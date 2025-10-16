import { ApiResponse } from "./base";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  phone_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  nhs_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  allergies?: string[];
  medications?: string[];
  health_conditions?: string[];
  lifestyle_factors?: any;
  account_status?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme?: string;
  preferred_language?: string;
  preferred_units?: string;
  notification_email?: boolean;
  notification_sms?: boolean;
  notification_push?: boolean;
  saved_filters?: any;
  dashboard_layout?: any;
  created_at: string;
  updated_at: string;
}

class UsersApi {
  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      return { data: data as UserProfile, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("user_id", userId)
        .select()
        .single();

      return { data: data as UserProfile, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<ApiResponse<UserPreferences>> {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      return { data: data as UserPreferences, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .update(updates)
        .eq("user_id", userId)
        .select()
        .single();

      return { data: data as UserPreferences, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create user profile
   */
  async createUserProfile(
    profile: Omit<UserProfile, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert(profile)
        .select()
        .single();

      return { data: data as UserProfile, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create user preferences
   */
  async createUserPreferences(
    preferences: Omit<UserPreferences, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<UserPreferences>> {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .insert(preferences)
        .select()
        .single();

      return { data: data as UserPreferences, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const usersApi = new UsersApi();
