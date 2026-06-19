import { ApiResponse } from "./base";
import { supabase } from "@/integrations/supabase/client";

export interface Test {
  id: string;
  test_name: string;
  category: string;
  subcategory?: string;
  description: string;
  detailed_description?: string;
  test_code?: string;
  biomarkers: any;
  sample_type?: string;
  fasting_required?: boolean;
  typical_turnaround_days?: number;
  preparation_instructions?: string;
  clinical_significance?: string;
  who_should_take?: string;
  popularity_score?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProviderTest {
  id: string;
  provider_id: string;
  provider_test_id: string;
  provider_test_name: string;
  test_master_id: string;
  current_price?: number;
  original_price?: number;
  discount_percentage?: number;
  turnaround_time_days?: number;
  sample_collection_method?: string;
  availability_status: string;
  provider_url?: string;
  accreditations?: string[];
  last_scraped_at?: string;
  created_at: string;
  updated_at: string;
}

class TestsApi {
  /**
   * Get all active tests
   */
  async getActiveTests(): Promise<ApiResponse<Test[]>> {
    try {
      const { data, error } = await supabase
        .from("tests_master")
        .select("*")
        .eq("is_active", true);

      return { data: data as Test[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get tests by category
   */
  async getTestsByCategory(category: string): Promise<ApiResponse<Test[]>> {
    try {
      const { data, error } = await supabase
        .from("tests_master")
        .select("*")
        .eq("category", category)
        .eq("is_active", true);

      return { data: data as Test[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Search active provider_tests across name / description / category /
   * canonical_category / biomarkers. Returns rows shaped to the legacy
   * Test interface so existing consumers keep working.
   */
  async searchTests(searchTerm: string): Promise<ApiResponse<Test[]>> {
    try {
      const safe = searchTerm.replace(/[(),]/g, " ").trim();
      const { data, error } = await supabase
        .from("provider_tests")
        .select(
          "id, test_name, provider_id, category, canonical_category, description, biomarkers_list, biomarker_count, price, url, image_url, is_active, created_at, updated_at"
        )
        .eq("is_active", true)
        .or(
          [
            `test_name.ilike.%${safe}%`,
            `description.ilike.%${safe}%`,
            `category.ilike.%${safe}%`,
            `canonical_category.ilike.%${safe}%`,
            `biomarkers_list.ilike.%${safe}%`,
          ].join(",")
        )
        .order("price", { ascending: true })
        .limit(600);

      return { data: (data as unknown) as Test[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get provider tests for a specific test
   */
  async getProviderTests(testMasterId: string): Promise<ApiResponse<ProviderTest[]>> {
    try {
      const { data, error } = await supabase
        .from("provider_test_mapping")
        .select("*")
        .eq("test_master_id", testMasterId)
        .eq("availability_status", "available");

      return { data: data as ProviderTest[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all provider tests with filters
   */
  async getAllProviderTests(
    category?: string,
    providers?: string[]
  ): Promise<ApiResponse<ProviderTest[]>> {
    try {
      let query = supabase
        .from("provider_test_mapping")
        .select("*")
        .eq("availability_status", "available");

      if (providers && providers.length > 0 && !providers.includes("all")) {
        query = query.in("provider_id", providers);
      }

      const { data, error } = await query;

      return { data: data as ProviderTest[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get popular tests
   */
  async getPopularTests(limit: number = 10): Promise<ApiResponse<Test[]>> {
    try {
      const { data, error } = await supabase
        .from("tests_master")
        .select("*")
        .eq("is_active", true)
        .order("popularity_score", { ascending: false })
        .limit(limit);

      return { data: data as Test[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const testsApi = new TestsApi();
