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

function parseBiomarkersList(raw: unknown): string[] {
  try {
    if (!raw || (typeof raw === "string" && raw.trim() === "")) {
      return ["General Health"];
    }

    if (Array.isArray(raw)) {
      const parsed = raw
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter(Boolean)
        .slice(0, 4);
      return parsed.length > 0 ? parsed : ["General Health"];
    }

    if (typeof raw === "string") {
      let arr: unknown[];
      try {
        arr = JSON.parse(raw);
      } catch {
        arr = raw.split(",").map((s) => s.trim());
      }
      if (Array.isArray(arr)) {
        const parsed = arr
          .map((x) => (typeof x === "string" ? x.trim() : ""))
          .filter(Boolean)
          .slice(0, 4);
        return parsed.length > 0 ? parsed : ["General Health"];
      }
    }

    return ["General Health"];
  } catch (e) {
    console.error("[useHeroPopularTests] parseBiomarkersList error:", e, "raw value:", raw);
    return ["General Health"];
  }
}

export function useHeroPopularTests() {
  return useQuery({
    queryKey: ["hero-popular-tests"],
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<HeroPopularTest[]> => {
      try {
        const { data, error } = await supabase
          .from("provider_tests")
          .select(
            "id, test_name, provider_id, total_expected_cost, biomarker_count, url, canonical_category, clinical_review_type, biomarkers_list, turnaround_days_text"
          )
          .eq("is_popular", true)
          .eq("is_active", true)
          .order("popularity_rank", { ascending: true, nullsFirst: false })
          .limit(16);

        if (error) {
          console.error("[useHeroPopularTests] Supabase query error:", error);
          return [];
        }

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn("[useHeroPopularTests] No data returned from provider_tests");
          return [];
        }

        return data.map((row: Record<string, unknown>) => ({
          id: String(row.id ?? ""),
          testName: String(row.test_name ?? "Unknown Test"),
          providerId: String(row.provider_id ?? ""),
          totalExpectedCost: typeof row.total_expected_cost === "number" ? row.total_expected_cost : null,
          biomarkerCount: typeof row.biomarker_count === "number" ? row.biomarker_count : null,
          url: typeof row.url === "string" ? row.url : null,
          canonicalCategory: typeof row.canonical_category === "string" ? row.canonical_category : null,
          clinicalReviewType: typeof row.clinical_review_type === "string" ? row.clinical_review_type : null,
          biomarkersList: parseBiomarkersList(row.biomarkers_list),
          turnaroundDaysText: typeof row.turnaround_days_text === "string" ? row.turnaround_days_text : null,
        }));
      } catch (e) {
        console.error("[useHeroPopularTests] Unexpected error in queryFn:", e);
        return [];
      }
    },
  });
}
