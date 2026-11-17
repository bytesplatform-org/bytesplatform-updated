import { getSitemapPages } from "@/lib/sitemapPages";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, postPages } = await getSitemapPages();
  return [...pages, ...postPages].map((entry) => ({ ...entry, changeFrequency: "daily" as const }));
}
