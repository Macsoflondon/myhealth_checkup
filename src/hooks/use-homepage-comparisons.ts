import { useQuery } from "@tanstack/react-query";
import { homepageComparisonQuery } from "@/lib/homepage-comparison-query";

export function useHomepageComparisons() {
  return useQuery(homepageComparisonQuery);
}
