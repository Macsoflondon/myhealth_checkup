/**
 * Custom hook for Compare Tests page data fetching
 * Centralises all test comparison data operations with React Query
 */

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { CompareService, type CompareTestData } from "@/services/CompareService";
import { logger } from "@/lib/logger";

// Query keys
export const compareQueryKeys = {
  tests: (category: string, provider: string, search: string) => 
    ['compare', 'tests', category, provider, search] as const,
  categories: () => ['compare', 'categories'] as const,
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
};

// Filter application logic
function applyLocalFilters(
  tests: CompareTestData[],
  filters: CompareFilters
): CompareTestData[] {
  let filtered = [...tests];

  // Price range filter
  if (filters.priceRange.min) {
    filtered = filtered.filter(
      test => test.price >= parseFloat(filters.priceRange.min)
    );
  }
  if (filters.priceRange.max) {
    filtered = filtered.filter(
      test => test.price <= parseFloat(filters.priceRange.max)
    );
  }

  // Sample method filter
  if (filters.sampleMethod && filters.sampleMethod !== "all") {
    filtered = filtered.filter(test => {
      const collection = (test.features?.collection || "").toLowerCase();
      switch (filters.sampleMethod) {
        case "finger-prick":
          return collection.includes("finger") || collection.includes("prick");
        case "venous":
          return collection.includes("clinic") || collection.includes("venous");
        case "home-phlebotomy":
          return collection.includes("home") && collection.includes("nurse");
        default:
          return true;
      }
    });
  }

  // GP Review filter
  if (filters.gpReview) {
    filtered = filtered.filter(test =>
      ["Medichecks", "Thriva", "Randox"].includes(test.provider)
    );
  }

  return filtered;
}

// Sort logic
function sortTests(tests: CompareTestData[], sortBy: string): CompareTestData[] {
  const sorted = [...tests];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "turnaround":
      return sorted.sort(
        (a, b) => (a.turnaroundDays || 999) - (b.turnaroundDays || 999)
      );
    case "popular":
      return sorted.sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)
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

  // Tests query
  const testsQuery = useQuery({
    queryKey: compareQueryKeys.tests(
      effectiveCategory,
      filters.selectedProvider,
      filters.searchQuery
    ),
    queryFn: async () => {
      try {
        const providerFilter =
          filters.selectedProvider === "all"
            ? ["all"]
            : [filters.selectedProvider];

        let results: CompareTestData[] = [];

        if (filters.searchQuery.trim()) {
          results = await CompareService.searchTests(
            filters.searchQuery,
            providerFilter
          );
        } else {
          const categoryName = effectiveCategory || "all";
          results = await CompareService.getTestsByCategory(
            categoryName,
            providerFilter
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

  // Apply local filters and sorting
  const processedTests = useMemo(() => {
    if (!testsQuery.data) return [];
    const filtered = applyLocalFilters(testsQuery.data, filters);
    return sortTests(filtered, filters.sortBy);
  }, [testsQuery.data, filters]);

  // Clear cache
  const clearCache = useCallback(() => {
    CompareService.clearCache();
  }, []);

  return {
    // Data
    tests: processedTests,
    categories: categoriesQuery.data || [],
    urlCategory,

    // Loading states
    isLoading: testsQuery.isLoading,
    isCategoriesLoading: categoriesQuery.isLoading,

    // Error states
    error: testsQuery.error,
    categoriesError: categoriesQuery.error,

    // Refetch
    refetch: testsQuery.refetch,
    refetchCategories: categoriesQuery.refetch,

    // Utilities
    clearCache,
  };
}
