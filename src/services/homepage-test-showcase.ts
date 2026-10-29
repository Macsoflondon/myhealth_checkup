import { supabase } from "@/integrations/supabase/client";
import {
  HOMEPAGE_PROVIDER_IDS,
  selectHomepageProviderTests,
} from "@/lib/homepage-provider-selection";

const SHOWCASE_COLUMNS =
  "id, provider_id, provider_name, test_name, description, price, total_expected_cost, collection_fee_type, collection_fee_amount, collection_fee_note, clinical_review_type, clinical_review_fee, biomarker_count, biomarkers_list, category_primary, sample_type, collection_method, turnaround_days_text, url, url_verified, image_url, is_addon, is_popular, popularity_rank, home_kit_available, clinic_visit_available, price_checked_at";

export async function getHomepageShowcaseTests() {
  // Fetch a bounded pool per provider, so global ranks cannot crowd out a provider.
  const pools = await Promise.all(
    HOMEPAGE_PROVIDER_IDS.map(async (providerId) => {
      const { data, error } = await supabase
        .from("unified_provider_tests")
        .select(SHOWCASE_COLUMNS)
        .eq("provider_id", providerId)
        .eq("is_addon", false)
        .gt("price", 0)
        .not("url", "is", null)
        .not("test_name", "ilike", "%appointment%")
        .not("test_name", "ilike", "%consultation%")
        .order("is_popular", { ascending: false, nullsFirst: false })
        .order("popularity_rank", { ascending: true, nullsFirst: false })
        .order("test_name", { ascending: true })
        .limit(12);
      if (error) throw error;
      return data ?? [];
    }),
  );
  return selectHomepageProviderTests(pools.flat()).map((test) => ({
    ...test,
    category: test.category_primary,
    canonical_category: test.category_primary,
  }));
}

export type HomepageShowcaseTest = Awaited<
  ReturnType<typeof getHomepageShowcaseTests>
>[number];

export const homepageShowcaseQueryOptions = {
  queryKey: ["homepage-provider-showcase", "eight-providers"] as const,
  queryFn: getHomepageShowcaseTests,
  staleTime: 10 * 60 * 1000,
};
