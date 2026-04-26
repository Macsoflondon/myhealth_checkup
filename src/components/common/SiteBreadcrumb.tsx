import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Route-driven breadcrumb. Skips on the homepage and noisy admin/auth/dashboard
 * routes. Emits BreadcrumbList JSON-LD for SEO (audit item 2.7 / 3.3).
 */

const HIDDEN_PREFIXES = ["/admin", "/auth", "/reset-password", "/dashboard", "/client-portal"];

const SLUG_LABELS: Record<string, string> = {
  compare: "Compare Tests",
  "compare-by-symptom": "By Symptom",
  "compare-by-goal": "By Goal",
  symptoms: "Symptoms",
  goals: "Goals",
  tests: "Tests",
  category: "Categories",
  categories: "Categories",
  providers: "Providers",
  provider: "Provider",
  clinics: "Clinics",
  "find-clinic": "Find a Clinic",
  "health-resource-hub": "Health Resource Hub",
  blog: "Health Resource Hub",
  "biomarker-database": "Biomarker Library",
  "cancer-screening": "Cancer Screening",
  "cancer-screening-compare": "Cancer Screening Compare",
  "cancer-biomarkers-reference": "Cancer Biomarkers",
  "blood-test-analysis": "Blood Test Analysis",
  "intelligent-search": "Search",
  "assisted-test-finder": "Test Finder",
  "how-it-works": "How It Works",
  "how-we-rank": "How We Rank",
  "about-us": "About Us",
  contact: "Contact",
  faqs: "FAQs",
  "privacy-policy": "Privacy Policy",
  "terms-conditions": "Terms & Conditions",
  "cookie-policy": "Cookie Policy",
  "affiliate-disclosure": "Affiliate Disclosure",
  "modern-slavery": "Modern Slavery Statement",
  "fair-trading-policy": "Fair Trading Policy",
  accessibility: "Accessibility",
  legal: "Legal",
  partners: "Partners",
  "trusted-providers": "Trusted Providers",
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

  if (pathname === "/" || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, idx) => ({
    label: humanise(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
    isLast: idx === segments.length - 1,
  }));

  const origin = typeof window !== "undefined" ? window.location.origin : "https://myhealthcheckup.co.uk";
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

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 sm:px-6 lg:px-12 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map((c) => (
              <span key={c.href} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {c.isLast ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={c.href}>{c.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </>
  );
};

export default SiteBreadcrumb;
