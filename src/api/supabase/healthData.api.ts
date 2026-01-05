import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "./base";

// Storage bucket for test result files
const TEST_RESULTS_BUCKET = 'test-results';

// Signed URL expiry time (1 hour in seconds)
const SIGNED_URL_EXPIRY = 3600;

export interface UploadedTestResult {
  id: string;
  user_id: string;
  test_name: string;
  provider_id?: string;
  test_date: string;
  uploaded_at: string;
  file_url?: string;
  parsed_data?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BiomarkerReading {
  id: string;
  uploaded_test_result_id?: string;
  appointment_id?: string;
  user_id: string;
  biomarker_name: string;
  value: number;
  unit?: string;
  reference_range_min?: number;
  reference_range_max?: number;
  status?: 'low' | 'normal' | 'high' | 'critical';
  recorded_at: string;
  created_at: string;
}

export interface UserHealthData {
  id: string;
  user_id: string;
  data_source: string;
  metric_type: string;
  value: number;
  unit?: string;
  recorded_at: string;
  synced_at: string;
  created_at: string;
}

export interface HealthScore {
  id: string;
  user_id: string;
  overall_score?: number;
  heart_score?: number;
  metabolic_score?: number;
  hormonal_score?: number;
  nutritional_score?: number;
  calculated_at: string;
  created_at: string;
}

class HealthDataApi {
  /**
   * Generate a signed URL for secure file access
   * URLs expire after 1 hour for security
   */
  async getSecureFileUrl(filePath: string): Promise<string | null> {
    if (!filePath) return null;
    
    // If it's already a full URL (external), return as-is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      // For external URLs, we can't generate signed URLs
      // Consider migrating to Supabase storage for security
      return filePath;
    }
    
    try {
      const { data, error } = await supabase.storage
        .from(TEST_RESULTS_BUCKET)
        .createSignedUrl(filePath, SIGNED_URL_EXPIRY);
      
      if (error) {
        console.error('Failed to generate signed URL:', error);
        return null;
      }
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
  }

  /**
   * Get uploaded test results with secure file URLs
   */
  async getUploadedTestResults(userId: string): Promise<ApiResponse<UploadedTestResult[]>> {
    const { data, error, count } = await supabase
      .from('uploaded_test_results')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('test_date', { ascending: false });

    if (error || !data) {
      return { data, error, count };
    }

    // Generate signed URLs for file access
    const resultsWithSignedUrls = await Promise.all(
      data.map(async (result) => ({
        ...result,
        file_url: result.file_url ? await this.getSecureFileUrl(result.file_url) : null,
      }))
    );

    return { data: resultsWithSignedUrls, error, count };
  }

  async uploadTestResult(result: Omit<UploadedTestResult, 'id' | 'user_id' | 'uploaded_at' | 'created_at' | 'updated_at'>): Promise<ApiResponse<UploadedTestResult>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('uploaded_test_results')
      .insert({ ...result, user_id: user.id })
      .select()
      .single();

    return { data, error };
  }

  async deleteTestResult(id: string): Promise<ApiResponse<null>> {
    const { error } = await supabase
      .from('uploaded_test_results')
      .delete()
      .eq('id', id);

    return { data: null, error };
  }

  // Biomarker Readings
  async getBiomarkerReadings(userId: string, biomarkerName?: string): Promise<ApiResponse<BiomarkerReading[]>> {
    let query = supabase
      .from('biomarker_readings')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });

    if (biomarkerName) {
      query = query.eq('biomarker_name', biomarkerName);
    }

    const { data, error, count } = await query;
    return { data: data as BiomarkerReading[] | null, error, count };
  }

  async addBiomarkerReading(reading: Omit<BiomarkerReading, 'id' | 'user_id' | 'created_at'>): Promise<ApiResponse<BiomarkerReading>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('biomarker_readings')
      .insert({ ...reading, user_id: user.id })
      .select()
      .single();

    return { data: data as BiomarkerReading | null, error };
  }

  async getBiomarkerTrend(userId: string, biomarkerName: string, limit: number = 10): Promise<ApiResponse<BiomarkerReading[]>> {
    const { data, error } = await supabase
      .from('biomarker_readings')
      .select('*')
      .eq('user_id', userId)
      .eq('biomarker_name', biomarkerName)
      .order('recorded_at', { ascending: true })
      .limit(limit);

    return { data: data as BiomarkerReading[] | null, error };
  }

  // Health Scores
  async getLatestHealthScore(userId: string): Promise<ApiResponse<HealthScore>> {
    const { data, error } = await supabase
      .from('user_health_scores')
      .select('*')
      .eq('user_id', userId)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single();

    return { data, error };
  }

  async getHealthScoreHistory(userId: string, limit: number = 30): Promise<ApiResponse<HealthScore[]>> {
    const { data, error } = await supabase
      .from('user_health_scores')
      .select('*')
      .eq('user_id', userId)
      .order('calculated_at', { ascending: false })
      .limit(limit);

    return { data, error };
  }

  // User Health Data (wearables, manual entries)
  async getUserHealthData(userId: string, metricType?: string, limit: number = 100): Promise<ApiResponse<UserHealthData[]>> {
    let query = supabase
      .from('user_health_data')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error, count } = await query;
    return { data, error, count };
  }

  async addHealthData(data: Omit<UserHealthData, 'id' | 'user_id' | 'synced_at' | 'created_at'>): Promise<ApiResponse<UserHealthData>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data: result, error } = await supabase
      .from('user_health_data')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    return { data: result, error };
  }
}

export const healthDataApi = new HealthDataApi();
