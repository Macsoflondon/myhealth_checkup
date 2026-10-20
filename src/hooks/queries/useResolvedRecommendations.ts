import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loadViewPricing, mergeViewPricing } from "@/lib/viewPricing";
import { supabase } from "@/integrations/supabase/client";
import type { UniversalTestData } from "@/components/cards/UniversalTestCard";

interface RecInput {
  actualTestId?: string;
  testName: string;
  providerId: string;
}

const SELECT = `
  id, provider_id, test_name, description, price, category, sample_type,
  biomarker_count, biomarkers_list, url, image_url, home_kit_available, clinic_visit_available,
  turnaround_days_text, base_price, collection_options, is_popular,
  symptoms, who_should_test
`;

async function resolveOne(rec: RecInput): Promise<UniversalTestData | null> {
  if (rec.actualTestId) {
    const { data } = await supabase
      .from("provider_tests")
      .select(SELECT)
      .eq("id", rec.actualTestId)
      .eq("is_active", true)
      .maybeSingle();
    if (data) return data as unknown as UniversalTestData;
  }

  // Fallback: fuzzy match by provider + test_name (LIKE for curly apostrophes)
  // Escape LIKE metacharacters (including the escape char itself) first, then
  // turn curly apostrophes into the single-char wildcard so it stays unescaped.
  const pattern = `%${rec.testName.replace(/[\\%_]/g, "\\$&").replace(/[\u2018\u2019]/g, "_")}%`;
  const { data } = await supabase
    .from("provider_tests")
    .select(SELECT)
    .eq("provider_id", rec.providerId)
    .eq("is_active", true)
    .ilike("test_name", pattern)
    .limit(1);

  return (data?.[0] as unknown as UniversalTestData) ?? null;
}

export function useResolvedRecommendations(recs: RecInput[]) {
  const key = recs
    .map((r) => r.actualTestId || `${r.providerId}:${r.testName}`)
    .join("|");
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["resolved-recommendations", key],
    queryFn: async () => {
      const results = await Promise.all(recs.map(resolveOne));
      // One pricing request for every resolved test; prices come only from
      // unified_provider_tests, and a test the view doesn't list is dropped.
      const pricing = await loadViewPricing(
        queryClient,
        results.flatMap((r) => (r ? [r.id] : [])),
      );
      return results.map((r): UniversalTestData | null => {
        if (!r) return null;
        const p = pricing.get(r.id);
        return p ? mergeViewPricing(r, p) : null;
      });
    },
    enabled: recs.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
