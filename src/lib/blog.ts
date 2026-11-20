import staticPosts from "@/data/staticPosts.json";
import { relatedPosts } from "@/data/internalLinks";
import type { PortableBlock, Post, PostSummary } from "./blogFormat";

export * from "./blogFormat";

/**
 * Blog posts come from two places, as on the previous site: the Sanity
 * dataset (read through its public HTTP API — the dataset is public, so no
 * token or client library) and 24 older posts kept in staticPosts.json.
 * Sanity wins when a slug exists in both.
 */

const SANITY = { projectId: "y08r07g3", dataset: "production", apiVersion: "2024-08-01" };
/** Matches the previous site: refresh from Sanity at most every 20 minutes. */
export const BLOG_REVALIDATE = 1200;

const SUMMARY_FIELDS = `
  title,
  "slug": slug.current,
  excerpt,
  category,
  publishedAt,
  "updated": _updatedAt,
  "image": listingImage.asset->url
`;

async function sanityQuery<T>(query: string, params: Record<string, string> = {}): Promise<T | null> {
  const url = new URL(`https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}`);
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  try {
    const response = await fetch(url, { next: { revalidate: BLOG_REVALIDATE, tags: ["blog"] } });
    if (!response.ok) return null;
    return ((await response.json()) as { result: T }).result;
  } catch {
    // Sanity unreachable: the page still renders with the static posts.
    return null;
  }
}

const cleanSlug = (slug: string) => slug.replace(/^\/+|\/+$/g, "");

type SanitySummary = { title: string; slug: string; excerpt?: string; category?: string; publishedAt: string; updated?: string; image?: string };

const fromSanity = (post: SanitySummary): PostSummary => ({
  slug: cleanSlug(post.slug),
  title: post.title,
  excerpt: post.excerpt ?? "",
  category: post.category ?? "",
  date: post.publishedAt,
  updated: post.updated,
  image: post.image ?? "",
});

const fromStatic = (post: (typeof staticPosts)[number]): PostSummary => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  date: post.date,
  image: post.image,
});

/** Every published post, newest first. */
export async function getAllPosts(): Promise<PostSummary[]> {
  const sanity = (await sanityQuery<SanitySummary[]>(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) { ${SUMMARY_FIELDS} }`,
  )) ?? [];
  const fromCms = sanity.map(fromSanity);
  const taken = new Set(fromCms.map((post) => post.slug));
  const local = staticPosts.filter((post) => !taken.has(post.slug)).map(fromStatic);
  return [...fromCms, ...local].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  // Slugs were saved both with and without a leading slash in Sanity.
  const sanity = await sanityQuery<(SanitySummary & { detailImage?: string; content?: PortableBlock[]; seo?: Post["seo"] }) | null>(
    `*[_type == "post" && status == "published" && slug.current in [$slug, $slashed]][0] {
      ${SUMMARY_FIELDS},
      "detailImage": detailImage.asset->url,
      content,
      seo
    }`,
    { slug, slashed: `/${slug}` },
  );
  if (sanity) {
    return {
      ...fromSanity(sanity),
      detailImage: sanity.detailImage ?? sanity.image ?? "",
      seo: sanity.seo,
      body: { kind: "portable", blocks: sanity.content ?? [] },
    };
  }
  const local = staticPosts.find((post) => post.slug === slug);
  if (!local) return null;
  return { ...fromStatic(local), detailImage: local.detailImage, seo: local.seo, body: { kind: "markdown", text: local.content } };
}

/**
 * Up to `count` other posts: the closest matches by content from
 * src/data/internalLinks.ts, then the newest in the same category.
 */
export async function getRelatedPosts(post: PostSummary, count = 3): Promise<PostSummary[]> {
  const all = (await getAllPosts()).filter((other) => other.slug !== post.slug);
  const bySlug = new Map(all.map((other) => [other.slug, other]));
  const picked = (relatedPosts[post.slug] ?? []).flatMap((slug) => bySlug.get(slug) ?? []);
  const same = all.filter((other) => other.category === post.category);
  const rest = all.filter((other) => other.category !== post.category);
  return [...new Set([...picked, ...same, ...rest])].slice(0, count);
}

/** Rough reading time from word count, for the post header. */
export function readingMinutes(post: Post) {
  const text = post.body.kind === "markdown"
    ? post.body.text
    : post.body.blocks.flatMap((block) => block.children?.map((child) => child.text) ?? []).join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 230));
}
