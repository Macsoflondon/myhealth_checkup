/**
 * Enhanced comparison types for detailed test comparison
 */

import type {
  SampleType,
  CollectionMethod,
  CollectionFeeType,
  ClinicalReviewType,
} from "@/lib/comparisonFormat";

export interface EnhancedTestData {
  id: string;
  testName: string;
  provider: string;
  providerId: string;
  providerLogo: string;
  image_url?: string | null;
  category: string;

  // Pricing — null means the real price is not known; never coerce to 0
  basePrice: number | null;
  gpConsultationIncluded: boolean;
  gpConsultationCost: number | null;
  phlebotomyIncluded: boolean;
  phlebotomyCost: number | null;
  totalEstimatedCost: number;

  // Features — legacy (kept for back-compat)
  turnaroundDays: number | null;
  sampleType:
    SampleType | "finger-prick" | "venous" | "urine" | "saliva" | "multiple";
  homeKitAvailable: boolean | null;
  clinicVisitAvailable: boolean | null;

  // Standardised comparison fields
  sampleTypeCode: SampleType | null;
  collectionMethod: CollectionMethod | null;
  collectionFeeType: CollectionFeeType | null;
  collectionFeeAmount: number | null;
  clinicalReviewType: ClinicalReviewType | null;
  clinicalReviewFee: number | null;
  totalExpectedCost: number | null;

  // Biomarkers — null means no real list/count is known; never inferred
  // from free-text keyword matching
  biomarkerCount: number | null;
  biomarkersList: string[] | null;

  // Quality
  accreditations: string[];

  // Meta
  description: string;
  url: string | null;
  /** provider_tests.url_verified: null = never checked, true = passed, false = last check failed. */
  urlVerified: boolean | null;
  dataSource?: "live" | "cache" | "database";
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
  feeFilter: "all" | "none" | "additional";
  clinicalReview: Array<"included" | "optional" | "not_included">;
}

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "turnaround-asc"
  | "turnaround-desc"
  | "biomarkers-desc"
  | "total-cost-asc";
