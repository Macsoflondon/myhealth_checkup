/**
 * Core entity type definitions
 * Single source of truth for all entity interfaces
 */


export interface Provider {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  accreditations?: string[];
}

export interface Test {
  id: string;
  name: string;
  provider: string;
  price: number;
  category: string;
  description: string;
  available: boolean;
}

export interface TestFeatures {
  turnaround: string;
  collection: string;
  bioMarkers?: string;
}

export interface CompareTestData extends Test {
  features: TestFeatures;
  providerLogo: string;
  dataSource?: 'live' | 'cache' | 'database';
  lastUpdated?: string;
  accreditations?: string[];
  popularityScore?: number;
  biomarkerCount?: number;
  turnaroundDays?: number;
  userRating?: number;
  url?: string; // Provider booking URL

  // Standardised comparison fields (optional — populated from DB when available)
  sampleTypeCode?: 'finger_prick' | 'venous' | 'saliva' | 'urine' | 'stool' | 'buccal_swab' | 'multiple' | null;
  collectionMethod?: 'home_kit' | 'clinic' | 'home_visit' | 'mobile_phleb' | 'third_party_phleb' | 'self_arranged' | 'multiple' | null;
  collectionFeeType?: 'none' | 'fixed' | 'from' | 'varies' | 'self_arranged' | null;
  collectionFeeAmount?: number | null;
  clinicalReviewType?: 'included' | 'optional' | 'gp_included' | 'consultant_included' | 'clinician_included' | 'not_included' | 'not_available' | null;
  clinicalReviewFee?: number | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  test_id: string;
  provider: string;
  status: string;
  order_date: string;
  price?: number;
  name?: string;
  result_date?: string;
  result_url?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  test_id: string;
  provider: string;
  category: string;
  name?: string;
  price?: number;
  created_at: string;
}
