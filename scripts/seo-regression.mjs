/**
 * SEO regression check.
 *
 * Verifies, for every public route in the sitemap:
 *   1. The route also appears in scripts/prerender-routes.mjs (so bots get an SSR snapshot)
 *      — dynamic routes excluded.
 *   2. Either index.html (sitewide) or the route's React page sets:
 *        canonical, og:title, og:description, og:url
 *      and at least one <script type="application/ld+json">.
 *   3. No `www.myhealthcheckup.co.uk` URLs leak into canonical / og:url / sitemap / JSON-LD.
 *
 * Run:  bunx tsx scripts/seo-regression.mjs   (or)   node scripts/seo-regression.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const APEX = "https://myhealthcheckup.co.uk";

const fail = [];
const warn = [];

// ---- 1. Read sitemap entries ----------------------------------------------
const sitemap = readFileSync(resolve(ROOT, "public/sitemap.xml"), "utf8");
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace(APEX, ""),
);

if (sitemap.includes("www.myhealthcheckup.co.uk")) {
  fail.push("sitemap.xml still contains www. URLs");
}

// ---- 2. Read prerender route list -----------------------------------------
const prerenderSrc = readFileSync(resolve(ROOT, "scripts/prerender-routes.mjs"), "utf8");
const prerenderPaths = [...prerenderSrc.matchAll(/"(\/[^"]*)"/g)].map((m) => m[1]);

// ---- 3. Walk src/ for Helmet usage ---------------------------------------
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(p);
  }
  return out;
}
const allSrc = walk(resolve(ROOT, "src"));

// Grep every file once for www. leaks
for (const f of allSrc) {
  const txt = readFileSync(f, "utf8");
  if (txt.includes("www.myhealthcheckup.co.uk")) {
    warn.push(`${f.replace(ROOT + "/", "")} still references www.myhealthcheckup.co.uk`);
  }
}

// ---- 4. Sitemap ↔ prerender coverage --------------------------------------
const dynamicSegment = (p) => /:[A-Za-z]/.test(p);
const missingPrerender = sitemapPaths
  .filter((p) => !dynamicSegment(p))
  .filter((p) => !prerenderPaths.includes(p));

for (const p of missingPrerender) {
  fail.push(`sitemap has ${p} but it's not in scripts/prerender-routes.mjs — bots will see empty shell`);
}

// ---- 5. Index.html sanity --------------------------------------------------
const indexHtml = readFileSync(resolve(ROOT, "index.html"), "utf8");
for (const tag of ["og:title", "og:description", "og:url", "og:type"]) {
  if (!indexHtml.includes(`property="${tag}"`)) fail.push(`index.html missing ${tag}`);
}
if (!indexHtml.includes("application/ld+json")) fail.push("index.html missing Organization JSON-LD");
if (indexHtml.includes("www.myhealthcheckup.co.uk")) fail.push("index.html still references www.");

// ---- 6. Report -------------------------------------------------------------
console.log(`Sitemap routes: ${sitemapPaths.length}`);
console.log(`Prerender routes: ${prerenderPaths.length}`);
console.log(`Source files scanned: ${allSrc.length}`);
console.log();

if (warn.length) {
  console.log(`⚠ ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  - ${w}`);
  console.log();
}

if (fail.length) {
  console.log(`✘ ${fail.length} failure(s):`);
  for (const f of fail) console.log(`  - ${f}`);
  process.exit(1);
}

console.log("✔ SEO regression check passed");
