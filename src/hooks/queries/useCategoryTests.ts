import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryTestsQueryOptions } from "@/services/category-catalogue";
export function useCategoryTests(
  canonicalCategory: string,
  subcategory?: string | null,
) {
  return useQuery(
    categoryTestsQueryOptions(useQueryClient(), canonicalCategory, subcategory),
  );
}
