import { ApiResponse } from "./base";
import { supabase } from "@/integrations/supabase/client";
import { encryptSensitiveFields, decryptSensitiveFields, SENSITIVE_FIELDS } from "@/services/EncryptionService";
import type { Json } from "@/integrations/supabase/types";

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
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
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
  notification_push?: boolean;
  saved_filters?: Json;
  dashboard_layout?: Json;
  created_at: string;
  updated_at: string;
}

class UsersApi {
  /**
   * Get user profile with automatic decryption of sensitive fields
   */
  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        return { data: null, error };
      }

      // Decrypt sensitive fields before returning
      const decryptedData = await decryptSensitiveFields(data as Record<string, unknown>);
      return { data: decryptedData as unknown as UserProfile, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update user profile with automatic encryption of sensitive fields
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    try {
      // Encrypt sensitive fields before storing
      const encryptedUpdates = await encryptSensitiveFields(
        updates as Record<string, unknown>,
        SENSITIVE_FIELDS
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from("user_profiles")
        .update(encryptedUpdates as any)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      // Decrypt sensitive fields before returning
      const decryptedData = await decryptSensitiveFields(data as Record<string, unknown>);
      return { data: decryptedData as unknown as UserProfile, error: null };
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from("user_preferences")
        .update(updates as any)
        .eq("user_id", userId)
        .select()
        .single();

      return { data: data as UserPreferences, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create user profile with automatic encryption of sensitive fields
   */
  async createUserProfile(
    profile: Omit<UserProfile, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<UserProfile>> {
    try {
      // Encrypt sensitive fields before storing
      const encryptedProfile = await encryptSensitiveFields(
        profile as Record<string, unknown>,
        SENSITIVE_FIELDS
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from("user_profiles")
        .insert(encryptedProfile as any)
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      // Decrypt sensitive fields before returning
      const decryptedData = await decryptSensitiveFields(data as Record<string, unknown>);
      return { data: decryptedData as unknown as UserProfile, error: null };
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from("user_preferences")
        .insert(preferences as any)
        .select()
        .single();

      return { data: data as UserPreferences, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const usersApi = new UsersApi();
