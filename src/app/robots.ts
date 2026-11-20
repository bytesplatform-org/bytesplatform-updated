import { site } from "@/data/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // One sitemap only: sitemap-static.xml repeats the core pages already in sitemap.xml.
    sitemap: `${site.url}/sitemap.xml`,
  };
}
