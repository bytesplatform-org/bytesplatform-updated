import pageDates from "@/data/pageDates.json";
import { governmentServices, govServicePath } from "@/data/governmentServices";
import { productLinks } from "@/data/products";
import { serviceLinks } from "@/data/services";
import { site } from "@/data/site";
import { getAllPosts } from "@/lib/blog";

/**
 * Every page both sitemaps list, with the date its content last changed.
 * Dates come from src/data/pageDates.json, which scripts/page-dates.mjs updates
 * on each commit. Blog posts use their own dates from Sanity or staticPosts.json.
 */
export type SitemapPage = { url: string; lastModified: Date };

const dates: Record<string, { lastmod: string }> = pageDates;

// Fallback for a page added without the commit hook: the date it was first built.
const lastmodOf = (path: string) => new Date(dates[path]?.lastmod ?? Date.now());

const page = (path: string): SitemapPage => ({
  url: path === "/" ? site.url : `${site.url}${path}`,
  lastModified: lastmodOf(path),
});

const latest = (...days: Date[]) => new Date(Math.max(...days.map((day) => day.getTime())));

export async function getSitemapPages() {
  const posts = await getAllPosts();
  const postDate = (post: (typeof posts)[number]) => new Date(post.updated ?? post.date);

  const blogs = page("/blogs");
  // The blog index changes whenever a post goes up or is edited.
  if (posts.length) blogs.lastModified = latest(blogs.lastModified, ...posts.map(postDate));

  const pages: SitemapPage[] = [
    page("/"),
    page("/about"),
    page("/contact"),
    page("/careers"),
    page("/industries"),
    page("/e-invoicing"),
    page("/government-contractors"),
    page("/case-studies"),
    ...serviceLinks.map(({ slug }) => page(`/services/${slug}`)),
    ...governmentServices.map(({ slug }) => page(govServicePath(slug))),
    ...productLinks.map(({ slug }) => page(`/products/${slug}`)),
    page("/privacy-policy"),
    page("/terms-conditions"),
    page("/refund-policy"),
    blogs,
  ];

  const postPages: SitemapPage[] = posts.map((post) => ({
    url: `${site.url}/blogs/${post.slug}`,
    lastModified: postDate(post),
  }));

  return { pages, postPages };
}
