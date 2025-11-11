/**
 * Centralized type exports
 */

export type {
  Clinic,
  ClinicWithDistance,
  Provider,
  Test,
  TestFeatures,
  CompareTestData,
  UserProfile,
  Order,
  Favorite,
} from './entities';

export type {
  ApiResponse,
  PaginationParams,
  FilterParams,
} from '../api/supabase/base';

/**
 * Live test data from provider_tests table
 */
export interface LiveTestData {
  id: string;
  test_name: string;
  provider_id: string;
  category: string;
  price: number | null;
  description: string | null;
  is_active: boolean;
  image_url: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}
