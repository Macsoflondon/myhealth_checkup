import React, { useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import MainLayout from "@/layouts/MainLayout";

import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import { ComparisonBar } from "@/components/compare/ComparisonBar";
import { ComparisonPanel } from "@/components/compare/ComparisonPanel";
import { ProviderComparisonTable } from "@/components/compare/ProviderComparisonTable";
import ComparisonSectionHeading from "@/components/sections/ComparisonSectionHeading";
import type { CompareTestData } from "@/services/CompareService";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
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
    ? tests.slice(0, 12)
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
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet>
          <title>Compare Blood Tests | myhealth checkup</title>
          <meta
            name="description"
            content="Compare private blood tests from Medichecks, Thriva, Randox, and more UK providers. Transparent pricing and inclusions from trusted UK providers."
          />
          <link rel="canonical" href="https://www.myhealthcheckup.co.uk/compare" />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Compare Blood Tests",
            "description": "Compare private blood tests from Medichecks, Thriva, Randox, and more UK providers.",
            "url": "https://www.myhealthcheckup.co.uk/compare",
            "isPartOf": { "@type": "WebSite", "name": "myhealth checkup", "url": "https://www.myhealthcheckup.co.uk" },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.myhealthcheckup.co.uk" },
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

        <MainLayout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* SECTION 1 — Recommended / Search */}
            <section className="mb-12">
              <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-white font-montserrat mb-6">
                {effectiveCategory && effectiveCategory !== "all"
                  ? `Compare ${getCategoryDisplayName(effectiveCategory)}`
                  : "Compare Private Blood Tests"}
              </h1>

              {/* Search bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
                    }
                    placeholder="Search tests by name, biomarker, or provider…"
                    className="w-full h-12 pl-11 pr-11 rounded-full border border-border bg-white text-sm font-['DM_Sans'] text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise/40 focus:border-brand-turquoise transition"
                  />
                  {filters.searchQuery && (
                    <button
                      type="button"
                      onClick={() =>
                        setFilters(prev => ({ ...prev, searchQuery: "" }))
                      }
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted text-muted-foreground"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Horizontal scrolling cards */}
              {showLoading ? (
                <div className="flex gap-4 pb-4 overflow-x-auto">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[300px] h-[420px] bg-muted animate-pulse rounded-2xl flex-shrink-0"
                    />
                  ))}
                </div>
              ) : displayTests.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-12">
                  No tests found for this search.
                </p>
              ) : (
                <div className="flex gap-4 pb-4 overflow-x-auto">
                  {displayTests.map(renderCard)}
                </div>
              )}
            </section>

            {/* SECTION 2 — Comparison table (always visible) */}
            <section>
              <ComparisonSectionHeading className="mb-8" />
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="font-montserrat font-semibold text-foreground text-base">
                  Comparing {selectedTests.length}{" "}
                  {selectedTests.length === 1 ? "test" : "tests"}
                </p>
              </div>
              <ProviderComparisonTable tests={selectedTests} />
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="font-['DM_Sans'] gap-1.5 border-destructive text-destructive hover:bg-destructive/10"
                >
                  <X size={14} />
                  Clear&nbsp;
                </Button>
              </div>
            </section>
          </div>
        </MainLayout>

      </div>
    </ErrorBoundary>
  );
};

export default CompareTests;
