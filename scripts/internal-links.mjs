// Checks the internal links in src/data/internalLinks.ts against the live content.
//
//   node scripts/internal-links.mjs
//
// It reads every published post (Sanity and staticPosts.json) and the page copy, then reports:
//   - anchors that no longer appear where they're meant to be linked (an edit removed the phrase)
//   - links to pages or posts that don't exist
//   - pages and posts with fewer than two links from other pages' content
// The menu and footer don't count towards the two. Exits with 1 if anything needs fixing.
// It needs the network (Sanity), so it isn't part of the build.

import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Same loader as page-dates.mjs: extensionless relative imports, TypeScript as ES modules.
const asModule = (result) => (result.url.endsWith(".ts") ? { ...result, format: "module-typescript" } : result);
registerHooks({
  resolve(specifier, context, next) {
    try {
      return asModule(next(specifier, context));
    } catch (error) {
      if (specifier.startsWith(".") && !specifier.endsWith(".ts")) return asModule(next(`${specifier}.ts`, context));
      throw error;
    }
  },
});

const load = (path) => import(join(ROOT, path));
const { postLinks, pageLinks, relatedPages, pageReading, relatedPosts, linkFixes } = await load("src/data/internalLinks.ts");
const { splitLinks } = await load("src/lib/linkText.ts");
const { serviceContent } = await load("src/data/serviceContent.ts");
const { productContent } = await load("src/data/productContent.ts");
const { governmentServices, govServicePath } = await load("src/data/governmentServices.ts");
const staticPosts = JSON.parse(readFileSync(join(ROOT, "src/data/staticPosts.json"), "utf8"));

// ------------------------------------------------------------------ posts
// Mirrors src/lib/blog.ts: Sanity wins when a slug exists in both places.
const SANITY = "https://y08r07g3.apicdn.sanity.io/v2024-08-01/data/query/production";
const query = `*[_type == "post" && status == "published"] | order(publishedAt desc) { "slug": slug.current, category, publishedAt, content }`;
const response = await fetch(`${SANITY}?query=${encodeURIComponent(query)}`);
if (!response.ok) throw new Error(`Sanity answered ${response.status}`);
const posts = new Map();
for (const post of (await response.json()).result) {
  const slug = post.slug.replace(/^\/+|\/+$/g, "");
  if (!posts.has(slug)) posts.set(slug, { category: post.category ?? "", date: post.publishedAt, ...portable(post.content ?? []) });
}
for (const post of staticPosts) {
  if (!posts.has(post.slug)) posts.set(post.slug, { category: post.category, date: post.date, ...markdown(post.content) });
}

/** Text runs a link can be woven into (the order PostBody renders them), plus the post's own links. */
function portable(blocks) {
  const runs = [];
  const hrefs = [];
  for (const block of blocks) {
    if (!block.children) continue;
    const defs = (block.markDefs ?? []).filter((def) => def._type === "link");
    hrefs.push(...defs.map((def) => def.href ?? ""));
    const links = new Set(defs.map((def) => def._key));
    if (/^h[1-6]$/.test(block.style ?? "")) continue;
    for (const span of block.children) if (!(span.marks ?? []).some((mark) => links.has(mark))) runs.push(span.text ?? "");
  }
  return { runs, hrefs };
}

/** As PostBody's renderMarkdown: runs of lines are one paragraph, "- " lines are list items, **bold** is its own run. */
function markdown(text) {
  const runs = [];
  let paragraph = [];
  const flush = () => {
    if (paragraph.length) runs.push(...paragraph.join(" ").split(/\*\*/));
    paragraph = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const item = /^[-•]\s+(.*)$/.exec(line);
    if (!line || /^#{2,4}\s/.test(line)) flush();
    else if (item) {
      flush();
      runs.push(...item[1].split(/\*\*/));
    } else paragraph.push(line);
  }
  flush();
  return { runs, hrefs: [] };
}

// ------------------------------------------------------------------ routes
const routes = new Set([
  "/", "/about", "/contact", "/careers", "/industries", "/e-invoicing", "/government-contractors", "/case-studies", "/blogs",
  ...Object.keys(serviceContent).map((slug) => `/services/${slug}`),
  ...Object.keys(productContent).map((slug) => `/products/${slug}`),
  ...governmentServices.map(({ slug }) => govServicePath(slug)),
  ...[...posts.keys()].map((slug) => `/blogs/${slug}`),
]);
// Pages people reach from the menu and footer only; they don't need links from content.
const exempt = new Set(["/careers", "/privacy-policy", "/terms-conditions", "/refund-policy"]);

const internalPath = (href) => {
  const match = /^(?:https?:\/\/(?:www\.)?bytesplatform\.com)?(\/[^?#]*)?/.exec(href);
  if (!match?.[1] && !/^https?:\/\/(www\.)?bytesplatform\.com/.test(href)) return null;
  const path = (match[1] ?? "/").replace(/(.)\/+$/, "$1");
  return linkFixes[path] ?? path;
};

// ------------------------------------------------------------------ check
const problems = [];
const sources = new Map();
const link = (from, to) => {
  if (from === to) return;
  if (!routes.has(to)) return problems.push(`${from} links to ${to}, which doesn't exist`);
  if (!sources.has(to)) sources.set(to, new Set());
  sources.get(to).add(from);
};

for (const [slug, post] of posts) {
  const from = `/blogs/${slug}`;
  for (const href of post.hrefs) {
    const path = internalPath(href);
    if (path && routes.has(path.split("#")[0])) link(from, path.split("#")[0]);
  }
  const pending = [...(postLinks[slug] ?? [])];
  for (const run of post.runs) {
    for (const part of splitLinks(run, pending)) if (typeof part !== "string") link(from, part.href);
  }
  for (const missed of pending) problems.push(`${from}: "${missed.anchor}" no longer appears, so its link to ${missed.href} is skipped`);
}
for (const slug of Object.keys(postLinks)) if (!posts.has(slug)) problems.push(`postLinks has "${slug}", which isn't a published post`);

/** The fields ServicePage and GovServicePage weave links into, by the keys pageLinks uses. */
function fields(content) {
  const out = { "hero.intro": content.hero.intro, "cta.body": content.cta.body };
  if (content.offer.body) out["offer.body"] = content.offer.body;
  content.offer.items.forEach((item, index) => (out[`offer.items.${index}`] = item.body));
  if (content.highlights?.body) out["highlights.body"] = content.highlights.body;
  content.highlights?.items.forEach((item, index) => (out[`highlights.items.${index}`] = item.body));
  if (content.process?.body) out["process.body"] = content.process.body;
  content.process?.steps.forEach((step, index) => (out[`process.steps.${index}`] = step.body));
  content.faqs.forEach((faq, index) => (out[`faqs.${index}`] = faq.a));
  return out;
}
const pageFields = new Map([
  ...Object.entries(serviceContent).map(([slug, content]) => [`/services/${slug}`, fields(content)]),
  ...Object.entries(productContent).map(([slug, content]) => [`/products/${slug}`, fields(content)]),
  ...governmentServices.map((service) => [govServicePath(service.slug), {
    summary: service.summary,
    ...Object.fromEntries(service.faqs.map((faq, index) => [`faqs.${index}`, faq.a])),
  }]),
]);

for (const [page, byField] of Object.entries(pageLinks)) {
  for (const [field, links] of Object.entries(byField)) {
    const pending = [...links];
    for (const part of splitLinks(pageFields.get(page)?.[field] ?? "", pending)) if (typeof part !== "string") link(page, part.href);
    for (const missed of pending) problems.push(`${page} ${field}: "${missed.anchor}" no longer appears, so its link to ${missed.href} is skipped`);
  }
}
for (const [page, targets] of Object.entries(relatedPages)) for (const to of targets) link(page, to);
for (const [page, slugs] of Object.entries(pageReading)) {
  for (const slug of slugs) if (posts.has(slug)) link(page, `/blogs/${slug}`);
}
// Government pages link to their two related services, and the hub's grid to every one of them.
for (const service of governmentServices) {
  link("/government-contractors", govServicePath(service.slug));
  for (const slug of service.related) link(govServicePath(service.slug), govServicePath(slug));
}
// Written straight into GovContractorsPage.tsx rather than read from data.
link("/government-contractors", "/products/bytesgov");
link("/government-contractors", "/case-studies");

// "Keep reading": listed matches first, then the newest same-category posts (as getRelatedPosts does).
const newest = [...posts.entries()].sort((a, b) => Date.parse(b[1].date) - Date.parse(a[1].date)).map(([slug]) => slug);
for (const [slug, post] of posts) {
  const picked = (relatedPosts[slug] ?? []).filter((other) => posts.has(other) && other !== slug);
  const fill = newest.filter((other) => other !== slug && posts.get(other).category === post.category);
  for (const other of [...new Set([...picked, ...fill])].slice(0, 3)) link(`/blogs/${slug}`, `/blogs/${other}`);
}

const thin = [...routes].filter((route) => !exempt.has(route) && (sources.get(route)?.size ?? 0) < 2);
for (const route of thin) problems.push(`${route} has ${sources.get(route)?.size ?? 0} link(s) from other pages' content; it needs 2`);

const counted = [...routes].filter((route) => !exempt.has(route));
console.log(`internal-links: ${posts.size} posts, ${counted.length} pages checked`);
if (problems.length) {
  console.error(problems.map((line) => `  - ${line}`).join("\n"));
  process.exit(1);
}
console.log("internal-links: every anchor is in place and every page has at least 2 links from other pages");
