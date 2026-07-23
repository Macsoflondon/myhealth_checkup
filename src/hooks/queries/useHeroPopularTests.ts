import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HeroPopularTest {
  id: string;
  testName: string;
  providerId: string;
  totalExpectedCost: number | null;
  biomarkerCount: number | null;
  url: string | null;
  canonicalCategory: string | null;
  clinicalReviewType: string | null;
  biomarkersList: string[];
  turnaroundDaysText: string | null;
}

export function useHeroPopularTests() {
  return useQuery({
    queryKey: ["hero-popular-tests"],
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<HeroPopularTest[]> => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select(
          "id, test_name, provider_id, total_expected_cost, biomarker_count, url, canonical_category, clinical_review_type, biomarkers_list, turnaround_days_text"
        )
        .eq("is_popular", true)
        .eq("is_active", true)
        .order("popularity_rank", { ascending: true, nullsFirst: false })
        .limit(16);

      if (error || !data) return [];

      return (data as Array<{
        id: string;
        test_name: string;
        provider_id: string;
        total_expected_cost: number | null;
        biomarker_count: number | null;
        url: string | null;
        canonical_category: string | null;
        clinical_review_type: string | null;
        biomarkers_list: unknown;
        turnaround_days_text: string | null;
      }>).map((row) => ({
        id: row.id,
        testName: row.test_name,
        providerId: row.provider_id,
        totalExpectedCost: row.total_expected_cost,
        biomarkerCount: row.biomarker_count,
        url: row.url,
        canonicalCategory: row.canonical_category,
        clinicalReviewType: row.clinical_review_type,
        biomarkersList: Array.isArray(row.biomarkers_list)
          ? row.biomarkers_list
              .map((x) => (typeof x === "string" ? x : ""))
              .filter(Boolean)
              .slice(0, 4)
          : [],
        turnaroundDaysText: row.turnaround_days_text,
      }));
    },
  });
}
