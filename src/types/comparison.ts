/**
 * Enhanced comparison types for detailed test comparison
 */

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
  
  // Features
  turnaroundDays: number;
  sampleType: 'finger-prick' | 'venous' | 'urine' | 'saliva' | 'multiple';
  homeKitAvailable: boolean;
  clinicVisitAvailable: boolean;
  
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
  bestValue: string | null; // test id with lowest total cost
  fastestResults: string | null; // test id with quickest turnaround
  mostComprehensive: string | null; // test id with most biomarkers
  biomarkerOverlap: string[]; // biomarkers common to all tests
  uniqueBiomarkers: Record<string, string[]>; // test id -> unique biomarkers
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
  sampleTypes: string[];
  includesGpConsult: boolean | null;
  includesPhlebotomy: boolean | null;
}

export type SortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'turnaround-asc' 
  | 'turnaround-desc'
  | 'biomarkers-desc'
  | 'total-cost-asc';
