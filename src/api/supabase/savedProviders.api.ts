import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "./base";

export interface SavedProvider {
  id: string;
  user_id: string;
  provider_id: string;
  provider_name: string;
  notes?: string | null;
  created_at: string;
}

class SavedProvidersApi {
  /**
   * Get all saved providers for a user
   */
  async getUserSavedProviders(userId: string): Promise<ApiResponse<SavedProvider[]>> {
    try {
      const { data, error } = await supabase
        .from("saved_providers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      return { data: data as SavedProvider[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Save a provider
   */
  async saveProvider(
    userId: string,
    providerId: string,
    providerName: string,
    notes?: string
  ): Promise<ApiResponse<SavedProvider>> {
    try {
      const { data, error } = await supabase
        .from("saved_providers")
        .insert({
          user_id: userId,
          provider_id: providerId,
          provider_name: providerName,
          notes
        } as any)
        .select()
        .single();

      return { data: data as SavedProvider, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Remove a saved provider
   */
  async removeSavedProvider(
    userId: string,
    providerId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from("saved_providers")
        .delete()
        .eq("user_id", userId)
        .eq("provider_id", providerId);

      return { data: !error, error };
    } catch (error) {
      return { data: false, error: error as Error };
    }
  }

  /**
   * Check if a provider is saved
   */
  async isProviderSaved(userId: string, providerId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from("saved_providers")
        .select("id")
        .eq("user_id", userId)
        .eq("provider_id", providerId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  }
}

export const savedProvidersApi = new SavedProvidersApi();
