/**
 * Provider-related type definitions
 * Centralized types for all provider data structures
 */

export interface Provider {
  id: string;
  name: string;
  logo: string;
  website?: string;
  color?: string;
  description?: string;
}

export interface ProviderDetails extends Provider {
  color: string;
  features?: string[];
  accreditations?: string[];
}

export interface ProviderTest {
  id: string;
  provider_id: string;
  test_name: string;
  category: string | null;
  price: number | null;
  description?: string | null;
  url?: string | null;
  biomarker_count?: number | null;
  biomarkers_list?: unknown;
  turnaround_days?: number;
  sample_type?: string | null;
  is_active: boolean;
  scraped_at: string;
  home_kit_available?: boolean | null;
  clinic_visit_available?: boolean | null;
  phlebotomy_included?: boolean | null;
  phlebotomy_cost?: number | null;
  gp_consultation_included?: boolean | null;
  gp_consultation_cost?: number | null;
  image_url?: string | null;
  provider_test_id?: string | null;
}

export interface ProviderApiResponse {
  data: ProviderTest[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_updated: string;
    version: string;
  };
}

export interface ProviderTestData {
  provider_id: string;
  test_name: string;
  price: number;
  url?: string;
  description?: string;
  category?: string;
  biomarker_count?: number;
  biomarkers_list?: unknown;
  sample_type?: string;
  home_kit_available?: boolean;
  clinic_visit_available?: boolean;
  phlebotomy_included?: boolean;
  phlebotomy_cost?: number;
  gp_consultation_included?: boolean;
  gp_consultation_cost?: number;
  image_url?: string;
  provider_test_id?: string;
}

export interface PriceUpdate {
  test_id: string;
  provider: string;
  price: number;
  available: boolean;
  updated_at: string;
}

export interface ProviderTestMapping {
  id: string;
  provider_id: string;
  test_master_id: string;
  provider_test_id: string;
  provider_test_name: string;
  current_price: number | null;
  original_price?: number | null;
  discount_percentage?: number | null;
  provider_url?: string | null;
  sample_collection_method?: string | null;
  turnaround_time_days?: number | null;
  accreditations?: string[] | null;
  availability_status?: string | null;
  last_scraped_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderFilter {
  providerId?: string;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  homeKitAvailable?: boolean;
  clinicVisitAvailable?: boolean;
}

export interface ProviderComparisonData {
  providerId: string;
  providerName: string;
  tests: ProviderTest[];
  totalTests: number;
  averagePrice: number;
}
