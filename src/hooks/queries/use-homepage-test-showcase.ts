import { useQuery } from "@tanstack/react-query";
import { homepageShowcaseQueryOptions } from "@/services/homepage-test-showcase";
import type { PopularTest } from "@/hooks/usePopularTestsFromDatabase";
import type { CollectionFeeType } from "@/lib/comparisonFormat";

export function useHomepagePopularShowcase() {
  return useQuery({
    ...homepageShowcaseQueryOptions,
    select: (tests): PopularTest[] =>
      tests.map((test) => ({
        id: test.id,
        test_name: test.test_name,
        provider_id: test.provider_id,
        provider_name: test.provider_name ?? test.provider_id,
        price: test.price ?? 0,
        category: test.category ?? "",
        biomarker_count: test.biomarker_count ?? 0,
        turnaround_time: test.turnaround_days_text ?? "",
        turnaround_days_text: test.turnaround_days_text ?? undefined,
        sample_type: test.sample_type ?? "",
        collection_method: test.collection_method ?? undefined,
        url: test.url ?? "",
        url_verified: test.url_verified,
        description: test.description ?? undefined,
        markers: Array.isArray(test.biomarkers_list)
          ? test.biomarkers_list.filter(
              (marker): marker is string => typeof marker === "string",
            )
          : [],
        image_url: test.image_url ?? undefined,
        total_expected_cost: test.total_expected_cost,
        collection_fee_type:
          test.collection_fee_type as CollectionFeeType | null,
        collection_fee_amount: test.collection_fee_amount,
        is_popular: test.is_popular ?? undefined,
        popularity_rank: test.popularity_rank ?? undefined,
        is_addon: test.is_addon ?? undefined,
      })),
  });
}
