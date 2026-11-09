import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProviderRatings } from "@/services/provider-ratings-service";
import {
  createProviderRatingLookup,
  type ProviderRatingLookup,
} from "@/lib/provider-rating-lookup";

export const providerRatingsQueryKey = ["provider-ratings"] as const;

/**
 * Live provider star ratings from public.provider_ratings. The lookup returns
 * null while loading or when a provider has no verified row; callers render
 * nothing in that case.
 */
export function useProviderRatings(): {
  getRating: ProviderRatingLookup;
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: providerRatingsQueryKey,
    queryFn: fetchProviderRatings,
    staleTime: 60 * 60 * 1000,
  });
  const getRating = useMemo(() => createProviderRatingLookup(data ?? []), [data]);
  return { getRating, isLoading };
}
