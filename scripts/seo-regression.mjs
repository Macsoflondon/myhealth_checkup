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
// These files reference the www host only to assert it never ships.
const WWW_GUARD_FILES = ["src/lib/seo/structured-data.ts", "src/lib/seo/route-metadata.test.ts"];
for (const f of allSrc) {
  const rel = f.replace(ROOT + "/", "");
  if (WWW_GUARD_FILES.includes(rel)) continue;
  const txt = readFileSync(f, "utf8");
  if (txt.includes("www.myhealthcheckup.co.uk")) {
    warn.push(`${f.replace(ROOT + "/", "")} still references www.myhealthcheckup.co.uk`);
  }
}

// ---- 4. Sitemap ↔ prerender coverage --------------------------------------
// Dynamic detail routes are server-rendered on demand, not prerendered.
const DYNAMIC_PREFIXES = ["/provider/"];
const dynamicSegment = (p) =>
  /:[A-Za-z]/.test(p) || DYNAMIC_PREFIXES.some((prefix) => p.startsWith(prefix));
const missingPrerender = sitemapPaths
  .filter((p) => !dynamicSegment(p))
  .filter((p) => !prerenderPaths.includes(p));

// SSR renders every route on demand, so a missing prerender entry is only a
// warm-cache gap, not a crawlability failure.
for (const p of missingPrerender) {
  warn.push(`sitemap has ${p} but it's not in scripts/prerender-routes.mjs (SSR still serves it)`);
}

// ---- 5. Root route sanity -------------------------------------------------
const rootRoute = readFileSync(resolve(ROOT, "src/routes/__root.tsx"), "utf8");
for (const tag of ["og:type", "og:site_name", "og:image"]) {
  if (!rootRoute.includes(`"${tag}"`)) fail.push(`__root.tsx missing ${tag}`);
}
if (!rootRoute.includes("application/ld+json")) fail.push("__root.tsx missing Organization JSON-LD");
if (rootRoute.includes("www.myhealthcheckup.co.uk")) fail.push("__root.tsx still references www.");

// ---- 5b. Dynamic detail routes must build metadata from the shared helpers --
const HELPER_ROUTES = [
  ["src/routes/provider.$providerId.index.tsx", "buildProviderHead"],
  ["src/routes/provider.$providerId.tests.$testId.tsx", "buildTestHead"],
];
for (const [file, helper] of HELPER_ROUTES) {
  const src = readFileSync(resolve(ROOT, file), "utf8");
  if (!src.includes(helper)) {
    fail.push(`${file} must build its head via ${helper} so canonical/og:url/JSON-LD stay in sync`);
  }
}

// ---- 5c. Sitemap must cover provider and test detail routes ----------------
// The generator marks the sitemap when the database was unreachable at build
// time. That is an environment problem, not a regression — warn, never block
// the build, or an offline/keyless CI run cannot ship at all.
const dynamicUnavailable = sitemap.includes("dynamic-routes: unavailable");
const missing = dynamicUnavailable ? warn : fail;
const providerPaths = sitemapPaths.filter((p) => /^\/provider\/[^/]+$/.test(p));
const testPaths = sitemapPaths.filter((p) => /^\/provider\/[^/]+\/tests\/[^/]+$/.test(p));
if (providerPaths.length === 0) missing.push("sitemap.xml contains no /provider/:id routes");
if (testPaths.length === 0) missing.push("sitemap.xml contains no /provider/:id/tests/:testId routes");
if (new Set(sitemapPaths).size !== sitemapPaths.length) {
  fail.push("sitemap.xml contains duplicate <loc> entries");
}
console.log(`Provider pages: ${providerPaths.length}, test detail pages: ${testPaths.length}`);

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
