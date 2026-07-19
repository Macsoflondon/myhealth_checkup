import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";

interface RecInput {
  actualTestId?: string;
  testName: string;
  providerId: string;
}

const SELECT = `
  id, provider_id, test_name, description, price, category, sample_type,
  biomarker_count, biomarkers_list, url, home_kit_available, clinic_visit_available,
  turnaround_days_text, base_price, collection_options, is_popular,
  collection_fee_amount, symptoms, who_should_test
`;

async function resolveOne(rec: RecInput): Promise<ProviderTestCardData | null> {
  if (rec.actualTestId) {
    const { data } = await supabase
      .from("provider_tests")
      .select(SELECT)
      .eq("id", rec.actualTestId)
      .eq("is_active", true)
      .maybeSingle();
    if (data) return data as unknown as ProviderTestCardData;
  }

  // Fallback: fuzzy match by provider + test_name (LIKE for curly apostrophes)
  const pattern = `%${rec.testName.replace(/['']/g, "_").replace(/[%_]/g, "\\$&")}%`;
  const { data } = await supabase
    .from("provider_tests")
    .select(SELECT)
    .eq("provider_id", rec.providerId)
    .eq("is_active", true)
    .ilike("test_name", pattern)
    .limit(1);

  return (data?.[0] as unknown as ProviderTestCardData) ?? null;
}

export function useResolvedRecommendations(recs: RecInput[]) {
  const key = recs.map((r) => r.actualTestId || `${r.providerId}:${r.testName}`).join("|");
  return useQuery({
    queryKey: ["resolved-recommendations", key],
    queryFn: async () => {
      const results = await Promise.all(recs.map(resolveOne));
      return results;
    },
    enabled: recs.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
