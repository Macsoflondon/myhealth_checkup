import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Home, Shield, Clock, AlertCircle, Inbox, RotateCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CategoryStandardHero } from "@/components/category/CategoryStandardHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { CategoryPageLayout, CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAtHomeTests } from "@/hooks/queries/useAtHomeTests";
import { getBranding } from "@/data/providerBranding";
import { getProviderRating } from "@/constants/providerRatings";
import { findSubcategory, testMatchesSubcategory } from "@/config/subcategoryMap";

const SEO = {
  title: "At Home Health Tests | myhealth checkup",
  description:
    "Compare at-home testing kits from the UK's most trusted providers. Finger-prick blood tests, delivered to your door, analysed in accredited labs.",
  keywords:
    "at home blood test, home testing kit, finger prick test, health test at home, private blood test UK",
  canonical: "https://myhealthcheckup.co.uk/at-home-tests",
};

const HERO_BENEFITS = [
  { icon: Home, title: "Delivered to Your Door", description: "Finger-prick kits shipped directly to your home across the UK" },
  { icon: Shield, title: "UKAS Accredited Labs", description: "Every sample analysed by UKAS-accredited UK laboratories" },
  { icon: Clock, title: "Fast Online Results", description: "Typical turnaround in a few days, delivered securely online" },
] as const;

const PROVIDER_ID_MAP: Record<string, string> = {};

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

const StatusShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Helmet>
      <title>{SEO.title}</title>
      <meta name="description" content={SEO.description} />
      <link rel="canonical" href={SEO.canonical} />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryStandardHero
          pillLabel="At Home"
          benefits={[...HERO_BENEFITS] as [typeof HERO_BENEFITS[0], typeof HERO_BENEFITS[1], typeof HERO_BENEFITS[2]]}
        />
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-[#08122b] min-h-[60vh]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </section>
        <CategoryPageBottom
          benefitsTitle="Why Choose At Home Testing?"
          benefits={[HERO_BENEFITS[0], HERO_BENEFITS[1], HERO_BENEFITS[2]]}
        />
      </main>
      <Footer />
    </div>
  </>
);

const LoadingSkeleton: React.FC = () => (
  <>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-10 w-48 rounded-md bg-white/10" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="w-full max-w-[340px] h-[440px] rounded-2xl bg-white/10" />
      ))}
    </div>
  </>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="text-center py-20 max-w-md mx-auto">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/15 mb-5">
      <AlertCircle className="h-7 w-7 text-destructive" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">Couldn't load at-home tests</h2>
    <p className="text-white/70 mb-6">
      Something went wrong while fetching the latest kits. Please check your connection and try again.
    </p>
    <Button onClick={onRetry} variant="secondary" className="gap-2">
      <RotateCw className="h-4 w-4" /> Retry
    </Button>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-20 max-w-md mx-auto">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-5">
      <Inbox className="h-7 w-7 text-white/70" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">No at-home tests available yet</h2>
    <p className="text-white/70 mb-6">
      We're updating our catalogue. Browse the full comparison hub to find the right test for you.
    </p>
    <Button asChild variant="secondary">
      <Link to="/compare">Browse all tests</Link>
    </Button>
  </div>
);

const AtHomeTestsPage: React.FC = () => {
  const { data: atHomeTests, isLoading, error, refetch, isFetching } = useAtHomeTests();
  const [params] = useSearchParams();
  const sub = findSubcategory("at-home", params.get("subcategory"));

  const tests: CategoryTestItem[] = useMemo(() => {
    if (!atHomeTests) return [];
    const mapped = atHomeTests.map((t) => {
      const branding = getBranding(t.provider_id);
      const providerRating = getProviderRating(t.provider_id);
      const tag = t.category || "General Health";
      const priceNum = t.price ?? 0;
      const biomarkers = (t.biomarkers_list || []).map((b) => b.value).filter(Boolean);
      return {
        id: t.id,
        providerId: t.provider_id,
        popular: t.is_popular,
        badge: tag,
        badgeColor: branding?.primary || "#e70d69",
        provider: t.provider_id,
        priceNum,
        price: `£${priceNum}`,
        turnaround: t.turnaround_days_text || "2–5 days",
        turnaroundDays: parseTurnaroundDays(t.turnaround_days_text || "5"),
        biomarkerCount: t.biomarker_count || biomarkers.length || 0,
        rating: providerRating.rating,
        reviews: providerRating.reviews,
        title: cleanName(t.test_name),
        desc:
          t.description ||
          `At-home ${t.sample_type || "finger-prick"} test analysed by a UKAS-accredited UK lab.`,
        biomarkers,
        tag,
        collection: t.sample_type || "Finger-prick",
        url: t.url || undefined,
        collectionOptions: t.collection_options,
      } satisfies CategoryTestItem;
    });

    if (!sub) return mapped;
    return mapped.filter((t) =>
      testMatchesSubcategory(sub, {
        title: t.title,
        biomarkers: t.biomarkers,
        tag: t.tag,
        desc: t.desc,
      })
    );
  }, [atHomeTests, sub]);

  const filters = useMemo(() => {
    const unique = Array.from(new Set(tests.map((t) => t.tag))).filter(Boolean);
    return ["All", ...unique];
  }, [tests]);

  if (isLoading || (isFetching && !atHomeTests)) {
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
      pillLabel="At Home"
      headline="At Home Health Tests"
      subtitle="Compare at-home testing kits from the UK's most trusted providers. Analysed in accredited labs, results delivered securely online."
      searchPlaceholder="Search by test name or biomarker…"
      trustStats={[
        { value: `${tests.length}+`, label: "At-Home Tests" },
        { value: "UKAS", label: "Accredited Labs" },
        { value: "Fast", label: "Online Results" },
      ]}
      filters={filters}
      tests={tests}
      benefitsTitle="Why Choose At Home Testing?"
      benefits={[
        { icon: Home, title: "Delivered to Your Door", description: "Finger-prick kits shipped directly to your home across the UK" },
        { icon: Shield, title: "UKAS Accredited Labs", description: "Every sample analysed by UKAS-accredited UK laboratories" },
        { icon: Clock, title: "Fast Online Results", description: "Typical turnaround in a few days, delivered securely online" },
      ]}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "At Home Tests" }]}
    />
  );
};

export default AtHomeTestsPage;
