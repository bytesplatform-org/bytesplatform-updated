import { linkFixes, pageLinks, pageReading, relatedPages } from "@/data/internalLinks";
import { governmentServices, govServicePath } from "@/data/governmentServices";
import { productLinks } from "@/data/products";
import { serviceLinks } from "@/data/services";
import { getAllPosts } from "@/lib/blog";
import type { PageExplore } from "@/lib/linkText";

const labels = new Map<string, string>([
  ...serviceLinks.map(({ slug, label }) => [`/services/${slug}`, label] as const),
  ...productLinks.map(({ slug, label }) => [`/products/${slug}`, label] as const),
  ...governmentServices.map(({ slug, title }) => [govServicePath(slug), `${title} for government`] as const),
  ["/government-contractors", "Government contractors"],
  ["/e-invoicing", "UAE e-invoicing"],
  ["/case-studies", "Case studies"],
]);

/** The page name used as a link's text, e.g. "Cybersecurity" for /services/cybersecurity. */
export const pageLabel = (path: string) => labels.get(path) ?? path;

/** In-copy links, related pages and reading list for one service, product or government page. */
export async function getPageExplore(path: string): Promise<PageExplore> {
  const wanted = pageReading[path] ?? [];
  const posts = wanted.length ? await getAllPosts() : [];
  return {
    links: pageLinks[path] ?? {},
    related: (relatedPages[path] ?? []).map((href) => ({ href, label: pageLabel(href) })),
    // Only posts that are still published, in the listed order.
    reading: wanted.flatMap((slug) => {
      const post = posts.find((item) => item.slug === slug);
      return post ? [{ href: `/blogs/${slug}`, title: post.title.trim() }] : [];
    }),
  };
}

/**
 * Internal links in older posts that point at moved or mistyped addresses
 * get their current address, and lose the utm_ tags some were pasted with.
 */
export function fixHref(href: string) {
  const internal = /^(?:https?:\/\/(?:www\.)?bytesplatform\.com)?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/.exec(href);
  if (!internal || (!internal[1] && !href.startsWith("https://"))) return href;
  const path = (internal[1] ?? "/").replace(/(.)\/+$/, "$1");
  const params = new URLSearchParams(internal[2] ?? "");
  for (const key of [...params.keys()]) if (key.startsWith("utm_")) params.delete(key);
  const query = params.toString();
  const fixed = linkFixes[path] ?? path;
  return `${fixed}${query ? `?${query}` : ""}${internal[3] ?? ""}`;
}
