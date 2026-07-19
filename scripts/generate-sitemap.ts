// Generates public/sitemap.xml. Runs via predev/prebuild npm hooks.
// PUBLIC-ONLY POLICY: only indexable, crawl-safe routes belong here.
// Anything matching PRIVATE_PREFIXES is filtered out — keep auth,
// dashboards, account, admin, and internal tools OUT of the sitemap.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://myhealthcheckup.co.uk";

// Any path starting with one of these is excluded from the sitemap.
// Mirror these in public/robots.txt Disallow rules.
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
];

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const rawEntries: SitemapEntry[] = [
  {
    "path": "/blog/testosterone-levels-by-age",
    "lastmod": "2026-06-19",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/blog/private-blood-test-cost-guide",
    "lastmod": "2026-07-19",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/blog/ferritin-vs-iron-comparison-guide",
    "lastmod": "2026-07-19",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "1.0"
  },
  {
    "path": "/compare",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.9"
  },
  {
    "path": "/test-categories",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.9"
  },
  {
    "path": "/search",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/how-it-works",
    "lastmod": "2026-03-15",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/about",
    "lastmod": "2026-03-15",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/symptoms",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/compare/goals",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/blood-tests",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/hormones",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/thyroid",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/vitamins",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/diabetes",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/heart-health",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/liver",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/kidney-health",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/cancer-screening",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },

  {
    "path": "/tests/fertility",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/general-health",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/allergy-testing",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/mens-health",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/womens-health",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/sports-fitness",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/weight-loss-tests",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/longevity-tests",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/tests/gut-health",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.8"
  },

  {
    "path": "/compare/goals/longevity",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/goals/performance",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/goals/weight-loss",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/goals/preventative-health",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/symptoms/fatigue",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/symptoms/low-mood",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/symptoms/hair-loss",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/symptoms/weight-gain",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/compare/symptoms/low-libido",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/thyroid",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/hormones",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/fertility-tests",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/sports-performance",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/wellness",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/popular-tests",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/at-home-tests",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/test/general-health",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/test/male-hormones",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/test/vitamin-d",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/test/iron-profile",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/test/lipid-profile",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/test/well-woman",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/test/female-hormones",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/trusted-providers",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/providers/compare",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/goodbody-clinic",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/faqs",
    "lastmod": "2026-03-15",
    "changefreq": "monthly",
    "priority": "0.5"
  },
  {
    "path": "/blog",
    "lastmod": "2026-04-09",
    "changefreq": "weekly",
    "priority": "0.6"
  },
  {
    "path": "/contact",
    "lastmod": "2026-03-15",
    "changefreq": "monthly",
    "priority": "0.5"
  },
  {
    "path": "/partners",
    "lastmod": "2026-03-15",
    "changefreq": "monthly",
    "priority": "0.5"
  },
  {
    "path": "/blood-test-analysis",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.6"
  },
  {
    "path": "/privacy-policy",
    "lastmod": "2026-02-01",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/terms",
    "lastmod": "2026-02-01",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/cookies",
    "lastmod": "2026-02-01",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/accessibility",
    "lastmod": "2026-02-01",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/how-we-rank",
    "lastmod": "2026-03-15",
    "changefreq": "monthly",
    "priority": "0.5"
  },
  {
    "path": "/sitemap",
    "lastmod": "2026-04-09",
    "changefreq": "monthly",
    "priority": "0.3"
  },
  {
    "path": "/legal",
    "lastmod": "2026-05-28",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/modern-slavery",
    "lastmod": "2026-05-28",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/affiliate-disclosure",
    "lastmod": "2026-05-28",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/fair-trading",
    "lastmod": "2026-05-28",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/complaints",
    "lastmod": "2026-05-28",
    "changefreq": "yearly",
    "priority": "0.3"
  },
  {
    "path": "/about/medical-review",
    "lastmod": "2026-05-28",
    "changefreq": "monthly",
    "priority": "0.5"
  },
  {
    "path": "/reviews",
    "lastmod": "2026-05-28",
    "changefreq": "weekly",
    "priority": "0.6"
  },
  {
    "path": "/find-test",
    "lastmod": "2026-05-28",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/biomarker-database",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/cancer-screening-compare",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/cancer-biomarkers-reference",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.7"
  },
  {
    "path": "/assisted-test-finder",
    "lastmod": "2026-04-20",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/recommendations",
    "lastmod": "2026-04-20",
    "changefreq": "monthly",
    "priority": "0.6"
  },
  {
    "path": "/mens-health",
    "lastmod": "2026-04-20",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/womens-health",
    "lastmod": "2026-04-20",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/conditions",
    "lastmod": "2026-04-20",
    "changefreq": "monthly",
    "priority": "0.6"
  },
  {
    "path": "/providers/medichecks",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.7"
  },
  {
    "path": "/medichecks/mens-health",
    "lastmod": "2026-04-20",
    "changefreq": "monthly",
    "priority": "0.6"
  },
  {
    "path": "/providers/thriva",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.7"
  },
  {
    "path": "/providers/randox",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.7"
  },
  {
    "path": "/providers/lola-health",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.7"
  },
  {
    "path": "/providers/london-medical-laboratory",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.7"
  },
  {
    "path": "/providers/goodbody-clinic",
    "lastmod": "2026-04-20",
    "changefreq": "weekly",
    "priority": "0.7"
  },
  {
    "path": "/guides",
    "lastmod": "2026-05-31",
    "changefreq": "weekly",
    "priority": "0.8"
  },
  {
    "path": "/guides/testosterone-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/guides/low-testosterone-symptoms",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/guides/cortisol-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/guides/ferritin-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/guides/vitamin-d-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/guides/thyroid-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/guides/liver-function-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/guides/kidney-function-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.8"
  },
  {
    "path": "/guides/crp-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/guides/autoimmune-blood-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/guides/finger-prick-blood-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.7"
  },
  {
    "path": "/guides/female-hormone-test",
    "lastmod": "2026-05-31",
    "changefreq": "monthly",
    "priority": "0.8"
  }
];

const isPublic = (path: string) =>
  !PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));

const entries = rawEntries.filter((e) => isPublic(e.path));
const dropped = rawEntries.length - entries.length;

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} public entries${dropped ? `, ${dropped} private filtered out` : ""})`);
