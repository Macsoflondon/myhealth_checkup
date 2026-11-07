import { queryOptions } from "@tanstack/react-query";
import { getHomepageComparisonPanels } from "@/services/homepage-comparison-service";

export const homepageComparisonQuery = queryOptions({
  queryKey: ["homepage", "compact-comparisons"],
  queryFn: getHomepageComparisonPanels,
  staleTime: 30 * 60 * 1000,
  gcTime: 60 * 60 * 1000,
});
