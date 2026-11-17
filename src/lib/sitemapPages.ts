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
export type SitemapPage = { url: string; lastModified: Date; priority: number };

const dates: Record<string, { lastmod: string }> = pageDates;

// Fallback for a page added without the commit hook: the date it was first built.
const lastmodOf = (path: string) => new Date(dates[path]?.lastmod ?? Date.now());

const page = (path: string, priority: number): SitemapPage => ({
  url: path === "/" ? site.url : `${site.url}${path}`,
  lastModified: lastmodOf(path),
  priority,
});

const latest = (...days: Date[]) => new Date(Math.max(...days.map((day) => day.getTime())));

export async function getSitemapPages() {
  const posts = await getAllPosts();
  const postDate = (post: (typeof posts)[number]) => new Date(post.updated ?? post.date);

  const blogs = page("/blogs", 0.7);
  // The blog index changes whenever a post goes up or is edited.
  if (posts.length) blogs.lastModified = latest(blogs.lastModified, ...posts.map(postDate));

  const pages: SitemapPage[] = [
    page("/", 1),
    page("/about", 0.8),
    page("/contact", 0.8),
    page("/careers", 0.7),
    page("/industries", 0.8),
    page("/e-invoicing", 0.8),
    page("/government-contractors", 0.8),
    page("/case-studies", 0.7),
    ...serviceLinks.map(({ slug }) => page(`/services/${slug}`, 0.9)),
    ...governmentServices.map(({ slug }) => page(govServicePath(slug), 0.7)),
    ...productLinks.map(({ slug }) => page(`/products/${slug}`, 0.9)),
    page("/privacy-policy", 0.3),
    page("/terms-conditions", 0.3),
    page("/refund-policy", 0.3),
    blogs,
  ];

  const postPages: SitemapPage[] = posts.map((post) => ({
    url: `${site.url}/blogs/${post.slug}`,
    lastModified: postDate(post),
    priority: 0.6,
  }));

  return { pages, postPages };
}
