import { useQuery } from "@tanstack/react-query";
import { getHomepageComparisonPanels } from "@/services/homepage-comparison-service";

export function useHomepageComparisons() {
  return useQuery({
    queryKey: ["homepage", "compact-comparisons"],
    queryFn: getHomepageComparisonPanels,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
