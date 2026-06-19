/**
 * Live test catalogue, sourced from Supabase `provider_tests`.
 *
 * Falls back to the static TEST_CATALOGUE (built from realProviderData +
 * SEED_TESTS) when the network is unavailable, so the quiz / compare /
 * recommendations screens stay functional offline or before login.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TEST_CATALOGUE } from "./catalogue";
import { adaptProviderTestRow, type ProviderTestRow } from "./supabaseAdapter";
import type { TestRecord } from "@/types/testFinder";

const QUERY_KEY = ["test-finder", "catalogue"] as const;

async function fetchCatalogue(): Promise<TestRecord[]> {
  const { data, error } = await supabase
    .from("provider_tests")
    .select(
      "id, provider_id, test_name, price, biomarker_count, biomarkers_list, sample_type, collection_method, collection_fee_type, collection_fee_amount, collection_fee_verification, home_kit_available, clinic_visit_available, clinical_review_type, clinical_review_professional, clinical_review_fee, clinical_review_verification, turnaround_days_text, canonical_category, category, url, url_verified, is_active",
    )
    .eq("is_active", true)
    .not("price", "is", null)
    .order("provider_id")
    .limit(1000);

  if (error) throw error;
  const rows = (data ?? []) as ProviderTestRow[];
  const records = rows
    .map(adaptProviderTestRow)
    .filter((r): r is TestRecord => r !== null);
  return records.length > 0 ? records : TEST_CATALOGUE;
}

export function useTestCatalogue() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchCatalogue,
    staleTime: 5 * 60 * 1000,
    placeholderData: TEST_CATALOGUE,
  });
}
