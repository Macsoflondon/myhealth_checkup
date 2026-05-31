import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { getProviderRating } from "@/constants/providerRatings";

const PROVIDER_NAMES: Record<string, string> = {
  "medichecks": "Medichecks",
  "thriva": "Thriva",
  "goodbody-clinic": "GoodBody Clinic",
  "lola-health": "Lola Health",
  "randox": "Randox Health",
  "london-medical-laboratory": "London Medical Laboratory",
  "london-health-company": "London Health Company",
  "clinilabs": "Clinilabs",
  "medical-diagnosis": "Medical Diagnosis",
};

const BADGE_COLOR_BY_CATEGORY: Record<string, string> = {
  "womens-health": "#E91E7A",
  "mens-health": "#3B82F6",
  "fertility": "#10B981",
  "sexual-health": "#8B5CF6",
  "hormones": "#E91E7A",
  "thyroid": "#22c0d4",
  "heart": "#EF4444",
  "gut": "#F59E0B",
  "vitamins": "#F97316",
  "cancer-screening": "#9333EA",
  "sports-performance": "#22c55e",
  "general-health": "#3B82F6",
  "at-home": "#22c0d4",
};

export function useCategoryTests(canonicalCategory: string) {
  return useQuery({
    queryKey: ["category-tests-db", canonicalCategory],
    queryFn: async (): Promise<CategoryTestItem[]> => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select(
          "id,provider_id,test_name,description,price,base_price,url,image_url,biomarker_count,biomarkers_list,turnaround_days_text,is_popular,popularity_rank,sample_type,home_kit_available,clinic_visit_available,category,source_section_label"
        )
        .eq("canonical_category", canonicalCategory)
        .eq("is_active", true)
        .not("image_url", "is", null)
        .not("url", "is", null)
        .order("is_popular", { ascending: false })
        .order("popularity_rank", { ascending: true, nullsFirst: false })
        .order("price", { ascending: true });

      if (error) throw error;
      if (!data) return [];

      const badgeColor = BADGE_COLOR_BY_CATEGORY[canonicalCategory] || "#3B82F6";

      return data.map((row): CategoryTestItem => {
        const providerName = PROVIDER_NAMES[row.provider_id] || row.provider_id;
        const rating = getProviderRating(row.provider_id);
        const priceNum = Number(row.price ?? row.base_price ?? 0);
        const biomarkers = Array.isArray(row.biomarkers_list)
          ? (row.biomarkers_list as unknown[]).map(String).slice(0, 6)
          : [];
        const turnaround = row.turnaround_days_text || "Typical 3–5 days";
        const turnaroundDays = (() => {
          const m = turnaround.match(/(\d+)/);
          return m ? parseInt(m[1], 10) : 5;
        })();
        const collection = row.home_kit_available && row.clinic_visit_available
          ? "Home Kit / Clinic"
          : row.clinic_visit_available
          ? "Clinic"
          : "Home Kit";

        return {
          id: row.id,
          popular: !!row.is_popular,
          badge: row.source_section_label || row.category || undefined,
          badgeColor,
          provider: providerName,
          priceNum,
          price: `£${priceNum.toFixed(priceNum % 1 === 0 ? 0 : 2)}`,
          turnaround,
          turnaroundDays,
          biomarkerCount: row.biomarker_count ?? biomarkers.length ?? 0,
          rating: rating.rating,
          reviews: rating.reviews,
          title: row.test_name,
          desc: row.description || `${row.test_name} from ${providerName}.`,
          biomarkers,
          tag: "All",
          collection,
          url: row.url || undefined,
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}
