import { supabase } from "@/integrations/supabase/client";
import { CANCER_SEARCH_TERMS } from "@/data/compare/cancerBiomarkers";

export async function getCancerTests() {
  const { data, error } = await supabase
    .from("unified_provider_tests")
    .select("*");
  if (error) throw error;
  const uniqueRows = Array.from(
    new Map((data ?? []).map((row) => [row.id, row])).values(),
  );
  return uniqueRows
    .filter((test) => {
      const text =
        `${test.test_name} ${test.description || ""} ${test.category_primary || ""}`.toLowerCase();
      return CANCER_SEARCH_TERMS.some((term) =>
        text.includes(term.toLowerCase()),
      );
    })
    .map((row) => ({
      ...row,
      id: row.id ?? undefined,
      test_name: row.test_name ?? undefined,
      provider_id: row.provider_id ?? undefined,
      category: row.category_primary,
    }));
}
