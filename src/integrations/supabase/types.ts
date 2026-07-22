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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string
          error_message: string | null
          id: string
          ip_address: string | null
          new_value: Json | null
          old_value: Json | null
          resource_id: string | null
          resource_name: string | null
          resource_type: string
          session_id: string | null
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          resource_id?: string | null
          resource_name?: string | null
          resource_type: string
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          resource_id?: string | null
          resource_name?: string | null
          resource_type?: string
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      ai_operation_logs: {
        Row: {
          cache_hit: boolean | null
          cost_usd: number | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          error_type: string | null
          id: string
          input_tokens: number | null
          job_type: string
          latency_ms: number | null
          metadata: Json | null
          model: string | null
          output_tokens: number | null
          prompt_version: string | null
          session_id: string | null
          success: boolean | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_operation_logs_2025: {
        Row: {
          cache_hit: boolean | null
          cost_usd: number | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          error_type: string | null
          id: string
          input_tokens: number | null
          job_type: string
          latency_ms: number | null
          metadata: Json | null
          model: string | null
          output_tokens: number | null
          prompt_version: string | null
          session_id: string | null
          success: boolean | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_operation_logs_2026: {
        Row: {
          cache_hit: boolean | null
          cost_usd: number | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          error_type: string | null
          id: string
          input_tokens: number | null
          job_type: string
          latency_ms: number | null
          metadata: Json | null
          model: string | null
          output_tokens: number | null
          prompt_version: string | null
          session_id: string | null
          success: boolean | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_operation_logs_2027: {
        Row: {
          cache_hit: boolean | null
          cost_usd: number | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          error_type: string | null
          id: string
          input_tokens: number | null
          job_type: string
          latency_ms: number | null
          metadata: Json | null
          model: string | null
          output_tokens: number | null
          prompt_version: string | null
          session_id: string | null
          success: boolean | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_operation_logs_2028: {
        Row: {
          cache_hit: boolean | null
          cost_usd: number | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          error_type: string | null
          id: string
          input_tokens: number | null
          job_type: string
          latency_ms: number | null
          metadata: Json | null
          model: string | null
          output_tokens: number | null
          prompt_version: string | null
          session_id: string | null
          success: boolean | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          cache_hit?: boolean | null
          cost_usd?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          job_type?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          prompt_version?: string | null
          session_id?: string | null
          success?: boolean | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_prompt_versions: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          job_type: string
          notes: string | null
          prompt_key: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          job_type: string
          notes?: string | null
          prompt_key: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string
          notes?: string | null
          prompt_key?: string
          version?: string
        }
        Relationships: []
      }
      ai_vector_index_log: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          index_name: string
          operation: string
          records_affected: number | null
          success: boolean | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          index_name: string
          operation: string
          records_affected?: number | null
          success?: boolean | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          index_name?: string
          operation?: string
          records_affected?: number | null
          success?: boolean | null
        }
        Relationships: []
      }
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
          data_classification: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          purpose: string | null
          reason_code: string | null
          record_id: string | null
          siem_exported_at: string | null
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          data_classification?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          purpose?: string | null
          reason_code?: string | null
          record_id?: string | null
          siem_exported_at?: string | null
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          data_classification?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          purpose?: string | null
          reason_code?: string | null
          record_id?: string | null
          siem_exported_at?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_retention_policy: {
        Row: {
          notes: string | null
          retention_days: number
          source: string
          time_column: string
          updated_at: string
        }
        Insert: {
          notes?: string | null
          retention_days: number
          source: string
          time_column?: string
          updated_at?: string
        }
        Update: {
          notes?: string | null
          retention_days?: number
          source?: string
          time_column?: string
          updated_at?: string
        }
        Relationships: []
      }
      biomarker_audit_runs: {
        Row: {
          approved: boolean
          approved_at: string | null
          approved_by: string | null
          created_at: string
          delta: string
          id: string
          notes: string | null
          provider_id: string
          provider_test_id: string | null
          run_id: string
          scraped_biomarkers: Json | null
          scraped_count: number | null
          stored_count: number | null
          stored_list: Json | null
          test_name: string
          url: string | null
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          delta: string
          id?: string
          notes?: string | null
          provider_id: string
          provider_test_id?: string | null
          run_id: string
          scraped_biomarkers?: Json | null
          scraped_count?: number | null
          stored_count?: number | null
          stored_list?: Json | null
          test_name: string
          url?: string | null
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          delta?: string
          id?: string
          notes?: string | null
          provider_id?: string
          provider_test_id?: string | null
          run_id?: string
          scraped_biomarkers?: Json | null
          scraped_count?: number | null
          stored_count?: number | null
          stored_list?: Json | null
          test_name?: string
          url?: string | null
        }
        Relationships: []
      }
      biomarker_hub: {
        Row: {
          abbreviation: string | null
          category: string | null
          clinical_tips: string[] | null
          created_at: string | null
          description_what: string | null
          description_why: string | null
          embedding: string | null
          icon: string | null
          id: string
          legacy_description: string | null
          name: string
          reference_ranges: Json | null
          related_tests: string[] | null
          symptoms_linked: string[] | null
          unit: string | null
        }
        Insert: {
          abbreviation?: string | null
          category?: string | null
          clinical_tips?: string[] | null
          created_at?: string | null
          description_what?: string | null
          description_why?: string | null
          embedding?: string | null
          icon?: string | null
          id?: string
          legacy_description?: string | null
          name: string
          reference_ranges?: Json | null
          related_tests?: string[] | null
          symptoms_linked?: string[] | null
          unit?: string | null
        }
        Update: {
          abbreviation?: string | null
          category?: string | null
          clinical_tips?: string[] | null
          created_at?: string | null
          description_what?: string | null
          description_why?: string | null
          embedding?: string | null
          icon?: string | null
          id?: string
          legacy_description?: string | null
          name?: string
          reference_ranges?: Json | null
          related_tests?: string[] | null
          symptoms_linked?: string[] | null
          unit?: string | null
        }
        Relationships: []
      }
      biomarker_knowledge_hub: {
        Row: {
          category: string
          clinical_description: string
          created_at: string | null
          effective_date_time: string | null
          embedding: string | null
          id: string
          last_updated: string | null
          loinc_code: string | null
          name: string
          reference_range_json: Json | null
          related_symptoms: string[] | null
          snomed_code: string | null
          status: string
        }
        Insert: {
          category?: string
          clinical_description?: string
          created_at?: string | null
          effective_date_time?: string | null
          embedding?: string | null
          id?: string
          last_updated?: string | null
          loinc_code?: string | null
          name: string
          reference_range_json?: Json | null
          related_symptoms?: string[] | null
          snomed_code?: string | null
          status?: string
        }
        Update: {
          category?: string
          clinical_description?: string
          created_at?: string | null
          effective_date_time?: string | null
          embedding?: string | null
          id?: string
          last_updated?: string | null
          loinc_code?: string | null
          name?: string
          reference_range_json?: Json | null
          related_symptoms?: string[] | null
          snomed_code?: string | null
          status?: string
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
          alternate_units: Json | null
          biomarker_code: string
          biomarker_name: string
          biomaterial: string | null
          body_system: string | null
          category: string
          clinical_significance: string | null
          created_at: string
          description: string
          id: string
          interpretation_guide: Json | null
          last_reviewed_at: string | null
          lifestyle_factors: string[] | null
          normal_range_female: string | null
          normal_range_male: string | null
          reference_ranges: Json | null
          related_articles: Json | null
          related_conditions: string[] | null
          reviewed_by: string | null
          synonyms: string[] | null
          unit_of_measurement: string | null
          updated_at: string
          what_affects_it: string | null
          what_it_measures: string | null
          when_to_retest: string | null
          why_it_matters: string | null
        }
        Insert: {
          alternate_units?: Json | null
          biomarker_code: string
          biomarker_name: string
          biomaterial?: string | null
          body_system?: string | null
          category: string
          clinical_significance?: string | null
          created_at?: string
          description: string
          id?: string
          interpretation_guide?: Json | null
          last_reviewed_at?: string | null
          lifestyle_factors?: string[] | null
          normal_range_female?: string | null
          normal_range_male?: string | null
          reference_ranges?: Json | null
          related_articles?: Json | null
          related_conditions?: string[] | null
          reviewed_by?: string | null
          synonyms?: string[] | null
          unit_of_measurement?: string | null
          updated_at?: string
          what_affects_it?: string | null
          what_it_measures?: string | null
          when_to_retest?: string | null
          why_it_matters?: string | null
        }
        Update: {
          alternate_units?: Json | null
          biomarker_code?: string
          biomarker_name?: string
          biomaterial?: string | null
          body_system?: string | null
          category?: string
          clinical_significance?: string | null
          created_at?: string
          description?: string
          id?: string
          interpretation_guide?: Json | null
          last_reviewed_at?: string | null
          lifestyle_factors?: string[] | null
          normal_range_female?: string | null
          normal_range_male?: string | null
          reference_ranges?: Json | null
          related_articles?: Json | null
          related_conditions?: string[] | null
          reviewed_by?: string | null
          synonyms?: string[] | null
          unit_of_measurement?: string | null
          updated_at?: string
          what_affects_it?: string | null
          what_it_measures?: string | null
          when_to_retest?: string | null
          why_it_matters?: string | null
        }
        Relationships: []
      }
      blood_tests: {
        Row: {
          biomarker_count: number | null
          biomarkers_included: string[] | null
          categories: string[] | null
          collection_fee_amount: number | null
          collection_method: string | null
          created_at: string | null
          gender_specific: string | null
          goals: string[] | null
          id: string
          last_validated: string | null
          method: string | null
          name: string
          price: number | null
          provider: string
          sample_type: string | null
          sub_goals: string[] | null
          test_url: string | null
          total_expected_cost: number | null
          updated_at: string | null
        }
        Insert: {
          biomarker_count?: number | null
          biomarkers_included?: string[] | null
          categories?: string[] | null
          collection_fee_amount?: number | null
          collection_method?: string | null
          created_at?: string | null
          gender_specific?: string | null
          goals?: string[] | null
          id?: string
          last_validated?: string | null
          method?: string | null
          name: string
          price?: number | null
          provider: string
          sample_type?: string | null
          sub_goals?: string[] | null
          test_url?: string | null
          total_expected_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          biomarker_count?: number | null
          biomarkers_included?: string[] | null
          categories?: string[] | null
          collection_fee_amount?: number | null
          collection_method?: string | null
          created_at?: string | null
          gender_specific?: string | null
          goals?: string[] | null
          id?: string
          last_validated?: string | null
          method?: string | null
          name?: string
          price?: number | null
          provider?: string
          sample_type?: string | null
          sub_goals?: string[] | null
          test_url?: string | null
          total_expected_cost?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          level: number
          metadata: Json
          name: string
          parent_id: string | null
          path: unknown
          seo_description: string | null
          seo_title: string | null
          short_name: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          level?: number
          metadata?: Json
          name: string
          parent_id?: string | null
          path?: unknown
          seo_description?: string | null
          seo_title?: string | null
          short_name?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          level?: number
          metadata?: Json
          name?: string
          parent_id?: string | null
          path?: unknown
          seo_description?: string | null
          seo_title?: string | null
          short_name?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_aliases: {
        Row: {
          alias: string
          category_id: string
          created_at: string
          id: string
          match_type: string
          weight: number
        }
        Insert: {
          alias: string
          category_id: string
          created_at?: string
          id?: string
          match_type?: string
          weight?: number
        }
        Update: {
          alias?: string
          category_id?: string
          created_at?: string
          id?: string
          match_type?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_aliases_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_slug_redirects: {
        Row: {
          created_at: string
          from_slug: string
          id: string
          to_slug: string
        }
        Insert: {
          created_at?: string
          from_slug: string
          id?: string
          to_slug: string
        }
        Update: {
          created_at?: string
          from_slug?: string
          id?: string
          to_slug?: string
        }
        Relationships: []
      }
      category_test_mapping: {
        Row: {
          category_id: string
          confidence: number
          created_at: string
          provider_test_id: string
          source: string
        }
        Insert: {
          category_id: string
          confidence?: number
          created_at?: string
          provider_test_id: string
          source?: string
        }
        Update: {
          category_id?: string
          confidence?: number
          created_at?: string
          provider_test_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_test_mapping_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_test_mapping_provider_test_id_fkey"
            columns: ["provider_test_id"]
            isOneToOne: false
            referencedRelation: "provider_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_test_mapping_provider_test_id_fkey"
            columns: ["provider_test_id"]
            isOneToOne: false
            referencedRelation: "unified_provider_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_biomarker_history: {
        Row: {
          ai_interpretation: string | null
          biomarker_code: string
          biomarker_name: string | null
          created_at: string
          id: string
          lab_name: string | null
          loinc_code: string | null
          recorded_at: string
          reference_range_max: number | null
          reference_range_min: number | null
          snomed_code: string | null
          source_type: string | null
          source_upload_id: string | null
          status: string | null
          trend_direction: string | null
          unit: string | null
          user_id: string
          value: number | null
        }
        Insert: {
          ai_interpretation?: string | null
          biomarker_code: string
          biomarker_name?: string | null
          created_at?: string
          id?: string
          lab_name?: string | null
          loinc_code?: string | null
          recorded_at: string
          reference_range_max?: number | null
          reference_range_min?: number | null
          snomed_code?: string | null
          source_type?: string | null
          source_upload_id?: string | null
          status?: string | null
          trend_direction?: string | null
          unit?: string | null
          user_id: string
          value?: number | null
        }
        Update: {
          ai_interpretation?: string | null
          biomarker_code?: string
          biomarker_name?: string | null
          created_at?: string
          id?: string
          lab_name?: string | null
          loinc_code?: string | null
          recorded_at?: string
          reference_range_max?: number | null
          reference_range_min?: number | null
          snomed_code?: string | null
          source_type?: string | null
          source_upload_id?: string | null
          status?: string | null
          trend_direction?: string | null
          unit?: string | null
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_biomarker_history_source_upload_id_fkey"
            columns: ["source_upload_id"]
            isOneToOne: false
            referencedRelation: "clinical_patient_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_consent_records: {
        Row: {
          consent_type: string
          created_at: string
          expires_at: string | null
          granted: boolean
          granted_at: string | null
          id: string
          ip_hash: string | null
          metadata: Json | null
          revoked_at: string | null
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          consent_type: string
          created_at?: string
          expires_at?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          revoked_at?: string | null
          user_agent?: string | null
          user_id: string
          version?: string
        }
        Update: {
          consent_type?: string
          created_at?: string
          expires_at?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          revoked_at?: string | null
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      clinical_fhir_bundles: {
        Row: {
          bundle_json: Json
          bundle_type: string
          created_at: string
          fhir_version: string | null
          id: string
          source_upload_id: string | null
          user_id: string
          validated: boolean | null
          validation_errors: Json | null
        }
        Insert: {
          bundle_json: Json
          bundle_type: string
          created_at?: string
          fhir_version?: string | null
          id?: string
          source_upload_id?: string | null
          user_id: string
          validated?: boolean | null
          validation_errors?: Json | null
        }
        Update: {
          bundle_json?: Json
          bundle_type?: string
          created_at?: string
          fhir_version?: string | null
          id?: string
          source_upload_id?: string | null
          user_id?: string
          validated?: boolean | null
          validation_errors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_fhir_bundles_source_upload_id_fkey"
            columns: ["source_upload_id"]
            isOneToOne: false
            referencedRelation: "clinical_patient_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_gp_notifications: {
        Row: {
          content_summary: string | null
          created_at: string
          error_message: string | null
          fhir_bundle_id: string | null
          gp_name: string | null
          gp_practice_ods_code: string | null
          id: string
          notification_type: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          content_summary?: string | null
          created_at?: string
          error_message?: string | null
          fhir_bundle_id?: string | null
          gp_name?: string | null
          gp_practice_ods_code?: string | null
          id?: string
          notification_type: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          content_summary?: string | null
          created_at?: string
          error_message?: string | null
          fhir_bundle_id?: string | null
          gp_name?: string | null
          gp_practice_ods_code?: string | null
          id?: string
          notification_type?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_gp_notifications_fhir_bundle_id_fkey"
            columns: ["fhir_bundle_id"]
            isOneToOne: false
            referencedRelation: "clinical_fhir_bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_loinc_mappings: {
        Row: {
          biomarker_code: string | null
          common_units: string[] | null
          component: string | null
          created_at: string
          id: string
          is_active: boolean | null
          loinc_code: string
          long_name: string
          method_type: string | null
          property: string | null
          scale_type: string | null
          short_name: string | null
          system: string | null
          time_aspect: string | null
        }
        Insert: {
          biomarker_code?: string | null
          common_units?: string[] | null
          component?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          loinc_code: string
          long_name: string
          method_type?: string | null
          property?: string | null
          scale_type?: string | null
          short_name?: string | null
          system?: string | null
          time_aspect?: string | null
        }
        Update: {
          biomarker_code?: string | null
          common_units?: string[] | null
          component?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          loinc_code?: string
          long_name?: string
          method_type?: string | null
          property?: string | null
          scale_type?: string | null
          short_name?: string | null
          system?: string | null
          time_aspect?: string | null
        }
        Relationships: []
      }
      clinical_patient_uploads: {
        Row: {
          consent_record_id: string | null
          created_at: string
          error_message: string | null
          file_ref: string | null
          file_size_bytes: number | null
          id: string
          mime_type: string | null
          original_filename: string | null
          processed_at: string | null
          source: string | null
          status: string
          upload_type: string
          user_id: string
        }
        Insert: {
          consent_record_id?: string | null
          created_at?: string
          error_message?: string | null
          file_ref?: string | null
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          processed_at?: string | null
          source?: string | null
          status?: string
          upload_type?: string
          user_id: string
        }
        Update: {
          consent_record_id?: string | null
          created_at?: string
          error_message?: string | null
          file_ref?: string | null
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          processed_at?: string | null
          source?: string | null
          status?: string
          upload_type?: string
          user_id?: string
        }
        Relationships: []
      }
      clinical_reference_ranges: {
        Row: {
          age_max_years: number | null
          age_min_years: number | null
          biomarker_code: string
          created_at: string
          id: string
          is_active: boolean | null
          loinc_code: string | null
          max_value: number | null
          min_value: number | null
          population: string | null
          sex: string | null
          source: string | null
          unit: string
        }
        Insert: {
          age_max_years?: number | null
          age_min_years?: number | null
          biomarker_code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          loinc_code?: string | null
          max_value?: number | null
          min_value?: number | null
          population?: string | null
          sex?: string | null
          source?: string | null
          unit: string
        }
        Update: {
          age_max_years?: number | null
          age_min_years?: number | null
          biomarker_code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          loinc_code?: string | null
          max_value?: number | null
          min_value?: number | null
          population?: string | null
          sex?: string | null
          source?: string | null
          unit?: string
        }
        Relationships: []
      }
      clinical_snomed_mappings: {
        Row: {
          biomarker_code: string | null
          biomarker_name: string | null
          category: string | null
          created_at: string
          id: string
          is_active: boolean | null
          preferred_term: string
          snomed_concept_id: string
        }
        Insert: {
          biomarker_code?: string | null
          biomarker_name?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          preferred_term: string
          snomed_concept_id: string
        }
        Update: {
          biomarker_code?: string | null
          biomarker_name?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          preferred_term?: string
          snomed_concept_id?: string
        }
        Relationships: []
      }
      cron_run_log: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          finished_at: string | null
          id: string
          job_name: string
          rows_affected: number | null
          started_at: string
          status: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          job_name: string
          rows_affected?: number | null
          started_at?: string
          status: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          job_name?: string
          rows_affected?: number | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      csp_reports: {
        Row: {
          blocked_uri: string | null
          document_uri: string | null
          id: string
          ip_address: string | null
          received_at: string
          report: Json
          user_agent: string | null
          violated_directive: string | null
        }
        Insert: {
          blocked_uri?: string | null
          document_uri?: string | null
          id?: string
          ip_address?: string | null
          received_at?: string
          report: Json
          user_agent?: string | null
          violated_directive?: string | null
        }
        Update: {
          blocked_uri?: string | null
          document_uri?: string | null
          id?: string
          ip_address?: string | null
          received_at?: string
          report?: Json
          user_agent?: string | null
          violated_directive?: string | null
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
      data_sharing_grants: {
        Row: {
          access_count: number
          access_token_hash: string
          created_at: string
          expires_at: string
          granted_at: string
          id: string
          last_accessed_at: string | null
          purpose: string
          recipient_email: string
          recipient_org: string | null
          revoked_at: string | null
          revoked_reason: string | null
          scope: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_count?: number
          access_token_hash: string
          created_at?: string
          expires_at?: string
          granted_at?: string
          id?: string
          last_accessed_at?: string | null
          purpose: string
          recipient_email: string
          recipient_org?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          scope?: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_count?: number
          access_token_hash?: string
          created_at?: string
          expires_at?: string
          granted_at?: string
          id?: string
          last_accessed_at?: string | null
          purpose?: string
          recipient_email?: string
          recipient_org?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          scope?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      edge_function_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          error_stack: string | null
          function_name: string
          http_status: number | null
          id: string
          invocation_id: string | null
          memory_mb: number | null
          request_size_bytes: number | null
          response_size_bytes: number | null
          status: string
          triggered_by: string | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          error_stack?: string | null
          function_name: string
          http_status?: number | null
          id?: string
          invocation_id?: string | null
          memory_mb?: number | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          status: string
          triggered_by?: string | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          error_stack?: string | null
          function_name?: string
          http_status?: number | null
          id?: string
          invocation_id?: string | null
          memory_mb?: number | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          status?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      encryption_keys: {
        Row: {
          activated_at: string | null
          alg: string
          created_at: string
          kid: string
          notes: string | null
          purpose: string
          retired_at: string | null
          rotated_from: string | null
          status: string
        }
        Insert: {
          activated_at?: string | null
          alg?: string
          created_at?: string
          kid: string
          notes?: string | null
          purpose: string
          retired_at?: string | null
          rotated_from?: string | null
          status?: string
        }
        Update: {
          activated_at?: string | null
          alg?: string
          created_at?: string
          kid?: string
          notes?: string | null
          purpose?: string
          retired_at?: string | null
          rotated_from?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "encryption_keys_rotated_from_fkey"
            columns: ["rotated_from"]
            isOneToOne: false
            referencedRelation: "encryption_keys"
            referencedColumns: ["kid"]
          },
        ]
      }
      engine_audit_log: {
        Row: {
          actor: string | null
          created_at: string
          id: string
          message: string | null
          metadata: Json | null
          run_id: string | null
          scope: string | null
          skill: string
          stage: string
          status: string
        }
        Insert: {
          actor?: string | null
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          run_id?: string | null
          scope?: string | null
          skill: string
          stage: string
          status: string
        }
        Update: {
          actor?: string | null
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          run_id?: string | null
          scope?: string | null
          skill?: string
          stage?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "engine_audit_log_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      engine_checkpoints: {
        Row: {
          created_at: string
          created_by: string | null
          files: Json
          id: string
          note: string
          snapshot: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          files?: Json
          id: string
          note: string
          snapshot?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          files?: Json
          id?: string
          note?: string
          snapshot?: Json | null
        }
        Relationships: []
      }
      engine_freezes: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          id: string
          path: string
          reason: string
          unfreeze_reason: string | null
          unfrozen_at: string | null
          unfrozen_by: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          path: string
          reason: string
          unfreeze_reason?: string | null
          unfrozen_at?: string | null
          unfrozen_by?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          path?: string
          reason?: string
          unfreeze_reason?: string | null
          unfrozen_at?: string | null
          unfrozen_by?: string | null
        }
        Relationships: []
      }
      engine_runs: {
        Row: {
          command: string
          completed_at: string | null
          created_by: string | null
          current_stage: string
          id: string
          notes: string | null
          parser: string
          result: Json | null
          scope: string | null
          skill: string
          stages: Json
          started_at: string
          status: string
        }
        Insert: {
          command: string
          completed_at?: string | null
          created_by?: string | null
          current_stage?: string
          id?: string
          notes?: string | null
          parser?: string
          result?: Json | null
          scope?: string | null
          skill: string
          stages?: Json
          started_at?: string
          status?: string
        }
        Update: {
          command?: string
          completed_at?: string | null
          created_by?: string | null
          current_stage?: string
          id?: string
          notes?: string | null
          parser?: string
          result?: Json | null
          scope?: string | null
          skill?: string
          stages?: Json
          started_at?: string
          status?: string
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
      fhir_export_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          expires_at: string
          id: string
          output: Json | null
          request_params: Json
          requested_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          expires_at?: string
          id?: string
          output?: Json | null
          request_params?: Json
          requested_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          expires_at?: string
          id?: string
          output?: Json | null
          request_params?: Json
          requested_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      funnel_events: {
        Row: {
          anonymous_id: string | null
          created_at: string
          currency: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          funnel_stage: string
          id: string
          provider_id: string | null
          revenue_amount: number | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage?: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      funnel_events_2025: {
        Row: {
          anonymous_id: string | null
          created_at: string
          currency: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          funnel_stage: string
          id: string
          provider_id: string | null
          revenue_amount: number | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage?: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      funnel_events_2026: {
        Row: {
          anonymous_id: string | null
          created_at: string
          currency: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          funnel_stage: string
          id: string
          provider_id: string | null
          revenue_amount: number | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage?: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      funnel_events_2027: {
        Row: {
          anonymous_id: string | null
          created_at: string
          currency: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          funnel_stage: string
          id: string
          provider_id: string | null
          revenue_amount: number | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage?: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      funnel_events_2028: {
        Row: {
          anonymous_id: string | null
          created_at: string
          currency: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          funnel_stage: string
          id: string
          provider_id: string | null
          revenue_amount: number | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          funnel_stage?: string
          id?: string
          provider_id?: string | null
          revenue_amount?: number | null
          session_id?: string
          user_id?: string | null
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
      live_comparison_panels: {
        Row: {
          created_at: string
          display_order: number
          id: string
          last_scraped_at: string | null
          panel_name: string
          rows: Json
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          last_scraped_at?: string | null
          panel_name: string
          rows?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          last_scraped_at?: string | null
          panel_name?: string
          rows?: Json
          slug?: string
          updated_at?: string
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
      operational_alerts: {
        Row: {
          alert_key: string | null
          alert_type: string
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          first_seen_at: string
          id: string
          is_resolved: boolean | null
          last_seen_at: string
          message: string
          metadata: Json | null
          occurrence_count: number | null
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          source: string
          title: string
        }
        Insert: {
          alert_key?: string | null
          alert_type: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          first_seen_at?: string
          id?: string
          is_resolved?: boolean | null
          last_seen_at?: string
          message: string
          metadata?: Json | null
          occurrence_count?: number | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source: string
          title: string
        }
        Update: {
          alert_key?: string | null
          alert_type?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          first_seen_at?: string
          id?: string
          is_resolved?: boolean | null
          last_seen_at?: string
          message?: string
          metadata?: Json | null
          occurrence_count?: number | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source?: string
          title?: string
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
      platform_metrics: {
        Row: {
          component: string
          environment: string | null
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          tags: Json | null
        }
        Insert: {
          component: string
          environment?: string | null
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
          tags?: Json | null
        }
        Update: {
          component?: string
          environment?: string | null
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          tags?: Json | null
        }
        Relationships: []
      }
      platform_metrics_2025: {
        Row: {
          component: string
          environment: string | null
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          tags: Json | null
        }
        Insert: {
          component: string
          environment?: string | null
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
          tags?: Json | null
        }
        Update: {
          component?: string
          environment?: string | null
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          tags?: Json | null
        }
        Relationships: []
      }
      platform_metrics_2026: {
        Row: {
          component: string
          environment: string | null
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          tags: Json | null
        }
        Insert: {
          component: string
          environment?: string | null
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
          tags?: Json | null
        }
        Update: {
          component?: string
          environment?: string | null
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          tags?: Json | null
        }
        Relationships: []
      }
      platform_metrics_2027: {
        Row: {
          component: string
          environment: string | null
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          tags: Json | null
        }
        Insert: {
          component: string
          environment?: string | null
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
          tags?: Json | null
        }
        Update: {
          component?: string
          environment?: string | null
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          tags?: Json | null
        }
        Relationships: []
      }
      platform_metrics_2028: {
        Row: {
          component: string
          environment: string | null
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          tags: Json | null
        }
        Insert: {
          component: string
          environment?: string | null
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
          tags?: Json | null
        }
        Update: {
          component?: string
          environment?: string | null
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          tags?: Json | null
        }
        Relationships: []
      }
      popular_test_enrichment_cache: {
        Row: {
          created_at: string
          description: string | null
          fetched_at: string
          image_url: string | null
          price: number | null
          provider_id: string
          test_id: string
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fetched_at?: string
          image_url?: string | null
          price?: number | null
          provider_id: string
          test_id: string
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fetched_at?: string
          image_url?: string | null
          price?: number | null
          provider_id?: string
          test_id?: string
          title?: string | null
          updated_at?: string
          url?: string
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
      product_change_log: {
        Row: {
          change_type: string
          changed_by: string | null
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          provider_id: string
          provider_test_id: string
          scrape_run_id: string | null
        }
        Insert: {
          change_type: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          provider_id: string
          provider_test_id: string
          scrape_run_id?: string | null
        }
        Update: {
          change_type?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          provider_id?: string
          provider_test_id?: string
          scrape_run_id?: string | null
        }
        Relationships: []
      }
      product_popularity: {
        Row: {
          affiliate_click_count: number | null
          comparison_count: number | null
          computed_at: string
          conversion_rate: number | null
          id: string
          master_test_id: string | null
          period_start: string
          period_type: string
          provider_id: string
          provider_test_id: string
          purchase_count: number | null
          revenue_total: number | null
          save_count: number | null
          view_count: number | null
        }
        Insert: {
          affiliate_click_count?: number | null
          comparison_count?: number | null
          computed_at?: string
          conversion_rate?: number | null
          id?: string
          master_test_id?: string | null
          period_start: string
          period_type?: string
          provider_id: string
          provider_test_id: string
          purchase_count?: number | null
          revenue_total?: number | null
          save_count?: number | null
          view_count?: number | null
        }
        Update: {
          affiliate_click_count?: number | null
          comparison_count?: number | null
          computed_at?: string
          conversion_rate?: number | null
          id?: string
          master_test_id?: string | null
          period_start?: string
          period_type?: string
          provider_id?: string
          provider_test_id?: string
          purchase_count?: number | null
          revenue_total?: number | null
          save_count?: number | null
          view_count?: number | null
        }
        Relationships: []
      }
      product_scores: {
        Row: {
          ai_confidence_score: number | null
          biomarker_count: number | null
          completeness_score: number | null
          computed_at: string
          has_affiliate_link: boolean | null
          has_biomarkers: boolean | null
          has_description: boolean | null
          has_image: boolean | null
          has_price: boolean | null
          has_sample_type: boolean | null
          id: string
          last_scraped_at: string | null
          last_updated_at: string | null
          last_verified_at: string | null
          overall_score: number | null
          provider_id: string
          provider_test_id: string
          quality_score: number | null
          seo_score: number | null
        }
        Insert: {
          ai_confidence_score?: number | null
          biomarker_count?: number | null
          completeness_score?: number | null
          computed_at?: string
          has_affiliate_link?: boolean | null
          has_biomarkers?: boolean | null
          has_description?: boolean | null
          has_image?: boolean | null
          has_price?: boolean | null
          has_sample_type?: boolean | null
          id?: string
          last_scraped_at?: string | null
          last_updated_at?: string | null
          last_verified_at?: string | null
          overall_score?: number | null
          provider_id: string
          provider_test_id: string
          quality_score?: number | null
          seo_score?: number | null
        }
        Update: {
          ai_confidence_score?: number | null
          biomarker_count?: number | null
          completeness_score?: number | null
          computed_at?: string
          has_affiliate_link?: boolean | null
          has_biomarkers?: boolean | null
          has_description?: boolean | null
          has_image?: boolean | null
          has_price?: boolean | null
          has_sample_type?: boolean | null
          id?: string
          last_scraped_at?: string | null
          last_updated_at?: string | null
          last_verified_at?: string | null
          overall_score?: number | null
          provider_id?: string
          provider_test_id?: string
          quality_score?: number | null
          seo_score?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      protected_call_log: {
        Row: {
          caller_id: string | null
          created_at: string
          details: Json | null
          function_name: string
          id: string
          ip_address: string | null
          status: string
          user_agent: string | null
        }
        Insert: {
          caller_id?: string | null
          created_at?: string
          details?: Json | null
          function_name: string
          id?: string
          ip_address?: string | null
          status: string
          user_agent?: string | null
        }
        Update: {
          caller_id?: string | null
          created_at?: string
          details?: Json | null
          function_name?: string
          id?: string
          ip_address?: string | null
          status?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      provider_biomarker_products: {
        Row: {
          biomarker_name: string
          biomarker_slug: string
          category_ids: string[]
          created_at: string
          currency: string
          description: string | null
          display_name: string | null
          id: string
          image_url: string | null
          is_active: boolean
          metadata: Json
          price: number | null
          provider_id: string
          provider_product_id: string | null
          sample_type: string | null
          scraped_at: string | null
          seo_description: string | null
          seo_title: string | null
          turnaround_days: number | null
          updated_at: string
          url: string | null
        }
        Insert: {
          biomarker_name: string
          biomarker_slug: string
          category_ids?: string[]
          created_at?: string
          currency?: string
          description?: string | null
          display_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          metadata?: Json
          price?: number | null
          provider_id: string
          provider_product_id?: string | null
          sample_type?: string | null
          scraped_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          turnaround_days?: number | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          biomarker_name?: string
          biomarker_slug?: string
          category_ids?: string[]
          created_at?: string
          currency?: string
          description?: string | null
          display_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          metadata?: Json
          price?: number | null
          provider_id?: string
          provider_product_id?: string | null
          sample_type?: string | null
          scraped_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          turnaround_days?: number | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      provider_catalogue_snapshots: {
        Row: {
          created_at: string
          id: string
          product_count: number | null
          products_added: Json | null
          products_removed: Json | null
          provider_id: string
          snapshot_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_count?: number | null
          products_added?: Json | null
          products_removed?: Json | null
          provider_id: string
          snapshot_date: string
        }
        Update: {
          created_at?: string
          id?: string
          product_count?: number | null
          products_added?: Json | null
          products_removed?: Json | null
          provider_id?: string
          snapshot_date?: string
        }
        Relationships: []
      }
      provider_image_audit: {
        Row: {
          category: string | null
          checked_at: string
          content_type: string | null
          http_status: number | null
          id: string
          image_url: string | null
          issue: string | null
          provider_id: string
          provider_test_id: string | null
          run_id: string
          status: string
          test_name: string | null
        }
        Insert: {
          category?: string | null
          checked_at?: string
          content_type?: string | null
          http_status?: number | null
          id?: string
          image_url?: string | null
          issue?: string | null
          provider_id: string
          provider_test_id?: string | null
          run_id: string
          status: string
          test_name?: string | null
        }
        Update: {
          category?: string | null
          checked_at?: string
          content_type?: string | null
          http_status?: number | null
          id?: string
          image_url?: string | null
          issue?: string | null
          provider_id?: string
          provider_test_id?: string | null
          run_id?: string
          status?: string
          test_name?: string | null
        }
        Relationships: []
      }
      provider_metadata: {
        Row: {
          accreditations: string[] | null
          api_endpoint: string | null
          coverage_areas: string[] | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_scraped_at: string | null
          metadata: Json | null
          provider_name: string
          supported_methods: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          accreditations?: string[] | null
          api_endpoint?: string | null
          coverage_areas?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_scraped_at?: string | null
          metadata?: Json | null
          provider_name: string
          supported_methods?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          accreditations?: string[] | null
          api_endpoint?: string | null
          coverage_areas?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_scraped_at?: string | null
          metadata?: Json | null
          provider_name?: string
          supported_methods?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      provider_metrics: {
        Row: {
          active_products: number | null
          affiliate_health: number | null
          avg_product_score: number | null
          broken_affiliate_links: number | null
          catalogue_completeness: number | null
          compliance_status: string | null
          computed_at: string
          consecutive_failures: number | null
          conversion_rate: number | null
          health_score: number | null
          id: string
          last_scrape_at: string | null
          last_scrape_success: boolean | null
          products_with_biomarkers: number | null
          products_with_image: number | null
          products_with_price: number | null
          provider_id: string
          scrape_reliability: number | null
          total_affiliate_clicks: number | null
          total_page_views: number | null
          total_products: number | null
          total_revenue: number | null
          trust_score: number | null
        }
        Insert: {
          active_products?: number | null
          affiliate_health?: number | null
          avg_product_score?: number | null
          broken_affiliate_links?: number | null
          catalogue_completeness?: number | null
          compliance_status?: string | null
          computed_at?: string
          consecutive_failures?: number | null
          conversion_rate?: number | null
          health_score?: number | null
          id?: string
          last_scrape_at?: string | null
          last_scrape_success?: boolean | null
          products_with_biomarkers?: number | null
          products_with_image?: number | null
          products_with_price?: number | null
          provider_id: string
          scrape_reliability?: number | null
          total_affiliate_clicks?: number | null
          total_page_views?: number | null
          total_products?: number | null
          total_revenue?: number | null
          trust_score?: number | null
        }
        Update: {
          active_products?: number | null
          affiliate_health?: number | null
          avg_product_score?: number | null
          broken_affiliate_links?: number | null
          catalogue_completeness?: number | null
          compliance_status?: string | null
          computed_at?: string
          consecutive_failures?: number | null
          conversion_rate?: number | null
          health_score?: number | null
          id?: string
          last_scrape_at?: string | null
          last_scrape_success?: boolean | null
          products_with_biomarkers?: number | null
          products_with_image?: number | null
          products_with_price?: number | null
          provider_id?: string
          scrape_reliability?: number | null
          total_affiliate_clicks?: number | null
          total_page_views?: number | null
          total_products?: number | null
          total_revenue?: number | null
          trust_score?: number | null
        }
        Relationships: []
      }
      provider_section_category_map: {
        Row: {
          canonical_category: string
          created_at: string
          id: string
          needs_review: boolean
          provider_id: string
          source_section: string
          updated_at: string
        }
        Insert: {
          canonical_category: string
          created_at?: string
          id?: string
          needs_review?: boolean
          provider_id: string
          source_section: string
          updated_at?: string
        }
        Update: {
          canonical_category?: string
          created_at?: string
          id?: string
          needs_review?: boolean
          provider_id?: string
          source_section?: string
          updated_at?: string
        }
        Relationships: []
      }
      provider_test_history: {
        Row: {
          biomarker_count: number | null
          biomarkers_list: Json | null
          collection_fee: number | null
          collection_method: string | null
          created_at: string
          gp_review_fee: number | null
          home_visit_fee: number | null
          id: string
          in_stock: boolean | null
          price: number | null
          provider_id: string
          provider_test_id: string | null
          raw_payload: Json | null
          sample_type: string | null
          scrape_run_id: string | null
          scrape_source_url: string | null
          snapshot_at: string
          test_name: string
          total_expected_cost: number | null
          trustpilot_rating: number | null
          trustpilot_review_count: number | null
          turnaround_days: number | null
          turnaround_hours: number | null
          turnaround_raw: string | null
          turnaround_unit: string | null
          was_price: number | null
        }
        Insert: {
          biomarker_count?: number | null
          biomarkers_list?: Json | null
          collection_fee?: number | null
          collection_method?: string | null
          created_at?: string
          gp_review_fee?: number | null
          home_visit_fee?: number | null
          id?: string
          in_stock?: boolean | null
          price?: number | null
          provider_id: string
          provider_test_id?: string | null
          raw_payload?: Json | null
          sample_type?: string | null
          scrape_run_id?: string | null
          scrape_source_url?: string | null
          snapshot_at?: string
          test_name: string
          total_expected_cost?: number | null
          trustpilot_rating?: number | null
          trustpilot_review_count?: number | null
          turnaround_days?: number | null
          turnaround_hours?: number | null
          turnaround_raw?: string | null
          turnaround_unit?: string | null
          was_price?: number | null
        }
        Update: {
          biomarker_count?: number | null
          biomarkers_list?: Json | null
          collection_fee?: number | null
          collection_method?: string | null
          created_at?: string
          gp_review_fee?: number | null
          home_visit_fee?: number | null
          id?: string
          in_stock?: boolean | null
          price?: number | null
          provider_id?: string
          provider_test_id?: string | null
          raw_payload?: Json | null
          sample_type?: string | null
          scrape_run_id?: string | null
          scrape_source_url?: string | null
          snapshot_at?: string
          test_name?: string
          total_expected_cost?: number | null
          trustpilot_rating?: number | null
          trustpilot_review_count?: number | null
          turnaround_days?: number | null
          turnaround_hours?: number | null
          turnaround_raw?: string | null
          turnaround_unit?: string | null
          was_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_test_history_provider_test_id_fkey"
            columns: ["provider_test_id"]
            isOneToOne: false
            referencedRelation: "provider_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_test_history_provider_test_id_fkey"
            columns: ["provider_test_id"]
            isOneToOne: false
            referencedRelation: "unified_provider_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_test_history_scrape_run_id_fkey"
            columns: ["scrape_run_id"]
            isOneToOne: false
            referencedRelation: "scrape_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_test_mapping: {
        Row: {
          accreditations: string[] | null
          availability_status: string | null
          clinical_review_fee: number | null
          clinical_review_professional: string | null
          clinical_review_type: string | null
          clinical_review_verification: string | null
          collection_fee_amount: number | null
          collection_fee_type: string | null
          collection_fee_verification: string | null
          collection_method: string | null
          created_at: string
          current_price: number | null
          discount_percentage: number | null
          id: string
          last_scraped_at: string | null
          original_price: number | null
          policy_source_url: string | null
          provider_id: string
          provider_test_id: string
          provider_test_name: string
          provider_url: string | null
          sample_collection_method: string | null
          sample_type: string | null
          test_master_id: string
          turnaround_time_days: number | null
          updated_at: string
        }
        Insert: {
          accreditations?: string[] | null
          availability_status?: string | null
          clinical_review_fee?: number | null
          clinical_review_professional?: string | null
          clinical_review_type?: string | null
          clinical_review_verification?: string | null
          collection_fee_amount?: number | null
          collection_fee_type?: string | null
          collection_fee_verification?: string | null
          collection_method?: string | null
          created_at?: string
          current_price?: number | null
          discount_percentage?: number | null
          id?: string
          last_scraped_at?: string | null
          original_price?: number | null
          policy_source_url?: string | null
          provider_id: string
          provider_test_id: string
          provider_test_name: string
          provider_url?: string | null
          sample_collection_method?: string | null
          sample_type?: string | null
          test_master_id: string
          turnaround_time_days?: number | null
          updated_at?: string
        }
        Update: {
          accreditations?: string[] | null
          availability_status?: string | null
          clinical_review_fee?: number | null
          clinical_review_professional?: string | null
          clinical_review_type?: string | null
          clinical_review_verification?: string | null
          collection_fee_amount?: number | null
          collection_fee_type?: string | null
          collection_fee_verification?: string | null
          collection_method?: string | null
          created_at?: string
          current_price?: number | null
          discount_percentage?: number | null
          id?: string
          last_scraped_at?: string | null
          original_price?: number | null
          policy_source_url?: string | null
          provider_id?: string
          provider_test_id?: string
          provider_test_name?: string
          provider_url?: string | null
          sample_collection_method?: string | null
          sample_type?: string | null
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
          base_price: number | null
          biomarker_count: number | null
          biomarkers_list: Json | null
          biomarkers_not_stated: boolean | null
          canonical_category: string | null
          category: string | null
          category_ids: string[]
          clinic_phlebotomy_cost: number | null
          clinic_visit_available: boolean | null
          clinical_review_fee: number | null
          clinical_review_professional: string | null
          clinical_review_type: string | null
          clinical_review_verification: string | null
          collection_fee: number | null
          collection_fee_amount: number | null
          collection_fee_type: string | null
          collection_fee_verification: string | null
          collection_method: string | null
          collection_options: Json | null
          conditions: Json | null
          created_at: string
          data_status: string | null
          description: string | null
          description_scraped: string | null
          discount_percentage: number | null
          field_completeness_score: number | null
          gender_specific: string | null
          goals: string[] | null
          gp_consultation_cost: number | null
          gp_consultation_included: boolean | null
          gp_review_fee: number | null
          gp_review_included: boolean | null
          handle: string | null
          home_kit_available: boolean | null
          home_phlebotomy_cost: number | null
          home_phlebotomy_option: boolean | null
          home_visit_fee: number | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          is_active: boolean
          is_addon: boolean | null
          is_popular: boolean | null
          lab_cqc_regulated: boolean | null
          lab_iso15189: boolean | null
          lab_ukas_accredited: boolean | null
          last_validated_at: string | null
          location_options: Json | null
          original_price: number | null
          phlebotomy_cost: number | null
          phlebotomy_included: boolean | null
          policy_source_url: string | null
          popularity_rank: number | null
          price: number | null
          price_not_stated: boolean | null
          provider_id: string
          provider_test_id: string | null
          sample_type: string | null
          scrape_source_url: string | null
          scraped_at: string
          sku: string | null
          source_section: string | null
          source_section_label: string | null
          sub_goals: string[] | null
          symptoms: Json | null
          test_name: string
          test_type: string | null
          total_expected_cost: number | null
          trustpilot_last_checked: string | null
          trustpilot_rating: number | null
          trustpilot_review_count: number | null
          turnaround_days: number | null
          turnaround_days_text: string | null
          turnaround_hours: number | null
          turnaround_not_stated: boolean | null
          turnaround_raw: string | null
          turnaround_unit: string | null
          updated_at: string
          url: string | null
          url_verified: boolean | null
          url_verified_at: string | null
          was_price: number | null
          who_should_test: string | null
        }
        Insert: {
          base_price?: number | null
          biomarker_count?: number | null
          biomarkers_list?: Json | null
          biomarkers_not_stated?: boolean | null
          canonical_category?: string | null
          category?: string | null
          category_ids?: string[]
          clinic_phlebotomy_cost?: number | null
          clinic_visit_available?: boolean | null
          clinical_review_fee?: number | null
          clinical_review_professional?: string | null
          clinical_review_type?: string | null
          clinical_review_verification?: string | null
          collection_fee?: number | null
          collection_fee_amount?: number | null
          collection_fee_type?: string | null
          collection_fee_verification?: string | null
          collection_method?: string | null
          collection_options?: Json | null
          conditions?: Json | null
          created_at?: string
          data_status?: string | null
          description?: string | null
          description_scraped?: string | null
          discount_percentage?: number | null
          field_completeness_score?: number | null
          gender_specific?: string | null
          goals?: string[] | null
          gp_consultation_cost?: number | null
          gp_consultation_included?: boolean | null
          gp_review_fee?: number | null
          gp_review_included?: boolean | null
          handle?: string | null
          home_kit_available?: boolean | null
          home_phlebotomy_cost?: number | null
          home_phlebotomy_option?: boolean | null
          home_visit_fee?: number | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_active?: boolean
          is_addon?: boolean | null
          is_popular?: boolean | null
          lab_cqc_regulated?: boolean | null
          lab_iso15189?: boolean | null
          lab_ukas_accredited?: boolean | null
          last_validated_at?: string | null
          location_options?: Json | null
          original_price?: number | null
          phlebotomy_cost?: number | null
          phlebotomy_included?: boolean | null
          policy_source_url?: string | null
          popularity_rank?: number | null
          price?: number | null
          price_not_stated?: boolean | null
          provider_id: string
          provider_test_id?: string | null
          sample_type?: string | null
          scrape_source_url?: string | null
          scraped_at?: string
          sku?: string | null
          source_section?: string | null
          source_section_label?: string | null
          sub_goals?: string[] | null
          symptoms?: Json | null
          test_name: string
          test_type?: string | null
          total_expected_cost?: number | null
          trustpilot_last_checked?: string | null
          trustpilot_rating?: number | null
          trustpilot_review_count?: number | null
          turnaround_days?: number | null
          turnaround_days_text?: string | null
          turnaround_hours?: number | null
          turnaround_not_stated?: boolean | null
          turnaround_raw?: string | null
          turnaround_unit?: string | null
          updated_at?: string
          url?: string | null
          url_verified?: boolean | null
          url_verified_at?: string | null
          was_price?: number | null
          who_should_test?: string | null
        }
        Update: {
          base_price?: number | null
          biomarker_count?: number | null
          biomarkers_list?: Json | null
          biomarkers_not_stated?: boolean | null
          canonical_category?: string | null
          category?: string | null
          category_ids?: string[]
          clinic_phlebotomy_cost?: number | null
          clinic_visit_available?: boolean | null
          clinical_review_fee?: number | null
          clinical_review_professional?: string | null
          clinical_review_type?: string | null
          clinical_review_verification?: string | null
          collection_fee?: number | null
          collection_fee_amount?: number | null
          collection_fee_type?: string | null
          collection_fee_verification?: string | null
          collection_method?: string | null
          collection_options?: Json | null
          conditions?: Json | null
          created_at?: string
          data_status?: string | null
          description?: string | null
          description_scraped?: string | null
          discount_percentage?: number | null
          field_completeness_score?: number | null
          gender_specific?: string | null
          goals?: string[] | null
          gp_consultation_cost?: number | null
          gp_consultation_included?: boolean | null
          gp_review_fee?: number | null
          gp_review_included?: boolean | null
          handle?: string | null
          home_kit_available?: boolean | null
          home_phlebotomy_cost?: number | null
          home_phlebotomy_option?: boolean | null
          home_visit_fee?: number | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_active?: boolean
          is_addon?: boolean | null
          is_popular?: boolean | null
          lab_cqc_regulated?: boolean | null
          lab_iso15189?: boolean | null
          lab_ukas_accredited?: boolean | null
          last_validated_at?: string | null
          location_options?: Json | null
          original_price?: number | null
          phlebotomy_cost?: number | null
          phlebotomy_included?: boolean | null
          policy_source_url?: string | null
          popularity_rank?: number | null
          price?: number | null
          price_not_stated?: boolean | null
          provider_id?: string
          provider_test_id?: string | null
          sample_type?: string | null
          scrape_source_url?: string | null
          scraped_at?: string
          sku?: string | null
          source_section?: string | null
          source_section_label?: string | null
          sub_goals?: string[] | null
          symptoms?: Json | null
          test_name?: string
          test_type?: string | null
          total_expected_cost?: number | null
          trustpilot_last_checked?: string | null
          trustpilot_rating?: number | null
          trustpilot_review_count?: number | null
          turnaround_days?: number | null
          turnaround_days_text?: string | null
          turnaround_hours?: number | null
          turnaround_not_stated?: boolean | null
          turnaround_raw?: string | null
          turnaround_unit?: string | null
          updated_at?: string
          url?: string | null
          url_verified?: boolean | null
          url_verified_at?: string | null
          was_price?: number | null
          who_should_test?: string | null
        }
        Relationships: []
      }
      recommendation_history: {
        Row: {
          completed_at: string | null
          consent_given: boolean
          created_at: string | null
          data_retention_expiry: string | null
          final_recommendations: Json
          id: string
          input_summary: string
          matched_biomarker_names: string[] | null
          matched_biomarkers: string[] | null
          processing_time_ms: number | null
          request_method: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          consent_given?: boolean
          created_at?: string | null
          data_retention_expiry?: string | null
          final_recommendations?: Json
          id?: string
          input_summary: string
          matched_biomarker_names?: string[] | null
          matched_biomarkers?: string[] | null
          processing_time_ms?: number | null
          request_method?: string | null
          status?: string
          user_id?: string
        }
        Update: {
          completed_at?: string | null
          consent_given?: boolean
          created_at?: string | null
          data_retention_expiry?: string | null
          final_recommendations?: Json
          id?: string
          input_summary?: string
          matched_biomarker_names?: string[] | null
          matched_biomarkers?: string[] | null
          processing_time_ms?: number | null
          request_method?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      revenue_events: {
        Row: {
          affiliate_network: string | null
          amount: number
          anonymous_id: string | null
          attribution_window_days: number | null
          click_id: string | null
          commission_amount: number | null
          commission_rate: number | null
          confirmed: boolean | null
          confirmed_at: string | null
          created_at: string
          currency: string | null
          id: string
          order_reference: string | null
          provider_id: string
          provider_test_id: string | null
          session_id: string | null
          source: string
          test_name: string | null
          user_id: string | null
        }
        Insert: {
          affiliate_network?: string | null
          amount: number
          anonymous_id?: string | null
          attribution_window_days?: number | null
          click_id?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          confirmed?: boolean | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          order_reference?: string | null
          provider_id: string
          provider_test_id?: string | null
          session_id?: string | null
          source?: string
          test_name?: string | null
          user_id?: string | null
        }
        Update: {
          affiliate_network?: string | null
          amount?: number
          anonymous_id?: string | null
          attribution_window_days?: number | null
          click_id?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          confirmed?: boolean | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          order_reference?: string | null
          provider_id?: string
          provider_test_id?: string | null
          session_id?: string | null
          source?: string
          test_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          target_user_id?: string
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
          id: string
          notes: string | null
          provider_id: string
          provider_name: string
          provider_website: string | null
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          provider_id: string
          provider_name: string
          provider_website?: string | null
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          provider_id?: string
          provider_name?: string
          provider_website?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scrape_change_events: {
        Row: {
          change_type: string
          created_at: string
          field_name: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          provider_id: string
          provider_test_id: string | null
          scrape_operation_id: string | null
          scrape_run_id: string | null
          severity: string | null
          test_name: string | null
        }
        Insert: {
          change_type: string
          created_at?: string
          field_name?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          provider_id: string
          provider_test_id?: string | null
          scrape_operation_id?: string | null
          scrape_run_id?: string | null
          severity?: string | null
          test_name?: string | null
        }
        Update: {
          change_type?: string
          created_at?: string
          field_name?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          provider_id?: string
          provider_test_id?: string | null
          scrape_operation_id?: string | null
          scrape_run_id?: string | null
          severity?: string | null
          test_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scrape_change_events_run_fk"
            columns: ["scrape_run_id"]
            isOneToOne: false
            referencedRelation: "scrape_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_change_events_scrape_operation_id_fkey"
            columns: ["scrape_operation_id"]
            isOneToOne: false
            referencedRelation: "scrape_operations"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_operations: {
        Row: {
          affiliate_failures: number | null
          api_failures: number | null
          biomarker_changes: number | null
          bytes_transferred: number | null
          completed_at: string | null
          created_at: string
          description_changes: number | null
          duration_ms: number | null
          error_details: Json | null
          error_message: string | null
          function_name: string
          id: string
          image_changes: number | null
          metadata: Json | null
          price_changes: number | null
          products_added: number | null
          products_found: number | null
          products_removed: number | null
          products_unchanged: number | null
          products_updated: number | null
          provider_id: string
          queued_at: string | null
          request_count: number | null
          retry_count: number | null
          run_id: string
          started_at: string | null
          status: string
          triggered_by: string | null
          triggered_by_user_id: string | null
          warning_count: number | null
        }
        Insert: {
          affiliate_failures?: number | null
          api_failures?: number | null
          biomarker_changes?: number | null
          bytes_transferred?: number | null
          completed_at?: string | null
          created_at?: string
          description_changes?: number | null
          duration_ms?: number | null
          error_details?: Json | null
          error_message?: string | null
          function_name: string
          id?: string
          image_changes?: number | null
          metadata?: Json | null
          price_changes?: number | null
          products_added?: number | null
          products_found?: number | null
          products_removed?: number | null
          products_unchanged?: number | null
          products_updated?: number | null
          provider_id: string
          queued_at?: string | null
          request_count?: number | null
          retry_count?: number | null
          run_id?: string
          started_at?: string | null
          status?: string
          triggered_by?: string | null
          triggered_by_user_id?: string | null
          warning_count?: number | null
        }
        Update: {
          affiliate_failures?: number | null
          api_failures?: number | null
          biomarker_changes?: number | null
          bytes_transferred?: number | null
          completed_at?: string | null
          created_at?: string
          description_changes?: number | null
          duration_ms?: number | null
          error_details?: Json | null
          error_message?: string | null
          function_name?: string
          id?: string
          image_changes?: number | null
          metadata?: Json | null
          price_changes?: number | null
          products_added?: number | null
          products_found?: number | null
          products_removed?: number | null
          products_unchanged?: number | null
          products_updated?: number | null
          provider_id?: string
          queued_at?: string | null
          request_count?: number | null
          retry_count?: number | null
          run_id?: string
          started_at?: string | null
          status?: string
          triggered_by?: string | null
          triggered_by_user_id?: string | null
          warning_count?: number | null
        }
        Relationships: []
      }
      scrape_run_log: {
        Row: {
          completed_at: string | null
          details: Json | null
          id: string
          mappings_upserted: number | null
          providers_run: number | null
          started_at: string
          status: string
          tests_promoted: number | null
          tests_scraped: number | null
          trigger_source: string | null
          verification_failures: number | null
        }
        Insert: {
          completed_at?: string | null
          details?: Json | null
          id?: string
          mappings_upserted?: number | null
          providers_run?: number | null
          started_at?: string
          status?: string
          tests_promoted?: number | null
          tests_scraped?: number | null
          trigger_source?: string | null
          verification_failures?: number | null
        }
        Update: {
          completed_at?: string | null
          details?: Json | null
          id?: string
          mappings_upserted?: number | null
          providers_run?: number | null
          started_at?: string
          status?: string
          tests_promoted?: number | null
          tests_scraped?: number | null
          trigger_source?: string | null
          verification_failures?: number | null
        }
        Relationships: []
      }
      scrape_runs: {
        Row: {
          created_at: string
          errors: Json
          fields_not_stated: number
          fields_populated: number
          finished_at: string | null
          id: string
          metadata: Json
          provider_id: string
          scraper_function: string | null
          started_at: string
          status: string
          tests_deactivated: number
          tests_new: number
          tests_seen: number
          tests_unchanged: number
          tests_updated: number
        }
        Insert: {
          created_at?: string
          errors?: Json
          fields_not_stated?: number
          fields_populated?: number
          finished_at?: string | null
          id?: string
          metadata?: Json
          provider_id: string
          scraper_function?: string | null
          started_at?: string
          status?: string
          tests_deactivated?: number
          tests_new?: number
          tests_seen?: number
          tests_unchanged?: number
          tests_updated?: number
        }
        Update: {
          created_at?: string
          errors?: Json
          fields_not_stated?: number
          fields_populated?: number
          finished_at?: string | null
          id?: string
          metadata?: Json
          provider_id?: string
          scraper_function?: string | null
          started_at?: string
          status?: string
          tests_deactivated?: number
          tests_new?: number
          tests_seen?: number
          tests_unchanged?: number
          tests_updated?: number
        }
        Relationships: []
      }
      scraper_alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          current_count: number | null
          expected_min: number | null
          id: string
          message: string
          previous_count: number | null
          provider_id: string
          severity: string
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          current_count?: number | null
          expected_min?: number | null
          id?: string
          message: string
          previous_count?: number | null
          provider_id: string
          severity?: string
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          current_count?: number | null
          expected_min?: number | null
          id?: string
          message?: string
          previous_count?: number | null
          provider_id?: string
          severity?: string
        }
        Relationships: []
      }
      scraping_jobs: {
        Row: {
          created_at: string
          error_message: string | null
          expected_min_tests: number | null
          id: string
          last_scraped: string | null
          last_test_count: number | null
          next_scrape: string | null
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          expected_min_tests?: number | null
          id?: string
          last_scraped?: string | null
          last_test_count?: number | null
          next_scrape?: string | null
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          expected_min_tests?: number | null
          id?: string
          last_scraped?: string | null
          last_test_count?: number | null
          next_scrape?: string | null
          provider_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_alert_recipients: {
        Row: {
          alert_types: string[]
          created_at: string
          email: string
          enabled: boolean
          id: string
          label: string | null
          updated_at: string
        }
        Insert: {
          alert_types?: string[]
          created_at?: string
          email: string
          enabled?: boolean
          id?: string
          label?: string | null
          updated_at?: string
        }
        Update: {
          alert_types?: string[]
          created_at?: string
          email?: string
          enabled?: boolean
          id?: string
          label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      security_scan_snapshots: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          added_findings: Json
          created_at: string
          error_count: number
          findings: Json
          has_diff: boolean
          id: string
          modified_findings: Json
          removed_findings: Json
          scanned_at: string
          total_findings: number
          warn_count: number
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          added_findings?: Json
          created_at?: string
          error_count?: number
          findings?: Json
          has_diff?: boolean
          id?: string
          modified_findings?: Json
          removed_findings?: Json
          scanned_at?: string
          total_findings?: number
          warn_count?: number
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          added_findings?: Json
          created_at?: string
          error_count?: number
          findings?: Json
          has_diff?: boolean
          id?: string
          modified_findings?: Json
          removed_findings?: Json
          scanned_at?: string
          total_findings?: number
          warn_count?: number
        }
        Relationships: []
      }
      seo_crawl_issues: {
        Row: {
          description: string | null
          first_seen_at: string
          id: string
          is_resolved: boolean | null
          issue_type: string
          last_seen_at: string
          page_url: string
          related_url: string | null
          resolved_at: string | null
          severity: string | null
        }
        Insert: {
          description?: string | null
          first_seen_at?: string
          id?: string
          is_resolved?: boolean | null
          issue_type: string
          last_seen_at?: string
          page_url: string
          related_url?: string | null
          resolved_at?: string | null
          severity?: string | null
        }
        Update: {
          description?: string | null
          first_seen_at?: string
          id?: string
          is_resolved?: boolean | null
          issue_type?: string
          last_seen_at?: string
          page_url?: string
          related_url?: string | null
          resolved_at?: string | null
          severity?: string | null
        }
        Relationships: []
      }
      seo_keyword_rankings: {
        Row: {
          clicks: number | null
          ctr: number | null
          id: string
          impressions: number | null
          keyword: string
          measured_at: string
          page_url: string
          position: number | null
          search_volume: number | null
          source: string | null
        }
        Insert: {
          clicks?: number | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          keyword: string
          measured_at?: string
          page_url: string
          position?: number | null
          search_volume?: number | null
          source?: string | null
        }
        Update: {
          clicks?: number | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          keyword?: string
          measured_at?: string
          page_url?: string
          position?: number | null
          search_volume?: number | null
          source?: string | null
        }
        Relationships: []
      }
      seo_page_metrics: {
        Row: {
          broken_link_count: number | null
          canonical_url: string | null
          cls_score: number | null
          crawled_at: string
          external_link_count: number | null
          fcp_ms: number | null
          fid_ms: number | null
          h1: string | null
          has_og_tags: boolean | null
          has_twitter_card: boolean | null
          http_status: number | null
          id: string
          image_count: number | null
          images_missing_alt: number | null
          internal_link_count: number | null
          is_canonical: boolean | null
          is_indexed: boolean | null
          lcp_ms: number | null
          meta_description: string | null
          page_path: string
          page_type: string | null
          page_url: string
          performance_score: number | null
          schema_types: string[] | null
          schema_valid: boolean | null
          seo_score: number | null
          title: string | null
          ttfb_ms: number | null
          word_count: number | null
        }
        Insert: {
          broken_link_count?: number | null
          canonical_url?: string | null
          cls_score?: number | null
          crawled_at?: string
          external_link_count?: number | null
          fcp_ms?: number | null
          fid_ms?: number | null
          h1?: string | null
          has_og_tags?: boolean | null
          has_twitter_card?: boolean | null
          http_status?: number | null
          id?: string
          image_count?: number | null
          images_missing_alt?: number | null
          internal_link_count?: number | null
          is_canonical?: boolean | null
          is_indexed?: boolean | null
          lcp_ms?: number | null
          meta_description?: string | null
          page_path: string
          page_type?: string | null
          page_url: string
          performance_score?: number | null
          schema_types?: string[] | null
          schema_valid?: boolean | null
          seo_score?: number | null
          title?: string | null
          ttfb_ms?: number | null
          word_count?: number | null
        }
        Update: {
          broken_link_count?: number | null
          canonical_url?: string | null
          cls_score?: number | null
          crawled_at?: string
          external_link_count?: number | null
          fcp_ms?: number | null
          fid_ms?: number | null
          h1?: string | null
          has_og_tags?: boolean | null
          has_twitter_card?: boolean | null
          http_status?: number | null
          id?: string
          image_count?: number | null
          images_missing_alt?: number | null
          internal_link_count?: number | null
          is_canonical?: boolean | null
          is_indexed?: boolean | null
          lcp_ms?: number | null
          meta_description?: string | null
          page_path?: string
          page_type?: string | null
          page_url?: string
          performance_score?: number | null
          schema_types?: string[] | null
          schema_valid?: boolean | null
          seo_score?: number | null
          title?: string | null
          ttfb_ms?: number | null
          word_count?: number | null
        }
        Relationships: []
      }
      siem_export_cursor: {
        Row: {
          last_batch_size: number | null
          last_error: string | null
          last_exported_at: string
          last_exported_id: string | null
          last_run_at: string | null
          source: string
        }
        Insert: {
          last_batch_size?: number | null
          last_error?: string | null
          last_exported_at?: string
          last_exported_id?: string | null
          last_run_at?: string | null
          source: string
        }
        Update: {
          last_batch_size?: number | null
          last_error?: string | null
          last_exported_at?: string
          last_exported_id?: string | null
          last_run_at?: string | null
          source?: string
        }
        Relationships: []
      }
      soc_incident_events: {
        Row: {
          actor_id: string | null
          created_at: string
          detail: Json
          event_type: string
          id: string
          incident_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          detail?: Json
          event_type: string
          id?: string
          incident_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          detail?: Json
          event_type?: string
          id?: string
          incident_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "soc_incident_events_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "soc_incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      soc_incidents: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          assignee_id: string | null
          cluster_key: string
          created_at: string
          entity: string | null
          first_seen_at: string
          id: string
          last_seen_at: string
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          sample_signal_ids: string[]
          severity: string
          signal_count: number
          source: string
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          assignee_id?: string | null
          cluster_key: string
          created_at?: string
          entity?: string | null
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          sample_signal_ids?: string[]
          severity?: string
          signal_count?: number
          source: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          assignee_id?: string | null
          cluster_key?: string
          created_at?: string
          entity?: string | null
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          sample_signal_ids?: string[]
          severity?: string
          signal_count?: number
          source?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_heartbeat: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          last_sync_at: string | null
          metadata: Json | null
          records_processed: number | null
          service_name: string
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          metadata?: Json | null
          records_processed?: number | null
          service_name: string
          status?: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          metadata?: Json | null
          records_processed?: number | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      test_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          last_price_update: string | null
          name: string
          parent_id: string | null
          price_check_frequency_hours: number | null
          provider_id: string
          realtime_enabled: boolean | null
          slug: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          last_price_update?: string | null
          name: string
          parent_id?: string | null
          price_check_frequency_hours?: number | null
          provider_id: string
          realtime_enabled?: boolean | null
          slug?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          last_price_update?: string | null
          name?: string
          parent_id?: string | null
          price_check_frequency_hours?: number | null
          provider_id?: string
          realtime_enabled?: boolean | null
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "test_categories"
            referencedColumns: ["id"]
          },
        ]
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
      translations_cache: {
        Row: {
          created_at: string
          id: string
          language: string
          namespace: string | null
          source_hash: string
          source_text: string
          translated_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          language: string
          namespace?: string | null
          source_hash: string
          source_text: string
          translated_text: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          namespace?: string | null
          source_hash?: string
          source_text?: string
          translated_text?: string
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
      user_events: {
        Row: {
          anonymous_id: string | null
          created_at: string
          duration_ms: number | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          event_name: string
          event_type: string
          id: string
          page_title: string | null
          page_url: string | null
          properties: Json | null
          referrer_url: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name: string
          event_type: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name?: string
          event_type?: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_events_2025: {
        Row: {
          anonymous_id: string | null
          created_at: string
          duration_ms: number | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          event_name: string
          event_type: string
          id: string
          page_title: string | null
          page_url: string | null
          properties: Json | null
          referrer_url: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name: string
          event_type: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name?: string
          event_type?: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_events_2026: {
        Row: {
          anonymous_id: string | null
          created_at: string
          duration_ms: number | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          event_name: string
          event_type: string
          id: string
          page_title: string | null
          page_url: string | null
          properties: Json | null
          referrer_url: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name: string
          event_type: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name?: string
          event_type?: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_events_2027: {
        Row: {
          anonymous_id: string | null
          created_at: string
          duration_ms: number | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          event_name: string
          event_type: string
          id: string
          page_title: string | null
          page_url: string | null
          properties: Json | null
          referrer_url: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name: string
          event_type: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name?: string
          event_type?: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_events_2028: {
        Row: {
          anonymous_id: string | null
          created_at: string
          duration_ms: number | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          event_name: string
          event_type: string
          id: string
          page_title: string | null
          page_url: string | null
          properties: Json | null
          referrer_url: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name: string
          event_type: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          event_name?: string
          event_type?: string
          id?: string
          page_title?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id?: string
          user_id?: string | null
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
      user_sessions: {
        Row: {
          anonymous_id: string | null
          browser: string | null
          browser_version: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          duration_seconds: number | null
          ended_at: string | null
          entry_page: string | null
          event_count: number | null
          exit_page: string | null
          id: string
          ip_hash: string | null
          is_bot: boolean | null
          is_returning: boolean | null
          last_seen_at: string | null
          os: string | null
          os_version: string | null
          page_count: number | null
          referrer: string | null
          region: string | null
          screen_height: number | null
          screen_width: number | null
          session_id: string
          started_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          anonymous_id?: string | null
          browser?: string | null
          browser_version?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          entry_page?: string | null
          event_count?: number | null
          exit_page?: string | null
          id?: string
          ip_hash?: string | null
          is_bot?: boolean | null
          is_returning?: boolean | null
          last_seen_at?: string | null
          os?: string | null
          os_version?: string | null
          page_count?: number | null
          referrer?: string | null
          region?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_id: string
          started_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          anonymous_id?: string | null
          browser?: string | null
          browser_version?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          entry_page?: string | null
          event_count?: number | null
          exit_page?: string | null
          id?: string
          ip_hash?: string | null
          is_bot?: boolean | null
          is_returning?: boolean | null
          last_seen_at?: string | null
          os?: string | null
          os_version?: string | null
          page_count?: number | null
          referrer?: string | null
          region?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_id?: string
          started_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      web_vitals: {
        Row: {
          connection_type: string | null
          created_at: string
          device_type: string | null
          id: string
          metric: string
          navigation_type: string | null
          rating: string | null
          route: string | null
          session_hash: string | null
          value: number
        }
        Insert: {
          connection_type?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          metric: string
          navigation_type?: string | null
          rating?: string | null
          route?: string | null
          session_hash?: string | null
          value: number
        }
        Update: {
          connection_type?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          metric?: string
          navigation_type?: string | null
          rating?: string | null
          route?: string | null
          session_hash?: string | null
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      provider_image_audit_latest: {
        Row: {
          category: string | null
          checked_at: string | null
          missing: number | null
          ok: number | null
          pct_ok: number | null
          placeholder: number | null
          provider_id: string | null
          total: number | null
          unreachable: number | null
          wrong_host: number | null
          wrong_type: number | null
        }
        Relationships: []
      }
      unified_audit_log: {
        Row: {
          action: string | null
          actor_id: string | null
          event_time: string | null
          id: string | null
          ip_address: string | null
          payload: Json | null
          severity: string | null
          source: string | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Relationships: []
      }
      unified_provider_tests: {
        Row: {
          biomarker_count: number | null
          biomarkers_list: Json | null
          biomarkers_listed: number | null
          body_system: string | null
          category_primary: string | null
          clinical_review_fee: number | null
          clinical_review_type: string | null
          collection_fee_amount: number | null
          collection_fee_type: string | null
          collection_method: string | null
          description: string | null
          discount_percentage: number | null
          id: string | null
          image_url: string | null
          is_addon: boolean | null
          is_popular: boolean | null
          original_price: number | null
          popularity_rank: number | null
          price: number | null
          provider_id: string | null
          provider_name: string | null
          sample_type: string | null
          sample_type_raw: string | null
          scraped_at: string | null
          test_name: string | null
          total_expected_cost: number | null
          turnaround_days_text: string | null
          updated_at: string | null
          url: string | null
          url_verified: boolean | null
        }
        Relationships: []
      }
      v_ai_ops_summary: {
        Row: {
          avg_latency_ms: number | null
          avg_tokens: number | null
          failed: number | null
          job_type: string | null
          last_call_at: string | null
          successful: number | null
          total_calls: number | null
          total_cost_usd: number | null
        }
        Relationships: []
      }
      v_commercial_funnel: {
        Row: {
          event_count: number | null
          funnel_stage: string | null
          unique_sessions: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      v_executive_kpis: {
        Row: {
          active_products: number | null
          active_providers: number | null
          ai_failures_24h: number | null
          avg_provider_health: number | null
          critical_alerts: number | null
          open_alerts: number | null
          revenue_30d: number | null
          scraper_failures_24h: number | null
          sessions_30d: number | null
          unique_visitors_30d: number | null
        }
        Relationships: []
      }
      v_provider_health_latest: {
        Row: {
          active_products: number | null
          affiliate_health: number | null
          avg_product_score: number | null
          broken_affiliate_links: number | null
          catalogue_completeness: number | null
          compliance_status: string | null
          computed_at: string | null
          consecutive_failures: number | null
          conversion_rate: number | null
          health_score: number | null
          id: string | null
          last_scrape_at: string | null
          last_scrape_success: boolean | null
          products_with_biomarkers: number | null
          products_with_image: number | null
          products_with_price: number | null
          provider_id: string | null
          scrape_reliability: number | null
          total_affiliate_clicks: number | null
          total_page_views: number | null
          total_products: number | null
          total_revenue: number | null
          trust_score: number | null
        }
        Relationships: []
      }
      v_scrape_ops_recent: {
        Row: {
          biomarker_changes: number | null
          completed_at: string | null
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          function_name: string | null
          price_changes: number | null
          products_added: number | null
          products_found: number | null
          products_removed: number | null
          products_updated: number | null
          provider_id: string | null
          retry_count: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          biomarker_changes?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          function_name?: string | null
          price_changes?: number | null
          products_added?: number | null
          products_found?: number | null
          products_removed?: number | null
          products_updated?: number | null
          provider_id?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          biomarker_changes?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          function_name?: string | null
          price_changes?: number | null
          products_added?: number | null
          products_found?: number | null
          products_removed?: number | null
          products_updated?: number | null
          provider_id?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      v_unresolved_alerts: {
        Row: {
          alert_type: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          first_seen_at: string | null
          id: string | null
          last_seen_at: string | null
          message: string | null
          metadata: Json | null
          occurrence_count: number | null
          severity: string | null
          source: string | null
          title: string | null
        }
        Insert: {
          alert_type?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          first_seen_at?: string | null
          id?: string | null
          last_seen_at?: string | null
          message?: string | null
          metadata?: Json | null
          occurrence_count?: number | null
          severity?: string | null
          source?: string | null
          title?: string | null
        }
        Update: {
          alert_type?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          first_seen_at?: string | null
          id?: string | null
          last_seen_at?: string | null
          message?: string | null
          metadata?: Json | null
          occurrence_count?: number | null
          severity?: string | null
          source?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_audit_retention: {
        Args: never
        Returns: {
          rows_deleted: number
          source: string
        }[]
      }
      call_edge_with_automations: {
        Args: { p_body?: Json; p_url: string }
        Returns: number
      }
      call_edge_with_service_role: {
        Args: { p_body?: Json; p_url: string }
        Returns: number
      }
      category_text_to_canonical: {
        Args: { _category: string }
        Returns: string
      }
      cleanup_cron_run_log: { Args: never; Returns: undefined }
      cleanup_csp_reports: { Args: never; Returns: undefined }
      cleanup_expired_recommendations: { Args: never; Returns: undefined }
      cleanup_old_health_queries: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      cleanup_protected_call_log: { Args: never; Returns: undefined }
      cleanup_role_audit_log: { Args: never; Returns: undefined }
      get_biomarker_validation_issues: {
        Args: never
        Returns: {
          biomarker_count: number
          biomarkers_list: Json
          category: string
          id: string
          issue: string
          provider_id: string
          scraped_at: string
          test_name: string
          updated_at: string
          url: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_current_user_admin: { Args: never; Returns: boolean }
      log_data_access_with_reason: {
        Args: {
          _classification?: string
          _purpose?: string
          _reason_code: string
          _record_id: string
          _table_name: string
        }
        Returns: string
      }
      lov_tables_without_policies: {
        Args: never
        Returns: {
          schemaname: string
          tablename: string
        }[]
      }
      match_biomarkers: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          clinical_description: string
          id: string
          name: string
          related_symptoms: string[]
          similarity: number
          snomed_code: string
        }[]
      }
      resolve_canonical_category: {
        Args: { _provider_id: string; _source_section: string }
        Returns: string
      }
      resolve_categories_for_text: {
        Args: { _text: string }
        Returns: string[]
      }
      run_logged_cleanup: {
        Args: { _job_name: string; _sql: string }
        Returns: string
      }
      sanitize_popular_provider_tests: { Args: never; Returns: undefined }
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
