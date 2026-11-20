import { getSitemapPages } from "@/lib/sitemapPages";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, postPages } = await getSitemapPages();
  // Only url and lastmod: Google ignores changefreq and priority.
  return [...pages, ...postPages];
}
