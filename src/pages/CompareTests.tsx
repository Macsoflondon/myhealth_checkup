import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import MainLayout from "@/layouts/MainLayout";

import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import { ProviderComparisonTable } from "@/components/compare/ProviderComparisonTable";
import ComparisonSectionHeading from "@/components/sections/ComparisonSectionHeading";
import ProviderComparisonSection from "@/components/sections/ProviderComparisonTable";
import type { CompareTestData } from "@/services/CompareService";
import { Button } from "@/components/ui/button";
import { Search, X, FlaskConical, Building2, PoundSterling } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useCompareTestsData, type CompareFilters, defaultFilters } from "@/hooks/queries/useCompareTestsData";
import { useRecommendedTests } from "@/hooks/queries/useRecommendedTests";
import { getCategoryDisplayName } from "@/utils/categoryTaglines";
import { getProviderRating } from "@/constants/providerRatings";
import { getCategoryPinColor } from "@/data/categoryColors";
import { getBranding } from "@/data/providerBranding";

const resolveCategoryColor = (test: CompareTestData): string => {
  const cat = test.category || "";
  const pin = getCategoryPinColor(cat.toLowerCase().replace(/\s+/g, "-"));
  if (pin && pin !== "#e70d69") return pin;
  const brand = getBranding(test.provider);
  if (brand?.primary) return brand.primary;
  return "#e70d69";
};

const CompareTests = () => {
  const [filters, setFilters] = useState<CompareFilters>(defaultFilters);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTests = useCompareItems();

  const { tests, isLoading, urlCategory } = useCompareTestsData(filters);

  const effectiveCategory = filters.selectedCategory || urlCategory || "general-health";
  const { data: recommendedTests = [], isLoading: isLoadingRecommended } = useRecommendedTests(
    effectiveCategory,
    8
  );

  useEffect(() => {
    if (urlCategory && !filters.selectedCategory) {
      setFilters(prev => ({ ...prev, selectedCategory: urlCategory }));
    }
  }, [urlCategory, filters.selectedCategory]);

  const handleToggleSelect = useCallback((test: CompareTestData) => {
    compareStore.toggle(test);
  }, []);

  const handleRemoveTest = useCallback((testId: string) => {
    compareStore.remove(testId);
  }, []);

  const handleClearAll = useCallback(() => {
    compareStore.clear();
  }, []);

  const handleOpenComparison = useCallback(() => {
    if (selectedTests.length >= 2) setIsComparisonOpen(true);
  }, [selectedTests.length]);

  useEffect(() => {
    if (searchParams.get("openCompare") === "1" && selectedTests.length >= 2) {
      setIsComparisonOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete("openCompare");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, selectedTests.length, setSearchParams]);

  const isSelected = useCallback(
    (id: string) => selectedTests.some(t => t.id === id),
    [selectedTests]
  );

  const hasSearch = filters.searchQuery.trim().length > 0;
  const displayTests: CompareTestData[] = hasSearch
    ? tests
    : recommendedTests.slice(0, 8);
  const showLoading = hasSearch ? isLoading : isLoadingRecommended;

  const renderCard = (test: CompareTestData) => {
    const selected = isSelected(test.id);
    const rating = getProviderRating(test.provider);
    return (
      <div key={test.id} className="w-[300px] flex-shrink-0">
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
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>Compare Blood Tests | myhealth checkup</title>
          <meta
            name="description"
            content="Compare private blood tests from Medichecks, Thriva, Randox, and more UK providers. Transparent pricing and inclusions from trusted UK providers."
          />
          <link rel="canonical" href="https://myhealthcheckup.co.uk/compare" />
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
          {/* CATEGORY HEADER — dark band with heading, stats, search */}
          <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: "#222b45" }}>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                {effectiveCategory && effectiveCategory !== "all"
                  ? `Compare ${getCategoryDisplayName(effectiveCategory)} Blood Tests`
                  : "Compare Private Blood Tests"}
              </h1>
              <p className="font-sans text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10">
                {effectiveCategory && effectiveCategory !== "all"
                  ? `Compare ${getCategoryDisplayName(effectiveCategory).toLowerCase()} blood tests from leading UK providers. Review pricing, biomarkers, turnaround times and sample methods to find the right test for your needs.`
                  : "Compare blood tests from leading UK providers. Review pricing, biomarkers, turnaround times and sample methods to find the right test for your needs."}
              </p>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 text-center">
                  <FlaskConical size={22} className="mx-auto mb-2 text-[#C59F4E]" />
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-[#C59F4E]">
                    {tests.length}
                  </p>
                  <p className="text-sm text-white/60 mt-1">Tests available</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 text-center">
                  <Building2 size={22} className="mx-auto mb-2 text-[#C59F4E]" />
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-[#C59F4E]">
                    {new Set(tests.map(t => t.provider)).size}
                  </p>
                  <p className="text-sm text-white/60 mt-1">Providers</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 text-center">
                  <PoundSterling size={22} className="mx-auto mb-2 text-[#C59F4E]" />
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-[#C59F4E]">
                    {tests.length > 0
                      ? `£${Math.min(...tests.map(t => t.price ?? Infinity)).toFixed(0)}`
                      : "—"}
                  </p>
                  <p className="text-sm text-white/60 mt-1">Lowest price</p>
                </div>
              </div>

              <div className="relative group max-w-2xl mx-auto">
                <Search
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#22c0d4] transition-colors"
                />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
                  }
                  placeholder="Search tests by name, biomarker, or provider…"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#22c0d4]/20 focus:border-[#22c0d4] transition-all text-base sm:text-lg placeholder-white/40 text-white"
                />
                {filters.searchQuery && (
                  <button
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: "" }))}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 text-white/40"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* DARK BAND — recommended / search results */}
          <section className="bg-[#081129] py-16 sm:py-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              {showLoading ? (
                <div className="flex gap-4 pb-4 overflow-x-auto">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[300px] h-[420px] bg-white/5 animate-pulse rounded-2xl flex-shrink-0"
                    />
                  ))}
                </div>
              ) : displayTests.length === 0 ? (
                <p className="text-center text-sm text-white/60 py-12">
                  No tests found for this search.
                </p>
              ) : (
                <div className="flex gap-5 pb-4 overflow-x-auto">
                  {displayTests.map(renderCard)}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 2 — Side-by-side provider comparison */}
          <ProviderComparisonSection />
        </MainLayout>

      </div>
    </ErrorBoundary>
  );
};

export default CompareTests;
