import { CompareTestData } from "@/types";
import { PROVIDER_LOGOS, PROVIDER_NAMES, PROVIDER_TURNAROUND_TIMES, PROVIDER_COLLECTION_METHODS } from "@/constants/providers";

/**
 * Minimal structural shape the transformer needs. Database rows expose these
 * columns as nullable, so nullability is normalised here at the boundary.
 */
export interface LiveTestRow {
  id: string;
  test_name: string;
  provider_id: string;
  category: string | null;
  price: number | null;
  description: string | null;
  is_active: boolean | null;
  url: string | null;
  /** Authoritative stored biomarker total (provider_tests.biomarker_count). */
  biomarker_count?: number | null;
  biomarkers_list?: unknown;
}

/**
 * Normalise the stored biomarkers_list JSON into plain strings.
 */
const toBiomarkerNames = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (entry && typeof entry === 'object' && 'value' in entry) {
        const value = (entry as { value?: unknown }).value;
        return typeof value === 'string' ? value : '';
      }
      return '';
    })
    .filter((name) => name.trim().length > 0);
};

/**
 * Transform raw test data from database into CompareTestData format
 */
export class TestDataTransformer {
  /**
   * Transform a single test record
   */
  static transformSingle(test: LiveTestRow): CompareTestData {
    const biomarkersList = toBiomarkerNames(test.biomarkers_list);
    // The stored count is the source of truth; never estimate it from copy.
    const biomarkerCount =
      typeof test.biomarker_count === 'number' && test.biomarker_count > 0
        ? test.biomarker_count
        : biomarkersList.length;
    const category = test.category ?? 'General';

    return {
      id: test.id,
      name: test.test_name,
      provider: PROVIDER_NAMES[test.provider_id] || test.provider_id,
      price: test.price || 0,
      category,
      description: test.description || '',
      features: {
        turnaround: this.estimateTurnaround(test.provider_id),
        collection: this.getCollectionMethod(test.provider_id),
        bioMarkers: biomarkersList.slice(0, 3).join(', ') || this.extractBioMarkers(test.description || '')
      },
      providerLogo: PROVIDER_LOGOS[test.provider_id] || '/placeholder.svg',
      available: test.is_active ?? true,
      accreditations: this.getAccreditations(test.provider_id),
      popularityScore: this.estimatePopularity(test.test_name, category),
      biomarkerCount,
      biomarkersList,
      turnaroundDays: this.estimateTurnaroundDays(test.provider_id),
      userRating: undefined,
      url: test.url || undefined
    };
  }

  /**
   * Transform multiple test records
   */
  static transformMultiple(tests: LiveTestRow[]): CompareTestData[] {
    return tests.map(test => this.transformSingle(test));
  }

  /**
   * Estimate turnaround time based on provider
   */
  private static estimateTurnaround(providerId: string): string {
    return PROVIDER_TURNAROUND_TIMES[providerId] || '3-5 days';
  }

  /**
   * Get collection method based on provider
   */
  private static getCollectionMethod(providerId: string): string {
    return PROVIDER_COLLECTION_METHODS[providerId] || 'Varies';
  }

  /**
   * Extract biomarker information from description
   */
  private static extractBioMarkers(description: string): string {
    if (!description) return '';
    
    const commonMarkers = [
      'cholesterol', 'hdl', 'ldl', 'triglycerides',
      'glucose', 'hba1c', 'insulin',
      'tsh', 't3', 't4',
      'vitamin d', 'b12', 'folate', 'iron',
      'testosterone', 'estrogen', 'progesterone',
      'cortisol', 'dhea'
    ];
    
    const found = commonMarkers.filter(marker => 
      description.toLowerCase().includes(marker)
    );
    
    return found.length > 0 ? found.slice(0, 3).join(', ') : '';
  }

  /**
   * Get provider accreditations
   */
  private static getAccreditations(providerId: string): string[] {
    const accreditationMap: Record<string, string[]> = {
      'medichecks': ['UKAS', 'CQC'],
      'goodbody-clinic': ['UKAS', 'ISO 15189'],
      'randox': ['UKAS', 'ISO 15189'],
      'thriva': ['CQC'],
      'london-medical-lab': ['CQC', 'ISO 15189'],
      'lola-health': ['CQC']
    };
    
    return accreditationMap[providerId] || [];
  }

  /**
   * Estimate test popularity based on name and category
   */
  private static estimatePopularity(testName: string, category: string): number {
    const nameLower = testName.toLowerCase();
    
    // High popularity tests
    if (nameLower.includes('vitamin d') || 
        nameLower.includes('thyroid') ||
        nameLower.includes('testosterone') ||
        nameLower.includes('full blood count') ||
        nameLower.includes('hba1c')) {
      return 85;
    }
    
    // Medium-high popularity
    if (nameLower.includes('cholesterol') ||
        nameLower.includes('liver') ||
        nameLower.includes('kidney') ||
        nameLower.includes('hormone')) {
      return 75;
    }
    
    // Standard popularity for common categories
    if (category.toLowerCase().includes('general') ||
        category.toLowerCase().includes('wellness') ||
        category.toLowerCase().includes('heart')) {
      return 65;
    }
    
    return 50; // Default popularity
  }

  /**
   * Estimate turnaround time in days
   */
  private static estimateTurnaroundDays(providerId: string): number {
    const turnaroundMap: Record<string, number> = {
      'medichecks': 2,
      'goodbody-clinic': 1,
      'randox': 2,
      'thriva': 3,
      'london-medical-lab': 1,
      'lola-health': 2
    };
    
    return turnaroundMap[providerId] || 3;
  }
}
