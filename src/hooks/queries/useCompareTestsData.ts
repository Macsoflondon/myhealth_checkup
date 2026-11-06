/**
 * Custom hook for Compare Tests page data fetching
 * Centralises all test comparison data operations with React Query
 */

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@/lib/router-compat";
import {
  CompareService,
  type CompareTestData,
} from "@/services/CompareService";
import { logger } from "@/lib/logger";
import { isJunkTestName } from "@/utils/is-junk-test-name";
import { describeSampleType } from "@/lib/sampleType";

// Query keys
export const compareQueryKeys = {
  tests: (category: string, provider: string, search: string) =>
    ["compare", "tests", category, provider, search] as const,
  biomarkerTests: (biomarkerId: string, provider: string) =>
    ["compare", "biomarker-tests", biomarkerId, provider] as const,
  symptomTests: (symptomSlug: string, provider: string) =>
    ["compare", "symptom-tests", symptomSlug, provider] as const,
  symptomPage: (symptomSlug: string) =>
    ["compare", "symptom-page", symptomSlug] as const,
  categories: () => ["compare", "categories"] as const,
};

export interface CompareFilters {
  searchQuery: string;
  selectedProvider: string;
  priceRange: { min: string; max: string };
  selectedCategory: string;
  sampleMethod: string;
  fastingRequired: string;
  gpReview: boolean;
  sortBy: string;
  /** ?biomarker= library id: list exactly the tests linked to it. */
  biomarkerId: string | null;
  /** ?symptom= slug: list the tests behind that symptom's recommendations. */
  symptomSlug: string | null;
}

export const defaultFilters: CompareFilters = {
  searchQuery: "",
  selectedProvider: "all",
  priceRange: { min: "", max: "" },
  selectedCategory: "",
  sampleMethod: "all",
  fastingRequired: "any",
  gpReview: false,
  sortBy: "price-asc",
  biomarkerId: null,
  symptomSlug: null,
};

/**
 * Inside a biomarker or symptom set, the search box narrows the set by name,
 * description or provider instead of replacing it with a text search.
 */
export function narrowBySearch(
  tests: CompareTestData[],
  searchQuery: string,
): CompareTestData[] {
  const term = searchQuery.trim().toLowerCase();
  if (!term) return tests;
  return tests.filter((t) =>
    [t.name, t.description, t.provider].some((v) =>
      (v ?? "").toLowerCase().includes(term),
    ),
  );
}

/** The junk, local-filter and sort steps every listing goes through. */
export function processCompareTests(
  tests: CompareTestData[],
  filters: CompareFilters,
): CompareTestData[] {
  const clean = tests.filter((test) => !isJunkTestName(test.name));
  return sortTests(applyLocalFilters(clean, filters), filters.sortBy);
}

// Filter application logic
function applyLocalFilters(
  tests: CompareTestData[],
  filters: CompareFilters,
): CompareTestData[] {
  let filtered = [...tests];

  // Price range filter
  if (filters.priceRange.min) {
    filtered = filtered.filter(
      (test) => test.price >= parseFloat(filters.priceRange.min),
    );
  }
  if (filters.priceRange.max) {
    filtered = filtered.filter(
      (test) => test.price <= parseFloat(filters.priceRange.max),
    );
  }

  // Sample method filter. "finger-prick" covers home blood samples, including
  // capillary blood from the QuickDraw upper-arm device (never venous).
  if (filters.sampleMethod && filters.sampleMethod !== "all") {
    filtered = filtered.filter((test) => {
      const collection = (test.features?.collection || "").toLowerCase();
      const token = describeSampleType(collection).token;
      const isHomeBlood = token === "finger_prick" || token === "capillary";
      switch (filters.sampleMethod) {
        case "finger-prick":
          return isHomeBlood || /finger|prick/.test(collection);
        case "venous":
          return (
            !isHomeBlood &&
            (collection.includes("clinic") || collection.includes("venous"))
          );
        case "home-phlebotomy":
          return collection.includes("home") && collection.includes("nurse");
        default:
          return true;
      }
    });
  }

  // GP Review filter
  if (filters.gpReview) {
    filtered = filtered.filter((test) =>
      ["Medichecks", "Randox"].includes(test.provider),
    );
  }

  return filtered;
}

// Sort logic
function sortTests(
  tests: CompareTestData[],
  sortBy: string,
): CompareTestData[] {
  const sorted = [...tests];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "turnaround":
      return sorted.sort(
        (a, b) => (a.turnaroundDays ?? 999) - (b.turnaroundDays ?? 999),
      );
    case "popular":
      return sorted.sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0),
      );
    default:
      return sorted.sort((a, b) => a.price - b.price);
  }
}

export function useCompareTestsData(filters: CompareFilters) {
  const location = useLocation();

  // Get category from URL on mount
  const urlCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "";
  }, [location.search]);

  // Use URL category if no filter category is set
  const effectiveCategory = filters.selectedCategory || urlCategory;

  // Categories query
  const categoriesQuery = useQuery({
    queryKey: compareQueryKeys.categories(),
    queryFn: async () => {
      try {
        return await CompareService.getCategories();
      } catch (error) {
        logger.error("Error fetching categories:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const providerFilter =
    filters.selectedProvider === "all" ? ["all"] : [filters.selectedProvider];
  const biomarkerId = filters.biomarkerId;
  const symptomSlug = biomarkerId ? null : filters.symptomSlug;

  // Biomarker mode: errors surface (no catch) so the page can say the load
  // failed rather than claim there are no tests.
  const biomarkerQuery = useQuery({
    queryKey: compareQueryKeys.biomarkerTests(
      biomarkerId ?? "",
      filters.selectedProvider,
    ),
    queryFn: () =>
      CompareService.getBiomarkerTests(biomarkerId as string, providerFilter),
    enabled: Boolean(biomarkerId),
    staleTime: 2 * 60 * 1000,
  });

  const symptomPageQuery = useQuery({
    queryKey: compareQueryKeys.symptomPage(symptomSlug ?? ""),
    queryFn: () => CompareService.getSymptomPage(symptomSlug as string),
    enabled: Boolean(symptomSlug),
    staleTime: Infinity,
  });
  const symptomPage = symptomPageQuery.data ?? null;

  const symptomTestsQuery = useQuery({
    queryKey: compareQueryKeys.symptomTests(
      symptomSlug ?? "",
      filters.selectedProvider,
    ),
    queryFn: () =>
      CompareService.getSymptomTests(
        symptomPage as NonNullable<typeof symptomPage>,
        providerFilter,
      ),
    enabled: Boolean(symptomSlug && symptomPage),
    staleTime: 2 * 60 * 1000,
  });

  const setMode = biomarkerId ? "biomarker" : symptomSlug ? "symptom" : null;

  // Tests query
  const testsQuery = useQuery({
    queryKey: compareQueryKeys.tests(
      effectiveCategory,
      filters.selectedProvider,
      filters.searchQuery,
    ),
    enabled: setMode === null,
    queryFn: async () => {
      try {
        let results: CompareTestData[] = [];

        if (filters.searchQuery.trim()) {
          results = await CompareService.searchTests(
            filters.searchQuery,
            providerFilter,
            effectiveCategory || undefined,
          );
        } else {
          const categoryName = effectiveCategory || "all";
          results = await CompareService.getTestsByCategory(
            categoryName,
            providerFilter,
          );
        }

        return results;
      } catch (error) {
        logger.error("Error fetching tests:", error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const activeQuery =
    setMode === "biomarker"
      ? biomarkerQuery
      : setMode === "symptom"
        ? symptomTestsQuery
        : testsQuery;

  // Apply local filters and sorting
  const processedTests = useMemo(() => {
    if (!activeQuery.data) return [];
    const base = setMode
      ? narrowBySearch(activeQuery.data, filters.searchQuery)
      : activeQuery.data;
    return processCompareTests(base, filters);
  }, [activeQuery.data, filters, setMode]);

  const symptomNotFound =
    setMode === "symptom" && symptomPageQuery.isSuccess && !symptomPage;
  const isLoading =
    setMode === "symptom"
      ? symptomPageQuery.isLoading || symptomTestsQuery.isLoading
      : activeQuery.isLoading;

  // Clear cache
  const clearCache = useCallback(() => {
    CompareService.clearCache();
  }, []);

  return {
    // Data
    tests: processedTests,
    categories: categoriesQuery.data || [],
    urlCategory,

    // Exact-set modes
    setMode,
    symptomPage,
    symptomNotFound,
    isError: activeQuery.isError || symptomPageQuery.isError,

    // Loading states
    isLoading,
    isCategoriesLoading: categoriesQuery.isLoading,

    // Error states
    error: activeQuery.error,
    categoriesError: categoriesQuery.error,

    // Refetch
    refetch: activeQuery.refetch,
    refetchCategories: categoriesQuery.refetch,

    // Utilities
    clearCache,
  };
}
