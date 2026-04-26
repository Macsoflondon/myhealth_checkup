/**
 * Static route list for prerendering (~80 routes).
 *
 * Phase 1: All static, non-dynamic pages where content does not depend on
 * URL params. Dynamic routes (/tests/:slug, /provider/:id, /locations/:id,
 * /biomarker/:slug, /blog/:slug, /provider/:id/tests/:testId, etc.) are
 * intentionally excluded — they'll be added in phase 2 once we wire the
 * Supabase URL pull.
 *
 * Edit this list when you add a new static route.
 */
export const STATIC_ROUTES = [
  // Home + top-level
  "/",
  "/test-categories",
  "/sitemap",

  // Discovery hubs
  "/compare",
  "/compare/symptoms",
  "/compare/goals",
  "/search",
  "/recommendations",
  "/find-test",
  "/assisted-test-finder",
  "/find-clinic",
  "/biomarker-database",
  "/conditions",

  // Category landings (legacy + canonical)
  "/tests/cancer",
  "/cancer-screening-compare",
  "/cancer-biomarkers-reference",
  "/tests/diabetes",
  "/tests/heart",
  "/tests/vitamins",
  "/tests/gut",
  "/tests/mens-health",
  "/tests/womens-health",
  "/fertility-tests",
  "/at-home-tests",
  "/popular-tests",
  "/wellness",
  "/sports-performance",
  "/thyroid",
  "/hormones",

  // Specific top-tier test pages
  "/test/general-health",
  "/test/male-hormones",
  "/test/vitamin-d",
  "/test/iron-profile",
  "/test/lipid-profile",
  "/test/well-woman",
  "/test/female-hormones",

  // Provider hubs
  "/trusted-providers",
  "/providers/compare",
  "/providers/goodbody-clinic",
  "/goodbody-clinic",
  "/providers/medichecks",
  "/medichecks/mens-health",
  "/providers/thriva",
  "/providers/randox",
  "/providers/lola-health",
  "/providers/london-medical-laboratory",

  // Tools
  "/blood-test-analysis",

  // Content / E-E-A-T
  "/how-it-works",
  "/how-we-rank",
  "/about",
  "/about/medical-review",
  "/faqs",
  "/contact",
  "/partners",
  "/blog",
  "/health-blog",

  // Legal / compliance
  "/legal",
  "/privacy-policy",
  "/cookies",
  "/terms",
  "/accessibility",
  "/modern-slavery",
  "/affiliate-disclosure",
  "/fair-trading",
];
