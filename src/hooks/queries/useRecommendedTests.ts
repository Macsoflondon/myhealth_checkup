/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
/**
 * Hook for fetching recommended/popular tests by category
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TestDataTransformer } from "@/services/transformers/testDataTransformer";
import type { CompareTestData } from "@/services/CompareService";
import { logger } from "@/lib/logger";
import {
  getCanonicalCategoriesForSlug,
  getNameFilterForSlug,
} from "@/constants/categories";

export const recommendedQueryKeys = {
  byCategory: (category: string) => ["recommended", "tests", category] as const,
};

const escapeIlike = (s: string) => s.replace(/[%,()]/g, " ").trim();

function applyCategoryFilter(query: any, category: string) {
  if (!category || category === "all") return query;

  const nameFilter = getNameFilterForSlug(category);
  if (nameFilter) {
    if (nameFilter.canonicals?.length) {
      query = query.in("canonical_category", nameFilter.canonicals);
    }
    query = query.or(
      nameFilter.includeNames
        .map((n) => `test_name.ilike.%${escapeIlike(n)}%`)
        .join(",")
    );
    if (nameFilter.excludeNames) {
      for (const ex of nameFilter.excludeNames) {
        query = query.not("test_name", "ilike", `%${escapeIlike(ex)}%`);
      }
    }
    return query;
  }

  const canonicals = getCanonicalCategoriesForSlug(category);
  if (canonicals && canonicals.length > 0) {
    return query.in("canonical_category", canonicals);
  }

  const patterns = getCategoryPatterns(category);
  return query.or(patterns.map((p) => `category.ilike.%${p}%`).join(","));
}

/**
 * Fetch recommended tests for a specific category
 */
export function useRecommendedTests(category: string, limit: number = 8) {
  return useQuery({
    queryKey: recommendedQueryKeys.byCategory(category),
    queryFn: async (): Promise<CompareTestData[]> => {
      try {
        // First try to get popular tests for this category
        let popularQuery = supabase
          .from("provider_tests")
          .select("*")
          .eq("is_active", true)
          .eq("is_popular", true)
          .order("popularity_rank", { ascending: true, nullsFirst: false })
          .limit(limit);
        popularQuery = applyCategoryFilter(popularQuery, category);

        const { data: popularData, error: popularError } = await popularQuery;
        if (popularError) {
          logger.error("Error fetching popular tests:", popularError);
        }

        if (popularData && popularData.length >= 4) {
          return TestDataTransformer.transformMultiple(popularData);
        }

        // Fallback: cheapest matching tests in the category
        let fallbackQuery = supabase
          .from("provider_tests")
          .select("*")
          .eq("is_active", true)
          .not("price", "is", null)
          .order("price", { ascending: true })
          .limit(limit * 2);
        fallbackQuery = applyCategoryFilter(fallbackQuery, category);

        const { data: fallbackData, error: fallbackError } = await fallbackQuery;
        if (fallbackError) {
          logger.error("Error fetching fallback tests:", fallbackError);
          return TestDataTransformer.transformMultiple(popularData || []);
        }

        const allTests = [...(popularData || []), ...(fallbackData || [])];
        const uniqueTests = allTests.filter(
          (test, index, self) => self.findIndex((t) => t.id === test.id) === index
        );

        const providerCount: Record<string, number> = {};
        const diverseTests = uniqueTests.filter((test) => {
          const count = providerCount[test.provider_id] || 0;
          if (count >= 2) return false;
          providerCount[test.provider_id] = count + 1;
          return true;
        });

        return TestDataTransformer.transformMultiple(diverseTests.slice(0, limit));
      } catch (error) {
        logger.error("Error in useRecommendedTests:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
}

/**
 * Legacy ilike patterns — used only for slugs without canonical mapping.
 */
function getCategoryPatterns(category: string): string[] {
  const normalised = category.toLowerCase().replace(/-/g, " ").trim();
  const patterns: string[] = [normalised];
  if (normalised.includes("health")) {
    patterns.push(normalised.replace("health", "").trim());
  }
  if (normalised === "hormones" || normalised === "hormone tests") {
    patterns.push("hormone", "hormones", "hormonal");
  }
  if (normalised === "women's health" || normalised === "womens health") {
    patterns.push("women", "female", "womens");
  }
  if (normalised === "men's health" || normalised === "mens health") {
    patterns.push("men", "male", "mens");
  }
  if (normalised === "general health" || normalised === "general") {
    patterns.push("general", "wellbeing", "wellness", "comprehensive");
  }
  if (normalised === "cancer screening" || normalised === "cancer") {
    patterns.push("cancer", "screening", "tumour");
  }
  return patterns;
}
