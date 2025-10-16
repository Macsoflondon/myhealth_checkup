import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "./base";

export interface ProviderTestData {
  id: string;
  provider_id: string;
  test_name: string;
  category?: string;
  description?: string;
  price?: number;
  url?: string;
  image_url?: string;
  provider_test_id?: string;
  is_active: boolean;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface PriceUpdate {
  id: string;
  test_id: string;
  provider: string;
  price: number;
  available: boolean;
  updated_at: string;
}

class ProvidersApi {
  /**
   * Get all provider tests
   */
  async getProviderTests(providerId?: string): Promise<ApiResponse<ProviderTestData[]>> {
    try {
      let query = supabase
        .from("provider_tests")
        .select("*")
        .eq("is_active", true);

      if (providerId) {
        query = query.eq("provider_id", providerId);
      }

      const { data, error } = await query;

      return { data: data as ProviderTestData[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get price updates for tests
   */
  async getPriceUpdates(
    testIds?: string[],
    provider?: string
  ): Promise<ApiResponse<PriceUpdate[]>> {
    try {
      let query = supabase.from("price_updates").select("*");

      if (testIds && testIds.length > 0) {
        query = query.in("test_id", testIds);
      }

      if (provider) {
        query = query.eq("provider", provider);
      }

      const { data, error } = await query;

      return { data: data as PriceUpdate[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get latest price for a specific test
   */
  async getLatestPrice(
    testId: string,
    provider: string
  ): Promise<ApiResponse<PriceUpdate>> {
    try {
      const { data, error } = await supabase
        .from("price_updates")
        .select("*")
        .eq("test_id", testId)
        .eq("provider", provider)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      return { data: data as PriceUpdate, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all active categories
   */
  async getCategories(): Promise<ApiResponse<Array<{ id: string; name: string; count: number }>>> {
    try {
      const { data, error } = await supabase
        .from("test_categories")
        .select("name, provider_id")
        .eq("realtime_enabled", true);

      if (error) throw error;

      // Group and count categories
      const categoryMap = new Map<string, number>();
      data?.forEach((cat) => {
        const count = categoryMap.get(cat.name) || 0;
        categoryMap.set(cat.name, count + 1);
      });

      const categories = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        count,
      }));

      return { data: categories, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Check if a category has real-time updates enabled
   */
  async isCategoryRealtimeEnabled(category: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("test_categories")
        .select("realtime_enabled")
        .eq("name", category)
        .single();

      return data?.realtime_enabled ?? false;
    } catch (error) {
      return false;
    }
  }
}

export const providersApi = new ProvidersApi();
