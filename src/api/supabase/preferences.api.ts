import { supabase } from "@/integrations/supabase/client";

export interface RecommendationPreferences {
  price: number;
  speed: number;
  comprehensiveness: number;
}

export interface EmailNotificationPreferences {
  notification_email: boolean;
  notification_order_updates: boolean;
  notification_health_insights: boolean;
  notification_promotions: boolean;
  notification_test_reminders: boolean;
}

export interface SmsNotificationPreferences {
  notification_sms: boolean;
  notification_sms_results: boolean;
  notification_sms_appointments: boolean;
  notification_sms_urgent: boolean;
}

export const preferencesApi = {
  async getRecommendationPreferences(
    userId: string
  ): Promise<RecommendationPreferences | null> {
    const { data, error } = await supabase
      .from("user_preferences")
      .select(
        "recommendation_price_weight, recommendation_speed_weight, recommendation_comprehensiveness_weight"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching recommendation preferences:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      price: data.recommendation_price_weight ?? 3,
      speed: data.recommendation_speed_weight ?? 3,
      comprehensiveness: data.recommendation_comprehensiveness_weight ?? 3,
    };
  },

  async saveRecommendationPreferences(
    userId: string,
    preferences: RecommendationPreferences
  ): Promise<{ success: boolean; error?: string }> {
    // First, check if a preferences record exists
    const { data: existingPrefs } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingPrefs) {
      // Update existing record
      const { error } = await supabase
        .from("user_preferences")
        .update({
          recommendation_price_weight: preferences.price,
          recommendation_speed_weight: preferences.speed,
          recommendation_comprehensiveness_weight: preferences.comprehensiveness,
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating recommendation preferences:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new record
      const { error } = await supabase.from("user_preferences").insert({
        user_id: userId,
        recommendation_price_weight: preferences.price,
        recommendation_speed_weight: preferences.speed,
        recommendation_comprehensiveness_weight: preferences.comprehensiveness,
      });

      if (error) {
        console.error("Error inserting recommendation preferences:", error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  },

  async getEmailNotificationPreferences(
    userId: string
  ): Promise<EmailNotificationPreferences | null> {
    const { data, error } = await supabase
      .from("user_preferences")
      .select(
        "notification_email, notification_order_updates, notification_health_insights, notification_promotions, notification_test_reminders"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching email notification preferences:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      notification_email: data.notification_email ?? true,
      notification_order_updates: data.notification_order_updates ?? true,
      notification_health_insights: data.notification_health_insights ?? true,
      notification_promotions: data.notification_promotions ?? false,
      notification_test_reminders: data.notification_test_reminders ?? true,
    };
  },

  async saveEmailNotificationPreferences(
    userId: string,
    preferences: Partial<EmailNotificationPreferences>
  ): Promise<{ success: boolean; error?: string }> {
    // First, check if a preferences record exists
    const { data: existingPrefs } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingPrefs) {
      // Update existing record
      const { error } = await supabase
        .from("user_preferences")
        .update(preferences)
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating email notification preferences:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new record
      const { error } = await supabase.from("user_preferences").insert({
        user_id: userId,
        ...preferences,
      });

      if (error) {
        console.error("Error inserting email notification preferences:", error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  },

  async getSmsNotificationPreferences(
    userId: string
  ): Promise<SmsNotificationPreferences | null> {
    const { data, error } = await supabase
      .from("user_preferences")
      .select(
        "notification_sms, notification_sms_results, notification_sms_appointments, notification_sms_urgent"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching SMS notification preferences:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      notification_sms: data.notification_sms ?? false,
      notification_sms_results: data.notification_sms_results ?? true,
      notification_sms_appointments: data.notification_sms_appointments ?? true,
      notification_sms_urgent: data.notification_sms_urgent ?? true,
    };
  },

  async saveSmsNotificationPreferences(
    userId: string,
    preferences: Partial<SmsNotificationPreferences>
  ): Promise<{ success: boolean; error?: string }> {
    // First, check if a preferences record exists
    const { data: existingPrefs } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingPrefs) {
      // Update existing record
      const { error } = await supabase
        .from("user_preferences")
        .update(preferences)
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating SMS notification preferences:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new record
      const { error } = await supabase.from("user_preferences").insert({
        user_id: userId,
        ...preferences,
      });

      if (error) {
        console.error("Error inserting SMS notification preferences:", error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  },
};
