import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  mappedCategoryTestsQueryOptions,
  mappedCategoryCountsQueryOptions,
} from "@/services/mapped-category-catalogue";
export function useMappedCategoryTests(
  slug: string | null,
  badgeColor: string,
) {
  return useQuery(
    mappedCategoryTestsQueryOptions(useQueryClient(), slug, badgeColor),
  );
}
export function useMappedCategoryCounts(slugs: string[]) {
  return useQuery(mappedCategoryCountsQueryOptions(slugs));
}
