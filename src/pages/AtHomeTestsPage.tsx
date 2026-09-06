import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Home, Shield, Clock, AlertCircle, Inbox, RotateCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CategoryStandardHero } from "@/components/category/CategoryStandardHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { CategoryPageLayout, CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { AtHomeSectionGrid } from "@/components/athome/AtHomeSectionGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAtHomeTests, type AtHomeTest } from "@/hooks/queries/useAtHomeTests";
import { getBranding } from "@/data/providerBranding";
import { getProviderRating } from "@/constants/providerRatings";
import { AT_HOME_SECTIONS, findAtHomeSection } from "@/config/atHomeSections";
import { normalizeBiomarkers } from "@/utils/normalize-biomarkers";

const SEO = {
  title: "At Home Test Kits | Compare UK Finger-Prick Tests | myhealth checkup",
  description:
    "Compare at home test kits from UKAS-accredited UK providers. Finger-prick blood tests posted to your door, with prices, biomarkers and typical turnaround times.",
  keywords:
    "at home test kits, at home blood test, home testing kit, finger prick test, private blood test UK",
  canonical: "https://myhealthcheckup.co.uk/at-home-tests",
};

const HERO_BENEFITS = [
  { icon: Home, title: "Delivered to Your Door", description: "Finger-prick kits shipped directly to your home across the UK" },
  { icon: Shield, title: "UKAS Accredited Labs", description: "Every sample analysed by UKAS-accredited UK laboratories" },
  { icon: Clock, title: "Fast Online Results", description: "Typical turnaround in a few days, delivered securely online" },
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

const toCategoryTestItem = (test: AtHomeTest): CategoryTestItem => {
  const branding = getBranding(test.provider_id);
  const providerRating = getProviderRating(test.provider_id);
  const tag = test.category || "General Health";
  const priceNum = test.price ?? 0;
  const biomarkers = normalizeBiomarkers(test.biomarkers_list);
  return {
    id: test.id,
    providerId: test.provider_id,
    popular: test.is_popular,
    badge: tag,
    badgeColor: branding?.primary || "#e70d69",
    provider: test.provider_id,
    priceNum,
    price: `£${priceNum}`,
    turnaround: test.turnaround_days_text || "2–5 days",
    turnaroundDays: parseTurnaroundDays(test.turnaround_days_text || "5"),
    biomarkerCount: test.biomarker_count || biomarkers.length || 0,
    rating: providerRating?.rating,
    reviews: providerRating?.reviews,
    title: cleanName(test.test_name),
    desc:
      test.description ||
      `At-home ${test.sample_type || "finger-prick"} test analysed by a UKAS-accredited UK lab.`,
    biomarkers,
    tag,
    collection: test.sample_type || "Finger-prick",
    url: test.url || undefined,
    imageUrl: test.image_url || undefined,
    collectionOptions: test.collection_options,
  } satisfies CategoryTestItem;
};

const StatusShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Helmet>
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryStandardHero pillLabel="At Home Test Kits" />
        <section className="pt-8 pb-[72px] px-4 sm:px-6 lg:px-10 bg-white min-h-[60vh]">
          <div className="max-w-[1280px] mx-auto">{children}</div>
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: 9 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-[240px] rounded-2xl bg-black/[0.06]" />
    ))}
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="text-center py-20 max-w-md mx-auto">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/15 mb-5">
      <AlertCircle className="h-7 w-7 text-destructive" />
    </div>
    <h2 className="text-2xl font-bold text-[#060b18] mb-2">Couldn't load at-home test kits</h2>
    <p className="text-[#060b18]/75 mb-6">
      Something went wrong while fetching the latest kits. Please check your connection and try again.
    </p>
    <Button onClick={onRetry} variant="secondary" className="gap-2">
      <RotateCw className="h-4 w-4" /> Retry
    </Button>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-20 max-w-md mx-auto">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black/[0.06] mb-5">
      <Inbox className="h-7 w-7 text-[#060b18]/70" />
    </div>
    <h2 className="text-2xl font-bold text-[#060b18] mb-2">No at home test kits available yet</h2>
    <p className="text-[#060b18]/75 mb-6">
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
  const section = findAtHomeSection(params.get("subcategory"));

  /** Live kit count per landing section. */
  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const def of AT_HOME_SECTIONS) {
      result[def.slug] = (atHomeTests ?? []).filter((t) =>
        def.categories.includes(t.canonical_category ?? "")
      ).length;
    }
    return result;
  }, [atHomeTests]);

  const totalKits = atHomeTests?.length ?? 0;

  const tests: CategoryTestItem[] = useMemo(() => {
    if (!atHomeTests || !section) return [];
    return atHomeTests
      .filter((t) => section.categories.includes(t.canonical_category ?? ""))
      .map(toCategoryTestItem);
  }, [atHomeTests, section]);

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

  if (totalKits === 0) {
    return (
      <StatusShell>
        <EmptyState />
      </StatusShell>
    );
  }

  // Landing view — category sections rather than one undifferentiated list.
  if (!section) {
    return (
      <StatusShell>
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#060b18] mb-3">
            Browse at home test kits by category
          </h2>
          <p className="text-[#060b18]/75 max-w-2xl mx-auto">
            {totalKits} finger-prick kits from UKAS-accredited UK providers, grouped so you can go
            straight to the area you care about.
          </p>
        </div>
        <AtHomeSectionGrid counts={counts} />
        <section className="mt-16">
          <div className="rounded-2xl bg-gradient-to-br from-[#e70d69] via-[#22c0d4] to-[#e70d69] p-[3px]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 rounded-[13px] bg-[#0a1120] px-6 py-8 sm:px-9">
              <div className="text-center sm:text-left">
                <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-[#22c0d4]">
                  Not Sure Where to Start?
                </p>
                <h2 className="m-0 text-[clamp(22px,3vw,28px)] font-bold text-white">
                  Find the Right Health Test for You
                </h2>
              </div>
              <Link
                to="/find-test"
                className="inline-block whitespace-nowrap rounded-[10px] bg-gradient-to-br from-[#e70d69] to-[#ff4d6d] px-9 py-4 text-base font-semibold text-white"
              >
                Start Your Quiz →
              </Link>
            </div>
          </div>
        </section>
      </StatusShell>
    );
  }

  return (
    <CategoryPageLayout
      seoTitle={`${section.label} At Home Test Kits | myhealth checkup`}
      seoDescription={`Compare ${section.label.toLowerCase()} at home test kits from UKAS-accredited UK labs, with prices, biomarkers and typical turnaround times.`}
      seoKeywords={SEO.keywords}
      canonicalUrl={`${SEO.canonical}?subcategory=${section.slug}`}
      pillLabel={`${section.label} At Home Test Kits`}
      headline={`${section.label} At Home Test Kits`}
      subtitle={section.desc}
      searchPlaceholder="Search by test name or biomarker…"
      trustStats={[
        { value: `${tests.length}`, label: `${section.label} Kits` },
        { value: "UKAS", label: "Accredited Labs" },
        { value: "Fast", label: "Online Results" },
      ]}
      filters={filters}
      tests={tests}
      benefitsTitle="Why Choose At Home Testing?"
      benefits={[HERO_BENEFITS[0], HERO_BENEFITS[1], HERO_BENEFITS[2]]}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "At Home Test Kits", href: "/at-home-tests" },
        { label: section.label },
      ]}
    />
  );
};

export default AtHomeTestsPage;
