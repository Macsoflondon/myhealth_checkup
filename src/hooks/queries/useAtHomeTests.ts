import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AtHomeTest {
  id: string;
  provider_id: string;
  test_name: string;
  category: string;
  canonical_category: string | null;
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

/**
 * Names that indicate a scraped HTTP error page rather than a real product.
 * Belt-and-braces: the scrape layer rejects these, this keeps any legacy rows
 * out of the customer-facing listing.
 */
const isJunkTestName = (name: string): boolean =>
  /^\s*(\d{3}\b|error\b|(page\s+)?not\s+found\b|access denied|forbidden|just a moment)/i.test(
    name.trim()
  ) || name.trim().length < 3;

export const useAtHomeTests = (category?: string, search?: string) => {
  return useQuery({
    queryKey: ["at-home-tests", category, search],
    queryFn: async () => {
      let query = supabase
        .from("provider_tests")
        .select(`
          id, provider_id, test_name, category, canonical_category, price, sample_type,
          turnaround_days_text, biomarker_count, biomarkers_list,
          description, who_should_test, symptoms, conditions, url,
          home_kit_available, clinic_visit_available, is_popular, is_addon,
          collection_options
        `)
        .eq("is_active", true)
        .eq("home_kit_available", true)
        .eq("is_addon", false)
        .ilike("sample_type", "%finger%")
        .not("price", "is", null)
        .gt("price", 0)
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
      const rows = (data || []) as unknown as AtHomeTest[];
      return rows.filter((row) => !isJunkTestName(row.test_name));
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
        .ilike("sample_type", "%finger%")
        .not("price", "is", null)
        .gt("price", 0);
      if (error) throw error;
      const cats = Array.from(new Set((data || []).map((r) => r.category).filter(Boolean))).sort();
      return ["All", ...cats];
    },
    staleTime: 10 * 60 * 1000,
  });
};
