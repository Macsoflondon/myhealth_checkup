/**
 * Test-related type definitions
 * Centralized types for all test data structures
 */

export interface Test {
  id: string;
  test_name: string;
  description: string;
  detailed_description?: string | null;
  category: string;
  subcategory?: string | null;
  biomarkers: unknown;
  sample_type?: string | null;
  fasting_required?: boolean | null;
  preparation_instructions?: string | null;
  typical_turnaround_days?: number | null;
  clinical_significance?: string | null;
  who_should_take?: string | null;
  popularity_score?: number | null;
  test_code?: string | null;
  is_active?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface TestMaster extends Test {
  // Alias for Test - used for tests_master table
}

export interface TestResult {
  id: string;
  user_id: string;
  test_master_id?: string | null;
  appointment_id?: string | null;
  provider_id?: string | null;
  result_date: string;
  biomarker_results: unknown;
  interpretation?: string | null;
  flagged_markers?: string[] | null;
  pdf_url?: string | null;
  reviewed_by_professional?: boolean | null;
  professional_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadedTestResult {
  id: string;
  user_id: string;
  test_name: string;
  test_date: string;
  provider_id?: string | null;
  file_url?: string | null;
  parsed_data?: unknown;
  notes?: string | null;
  uploaded_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BiomarkerReading {
  id: string;
  user_id: string;
  biomarker_name: string;
  value: number;
  unit?: string | null;
  reference_range_min?: number | null;
  reference_range_max?: number | null;
  status?: string | null;
  recorded_at: string;
  appointment_id?: string | null;
  uploaded_test_result_id?: string | null;
  created_at?: string | null;
}

export interface TestCategory {
  id: string;
  name: string;
  description?: string;
  searchTerms: string[];
  icon?: string;
  color?: string;
}

export interface TestFilter {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  providerId?: string;
  homeKitAvailable?: boolean;
  clinicVisitAvailable?: boolean;
  sortBy?: 'price' | 'name' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface TestComparison {
  testId: string;
  testName: string;
  providers: Array<{
    providerId: string;
    providerName: string;
    price: number;
    url?: string;
    biomarkerCount?: number;
    turnaroundDays?: number;
  }>;
}

export interface EnhancedTestData {
  id: string;
  name: string;
  category: string;
  provider: string;
  providerId: string;
  price: number;
  originalPrice?: number;
  biomarkerCount: number;
  biomarkers: string[];
  turnaround: string;
  sampleType: string;
  homeKit: boolean;
  clinicVisit: boolean;
  phlebotomyIncluded?: boolean;
  phlebotomyCost?: number;
  gpConsultationIncluded?: boolean;
  gpConsultationCost?: number;
  url: string;
  description?: string;
  isLive?: boolean;
  lastUpdated?: string;
}

export interface TestCardData {
  id: string;
  name: string;
  category: string;
  price: number;
  provider: string;
  providerLogo?: string;
  biomarkerCount: number;
  turnaround: string;
  sampleType?: string;
  url?: string;
  isFavorite?: boolean;
}
