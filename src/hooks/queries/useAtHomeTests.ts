import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AtHomeTest {
  id: string;
  provider_id: string;
  test_name: string;
  category: string;
  price: number | null;
  sample_type: string | null;
  turnaround_days_text: string | null;
  biomarker_count: number | null;
  biomarkers_list: { value: string }[] | null;
  description: string | null;
  who_should_test: string | null;
  symptoms: string[] | null;
  conditions: string[] | null;
  url: string | null;
  home_kit_available: boolean;
  clinic_visit_available: boolean;
  is_popular: boolean;
  is_addon: boolean;
  collection_options: Record<string, unknown> | null;
}

export const useAtHomeTests = (category?: string, search?: string) => {
  return useQuery({
    queryKey: ["at-home-tests", category, search],
    queryFn: async () => {
      let query = supabase
        .from("provider_tests")
        .select(`
          id, provider_id, test_name, category, price, sample_type,
          turnaround_days_text, biomarker_count, biomarkers_list,
          description, who_should_test, symptoms, conditions, url,
          home_kit_available, clinic_visit_available, is_popular, is_addon,
          collection_options
        `)
        .eq("is_active", true)
        .eq("home_kit_available", true)
        .eq("is_addon", false)
        .ilike("sample_type", "%finger%")
        .order("is_popular", { ascending: false })
        .order("test_name", { ascending: true });

      if (category && category !== "All") {
        query = query.eq("category", category);
      }

      if (search && search.trim()) {
        query = query.or(`test_name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as AtHomeTest[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAtHomeCategories = () => {
  return useQuery({
    queryKey: ["at-home-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("category")
        .eq("is_active", true)
        .eq("home_kit_available", true)
        .eq("is_addon", false)
        .or(
          "sample_type.ilike.%finger%,sample_type.ilike.%home%,sample_type.ilike.%at-home%,sample_type.ilike.%saliva%,sample_type.ilike.%urine%,sample_type.ilike.%stool%,sample_type.is.null"
        );
      if (error) throw error;
      const cats = Array.from(new Set((data || []).map((r) => r.category).filter(Boolean))).sort();
      return ["All", ...cats];
    },
    staleTime: 10 * 60 * 1000,
  });
};
