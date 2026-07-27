#!/usr/bin/env node
/**
 * Sitemap validator — fails CI/build if any public static route is missing from public/sitemap.xml.
 *
 * Scans src/routes/*.tsx for <Route path="..."> entries, strips private/dynamic/wildcard paths,
 * and diffs the remaining set against <loc> entries in public/sitemap.xml.
 *
 * Exits 1 on any drift so predev/prebuild/CI catch it.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(process.cwd());
const ROUTES_DIR = join(ROOT, "src", "routes");
const SITEMAP_PATH = join(ROOT, "public", "sitemap.xml");
const BASE_URL = "https://myhealthcheckup.co.uk";

// Mirror scripts/generate-sitemap.ts PRIVATE_PREFIXES.
const PRIVATE_PREFIXES = [
  "/admin",
  "/auth",
  "/reset-password",
  "/dashboard",
  "/health-dashboard",
  "/client-portal",
  "/portal",
  "/notifications",
  "/notification-history",
  "/feedback",
  "/typography-showcase",
  "/control",
  "/.lovable",
];

// Static routes intentionally excluded from the sitemap (redirect shells, wildcards).
const EXPLICIT_EXCLUDES = new Set([
  "/category", // legacy redirect
  "*",
]);

const isPrivate = (p) =>
  PRIVATE_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + "/"));

const isDynamic = (p) => p.includes(":") || p.includes("*");

function collectRoutePaths() {
  const files = readdirSync(ROUTES_DIR).filter((f) => f.endsWith(".tsx"));
  const paths = new Set();
  for (const file of files) {
    const src = readFileSync(join(ROUTES_DIR, file), "utf8");
    const re = /path=["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(src)) !== null) paths.add(m[1]);
  }
  return paths;
}

function collectSitemapPaths() {
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  const paths = new Set();
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const url = m[1].trim();
    const path = url.startsWith(BASE_URL) ? url.slice(BASE_URL.length) || "/" : url;
    paths.add(path);
  }
  return paths;
}

const routePaths = collectRoutePaths();
const sitemapPaths = collectSitemapPaths();

const publicStaticRoutes = [...routePaths]
  .filter((p) => !EXPLICIT_EXCLUDES.has(p))
  .filter((p) => !isDynamic(p))
  .filter((p) => !isPrivate(p))
  .sort();

const missing = publicStaticRoutes.filter((p) => !sitemapPaths.has(p));

// Reverse check: sitemap entries with no matching route (excluding dynamic-generated ones).
const stale = [...sitemapPaths]
  .filter((p) => !routePaths.has(p))
  // ignore dynamic-content children (e.g. /guides/foo, /tests/cancer) — those come from data loaders
  .filter((p) => {
    const parent = "/" + p.split("/").filter(Boolean)[0];
    // if the router has a dynamic sibling like /guides/:slug or /tests/:category, the child is legit
    for (const r of routePaths) {
      if (r.startsWith(parent + "/") && r.includes(":")) return false;
      // /provider/:providerId, /medichecks/:testId etc.
      if (r === parent + "/:providerId" || r === parent + "/:testId" || r === parent + "/:slug") return false;
    }
    return true;
  })
  .sort();

let failed = false;

if (missing.length) {
  console.error("\n✗ Sitemap is missing the following public routes:");
  for (const p of missing) console.error(`    ${p}`);
  failed = true;
}

if (stale.length) {
  console.warn("\n⚠ Sitemap contains paths with no matching router entry:");
  for (const p of stale) console.warn(`    ${p}`);
  // stale entries are a warning, not a hard failure — dynamic pages come from data.
}

if (failed) {
  console.error(
    `\nRoutes checked: ${publicStaticRoutes.length} · sitemap <loc>s: ${sitemapPaths.size} · missing: ${missing.length}`,
  );
  console.error("Add the missing paths to scripts/generate-sitemap.ts (rawEntries) and rerun `npm run prebuild`.\n");
  process.exit(1);
}

console.log(
  `✓ Sitemap covers all ${publicStaticRoutes.length} public static routes (${sitemapPaths.size} total <loc>s).`,
);
