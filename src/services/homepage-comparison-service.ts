import { supabase } from "@/integrations/supabase/client";
import { getSupportedProviderIds } from "@/constants/providers";

export const HOMEPAGE_COMPARISON_PANELS = {
  "full-blood-count": { title: "Full blood count", filter: "test_name.ilike.%full blood count%,test_name.ilike.%complete blood count%" },
  thyroid: { title: "Thyroid function", filter: "test_name.ilike.%thyroid%" },
  liver: { title: "Liver function", filter: "test_name.ilike.%liver%" },
} as const;
export type HomepageComparisonPanel = keyof typeof HOMEPAGE_COMPARISON_PANELS;

export async function getHomepageComparison(panel: HomepageComparisonPanel = "full-blood-count") {
  const { data, error } = await supabase
    .from("unified_provider_tests")
    .select(
      "id, test_name, provider_name, provider_id, price, collection_fee_amount, clinical_review_fee, total_expected_cost, biomarker_count, turnaround_days_text, updated_at, collection_method",
    )
    .in("provider_id", getSupportedProviderIds())
    .or(HOMEPAGE_COMPARISON_PANELS[panel].filter)
    .eq("clinic_visit_available", true)
    .gt("total_expected_cost", 0)
    .order("total_expected_cost", { ascending: true });
  if (error) throw error;
  const seen = new Set<string>();
  const seenIds = new Set<string>();
  return (data ?? [])
    .filter((row) => {
      if (!row.id || !row.provider_id || seenIds.has(row.id) || seen.has(row.provider_id))
        return false;
      seenIds.add(row.id);
      seen.add(row.provider_id);
      return true;
    })
    .slice(0, 3);
}
