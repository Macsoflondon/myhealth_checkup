import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProviderTestRow {
  id: string;
  testName: string;
  provider: string;
  price: number;
  originalPrice?: number;
  turnaroundDays?: number;
  biomarkerCount?: number;
  sampleType?: string;
  homeKitAvailable: boolean;
  clinicVisitAvailable: boolean;
  gpReviewIncluded: boolean;
  url?: string;
  description?: string;
  category?: string;
}

interface UseProvidersByTestTypeOptions {
  testType: string;
  category?: string;
  enabled?: boolean;
}

export const useProvidersByTestType = ({ testType, category, enabled = true }: UseProvidersByTestTypeOptions) => {
  return useQuery({
    queryKey: ["providers-by-test-type", testType, category],
    queryFn: async (): Promise<ProviderTestRow[]> => {
      // Search for similar tests across all providers
      let query = supabase
        .from("provider_tests")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      // Search by test name similarity
      if (testType) {
        // Use ilike for partial matching
        query = query.ilike("test_name", `%${testType}%`);
      }

      // Optionally filter by category
      if (category) {
        query = query.ilike("category", `%${category}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching providers by test type:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Transform database results to ProviderTestRow format
      return data.map((row) => ({
        id: row.id,
        testName: row.test_name,
        provider: row.provider_id,
        price: row.price || 0,
        originalPrice: row.original_price || undefined,
        turnaroundDays: undefined, // Not in current schema
        biomarkerCount: row.biomarker_count || undefined,
        sampleType: row.sample_type || undefined,
        homeKitAvailable: row.home_kit_available || false,
        clinicVisitAvailable: row.clinic_visit_available || false,
        gpReviewIncluded: row.gp_consultation_included || false,
        url: row.url || undefined,
        description: row.description || undefined,
        category: row.category || undefined,
      }));
    },
    enabled: enabled && !!testType,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get all providers for a specific category
export const useProvidersByCategory = (category: string, enabled = true) => {
  return useQuery({
    queryKey: ["providers-by-category", category],
    queryFn: async (): Promise<ProviderTestRow[]> => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("*")
        .eq("is_active", true)
        .ilike("category", `%${category}%`)
        .order("price", { ascending: true });

      if (error) {
        console.error("Error fetching providers by category:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        testName: row.test_name,
        provider: row.provider_id,
        price: row.price || 0,
        originalPrice: row.original_price || undefined,
        turnaroundDays: undefined,
        biomarkerCount: row.biomarker_count || undefined,
        sampleType: row.sample_type || undefined,
        homeKitAvailable: row.home_kit_available || false,
        clinicVisitAvailable: row.clinic_visit_available || false,
        gpReviewIncluded: row.gp_consultation_included || false,
        url: row.url || undefined,
        description: row.description || undefined,
        category: row.category || undefined,
      }));
    },
    enabled: enabled && !!category,
    staleTime: 5 * 60 * 1000,
  });
};

// Group tests by name to show all providers offering similar tests
export const groupTestsByName = (tests: ProviderTestRow[]): Map<string, ProviderTestRow[]> => {
  const groups = new Map<string, ProviderTestRow[]>();
  
  tests.forEach((test) => {
    // Normalise test name for grouping
    const normalisedName = test.testName.toLowerCase().trim();
    
    if (!groups.has(normalisedName)) {
      groups.set(normalisedName, []);
    }
    groups.get(normalisedName)!.push(test);
  });
  
  return groups;
};
