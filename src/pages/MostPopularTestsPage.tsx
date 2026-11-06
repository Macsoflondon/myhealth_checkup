import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "@/lib/router-compat";
import {
  Star,
  TrendingUp,
  Shield,
  AlertCircle,
  Inbox,
  RotateCw,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CategoryStandardHero } from "@/components/category/CategoryStandardHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import {
  CategoryPageLayout,
  CategoryTestItem,
} from "@/components/category/CategoryPageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  hasStartingPrice,
  usePopularTestsFromDatabase,
} from "@/hooks/usePopularTestsFromDatabase";
import { getProviderRating } from "@/constants/providerRatings";
import { categoryMenuIconFor } from "@/components/header/menuIcons";

const SEO = {
  title: "Most popular tests | myhealth checkup",
  description:
    "Discover our most popular health tests, trusted by thousands of customers. Compare the best-selling blood tests from UK providers.",
  keywords:
    "popular health tests, blood tests, health screening, comprehensive health check",
  canonical: "https://myhealthcheckup.co.uk/popular-tests",
};

const HERO_BENEFITS = [
  {
    icon: Star,
    title: "Trusted by thousands",
    description: "Our highest-rated tests chosen by customers across the UK",
  },
  {
    icon: TrendingUp,
    title: "Comprehensive insights",
    description: "Thorough biomarker panels for a complete health picture",
  },
  {
    icon: Shield,
    title: "Accredited labs",
    description: "All tests processed by UKAS-accredited laboratories",
  },
] as const;

const cleanName = (name: string) =>
  name
    .replace(/\s*[-–|].*$/, "")
    .replace(/\s+Blood Test$/i, "")
    .replace(/\s+for Enhanced Health$/i, "")
    .replace(/\s*\| Book Online today$/i, "");

const parseTurnaroundDays = (turnaround: string): number => {
  const match = turnaround.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
};

/** Wrapper that renders the standard hero + a content slot (skeleton / error / empty). */
const StatusShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Helmet></Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryStandardHero pillLabel="Most popular" />
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-[#08122b] min-h-[60vh]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </section>
        <CategoryPageBottom
          benefitsTitle="Why choose our most popular tests?"
          benefits={[HERO_BENEFITS[0], HERO_BENEFITS[1], HERO_BENEFITS[2]]}
        />
      </main>
      <Footer />
    </div>
  </>
);

const LoadingSkeleton: React.FC = () => (
  <>
    {/* Filter bar skeleton */}
    <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-10 w-48 rounded-md bg-white/10" />
    </div>
    {/* Card grid skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-full max-w-[340px] h-[440px] rounded-2xl bg-white/10"
        />
      ))}
    </div>
  </>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="text-center py-20 max-w-md mx-auto">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/15 mb-5">
      <AlertCircle className="h-7 w-7 text-destructive" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">
      Couldn't load popular tests
    </h2>
    <p className="text-white/90 mb-6">
      Something went wrong while fetching the latest tests. Please check your
      connection and try again.
    </p>
    <Button onClick={onRetry} variant="secondary" className="gap-2">
      <RotateCw className="h-4 w-4" /> Retry
    </Button>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-20 max-w-md mx-auto">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-5">
      <Inbox className="h-7 w-7 text-white/90" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">
      No popular tests available yet
    </h2>
    <p className="text-white/90 mb-6">
      We're updating our catalogue. Browse the full comparison hub to find the
      right test for you.
    </p>
    <Button asChild variant="secondary">
      <Link to="/compare">Browse all tests</Link>
    </Button>
  </div>
);

const MostPopularTestsPage = () => {
  const {
    data: popularTests,
    isLoading,
    error,
    refetch,
    isFetching,
  } = usePopularTestsFromDatabase(24);

  const tests: CategoryTestItem[] = useMemo(() => {
    if (!popularTests) return [];
    return popularTests.map((t, idx) => {
      const providerRating = getProviderRating(t.provider_id);
      const tag = t.category || "General Health";
      return {
        id: t.id,
        providerId: t.provider_id,
        popular: idx < 3,
        badge: tag,
        badgeColor: categoryMenuIconFor("Most popular tests").color,
        provider: t.provider_name,
        priceNum: t.price,
        price: hasStartingPrice(t) ? `from £${t.price}` : `£${t.price}`,
        turnaround: t.turnaround_time || "2–5 days",
        turnaroundDays: parseTurnaroundDays(t.turnaround_time || "5"),
        biomarkerCount: t.biomarker_count || 0,
        rating: providerRating?.rating,
        reviews: providerRating?.reviews,
        title: cleanName(t.test_name),
        desc:
          t.description ||
          `Comprehensive health screening covering essential markers. ${t.sample_type || "Blood sample"} collection.`,
        biomarkers: t.markers || [],
        tag,
        collection: t.sample_type || "Blood sample",
        url: t.url || undefined,
        url_verified: t.url_verified ?? null,
        imageUrl: t.image_url,
        collectionOptions: t.collection_options,
        isAddon: t.is_addon,
      } satisfies CategoryTestItem;
    });
  }, [popularTests]);

  const filters = useMemo(() => {
    const unique = Array.from(new Set(tests.map((t) => t.tag))).filter(Boolean);
    return ["All", ...unique];
  }, [tests]);

  if (isLoading || (isFetching && !popularTests)) {
    return (
      <StatusShell>
        <LoadingSkeleton />
      </StatusShell>
    );
  }

  if (error) {
    return (
      <StatusShell>
        <ErrorState onRetry={() => refetch()} />
      </StatusShell>
    );
  }

  if (tests.length === 0) {
    return (
      <StatusShell>
        <EmptyState />
      </StatusShell>
    );
  }

  return (
    <CategoryPageLayout
      seoTitle={SEO.title}
      seoDescription={SEO.description}
      seoKeywords={SEO.keywords}
      canonicalUrl={SEO.canonical}
      pillLabel="Most popular"
      headline="Most popular tests"
      subtitle="Compare the best-selling health tests from trusted UK providers, chosen by thousands of customers."
      searchPlaceholder="Search popular tests..."
      trustStats={[
        { value: "50,000+", label: "Customers served" },
        { value: "4.8★", label: "Average rating" },
        { value: "9+", label: "Trusted providers" },
      ]}
      filters={filters}
      tests={tests}
      categoryAccent="Most popular tests"
      benefitsTitle="Why choose our most popular tests?"
      benefits={[
        {
          icon: Star,
          title: "Trusted by thousands",
          description:
            "Our highest-rated tests chosen by customers across the UK",
        },
        {
          icon: TrendingUp,
          title: "Comprehensive insights",
          description:
            "Thorough biomarker panels for a complete health picture",
        },
        {
          icon: Shield,
          title: "Accredited labs",
          description: "All tests processed by UKAS-accredited laboratories",
        },
      ]}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Popular tests" }]}
    />
  );
};

export default MostPopularTestsPage;
