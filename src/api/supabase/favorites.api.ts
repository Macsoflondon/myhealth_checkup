import { ApiResponse } from "./base";
import { supabase } from "@/integrations/supabase/client";

export interface Favorite {
  id: string;
  user_id: string;
  test_id: string;
  category: string;
  provider: string;
  name?: string;
  price?: number;
  created_at: string;
}

class FavoritesApi {

  /**
   * Get all favorites for a user
   */
  async getUserFavorites(userId: string): Promise<ApiResponse<Favorite[]>> {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId);

      return { data: data as Favorite[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get favorites by category
   */
  async getFavoritesByCategory(
    userId: string,
    category: string
  ): Promise<ApiResponse<Favorite[]>> {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .eq("category", category);

      return { data: data as Favorite[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get test IDs for favorites in a category
   */
  async getFavoriteTestIds(
    userId: string,
    category: string
  ): Promise<ApiResponse<string[]>> {
    const { data, error } = await this.getFavoritesByCategory(userId, category);
    
    if (error || !data) {
      return { data: null, error };
    }

    return { data: data.map((f) => f.test_id), error: null };
  }

  /**
   * Add a favorite
   */
  async addFavorite(favorite: Omit<Favorite, "id" | "created_at">): Promise<ApiResponse<Favorite>> {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .insert(favorite as any)
        .select()
        .single();

      return { data: data as Favorite, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Remove a favorite
   */
  async removeFavorite(
    userId: string,
    testId: string,
    category: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("test_id", testId)
        .eq("category", category);

      return { data: !error, error };
    } catch (error) {
      return { data: false, error: error as Error };
    }
  }

  /**
   * Check if a test is favorited
   */
  async isFavorited(
    userId: string,
    testId: string,
    category: string
  ): Promise<boolean> {
    const { data } = await this.getFavoritesByCategory(userId, category);
    return data?.some((f) => f.test_id === testId) ?? false;
  }
}

export const favoritesApi = new FavoritesApi();
