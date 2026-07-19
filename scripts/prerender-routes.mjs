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
  "/blog/testosterone-levels-by-age",
  "/blog/private-blood-test-cost-guide",
  "/blog/ferritin-vs-iron-comparison-guide",
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
  "/complaints",
  "/reviews",

  // Symptom + goal hubs
  "/compare/symptoms/fatigue",
  "/compare/symptoms/low-mood",
  "/compare/symptoms/hair-loss",
  "/compare/symptoms/weight-gain",
  "/compare/symptoms/low-libido",
  "/compare/goals/longevity",
  "/compare/goals/performance",
  "/compare/goals/weight-loss",
  "/compare/goals/preventative-health",

  // Category hubs
  "/tests/blood-tests",
  "/tests/hormones",
  "/tests/thyroid",
  "/tests/liver",
  "/tests/kidney-health",
  "/tests/fertility",
  "/tests/general-health",
  "/tests/allergy-testing",
  "/tests/sports-fitness",
  "/tests/weight-loss-tests",
  "/tests/longevity-tests",

  // Dedicated landings
  "/mens-health",
  "/womens-health",

  // Biomarker guides
  "/guides",
  "/guides/testosterone-test",
  "/guides/low-testosterone-symptoms",
  "/guides/thyroid-test",
  "/guides/cortisol-test",
  "/guides/vitamin-d-test",
  "/guides/ferritin-test",
  "/guides/liver-function-test",
  "/guides/kidney-function-test",
  "/guides/crp-test",
  "/guides/autoimmune-blood-test",
  "/guides/finger-prick-blood-test",
  "/guides/female-hormone-test",
  "/guides/globulins",
];
