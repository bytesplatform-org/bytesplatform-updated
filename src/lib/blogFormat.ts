/**
 * Blog types and display helpers that are safe in client components — kept
 * apart from blog.ts so the posts data never ships to the browser.
 */

export type PortableSpan = { _type: "span"; _key?: string; text: string; marks?: string[] };
export type PortableBlock = {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: "bullet" | "number";
  level?: number;
  children?: PortableSpan[];
  markDefs?: { _key: string; _type: string; href?: string }[];
};

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
};

export type Post = PostSummary & {
  detailImage: string;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  body: { kind: "portable"; blocks: PortableBlock[] } | { kind: "markdown"; text: string };
};

/** Sanity image URLs take sizing parameters; local images are served as-is. */
export function imageUrl(src: string, width: number, height?: number) {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  if (height) {
    url.searchParams.set("h", String(height));
    url.searchParams.set("fit", "crop");
  }
  url.searchParams.set("auto", "format");
  return url.toString();
}

/** "ADVANCED SERVICES" → "Advanced Services"; short codes read better as words. */
export function categoryLabel(category: string) {
  const labels: Record<string, string> = { WEB: "Web", APP: "App", SEO: "SEO", MARKETING: "Marketing", "ADVANCED SERVICES": "Advanced Services" };
  return labels[category] ?? category;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

/* ----------------------------------------------------------------- headings */

export type PostHeading = { id: string; text: string; level: 2 | 3 };

/**
 * Turns heading text into unique, URL-safe ids. A fresh slugger fed the same
 * headings in the same order always returns the same ids, which is how
 * PostBody and the contents list agree on anchors without sharing state.
 */
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };
}

/** The plain text of a markdown heading line's content ("**Bold**" → "Bold"). */
export const markdownHeadingText = (raw: string) => raw.replace(/\*\*/g, "").trim();

/** Every h2–h4 in reading order, with the ids PostBody gives them. */
function allHeadings(body: Post["body"]): { id: string; text: string; level: number }[] {
  const slug = createSlugger();
  const found: { text: string; level: number }[] = [];
  if (body.kind === "portable") {
    for (const block of body.blocks) {
      if (!block.children || block.listItem) continue;
      const match = /^h([234])$/.exec(block.style ?? "");
      const text = block.children.map((child) => child.text).join("").trim();
      if (match && text) found.push({ text, level: Number(match[1]) });
    }
  } else {
    for (const raw of body.text.split("\n")) {
      const heading = /^(#{2,4})\s+(.*)$/.exec(raw.trim());
      if (heading) found.push({ text: markdownHeadingText(heading[2]), level: heading[1].length });
    }
  }
  return found.map((heading) => ({ ...heading, id: slug(heading.text) }));
}

/** The h2s and h3s a post's contents list links to. */
export function postHeadings(body: Post["body"]): PostHeading[] {
  return allHeadings(body).filter((heading): heading is PostHeading => heading.level === 2 || heading.level === 3);
}
