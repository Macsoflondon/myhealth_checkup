import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  useCompareTestsData,
  type CompareFilters,
  defaultFilters,
} from "@/hooks/queries/useCompareTestsData";
import { useRecommendedTests } from "@/hooks/queries/useRecommendedTests";
import { getProviderRating } from "@/constants/providerRatings";
import { getCategoryPinColor } from "@/data/categoryColors";
import { getBranding } from "@/data/providerBranding";
import { StandardPageHero } from "@/components/layout/StandardPageHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { getCompareHeader } from "@/data/compareCategoryBenefits";
import { Scale, Shield, Clock, Search, X } from "lucide-react";
import { getProviderName } from "@/constants/providers";
import { libraryEntryNameQuery } from "@/services/BiomarkerLibraryService";
import {
  clearCompareFilterParams,
  hasInvalidBiomarkerParam,
  parseCompareUrlFilters,
  removeCompareParam,
} from "@/services/compareFilters";

const COMPARE_BENEFITS = [
  {
    icon: Scale,
    title: "Like-for-like comparison",
    description: "Price, biomarker coverage and sample method side by side",
  },
  {
    icon: Shield,
    title: "UKAS accredited labs",
    description: "Every listed provider uses UKAS-accredited UK laboratories",
  },
  {
    icon: Clock,
    title: "Clear turnaround",
    description: "Typical result times shown on every listing",
  },
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
    // Goal/symptom "Compare prices" links arrive as /compare?search=vitamin+d,
    // so the URL seeds the same search field the toolbar input drives.
    searchQuery: searchParams.get("search") || "",
  }));

  // ?biomarker=, ?symptom= and ?provider= are read from the URL on every
  // render, so the filter chips and "Clear filters" only need to edit the URL.
  const urlFilters = useMemo(
    () => parseCompareUrlFilters(searchParams),
    [searchParams],
  );
  const invalidBiomarker = hasInvalidBiomarkerParam(searchParams);
  const effectiveFilters = useMemo<CompareFilters>(
    () => ({
      ...filters,
      selectedProvider: urlFilters.provider ?? "all",
      biomarkerId: urlFilters.biomarkerId,
      symptomSlug: urlFilters.symptomSlug,
    }),
    [filters, urlFilters],
  );

  const navigate = useNavigate();

  const selectedTests = useCompareItems();

  const {
    tests,
    isLoading,
    isError,
    urlCategory,
    setMode,
    symptomPage,
    symptomNotFound,
  } = useCompareTestsData(effectiveFilters);

  const biomarkerNameQ = useQuery(
    libraryEntryNameQuery(urlFilters.biomarkerId ?? ""),
  );
  const biomarkerName = biomarkerNameQ.data?.name ?? null;

  // The ?category= slug drives the whole browse view; read it directly so the
  // first render is already scoped to the category.
  const queryCategory = searchParams.get("category") || "";
  const effectiveCategory =
    filters.selectedCategory ||
    urlCategory ||
    queryCategory ||
    "general-health";
  const { data: recommendedTests = [], isLoading: isLoadingRecommended } =
    useRecommendedTests(effectiveCategory, 8);

  useEffect(() => {
    const next = urlCategory || queryCategory;
    if (next && filters.selectedCategory !== next) {
      setFilters((prev) => ({ ...prev, selectedCategory: next }));
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
      if (selectedTests.length >= 2)
        navigate(compareResultsPath(selectedTests.map((t) => t.id)));
    }
  }, [searchParams, selectedTests, setSearchParams, navigate]);

  const isSelected = useCallback(
    (id: string) => selectedTests.some((t) => t.id === id),
    [selectedTests],
  );

  const hasSearch = filters.searchQuery.trim().length > 0;
  const providerFilter = urlFilters.provider;
  // Any filter the visitor chose. With one active the page lists exactly the
  // matching tests, or says there are none; it never swaps in other tests.
  const hasExplicitFilter = Boolean(
    setMode || providerFilter || hasSearch || invalidBiomarker,
  );

  const clearFilters = useCallback(() => {
    setFilters((prev) => ({ ...prev, searchQuery: "" }));
    setSearchParams((prev: URLSearchParams) => clearCompareFilterParams(prev), {
      replace: true,
    });
  }, [setSearchParams]);

  const removeFilter = useCallback(
    (key: "biomarker" | "symptom" | "provider" | "search") => {
      if (key === "search")
        setFilters((prev) => ({ ...prev, searchQuery: "" }));
      setSearchParams(
        (prev: URLSearchParams) => removeCompareParam(prev, key),
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Keep the search field and the ?search= param in step, so the view stays shareable.
  const updateSearchQuery = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, searchQuery: value }));
      setSearchParams(
        (prev: URLSearchParams) => {
          const next = new URLSearchParams(prev);
          if (value.trim()) next.set("search", value);
          else next.delete("search");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );
  // A category page browses the full category; the bare /compare hub shows a curated row.
  const isCategoryView = Boolean(
    filters.selectedCategory || urlCategory || searchParams.get("category"),
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    filters.selectedCategory,
    filters.searchQuery,
    urlCategory,
    urlFilters.biomarkerId,
    urlFilters.symptomSlug,
    urlFilters.provider,
  ]);

  const listsMatches = isCategoryView || hasExplicitFilter;
  const displayTests: CompareTestData[] = invalidBiomarker
    ? []
    : listsMatches
      ? tests
      : recommendedTests.slice(0, 8);
  const showLoading = invalidBiomarker
    ? false
    : listsMatches
      ? isLoading
      : isLoadingRecommended;

  const symptomName = symptomPage?.name ?? null;
  const heroTitle =
    setMode === "biomarker"
      ? biomarkerName
        ? `Tests that measure ${biomarkerName}`
        : "Tests for the selected biomarker"
      : setMode === "symptom" && symptomName
        ? `Tests for ${symptomName.toLowerCase()}`
        : null;

  const chips: {
    key: "biomarker" | "symptom" | "provider" | "search";
    label: string;
  }[] = [
    ...(urlFilters.biomarkerId || invalidBiomarker
      ? [
          {
            key: "biomarker" as const,
            label: `Biomarker: ${biomarkerName ?? (invalidBiomarker ? "not recognised" : "loading")}`,
          },
        ]
      : []),
    ...(urlFilters.symptomSlug
      ? [
          {
            key: "symptom" as const,
            label: `Symptom: ${symptomName ?? (symptomNotFound ? "not recognised" : "loading")}`,
          },
        ]
      : []),
    ...(providerFilter
      ? [
          {
            key: "provider" as const,
            label: `Provider: ${getProviderName(providerFilter)}`,
          },
        ]
      : []),
    ...(hasSearch
      ? [
          {
            key: "search" as const,
            label: `Search: \u201c${filters.searchQuery.trim()}\u201d`,
          },
        ]
      : []),
  ];

  const emptyMessage = invalidBiomarker
    ? "This link does not name a biomarker we recognise."
    : symptomNotFound
      ? "We do not have a symptom page with that name."
      : isError
        ? "We could not load these tests. Please try again."
        : hasExplicitFilter
          ? "No tests match these filters."
          : "No tests found for this search.";

  const renderCard = (test: CompareTestData) => {
    const selected = isSelected(test.id);
    const rating = getProviderRating(test.provider);
    return (
      <div key={test.id} className="w-full">
        <UnifiedTestCard
          category={test.category || "Health"}
          categoryColor={resolveCategoryColor(test)}
          name={test.name}
          description={
            test.description || "Comprehensive health screening test"
          }
          biomarkers={test.biomarkerCount ?? 0}
          results={
            test.features?.turnaround || `${test.turnaroundDays ?? "2-3"} days`
          }
          collection={test.features?.collection || "Home kit"}
          rating={rating?.rating}
          reviews={rating?.reviews}
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
            url_verified: test.url_verified ?? null,
            image_url: test.image_is_stock ? null : test.image_url,
            biomarkers_list: (test.biomarkersList ?? []).map((value) => ({
              value,
            })),
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
        <MainLayout mainClassName="flex-1 bg-white">
          {/* CATEGORY HEADER — unified hero (title + 3 benefits + divider) */}
          {(() => {
            const header = getCompareHeader(effectiveCategory);
            return (
              <StandardPageHero
                title={
                  heroTitle ??
                  (isCategoryView ? header.title : "Compare blood tests")
                }
                strapline="Compare private blood tests across UK providers by price, biomarkers included, sample method and typical turnaround."
              />
            );
          })()}

          {/* ENTRY POINTS — goal and symptom comparison hubs (hub view only) */}
          {!isCategoryView && !hasExplicitFilter && (
            <section className="bg-white px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 sm:pt-16">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Link
                  to="/compare/goals"
                  className="group block rounded-2xl border border-[#081129]/10 bg-white shadow-[0_2px_12px_rgba(8,17,41,0.06)] p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:border-[#22c0d4]/60 hover:shadow-[0_8px_24px_rgba(8,17,41,0.10)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22c0d4]">
                    Start with an outcome
                  </span>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-[#081129] mt-2">
                    Compare by goal
                  </h2>
                  <p className="text-sm sm:text-base text-[#081129]/80 mt-1.5">
                    Know what you want to achieve — longevity, performance,
                    weight loss, prevention — and see which tests get you there.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#22c0d4] group-hover:text-[#e70d69] transition-colors mt-3">
                    Browse goals{" "}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>

                <Link
                  to="/compare/symptoms"
                  className="group block rounded-2xl border border-[#081129]/10 bg-white shadow-[0_2px_12px_rgba(8,17,41,0.06)] p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:border-[#e70d69]/60 hover:shadow-[0_8px_24px_rgba(8,17,41,0.10)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e70d69]">
                    Start with how you feel
                  </span>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-[#081129] mt-2">
                    Compare by symptom
                  </h2>
                  <p className="text-sm sm:text-base text-[#081129]/80 mt-1.5">
                    Tired, low mood, unexplained weight change — see the tests
                    and biomarkers commonly used to investigate each symptom.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#e70d69] group-hover:text-[#22c0d4] transition-colors mt-3">
                    Browse symptoms{" "}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </div>
            </section>
          )}

          {/* Category browse grid / search results */}
          <section className="bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="max-w-6xl mx-auto">
              {/* Toolbar — live count and search */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                <p className="text-sm text-[#081129]/80">
                  {showLoading
                    ? "Loading tests…"
                    : `${displayTests.length} test${displayTests.length === 1 ? "" : "s"} ${
                        hasExplicitFilter
                          ? "found"
                          : isCategoryView
                            ? "in this category"
                            : "shown"
                      }`}
                </p>
                <div className="relative w-full sm:w-72">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#081129]/50"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={filters.searchQuery}
                    onChange={(e) => updateSearchQuery(e.target.value)}
                    placeholder={
                      setMode
                        ? "Search within these tests"
                        : "Search tests or providers"
                    }
                    aria-label="Search tests"
                    className="min-h-11 w-full rounded-full border border-[#081129]/15 bg-white py-2.5 pl-9 pr-4 text-sm text-[#081129] placeholder:text-[#081129]/50 focus:border-[#22c0d4] focus:outline-none focus:ring-1 focus:ring-[#22c0d4]"
                  />
                </div>
              </div>

              {chips.length > 0 && (
                <div
                  className="flex flex-wrap items-center gap-2 mb-6"
                  aria-label="Active filters"
                  role="group"
                >
                  <span className="text-sm text-[#081129]/70">Filters:</span>
                  {chips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => removeFilter(chip.key)}
                      aria-label={`Remove filter ${chip.label}`}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#081129]/15 bg-[#f6f8fb] px-4 py-2 text-sm font-semibold text-[#081129] transition-colors hover:border-[#e70d69]/60"
                    >
                      {chip.label}
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="min-h-[44px] px-2 text-sm font-semibold text-[#0a8fa0] underline underline-offset-2 hover:text-[#e70d69]"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {showLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[420px] bg-[#081129]/5 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : displayTests.length === 0 ? (
                <div className="text-center py-12" role="status">
                  <p className="text-sm text-[#081129]/70">{emptyMessage}</p>
                  {hasExplicitFilter && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 min-h-[44px] rounded-full border border-[#22c0d4]/60 px-6 py-2.5 text-sm font-semibold text-[#0a8fa0] transition-colors hover:bg-[#22c0d4] hover:text-white"
                    >
                      Clear filters and show all tests
                    </button>
                  )}
                </div>
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
                        className="rounded-full border border-[#22c0d4]/60 px-6 py-2.5 text-sm font-semibold text-[#0a8fa0] transition-colors hover:bg-[#22c0d4] hover:text-white"
                      >
                        Show more tests ({displayTests.length - visibleCount}{" "}
                        remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <CategoryPageBottom
            benefitsTitle="Why compare with myhealth checkup?"
            benefits={[
              COMPARE_BENEFITS[0],
              COMPARE_BENEFITS[1],
              COMPARE_BENEFITS[2],
            ]}
          />
        </MainLayout>
      </div>
    </ErrorBoundary>
  );
};

export default CompareTests;
