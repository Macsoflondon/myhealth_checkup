import { useMemo } from "react";
import { Shield, FlaskConical, Scale } from "lucide-react";
import { CategoryPageLayout } from "@/components/category/CategoryPageLayout";
import {
  CategoryStatusShell,
  CategoryLoadingSkeleton,
  CategoryErrorState,
  CategoryEmptyState,
} from "@/components/category/CategoryStatusStates";
import { useAllTests } from "@/hooks/queries/useAllTests";

const SEO = {
  title: "Test Categories | myhealth checkup",
  description:
    "Browse every clinically validated private health test from trusted UK providers. Filter by category and compare prices, biomarkers, and turnaround times.",
  keywords:
    "test categories, private blood tests, health screening, compare tests UK, UKAS accredited",
  canonical: "https://myhealthcheckup.co.uk/test-categories",
};

const BENEFITS = [
  {
    icon: Shield,
    title: "UKAS-Accredited Labs",
    description: "Every listed test is processed by an accredited UK laboratory",
  },
  {
    icon: FlaskConical,
    title: "Transparent Pricing",
    description: "Full biomarker lists and total costs shown up front — no hidden fees",
  },
  {
    icon: Scale,
    title: "Editorially Independent",
    description: "Comparison ranking is never influenced by provider commercials",
  },
] as const;

const BENEFITS_TUPLE: [typeof BENEFITS[0], typeof BENEFITS[1], typeof BENEFITS[2]] = [
  BENEFITS[0],
  BENEFITS[1],
  BENEFITS[2],
];

const PILL_LABEL = "All Test Categories";
const BENEFITS_TITLE = "Why Compare Through myhealth checkup?";

const TestCategoriesPage = () => {
  const { data: tests, isLoading, isFetching, error, refetch } = useAllTests();

  const filters = useMemo(() => {
    if (!tests) return ["All"];
    const unique = Array.from(new Set(tests.map((t) => t.tag))).filter(Boolean).sort();
    return ["All", ...unique];
  }, [tests]);

  if (isLoading || (isFetching && !tests)) {
    return (
      <CategoryStatusShell
        seoTitle={SEO.title}
        seoDescription={SEO.description}
        canonicalUrl={SEO.canonical}
        pillLabel={PILL_LABEL}
        benefits={BENEFITS_TUPLE}
        benefitsTitle={BENEFITS_TITLE}
      >
        <CategoryLoadingSkeleton />
      </CategoryStatusShell>
    );
  }

  if (error) {
    return (
      <CategoryStatusShell
        seoTitle={SEO.title}
        seoDescription={SEO.description}
        canonicalUrl={SEO.canonical}
        pillLabel={PILL_LABEL}
        benefits={BENEFITS_TUPLE}
        benefitsTitle={BENEFITS_TITLE}
      >
        <CategoryErrorState onRetry={() => refetch()} title="Couldn't load test categories" />
      </CategoryStatusShell>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <CategoryStatusShell
        seoTitle={SEO.title}
        seoDescription={SEO.description}
        canonicalUrl={SEO.canonical}
        pillLabel={PILL_LABEL}
        benefits={BENEFITS_TUPLE}
        benefitsTitle={BENEFITS_TITLE}
      >
        <CategoryEmptyState title="No tests available yet" />
      </CategoryStatusShell>
    );
  }

  return (
    <CategoryPageLayout
      seoTitle={SEO.title}
      seoDescription={SEO.description}
      seoKeywords={SEO.keywords}
      canonicalUrl={SEO.canonical}
      pillLabel={PILL_LABEL}
      headline="Browse Tests by Category"
      subtitle="Every clinically validated test from our trusted UK providers, filterable by category."
      searchPlaceholder="Search by test name, biomarker, or category…"
      trustStats={[
        { value: "50,000+", label: "Tests Compared" },
        { value: "4.8★", label: "Average Rating" },
        { value: "9+", label: "Trusted Providers" },
      ]}
      filters={filters}
      tests={tests}
      benefitsTitle={BENEFITS_TITLE}
      benefits={BENEFITS_TUPLE}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Test Categories" }]}
      compareUrl="/compare"
    />
  );
};

export default TestCategoriesPage;
