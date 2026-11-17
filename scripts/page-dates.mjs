// Keeps src/data/pageDates.json up to date: the date each page's content last changed.
// It hashes each page's content and moves a page's date to today only when its hash changes.
// The pre-commit hook (.githooks/pre-commit) runs it, so dates follow real edits.
//
//   node scripts/page-dates.mjs                    update changed pages to today
//   node scripts/page-dates.mjs --set 2026-11-17   reset every page to that date

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/data/pageDates.json");

// The data files import each other without the ".ts" extension, the way Next resolves them.
// They're also ES modules, which Node can't tell without "type": "module" in package.json.
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

const { serviceContent } = await import(join(ROOT, "src/data/serviceContent.ts"));
const { productContent } = await import(join(ROOT, "src/data/productContent.ts"));
const { governmentServices, governmentServiceShared, govServicePath } = await import(join(ROOT, "src/data/governmentServices.ts"));

// Files that hold each page's own content. Shared parts (nav, footer, animation code,
// styles) are left out on purpose, so a design tweak doesn't mark every page as edited.
const PAGE_FILES = {
  "/": [
    "src/app/page.tsx",
    "src/components/IntroExperience.tsx",
    "src/components/hero/Hero.tsx",
    "src/components/hero/HeroTypography.tsx",
    "src/components/hero/MobileHeroProject.tsx",
    "src/components/hero/ServingLine.tsx",
    "src/components/sections/FluidVideoTransition.tsx",
    "src/components/sections/ServicesSection.tsx",
    "src/components/sections/FeaturedWork.tsx",
    "src/components/sections/StorySection.tsx",
    "src/components/sections/StatsSection.tsx",
    "src/components/sections/TestimonialsSection.tsx",
    "src/components/sections/ClientsSection.tsx",
    "src/components/sections/GovContractorsCta.tsx",
    "src/data/projects.ts",
  ],
  "/about": ["src/app/about/page.tsx", "src/components/about/AboutPage.tsx", "src/components/sections/StoryFilm.tsx", "src/data/about.ts"],
  "/contact": ["src/app/contact/page.tsx", "src/components/contact/ContactPage.tsx"],
  "/careers": ["src/app/careers/page.tsx", "src/components/careers/CareersPage.tsx", "src/data/careers.ts"],
  "/industries": ["src/app/industries/page.tsx", "src/components/industries/IndustriesPage.tsx", "src/data/industries.ts"],
  "/e-invoicing": ["src/app/e-invoicing/page.tsx", "src/components/einvoicing/EInvoicingPage.tsx", "src/data/einvoicing.ts"],
  "/government-contractors": [
    "src/app/government-contractors/page.tsx",
    "src/components/govcon/GovContractorsPage.tsx",
    "src/data/govcon.ts",
  ],
  "/case-studies": [
    "src/app/case-studies/page.tsx",
    "src/components/casestudies/CaseStudiesPage.tsx",
    "src/data/caseStudies.ts",
    "src/data/demos.ts",
  ],
  "/privacy-policy": ["src/app/privacy-policy/page.tsx", "src/components/legal/PrivacyContent.tsx"],
  "/terms-conditions": ["src/app/terms-conditions/page.tsx", "src/components/legal/TermsContent.tsx"],
  "/refund-policy": ["src/app/refund-policy/page.tsx", "src/components/legal/RefundContent.tsx"],
  // The sitemap also moves /blogs forward whenever a post is published or updated.
  "/blogs": ["src/app/blogs/page.tsx", "src/components/blog/BlogIndex.tsx"],
};

const hash = (text) => createHash("sha256").update(text).digest("hex").slice(0, 16);

const contents = {};
for (const [path, files] of Object.entries(PAGE_FILES)) {
  contents[path] = files
    .map((file) => {
      const full = join(ROOT, file);
      if (!existsSync(full)) throw new Error(`page-dates: ${file} (listed for ${path}) no longer exists`);
      return readFileSync(full, "utf8");
    })
    .join("\0");
}
// Services and products share one template, so each one is tracked by its own content entry.
for (const [slug, content] of Object.entries(serviceContent)) contents[`/services/${slug}`] = JSON.stringify(content);
for (const [slug, content] of Object.entries(productContent)) contents[`/products/${slug}`] = JSON.stringify(content);
// Government service pages show their own entry plus a block of text they all share.
for (const service of governmentServices) {
  contents[govServicePath(service.slug)] = JSON.stringify([service, governmentServiceShared]);
}

const setIndex = process.argv.indexOf("--set");
const forced = setIndex === -1 ? null : process.argv[setIndex + 1];
if (setIndex !== -1 && !/^\d{4}-\d{2}-\d{2}$/.test(forced ?? "")) throw new Error("page-dates: --set needs a date like 2026-11-17");

// Local date, so a late-evening commit is dated the day it happened where you are.
const now = new Date();
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};

const next = {};
const changed = [];
for (const [path, text] of Object.entries(contents)) {
  const digest = hash(text);
  const old = previous[path];
  if (forced) next[path] = { lastmod: forced, hash: digest };
  else if (old && old.hash === digest) next[path] = old;
  else {
    next[path] = { lastmod: today, hash: digest };
    changed.push(path);
  }
}

writeFileSync(OUT, `${JSON.stringify(next, null, 2)}\n`);
if (forced) console.log(`page-dates: set ${Object.keys(next).length} pages to ${forced}`);
else if (changed.length) console.log(`page-dates: ${changed.length} page(s) changed today: ${changed.join(", ")}`);
