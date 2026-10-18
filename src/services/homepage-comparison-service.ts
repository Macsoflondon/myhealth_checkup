import { supabase } from "@/integrations/supabase/client";
import { getSupportedProviderIds } from "@/constants/providers";

export async function getHomepageComparison() {
  const { data, error } = await supabase
    .from("unified_provider_tests")
    .select("id, test_name, provider_name, provider_id, total_expected_cost, biomarker_count, turnaround_days_text, updated_at, collection_method")
    .in("provider_id", getSupportedProviderIds())
    .or("test_name.ilike.%full blood count%,test_name.ilike.%complete blood count%")
    .eq("clinic_visit_available", true)
    .gt("total_expected_cost", 0)
    .order("total_expected_cost", { ascending: true });
  if (error) throw error;
  const seen = new Set<string>();
  return (data ?? []).filter((row) => {
    if (!row.id || !row.provider_id || seen.has(row.provider_id)) return false;
    seen.add(row.provider_id);
    return true;
  }).slice(0, 3);
}