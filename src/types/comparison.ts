/**
 * Enhanced comparison types for detailed test comparison
 */

import type {
  SampleType,
  CollectionMethod,
  CollectionFeeType,
  ClinicalReviewType,
} from '@/lib/comparisonFormat';

export interface EnhancedTestData {
  id: string;
  testName: string;
  provider: string;
  providerId: string;
  providerLogo: string;
  category: string;

  // Pricing
  basePrice: number;
  gpConsultationIncluded: boolean;
  gpConsultationCost: number | null;
  phlebotomyIncluded: boolean;
  phlebotomyCost: number | null;
  totalEstimatedCost: number;

  // Features — legacy (kept for back-compat)
  turnaroundDays: number;
  sampleType: SampleType | 'finger-prick' | 'venous' | 'urine' | 'saliva' | 'multiple';
  homeKitAvailable: boolean;
  clinicVisitAvailable: boolean;

  // Standardised comparison fields
  sampleTypeCode: SampleType | null;
  collectionMethod: CollectionMethod | null;
  collectionFeeType: CollectionFeeType | null;
  collectionFeeAmount: number | null;
  clinicalReviewType: ClinicalReviewType | null;
  clinicalReviewFee: number | null;
  totalExpectedCost: number;

  // Biomarkers
  biomarkerCount: number;
  biomarkersList: string[];

  // Quality
  accreditations: string[];

  // Meta
  description: string;
  url: string | null;
  dataSource?: 'live' | 'cache' | 'database';
  lastUpdated?: string;
}

export interface ComparisonResult {
  tests: EnhancedTestData[];
  bestValue: string | null; // lowest total expected cost
  fastestResults: string | null;
  mostComprehensive: string | null;
  biomarkerOverlap: string[];
  uniqueBiomarkers: Record<string, string[]>;
}

export interface SavedComparison {
  id: string;
  userId: string;
  comparisonName: string;
  testIds: string[];
  category: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ComparisonFilters {
  category: string;
  providers: string[];
  priceRange: [number, number];
  maxTurnaround: number | null;
  // New standardised filter groups
  sampleTypes: SampleType[];
  collectionMethods: CollectionMethod[];
  feeFilter: 'all' | 'none' | 'additional';
  clinicalReview: Array<'included' | 'optional' | 'not_included'>;
}

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'turnaround-asc'
  | 'turnaround-desc'
  | 'biomarkers-desc'
  | 'total-cost-asc';
