/**
 * Hook for fetching recommended/popular tests by category
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TestDataTransformer } from "@/services/transformers/testDataTransformer";
import type { CompareTestData } from "@/services/CompareService";
import { logger } from "@/lib/logger";

export const recommendedQueryKeys = {
  byCategory: (category: string) => ["recommended", "tests", category] as const,
};

/**
 * Fetch recommended tests for a specific category
 */
export function useRecommendedTests(category: string, limit: number = 8) {
  return useQuery({
    queryKey: recommendedQueryKeys.byCategory(category),
    queryFn: async (): Promise<CompareTestData[]> => {
      try {
        // Normalise category for matching
        const categoryPatterns = getCategoryPatterns(category);
        
        // First try to get popular tests for this category
        let query = supabase
          .from("provider_tests")
          .select("*")
          .eq("is_active", true)
          .eq("is_popular", true)
          .order("popularity_rank", { ascending: true, nullsFirst: false })
          .limit(limit);

        // Add category filter if not "all"
        if (category && category !== "all") {
          query = query.or(
            categoryPatterns.map(p => `category.ilike.%${p}%`).join(",")
          );
        }

        const { data: popularData, error: popularError } = await query;

        if (popularError) {
          logger.error("Error fetching popular tests:", popularError);
        }

        // If we have enough popular tests, use them
        if (popularData && popularData.length >= 4) {
          return TestDataTransformer.transformMultiple(popularData);
        }

        // Fallback: Get highest rated / lowest priced tests in the category
        let fallbackQuery = supabase
          .from("provider_tests")
          .select("*")
          .eq("is_active", true)
          .not("price", "is", null)
          .order("price", { ascending: true })
          .limit(limit);

        if (category && category !== "all") {
          fallbackQuery = fallbackQuery.or(
            categoryPatterns.map(p => `category.ilike.%${p}%`).join(",")
          );
        }

        const { data: fallbackData, error: fallbackError } = await fallbackQuery;

        if (fallbackError) {
          logger.error("Error fetching fallback tests:", fallbackError);
          return [];
        }

        // Combine and deduplicate
        const allTests = [...(popularData || []), ...(fallbackData || [])];
        const uniqueTests = allTests.filter(
          (test, index, self) => self.findIndex(t => t.id === test.id) === index
        );

        // Ensure provider diversity (max 2 per provider)
        const providerCount: Record<string, number> = {};
        const diverseTests = uniqueTests.filter(test => {
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });
}

/**
 * Generate category patterns for fuzzy matching
 */
function getCategoryPatterns(category: string): string[] {
  const normalised = category.toLowerCase().replace(/-/g, " ").trim();
  
  const patterns: string[] = [normalised];
  
  // Add variations
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
