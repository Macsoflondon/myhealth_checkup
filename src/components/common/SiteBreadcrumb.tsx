import { useLocation, useSearchParams } from "@/lib/router-compat";
import { Helmet } from "react-helmet-async";
import { findSubcategoryBySlug } from "@/config/subcategoryMap";

/**
 * Route-driven breadcrumb. Skips on the homepage and noisy admin/auth/dashboard
 * routes. Emits BreadcrumbList JSON-LD for SEO (audit item 2.7 / 3.3).
 */

const HIDDEN_PREFIXES = [
  "/admin",
  "/auth",
  "/reset-password",
  "/dashboard",
  "/client-portal",
  "/provider",
  "/providers",
];

const SLUG_LABELS: Record<string, string> = {
  compare: "Compare tests",
  "compare-by-symptom": "By symptom",
  "compare-by-goal": "By goal",
  symptoms: "Symptoms",
  goals: "Goals",
  tests: "Tests",
  category: "Categories",
  categories: "Categories",
  providers: "Providers",
  provider: "Provider",
  "health-resource-hub": "Health Resource Hub",
  blog: "Health Resource Hub",
  "biomarker-database": "Complete biomarker reference library",
  "cancer-screening": "Cancer screening",
  "cancer-screening-compare": "Cancer screening compare",
  "cancer-biomarkers-reference": "Cancer biomarkers",
  "blood-test-analysis": "Blood test analysis",
  "intelligent-search": "Search",
  "assisted-test-finder": "Test finder",
  "how-it-works": "How it works",
  "how-we-rank": "How we rank",
  "about-us": "About us",
  contact: "Contact",
  faqs: "FAQs",
  "privacy-policy": "Privacy policy",
  "terms-conditions": "Terms & conditions",
  "cookie-policy": "Cookie policy",
  "affiliate-disclosure": "Affiliate disclosure",
  "modern-slavery": "Modern slavery statement",
  "fair-trading-policy": "Fair trading policy",
  accessibility: "Accessibility",
  legal: "Legal",
  partners: "Partners",
  "trusted-providers": "Trusted providers",
  recommendations: "Recommendations",
  notifications: "Notifications",
  sitemap: "Sitemap",
  locations: "Locations",
};

const humanise = (slug: string) =>
  SLUG_LABELS[slug] ??
  decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const SiteBreadcrumb = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  if (pathname === "/" || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const baseCrumbs = segments.map((seg, idx) => ({
    label: humanise(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
    isLast: idx === segments.length - 1,
  }));

  // Reflect ?subcategory=<slug> as an additional trailing crumb so navigating
  // via query-param dropdowns is visible in the breadcrumb trail.
  const subSlug = searchParams.get("subcategory");
  const sub = findSubcategoryBySlug(subSlug);
  const crumbs = sub
    ? [
        ...baseCrumbs.map((c) => ({ ...c, isLast: false })),
        {
          label: sub.label,
          href: `${baseCrumbs[baseCrumbs.length - 1].href}?subcategory=${sub.slug}`,
          isLast: true,
        },
      ]
    : baseCrumbs;

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://myhealthcheckup.co.uk";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        item: `${origin}${c.href}`,
      })),
    ],
  };

  // Structured data only — the visible breadcrumb strip was removed by design.
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SiteBreadcrumb;
