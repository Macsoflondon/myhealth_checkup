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
  description: string | null;
  sampleType: string | null;
  collectionMethod: string | null;
  collectionOptions: unknown;
  measurementType: string | null;
  whoShouldTest: string | null;
  homeKitAvailable: boolean | null;
  clinicVisitAvailable: boolean | null;
  isAddon: boolean | null;
  imageUrl: string | null;
  /** True when imageUrl is an on-brand generic stock photo, not a provider product photo. */
  imageIsStock: boolean | null;
}

function parseBiomarkersList(raw: unknown): string[] {
  try {
    if (!raw || (typeof raw === "string" && raw.trim() === "")) {
      return [];
    }

    if (Array.isArray(raw)) {
      const parsed = raw
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter(Boolean)
        ;
      return parsed;
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
          ;
        return parsed;
      }
    }

    return [];
  } catch (e) {
    console.error("[useHeroPopularTests] parseBiomarkersList error:", e, "raw value:", raw);
    return [];
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
            "id, test_name, provider_id, total_expected_cost, biomarker_count, url, canonical_category, clinical_review_type, biomarkers_list, turnaround_days_text, image_url, image_is_stock, description, sample_type, collection_method, collection_options, measurement_type, who_should_test, home_kit_available, clinic_visit_available, is_addon"
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
          imageUrl: typeof row.image_url === "string" ? row.image_url : null,
          imageIsStock: typeof row.image_is_stock === "boolean" ? row.image_is_stock : null,
          description: typeof row.description === "string" ? row.description : null,
          sampleType: typeof row.sample_type === "string" ? row.sample_type : null,
          collectionMethod: typeof row.collection_method === "string" ? row.collection_method : null,
          collectionOptions: row.collection_options ?? null,
          measurementType: typeof row.measurement_type === "string" ? row.measurement_type : null,
          whoShouldTest: typeof row.who_should_test === "string" ? row.who_should_test : null,
          homeKitAvailable: typeof row.home_kit_available === "boolean" ? row.home_kit_available : null,
          clinicVisitAvailable: typeof row.clinic_visit_available === "boolean" ? row.clinic_visit_available : null,
          isAddon: typeof row.is_addon === "boolean" ? row.is_addon : null,
        }));
      } catch (e) {
        console.error("[useHeroPopularTests] Unexpected error in queryFn:", e);
        return [];
      }
    },
  });
}
