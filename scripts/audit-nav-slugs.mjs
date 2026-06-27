#!/usr/bin/env node
/**
 * Nav-slug resolver audit.
 *
 * Extracts every `/compare?category=<slug>` link from the navigation source,
 * then verifies each slug resolves either to a row in public.categories or to
 * a row in public.category_slug_redirects. Fails the process with exit 1 on
 * any broken or ambiguous match so CI can block deployment.
 *
 * Usage:
 *   node scripts/audit-nav-slugs.mjs
 *
 * Required env (set in CI):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const NAV_DIR = "src/components/header";
const NAV_FILE_PREFIX = "NavigationItems";
const COMPARE_SLUG_RE = /\/compare\?category=([a-z0-9-]+)/g;

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("✖ Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(2);
}

function collectNavSlugs() {
  const slugs = new Set();
  const files = readdirSync(NAV_DIR).filter((f) => f.startsWith(NAV_FILE_PREFIX));
  if (!files.length) {
    console.error(`✖ No ${NAV_FILE_PREFIX}* file found in ${NAV_DIR}`);
    process.exit(2);
  }
  for (const f of files) {
    const src = readFileSync(join(NAV_DIR, f), "utf8");
    for (const m of src.matchAll(COMPARE_SLUG_RE)) slugs.add(m[1]);
  }
  return [...slugs].sort();
}

async function rest(path) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.error(`✖ Supabase REST ${path} → ${res.status} ${await res.text()}`);
    process.exit(2);
  }
  return res.json();
}

const navSlugs = collectNavSlugs();
const [cats, reds] = await Promise.all([
  rest("categories?select=slug"),
  rest("category_slug_redirects?select=from_slug,to_slug"),
]);

const catSet = new Set(cats.map((r) => r.slug));
const redMap = new Map(reds.map((r) => [r.from_slug, r.to_slug]));

const rows = navSlugs.map((slug) => {
  const inCat = catSet.has(slug);
  const inRed = redMap.has(slug);
  let status, detail;
  if (inCat && inRed) {
    status = "AMBIGUOUS";
    detail = `category + redirect→${redMap.get(slug)}`;
  } else if (inCat) {
    status = "OK";
    detail = "category";
  } else if (inRed) {
    const target = redMap.get(slug);
    if (!catSet.has(target)) {
      status = "BROKEN";
      detail = `redirect→${target} (target missing)`;
    } else {
      status = "OK";
      detail = `redirect→${target}`;
    }
  } else {
    status = "BROKEN";
    detail = "no category or redirect";
  }
  return { slug, status, detail };
});

const pad = (s, n) => s + " ".repeat(Math.max(0, n - s.length));
const w = Math.max(...rows.map((r) => r.slug.length), 4);
console.log(`Nav slugs audited: ${rows.length}\n`);
for (const r of rows) {
  const tag = r.status === "OK" ? "✓" : r.status === "AMBIGUOUS" ? "≈" : "✖";
  console.log(`  ${tag} ${pad(r.slug, w)}  ${r.status.padEnd(9)} ${r.detail}`);
}

const broken = rows.filter((r) => r.status === "BROKEN");
const ambiguous = rows.filter((r) => r.status === "AMBIGUOUS");

console.log(
  `\nSummary: ${rows.length - broken.length - ambiguous.length} ok · ${ambiguous.length} ambiguous · ${broken.length} broken`,
);

if (broken.length || ambiguous.length) {
  console.error(
    "\n✖ Nav-slug audit failed. Add the missing category, create a redirect, or remove the link before deploying.",
  );
  process.exit(1);
}

console.log("\n✓ All nav slugs resolve cleanly.");
