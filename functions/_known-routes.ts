/**
 * Canonical list of routes the SPA actually handles.
 *
 * Used by `_middleware.ts` to decide whether an unknown URL should:
 *   - fall through to the SPA shell (known route → 200), or
 *   - return a real HTTP 404 with the NotFound shell (unknown route).
 *
 * Keep in sync with src/routes/*.tsx. Express-style `:param` segments are
 * matched as a single non-empty path segment with no slashes.
 *
 * Why a real 404 matters
 * ----------------------
 * Pure-CSR SPAs return HTTP 200 for every URL because the server has no
 * knowledge of client routes — Google flags these as "soft 404s" and
 * wastes crawl budget on garbage URLs (e.g. /foo/bar/baz from broken
 * backlinks). A correct 404 status tells crawlers to drop the URL.
 */

/** Exact-match static paths. */
export const STATIC_ROUTES: ReadonlySet<string> = new Set([
  // Home + top-level
  "/",
  "/test-categories",
  "/sitemap",

  // Auth
  "/auth",
  "/reset-password",
  "/dashboard",
  "/health-dashboard",
  "/notification-history",
  "/portal",

  // Admin
  "/admin/login",
  "/admin/test-upload",
  "/admin/data-refresh",
  "/admin/scrapers",
  "/admin/test-mapper",
  "/admin/test-dashboard",
  "/typography-showcase",

  // Discovery / comparison
  "/compare",
  "/compare/symptoms",
  "/compare/goals",
  "/search",
  "/recommendations",
  "/reviews",
  "/find-test",
  "/assisted-test-finder",
  "/biomarker-database",
  "/conditions",

  // Provider hubs
  "/providers",
  "/providers/compare",
  "/providers/goodbody-clinic",
  "/goodbody-clinic",
  "/providers/medichecks",
  "/medichecks/mens-health",
  "/providers/thriva",
  "/providers/randox",
  "/providers/lola-health",
  "/providers/london-medical-laboratory",
  "/providers/london-health-company",
  "/providers/medical-diagnosis",
  "/providers/clinilabs",

  // Tools
  "/blood-test-analysis",

  // Categories
  "/tests/cancer",
  "/cancer-screening-compare",
  "/cancer-biomarkers-reference",
  "/tests/diabetes",
  "/tests/heart",
  "/tests/vitamins",
  "/tests/gut",
  "/tests/mens-health",
  "/tests/womens-health",
  "/tests/fertility",
  "/fertility-tests",
  "/at-home-tests",
  "/popular-tests",
  "/most-popular-tests",
  "/wellness",
  "/sports-performance",
  "/thyroid",
  "/hormones",
  "/mens-health",
  "/womens-health",

  // Specific test pages
  "/test/general-health",
  "/test/male-hormones",
  "/test/vitamin-d",
  "/test/iron-profile",
  "/test/lipid-profile",
  "/test/well-woman",
  "/test/female-hormones",

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
  "/trusted-providers",
  "/guides",
  "/blog/testosterone-levels-by-age",

  // Legal
  "/legal",
  "/privacy-policy",
  "/cookies",
  "/terms",
  "/accessibility",
  "/modern-slavery",
  "/affiliate-disclosure",
  "/fair-trading",
]);

/**
 * Dynamic route patterns. Each entry is a path template using `:param`
 * placeholders that match a single URL segment (no slashes, non-empty).
 *
 * Compiled to RegExp once at module load.
 */
const DYNAMIC_ROUTE_PATTERNS: readonly string[] = [
  "/tests/:category",
  "/compare/symptoms/:symptomSlug",
  "/compare/goals/:goalSlug",
  
  "/provider/:providerId",
  "/provider/:providerId/tests",
  "/provider/:providerId/tests/:testId",
  "/lola-health/:testId",
  "/goodbody-clinic/:testId",
  "/goodbody/:testId",
  "/medichecks/:testId",
  "/thriva/:testId",
  "/randox/:testId",
  "/randox-health/:testId",
  "/london-medical-laboratory/:testId",
  "/guides/:slug",
  "/clinilabs/:testId",
  "/london-health-company/:testId",
  "/medical-diagnosis/:testId",
];

const DYNAMIC_ROUTE_REGEXES: readonly RegExp[] = DYNAMIC_ROUTE_PATTERNS.map(
  (pattern) => {
    const source = pattern
      .split("/")
      .map((seg) => (seg.startsWith(":") ? "[^/]+" : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
      .join("/");
    return new RegExp(`^${source}/?$`);
  },
);

/**
 * Path prefixes whose entire subtree is owned by the SPA. Used as a
 * conservative escape hatch for admin-only or future expansion areas
 * we don't want to accidentally 404.
 */
const ALLOWED_PREFIXES: readonly string[] = ["/admin/"];

/** Returns true if the path corresponds to a real SPA route. */
export function isKnownRoute(pathname: string): boolean {
  // Normalise trailing slash (treat "/foo/" same as "/foo").
  const normalised =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  if (STATIC_ROUTES.has(normalised)) return true;

  for (const re of DYNAMIC_ROUTE_REGEXES) {
    if (re.test(normalised)) return true;
  }

  for (const prefix of ALLOWED_PREFIXES) {
    if (normalised.startsWith(prefix)) return true;
  }

  return false;
}