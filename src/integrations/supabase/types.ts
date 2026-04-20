export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          client_key: string
          created_at: string | null
          endpoint: string
          id: string
          request_count: number
          window_start: string
        }
        Insert: {
          client_key: string
          created_at?: string | null
          endpoint: string
          id?: string
          request_count?: number
          window_start: string
        }
        Update: {
          client_key?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      biomarker_readings: {
        Row: {
          appointment_id: string | null
          biomarker_name: string
          created_at: string | null
          id: string
          recorded_at: string
          reference_range_max: number | null
          reference_range_min: number | null
          status: string | null
          unit: string | null
          uploaded_test_result_id: string | null
          user_id: string
          value: number
        }
        Insert: {
          appointment_id?: string | null
          biomarker_name: string
          created_at?: string | null
          id?: string
          recorded_at: string
          reference_range_max?: number | null
          reference_range_min?: number | null
          status?: string | null
          unit?: string | null
          uploaded_test_result_id?: string | null
          user_id: string
          value: number
        }
        Update: {
          appointment_id?: string | null
          biomarker_name?: string
          created_at?: string | null
          id?: string
          recorded_at?: string
          reference_range_max?: number | null
          reference_range_min?: number | null
          status?: string | null
          unit?: string | null
          uploaded_test_result_id?: string | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "biomarker_readings_uploaded_test_result_id_fkey"
            columns: ["uploaded_test_result_id"]
            isOneToOne: false
            referencedRelation: "uploaded_test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      biomarkers_library: {
        Row: {
          biomarker_code: string
          biomarker_name: string
          category: string
          clinical_significance: string | null
          created_at: string
          description: string
          id: string
          interpretation_guide: Json | null
          lifestyle_factors: string[] | null
          normal_range_female: string | null
          normal_range_male: string | null
          related_conditions: string[] | null
          unit_of_measurement: string | null
          updated_at: string
        }
        Insert: {
          biomarker_code: string
          biomarker_name: string
          category: string
          clinical_significance?: string | null
          created_at?: string
          description: string
          id?: string
          interpretation_guide?: Json | null
          lifestyle_factors?: string[] | null
          normal_range_female?: string | null
          normal_range_male?: string | null
          related_conditions?: string[] | null
          unit_of_measurement?: string | null
          updated_at?: string
        }
        Update: {
          biomarker_code?: string
          biomarker_name?: string
          category?: string
          clinical_significance?: string | null
          created_at?: string
          description?: string
          id?: string
          interpretation_guide?: Json | null
          lifestyle_factors?: string[] | null
          normal_range_female?: string | null
          normal_range_male?: string | null
          related_conditions?: string[] | null
          unit_of_measurement?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clinics: {
        Row: {
          access_note: string | null
          created_at: string
          full_address: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          postal_code: string | null
          provider_id: string | null
        }
        Insert: {
          access_note?: string | null
          created_at?: string
          full_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_code?: string | null
          provider_id?: string | null
        }
        Update: {
          access_note?: string | null
          created_at?: string
          full_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_code?: string | null
          provider_id?: string | null
        }
        Relationships: []
      }
      data_access_requests: {
        Row: {
          completed_at: string | null
          data_package_url: string | null
          id: string
          notes: string | null
          request_type: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          data_package_url?: string | null
          id?: string
          notes?: string | null
          request_type: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          data_package_url?: string | null
          id?: string
          notes?: string | null
          request_type?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string | null
          price: number | null
          provider: string
          test_id: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name?: string | null
          price?: number | null
          provider: string
          test_id: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string | null
          price?: number | null
          provider?: string
          test_id?: string
          user_id?: string
        }
        Relationships: []
      }
      health_insights: {
        Row: {
          action_items: string[] | null
          created_at: string
          created_by: string | null
          description: string
          expires_at: string | null
          id: string
          insight_type: string
          is_read: boolean | null
          priority: string | null
          related_biomarkers: string[] | null
          related_test_results: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          action_items?: string[] | null
          created_at?: string
          created_by?: string | null
          description: string
          expires_at?: string | null
          id?: string
          insight_type: string
          is_read?: boolean | null
          priority?: string | null
          related_biomarkers?: string[] | null
          related_test_results?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          action_items?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_read?: boolean | null
          priority?: string | null
          related_biomarkers?: string[] | null
          related_test_results?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      health_queries: {
        Row: {
          age: number | null
          ai_response: Json | null
          created_at: string
          gender: string | null
          id: string
          query_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          ai_response?: Json | null
          created_at?: string
          gender?: string | null
          id?: string
          query_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          ai_response?: Json | null
          created_at?: string
          gender?: string | null
          id?: string
          query_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lola_health_products: {
        Row: {
          areas_covered: string[] | null
          created_at: string
          id: string
          price_gbp: number | null
          product_name: string
          product_url: string | null
          updated_at: string
        }
        Insert: {
          areas_covered?: string[] | null
          created_at?: string
          id?: string
          price_gbp?: number | null
          product_name: string
          product_url?: string | null
          updated_at?: string
        }
        Update: {
          areas_covered?: string[] | null
          created_at?: string
          id?: string
          price_gbp?: number | null
          product_name?: string
          product_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          consent_ip: unknown
          consent_user_agent: string | null
          created_at: string
          email: string
          id: string
          source: string | null
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          consent_ip?: unknown
          consent_user_agent?: string | null
          created_at?: string
          email: string
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          consent_ip?: unknown
          consent_user_agent?: string | null
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_history: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          notification_category: string
          notification_type: string
          recipient: string
          sent_at: string | null
          status: string
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          notification_category: string
          notification_type: string
          recipient: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          notification_category?: string
          notification_type?: string
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          name: string | null
          order_date: string
          price: number | null
          provider: string
          result_date: string | null
          result_url: string | null
          status: string
          test_id: string
          user_id: string
        }
        Insert: {
          id?: string
          name?: string | null
          order_date?: string
          price?: number | null
          provider: string
          result_date?: string | null
          result_url?: string | null
          status?: string
          test_id: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string | null
          order_date?: string
          price?: number | null
          provider?: string
          result_date?: string | null
          result_url?: string | null
          status?: string
          test_id?: string
          user_id?: string
        }
        Relationships: []
      }
      price_alert_preferences: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          last_alerted_at: string | null
          provider: string
          test_id: string
          threshold_percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_alerted_at?: string | null
          provider: string
          test_id: string
          threshold_percentage?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_alerted_at?: string | null
          provider?: string
          test_id?: string
          threshold_percentage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          availability_changed: boolean | null
          change_percentage: number | null
          changed_at: string | null
          id: string
          new_price: number
          old_price: number | null
          provider: string
          test_id: string
        }
        Insert: {
          availability_changed?: boolean | null
          change_percentage?: number | null
          changed_at?: string | null
          id?: string
          new_price: number
          old_price?: number | null
          provider: string
          test_id: string
        }
        Update: {
          availability_changed?: boolean | null
          change_percentage?: number | null
          changed_at?: string | null
          id?: string
          new_price?: number
          old_price?: number | null
          provider?: string
          test_id?: string
        }
        Relationships: []
      }
      price_updates: {
        Row: {
          available: boolean
          id: string
          price: number
          provider: string
          test_id: string
          updated_at: string
        }
        Insert: {
          available?: boolean
          id?: string
          price: number
          provider: string
          test_id: string
          updated_at?: string
        }
        Update: {
          available?: boolean
          id?: string
          price?: number
          provider?: string
          test_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      provider_test_mapping: {
        Row: {
          accreditations: string[] | null
          availability_status: string | null
          created_at: string
          current_price: number | null
          discount_percentage: number | null
          id: string
          last_scraped_at: string | null
          original_price: number | null
          provider_id: string
          provider_test_id: string
          provider_test_name: string
          provider_url: string | null
          sample_collection_method: string | null
          test_master_id: string
          turnaround_time_days: number | null
          updated_at: string
        }
        Insert: {
          accreditations?: string[] | null
          availability_status?: string | null
          created_at?: string
          current_price?: number | null
          discount_percentage?: number | null
          id?: string
          last_scraped_at?: string | null
          original_price?: number | null
          provider_id: string
          provider_test_id: string
          provider_test_name: string
          provider_url?: string | null
          sample_collection_method?: string | null
          test_master_id: string
          turnaround_time_days?: number | null
          updated_at?: string
        }
        Update: {
          accreditations?: string[] | null
          availability_status?: string | null
          created_at?: string
          current_price?: number | null
          discount_percentage?: number | null
          id?: string
          last_scraped_at?: string | null
          original_price?: number | null
          provider_id?: string
          provider_test_id?: string
          provider_test_name?: string
          provider_url?: string | null
          sample_collection_method?: string | null
          test_master_id?: string
          turnaround_time_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_test_mapping_test_master_id_fkey"
            columns: ["test_master_id"]
            isOneToOne: false
            referencedRelation: "tests_master"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_tests: {
        Row: {
          biomarker_count: number | null
          biomarkers_list: Json | null
          category: string | null
          clinic_visit_available: boolean | null
          conditions: Json | null
          created_at: string
          description: string | null
          discount_percentage: number | null
          gp_consultation_cost: number | null
          gp_consultation_included: boolean | null
          home_kit_available: boolean | null
          id: string
          image_url: string | null
          is_active: boolean
          is_addon: boolean | null
          is_popular: boolean | null
          original_price: number | null
          phlebotomy_cost: number | null
          phlebotomy_included: boolean | null
          popularity_rank: number | null
          price: number | null
          provider_id: string
          provider_test_id: string | null
          sample_type: string | null
          scraped_at: string
          symptoms: Json | null
          test_name: string
          updated_at: string
          url: string | null
          url_verified: boolean | null
          url_verified_at: string | null
          who_should_test: string | null
        }
        Insert: {
          biomarker_count?: number | null
          biomarkers_list?: Json | null
          category?: string | null
          clinic_visit_available?: boolean | null
          conditions?: Json | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          gp_consultation_cost?: number | null
          gp_consultation_included?: boolean | null
          home_kit_available?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_addon?: boolean | null
          is_popular?: boolean | null
          original_price?: number | null
          phlebotomy_cost?: number | null
          phlebotomy_included?: boolean | null
          popularity_rank?: number | null
          price?: number | null
          provider_id: string
          provider_test_id?: string | null
          sample_type?: string | null
          scraped_at?: string
          symptoms?: Json | null
          test_name: string
          updated_at?: string
          url?: string | null
          url_verified?: boolean | null
          url_verified_at?: string | null
          who_should_test?: string | null
        }
        Update: {
          biomarker_count?: number | null
          biomarkers_list?: Json | null
          category?: string | null
          clinic_visit_available?: boolean | null
          conditions?: Json | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          gp_consultation_cost?: number | null
          gp_consultation_included?: boolean | null
          home_kit_available?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_addon?: boolean | null
          is_popular?: boolean | null
          original_price?: number | null
          phlebotomy_cost?: number | null
          phlebotomy_included?: boolean | null
          popularity_rank?: number | null
          price?: number | null
          provider_id?: string
          provider_test_id?: string | null
          sample_type?: string | null
          scraped_at?: string
          symptoms?: Json | null
          test_name?: string
          updated_at?: string
          url?: string | null
          url_verified?: boolean | null
          url_verified_at?: string | null
          who_should_test?: string | null
        }
        Relationships: []
      }
      saved_comparisons: {
        Row: {
          category: string | null
          comparison_name: string
          created_at: string | null
          id: string
          notes: string | null
          test_ids: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          comparison_name: string
          created_at?: string | null
          id?: string
          notes?: string | null
          test_ids: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          comparison_name?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          test_ids?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_providers: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          provider_id: string
          provider_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          provider_id: string
          provider_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          provider_id?: string
          provider_name?: string
          user_id?: string
        }
        Relationships: []
      }
      scraping_jobs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          last_scraped: string | null
          next_scrape: string | null
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_scraped?: string | null
          next_scrape?: string | null
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_scraped?: string | null
          next_scrape?: string | null
          provider_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_categories: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          last_price_update: string | null
          name: string
          price_check_frequency_hours: number | null
          provider_id: string
          realtime_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          last_price_update?: string | null
          name: string
          price_check_frequency_hours?: number | null
          provider_id: string
          realtime_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          last_price_update?: string | null
          name?: string
          price_check_frequency_hours?: number | null
          provider_id?: string
          realtime_enabled?: boolean | null
        }
        Relationships: []
      }
      test_results: {
        Row: {
          appointment_id: string | null
          biomarker_results: Json
          created_at: string
          flagged_markers: string[] | null
          id: string
          interpretation: string | null
          pdf_url: string | null
          professional_notes: string | null
          provider_id: string | null
          result_date: string
          reviewed_by_professional: boolean | null
          test_master_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          biomarker_results: Json
          created_at?: string
          flagged_markers?: string[] | null
          id?: string
          interpretation?: string | null
          pdf_url?: string | null
          professional_notes?: string | null
          provider_id?: string | null
          result_date: string
          reviewed_by_professional?: boolean | null
          test_master_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          biomarker_results?: Json
          created_at?: string
          flagged_markers?: string[] | null
          id?: string
          interpretation?: string | null
          pdf_url?: string | null
          professional_notes?: string | null
          provider_id?: string | null
          result_date?: string
          reviewed_by_professional?: boolean | null
          test_master_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_test_master_id_fkey"
            columns: ["test_master_id"]
            isOneToOne: false
            referencedRelation: "tests_master"
            referencedColumns: ["id"]
          },
        ]
      }
      tests_master: {
        Row: {
          biomarkers: Json
          category: string
          clinical_significance: string | null
          created_at: string
          description: string
          detailed_description: string | null
          fasting_required: boolean | null
          id: string
          is_active: boolean | null
          popularity_score: number | null
          preparation_instructions: string | null
          sample_type: string | null
          subcategory: string | null
          test_code: string | null
          test_name: string
          typical_turnaround_days: number | null
          updated_at: string
          who_should_take: string | null
        }
        Insert: {
          biomarkers: Json
          category: string
          clinical_significance?: string | null
          created_at?: string
          description: string
          detailed_description?: string | null
          fasting_required?: boolean | null
          id?: string
          is_active?: boolean | null
          popularity_score?: number | null
          preparation_instructions?: string | null
          sample_type?: string | null
          subcategory?: string | null
          test_code?: string | null
          test_name: string
          typical_turnaround_days?: number | null
          updated_at?: string
          who_should_take?: string | null
        }
        Update: {
          biomarkers?: Json
          category?: string
          clinical_significance?: string | null
          created_at?: string
          description?: string
          detailed_description?: string | null
          fasting_required?: boolean | null
          id?: string
          is_active?: boolean | null
          popularity_score?: number | null
          preparation_instructions?: string | null
          sample_type?: string | null
          subcategory?: string | null
          test_code?: string | null
          test_name?: string
          typical_turnaround_days?: number | null
          updated_at?: string
          who_should_take?: string | null
        }
        Relationships: []
      }
      uploaded_test_results: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          notes: string | null
          parsed_data: Json | null
          provider_id: string | null
          test_date: string
          test_name: string
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          parsed_data?: Json | null
          provider_id?: string | null
          test_date: string
          test_name: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          parsed_data?: Json | null
          provider_id?: string | null
          test_date?: string
          test_name?: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_date: string
          consent_given: boolean
          consent_type: string
          consent_withdrawn_date: string | null
          created_at: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          consent_date?: string
          consent_given?: boolean
          consent_type: string
          consent_withdrawn_date?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id: string
          version: string
        }
        Update: {
          consent_date?: string
          consent_given?: boolean
          consent_type?: string
          consent_withdrawn_date?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      user_health_data: {
        Row: {
          created_at: string | null
          data_source: string
          id: string
          metric_type: string
          recorded_at: string
          synced_at: string | null
          unit: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          data_source: string
          id?: string
          metric_type: string
          recorded_at: string
          synced_at?: string | null
          unit?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          data_source?: string
          id?: string
          metric_type?: string
          recorded_at?: string
          synced_at?: string | null
          unit?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      user_health_scores: {
        Row: {
          calculated_at: string | null
          created_at: string | null
          heart_score: number | null
          hormonal_score: number | null
          id: string
          metabolic_score: number | null
          nutritional_score: number | null
          overall_score: number | null
          user_id: string
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string | null
          heart_score?: number | null
          hormonal_score?: number | null
          id?: string
          metabolic_score?: number | null
          nutritional_score?: number | null
          overall_score?: number | null
          user_id: string
        }
        Update: {
          calculated_at?: string | null
          created_at?: string | null
          heart_score?: number | null
          hormonal_score?: number | null
          id?: string
          metabolic_score?: number | null
          nutritional_score?: number | null
          overall_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          dashboard_layout: Json | null
          id: string
          notification_push: boolean | null
          preferred_language: string | null
          preferred_units: string | null
          recommendation_comprehensiveness_weight: number | null
          recommendation_price_weight: number | null
          recommendation_speed_weight: number | null
          saved_filters: Json | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          notification_push?: boolean | null
          preferred_language?: string | null
          preferred_units?: string | null
          recommendation_comprehensiveness_weight?: number | null
          recommendation_price_weight?: number | null
          recommendation_speed_weight?: number | null
          saved_filters?: Json | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          notification_push?: boolean | null
          preferred_language?: string | null
          preferred_units?: string | null
          recommendation_comprehensiveness_weight?: number | null
          recommendation_price_weight?: number | null
          recommendation_speed_weight?: number | null
          saved_filters?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          account_status: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_login: string | null
          last_name: string | null
          phone_number: string | null
          postal_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_health_queries: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_current_user_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
