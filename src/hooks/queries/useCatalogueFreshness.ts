import { useQuery } from "@tanstack/react-query";
import {
  fetchCatalogueFreshness,
  type CatalogueFreshness,
} from "@/services/CatalogueFreshnessService";

const QUERY_KEY = ["catalogue-freshness"] as const;

/**
 * Live catalogue freshness. Never seeded with placeholder values: if the view
 * is unreachable, consumers get `undefined` and must show no claim at all.
 */
export function useCatalogueFreshness() {
  return useQuery<CatalogueFreshness>({
    queryKey: QUERY_KEY,
    queryFn: fetchCatalogueFreshness,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/** Oldest (worst) age in hours across the given providers — never the newest. */
export function oldestAgeHours(
  freshness: CatalogueFreshness | undefined,
  providerIds: string[] | undefined,
): number | null {
  if (!freshness || !providerIds?.length) return null;
  const ages = providerIds
    .map((id) => freshness.byProviderId[id]?.hoursSinceScrape)
    .filter((h): h is number => typeof h === "number");
  if (ages.length === 0) return null;
  return Math.max(...ages);
}
