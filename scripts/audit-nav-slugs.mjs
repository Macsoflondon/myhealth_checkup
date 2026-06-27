#!/usr/bin/env node
/**
 * Nav + sitemap slug resolver audit.
 *
 * Sources audited:
 *   1. Navigation links: `/compare?category=<slug>` in src/components/header/NavigationItems.*
 *   2. Sitemap URLs: `/tests/<slug>` and any `?category=<slug>` in public/sitemap.xml
 *
 * Resolution rules:
 *   - A nav slug must hit a category OR a redirect whose target is a category.
 *   - A sitemap URL must hit a category DIRECTLY (sitemaps must not list 30x URLs).
 *
 * For ambiguous slugs (multiple resolution targets, or aliases that resolve to
 * conflicting categories) the audit prints the matched aliases / patterns and
 * the conflicting destination categories so the taxonomy can be fixed.
 *
 * Required env: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
 * Exit 0 only when every audited URL resolves cleanly. Exit 1 on any failure.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const NAV_DIR = "src/components/header";
const NAV_FILE_PREFIX = "NavigationItems";
const SITEMAP_PATH = "public/sitemap.xml";

const COMPARE_SLUG_RE = /\/compare\?category=([a-z0-9-]+)/g;
const TESTS_PATH_RE = /\/tests\/([a-z0-9-]+)/g;
const ANY_CAT_QS_RE = /[?&]category=([a-z0-9-]+)/g;

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.error("✖ Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(2);
}

function collectNavSlugs() {
  const slugs = new Set();
  const files = readdirSync(NAV_DIR).filter((f) => f.startsWith(NAV_FILE_PREFIX));
  for (const f of files) {
    const src = readFileSync(join(NAV_DIR, f), "utf8");
    for (const m of src.matchAll(COMPARE_SLUG_RE)) slugs.add(m[1]);
  }
  return [...slugs].sort();
}

function collectSitemapSlugs() {
  if (!existsSync(SITEMAP_PATH)) {
    console.error(`✖ ${SITEMAP_PATH} not found — generate the sitemap first.`);
    process.exit(2);
  }
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  // Pull just the <loc> contents so we don't catch slugs mentioned in comments.
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const tests = new Set();
  const queries = new Set();
  for (const loc of locs) {
    for (const m of loc.matchAll(TESTS_PATH_RE)) tests.add(m[1]);
    for (const m of loc.matchAll(ANY_CAT_QS_RE)) queries.add(m[1]);
  }
  return {
    testsSlugs: [...tests].sort(),
    querySlugs: [...queries].sort(),
  };
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

const [cats, reds, aliases] = await Promise.all([
  rest("categories?select=id,slug"),
  rest("category_slug_redirects?select=from_slug,to_slug"),
  rest("category_aliases?select=category_id,alias,match_type"),
]);

const catSet = new Set(cats.map((c) => c.slug));
const catById = new Map(cats.map((c) => [c.id, c.slug]));
const redMap = new Map(reds.map((r) => [r.from_slug, r.to_slug]));
const aliasByCat = new Map();
for (const a of aliases) {
  const slug = catById.get(a.category_id);
  if (!slug) continue;
  if (!aliasByCat.has(slug)) aliasByCat.set(slug, []);
  aliasByCat.get(slug).push(`${a.match_type}:${a.alias}`);
}

// Resolve a slug under the chosen policy.
//  - "nav":     direct category OR redirect-to-category is OK.
//  - "sitemap": direct category ONLY (redirected URLs in a sitemap = fail).
function resolveSlug(slug, policy) {
  const inCat = catSet.has(slug);
  const inRed = redMap.has(slug);
  const redTarget = redMap.get(slug);
  const redTargetExists = inRed ? catSet.has(redTarget) : false;

  if (inCat && inRed) {
    // The same slug resolves two ways. Surface aliases + both destinations.
    const directAliases = aliasByCat.get(slug) ?? [];
    const targetAliases = redTargetExists ? aliasByCat.get(redTarget) ?? [] : [];
    return {
      status: "AMBIGUOUS",
      detail: `category "${slug}" AND redirect→${redTarget}${redTargetExists ? "" : " (target missing)"}`,
      conflicts: [
        { destination: slug, source: "category", aliases: directAliases },
        {
          destination: redTarget,
          source: "redirect",
          aliases: targetAliases,
          targetMissing: !redTargetExists,
        },
      ],
    };
  }
  if (inCat) return { status: "OK", detail: `category "${slug}"` };
  if (inRed) {
    if (policy === "sitemap") {
      return {
        status: "BROKEN",
        detail: `sitemap URL points at redirect→${redTarget} (sitemaps must list canonical URLs only)`,
      };
    }
    if (!redTargetExists) {
      return { status: "BROKEN", detail: `redirect→${redTarget} but target category missing` };
    }
    return { status: "OK", detail: `redirect→${redTarget}` };
  }
  return { status: "BROKEN", detail: "no category and no redirect" };
}

function audit(source, slugs, policy) {
  return slugs.map((slug) => ({ source, slug, ...resolveSlug(slug, policy) }));
}

const navSlugs = collectNavSlugs();
const { testsSlugs, querySlugs } = collectSitemapSlugs();

const results = [
  ...audit("nav     ", navSlugs, "nav"),
  ...audit("sitemap ", testsSlugs, "sitemap"),
  ...audit("sitemap?", querySlugs, "sitemap"),
];

const w = Math.max(...results.map((r) => r.slug.length), 4);
const pad = (s, n) => s + " ".repeat(Math.max(0, n - s.length));

console.log(`Audited ${results.length} URLs (nav: ${navSlugs.length} · sitemap /tests/: ${testsSlugs.length} · sitemap ?category=: ${querySlugs.length})\n`);
for (const r of results) {
  const tag = r.status === "OK" ? "✓" : r.status === "AMBIGUOUS" ? "≈" : "✖";
  console.log(`  ${tag} [${r.source}] ${pad(r.slug, w)}  ${r.status.padEnd(9)} ${r.detail}`);
  if (r.conflicts) {
    for (const c of r.conflicts) {
      const aliasLine = c.aliases.length ? c.aliases.join(", ") : "(no aliases)";
      console.log(`        └─ ${c.source} → "${c.destination}"${c.targetMissing ? " [MISSING]" : ""}  aliases: ${aliasLine}`);
    }
  }
}

const broken = results.filter((r) => r.status === "BROKEN");
const ambiguous = results.filter((r) => r.status === "AMBIGUOUS");
const ok = results.length - broken.length - ambiguous.length;

console.log(`\nSummary: ${ok} ok · ${ambiguous.length} ambiguous · ${broken.length} broken`);

if (broken.length || ambiguous.length) {
  console.error("\n✖ Audit failed. Fix the taxonomy, the sitemap entries, or the nav links before deploying.");
  process.exit(1);
}

console.log("\n✓ All nav + sitemap category URLs resolve cleanly.");
