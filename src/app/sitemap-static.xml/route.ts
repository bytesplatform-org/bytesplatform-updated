import { getSitemapPages } from "@/lib/sitemapPages";

// Served as plain XML with the styled view, like the old public/sitemap-static.xml.
// Each page's date comes from src/data/pageDates.json (see src/lib/sitemapPages.ts).
// Rebuilt every 20 minutes, like the blog, so /blogs picks up new posts.
export const revalidate = 1200;

export async function GET() {
  const { pages } = await getSitemapPages();
  // Only loc and lastmod: Google ignores changefreq and priority.
  const urls = pages
    .map(({ url, lastModified }) => `<url><loc>${url}</loc><lastmod>${lastModified.toISOString().slice(0, 10)}</lastmod></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
