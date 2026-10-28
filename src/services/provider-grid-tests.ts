import { supabase } from "@/integrations/supabase/client";

export async function getProviderGridTests(dbId: string, limit: number) {
  const { data, error } = await supabase
    .from("provider_tests")
    .select(
      "id, test_name, image_url, price, base_price, home_phlebotomy_cost, category, sample_type, collection_method, measurement_type, who_should_test, home_kit_available, clinic_visit_available, url, url_verified, biomarker_count, biomarkers_list, description, what_is_tested, preparation_notes, test_limitations, turnaround_days_text, collection_options, popularity_rank, is_popular, is_addon, purchase_notes, lab_ukas_accredited, lab_cqc_regulated, lab_iso15189",
    )
    .eq("provider_id", dbId)
    .eq("is_active", true)
    .not("price", "is", null)
    .order("is_addon", { ascending: true, nullsFirst: true })
    .order("is_popular", { ascending: false, nullsFirst: false })
    .order("popularity_rank", { ascending: true, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
