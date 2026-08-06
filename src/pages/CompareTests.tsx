import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, useNavigate, Link } from "@/lib/router-compat";
import { compareResultsPath } from "@/lib/compareUrl";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import MainLayout from "@/layouts/MainLayout";

import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import { ProviderComparisonTable } from "@/components/compare/ProviderComparisonTable";
import ComparisonSectionHeading from "@/components/sections/ComparisonSectionHeading";
import type { CompareTestData } from "@/services/CompareService";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useCompareTestsData, type CompareFilters, defaultFilters } from "@/hooks/queries/useCompareTestsData";
import { useRecommendedTests } from "@/hooks/queries/useRecommendedTests";
import { getProviderRating } from "@/constants/providerRatings";
import { getCategoryPinColor } from "@/data/categoryColors";
import { getBranding } from "@/data/providerBranding";
import { CategoryStandardHero } from "@/components/category/CategoryStandardHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { getCompareHeader } from "@/data/compareCategoryBenefits";
import { Scale, Shield, Clock, Search } from "lucide-react";

const COMPARE_BENEFITS = [
  { icon: Scale, title: "Like-for-like comparison", description: "Price, biomarker coverage and sample method side by side" },
  { icon: Shield, title: "UKAS accredited labs", description: "Every listed provider uses UKAS-accredited UK laboratories" },
  { icon: Clock, title: "Clear turnaround", description: "Typical result times shown on every listing" },
] as const;



const resolveCategoryColor = (test: CompareTestData): string => {
  const cat = test.category || "";
  const pin = getCategoryPinColor(cat.toLowerCase().replace(/\s+/g, "-"));
  if (pin && pin !== "#e70d69") return pin;
  const brand = getBranding(test.provider);
  if (brand?.primary) return brand.primary;
  return "#e70d69";
};

const PAGE_SIZE = 24;


const CompareTests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Seed the category from the URL on first render so we never fire an
  // unscoped "all tests" query before the effect syncs it.
  const [filters, setFilters] = useState<CompareFilters>(() => ({
    ...defaultFilters,
    selectedCategory: searchParams.get("category") || "",
  }));

  const navigate = useNavigate();


  const selectedTests = useCompareItems();

  const { tests, isLoading, urlCategory } = useCompareTestsData(filters);

  // The ?category= slug drives the whole browse view; read it directly so the
  // first render is already scoped to the category.
  const queryCategory = searchParams.get("category") || "";
  const effectiveCategory = filters.selectedCategory || urlCategory || queryCategory || "general-health";
  const { data: recommendedTests = [], isLoading: isLoadingRecommended } = useRecommendedTests(
    effectiveCategory,
    8
  );

  useEffect(() => {
    const next = urlCategory || queryCategory;
    if (next && filters.selectedCategory !== next) {
      setFilters(prev => ({ ...prev, selectedCategory: next }));
    }
  }, [urlCategory, queryCategory, filters.selectedCategory]);


  const handleToggleSelect = useCallback((test: CompareTestData) => {
    compareStore.toggle(test);
  }, []);

  const handleRemoveTest = useCallback((testId: string) => {
    compareStore.remove(testId);
  }, []);

  const handleClearAll = useCallback(() => {
    compareStore.clear();
  }, []);

  useEffect(() => {
    if (searchParams.get("openCompare") === "1") {
      const next = new URLSearchParams(searchParams);
      next.delete("openCompare");
      setSearchParams(next, { replace: true });
      if (selectedTests.length >= 2) navigate(compareResultsPath(selectedTests.map((t) => t.id)));
    }
  }, [searchParams, selectedTests, setSearchParams, navigate]);


  const isSelected = useCallback(
    (id: string) => selectedTests.some(t => t.id === id),
    [selectedTests]
  );

  const hasSearch = filters.searchQuery.trim().length > 0;
  // A category page browses the full category; the bare /compare hub shows a curated row.
  const isCategoryView = Boolean(
    filters.selectedCategory || urlCategory || searchParams.get("category"),
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters.selectedCategory, filters.searchQuery, urlCategory]);


  const displayTests: CompareTestData[] = isCategoryView || hasSearch
    ? tests
    : recommendedTests.slice(0, 8);
  const showLoading = isCategoryView || hasSearch ? isLoading : isLoadingRecommended;

  const renderCard = (test: CompareTestData) => {
    const selected = isSelected(test.id);
    const rating = getProviderRating(test.provider);
    return (
      <div key={test.id} className="w-full">

        <UnifiedTestCard
          category={test.category || "Health"}
          categoryColor={resolveCategoryColor(test)}
          name={test.name}
          description={test.description || "Comprehensive health screening test"}
          biomarkers={test.biomarkerCount ?? 0}
          results={test.features?.turnaround || `${test.turnaroundDays ?? "2-3"} days`}
          collection={test.features?.collection || "Home kit"}
          rating={rating.rating}
          reviews={rating.reviews}
          price={test.price}
          provider={test.provider}
          url={test.url}
          ctaLabel={selected ? "Selected ✓" : "View details"}
          compareSelected={selected}
          testDetails={{
            id: test.id,
            provider_id: test.provider.toLowerCase().replace(/\s+/g, "-"),
            test_name: test.name,
            description: test.description ?? null,
            price: test.price ?? null,
            category: test.category ?? null,
            sample_type: test.features?.collection ?? null,
            biomarker_count: test.biomarkerCount ?? null,
            url: test.url ?? null,
            biomarkers_list: null,
            turnaround_days_text: test.features?.turnaround ?? null,
            base_price: null,
            collection_options: null,
          }}
        />
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Compare Blood Tests",
            "description": "Compare private blood tests from Medichecks, Thriva, Randox, and more UK providers.",
            "url": "https://myhealthcheckup.co.uk/compare",
            "isPartOf": { "@type": "WebSite", "name": "myhealth checkup", "url": "https://myhealthcheckup.co.uk" },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myhealthcheckup.co.uk" },
                { "@type": "ListItem", "position": 2, "name": "Compare Tests" }
              ]
            }
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I compare private blood tests in the UK?",
                "acceptedAnswer": { "@type": "Answer", "text": "Use myhealth checkup to compare price, biomarker coverage, sample method, and typical turnaround across UKAS-accredited providers including Medichecks, Thriva, Randox and more. Filter by category, then select up to four tests to compare side-by-side." }
              },
              {
                "@type": "Question",
                "name": "Are the labs UKAS accredited?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. We only list providers whose laboratories hold UKAS accreditation (ISO 15189 where applicable) and whose clinics are CQC regulated. Accreditation status is shown on every provider profile." }
              },
              {
                "@type": "Question",
                "name": "Do I need a GP referral to book a private blood test?",
                "acceptedAnswer": { "@type": "Answer", "text": "No GP referral is required for the tests listed on myhealth checkup. You can book directly through the provider. Some specialist tests may include an optional GP review of your results." }
              },
              {
                "@type": "Question",
                "name": "How long do results take?",
                "acceptedAnswer": { "@type": "Answer", "text": "Typical turnaround is 2–5 working days from sample receipt for most blood tests, though times vary by provider and test type. Estimated turnaround is shown on each test card." }
              },
              {
                "@type": "Question",
                "name": "Is myhealth checkup free to use?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. The comparison platform is free for users. We may earn a referral fee when you book through a provider link, which never affects the price you pay or the ranking of results." }
              }
            ]
          })}</script>
        </Helmet>

        <MainLayout mainClassName="flex-1 bg-white">
          {/* CATEGORY HEADER — unified hero (title + 3 benefits + divider) */}
          {(() => {
            const header = getCompareHeader(effectiveCategory);
            return (
              <CategoryStandardHero pillLabel={header.title} />
            );
          })()}

          {/* ENTRY POINTS — goal and symptom comparison hubs (hub view only) */}
          {!isCategoryView && (
            <section className="bg-[#08122b] px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 sm:pt-16">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Link
                  to="/compare/goals"
                  className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:border-[#22c0d4]/60 hover:bg-white/[0.08]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22c0d4]">
                    Start with an outcome
                  </span>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-white mt-2">
                    Compare by goal
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 mt-1.5">
                    Know what you want to achieve — longevity, performance, weight loss, prevention —
                    and see which tests get you there.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#22c0d4] group-hover:text-[#e70d69] transition-colors mt-3">
                    Browse goals{" "}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>

                <Link
                  to="/compare/symptoms"
                  className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:border-[#e70d69]/60 hover:bg-white/[0.08]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e70d69]">
                    Start with how you feel
                  </span>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-white mt-2">
                    Compare by symptom
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 mt-1.5">
                    Tired, low mood, unexplained weight change — see the tests and biomarkers commonly
                    used to investigate each symptom.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#e70d69] group-hover:text-[#22c0d4] transition-colors mt-3">
                    Browse symptoms{" "}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              </div>
            </section>
          )}

          {/* DARK BAND — category browse grid / search results */}
          <section className="bg-[#08122b] py-10 sm:py-14 px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="max-w-6xl mx-auto">
              {/* Toolbar — live count and search */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                <p className="text-sm text-white/90">
                  {showLoading
                    ? "Loading tests…"
                    : `${displayTests.length} test${displayTests.length === 1 ? "" : "s"} ${
                        isCategoryView ? "in this category" : "shown"
                      }`}
                </p>
                <div className="relative w-full sm:w-72">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/78"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                    }
                    placeholder="Search tests or providers"
                    aria-label="Search tests"
                    className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/65 focus:border-[#22c0d4] focus:outline-none focus:ring-1 focus:ring-[#22c0d4]"
                  />
                </div>
              </div>

              {showLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-[420px] bg-white/5 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : displayTests.length === 0 ? (
                <p className="text-center text-sm text-white/78 py-12">
                  No tests found for this search.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {displayTests.slice(0, visibleCount).map(renderCard)}
                  </div>
                  {displayTests.length > visibleCount && (
                    <div className="flex justify-center mt-8">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="rounded-full border border-[#22c0d4]/60 px-6 py-2.5 text-sm font-semibold text-[#22c0d4] transition-colors hover:bg-[#22c0d4] hover:text-[#08122b]"
                      >
                        Show more tests ({displayTests.length - visibleCount} remaining)
                      </button>
                    </div>
                  )}
                </>
              )}

            </div>
          </section>


          <CategoryPageBottom
            benefitsTitle="Why compare with myhealth checkup?"
            benefits={[COMPARE_BENEFITS[0], COMPARE_BENEFITS[1], COMPARE_BENEFITS[2]]}
          />
        </MainLayout>


      </div>
    </ErrorBoundary>
  );
};

export default CompareTests;
