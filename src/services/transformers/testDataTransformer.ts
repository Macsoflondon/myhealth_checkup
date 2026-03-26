import { CompareTestData, LiveTestData } from "@/types";
import { PROVIDER_LOGOS, PROVIDER_NAMES, PROVIDER_TURNAROUND_TIMES, PROVIDER_COLLECTION_METHODS } from "@/constants/providers";

/**
 * Transform raw test data from database into CompareTestData format
 */
export class TestDataTransformer {
  /**
   * Transform a single test record
   */
  static transformSingle(test: LiveTestData): CompareTestData {
    const biomarkers = this.extractBioMarkers(test.description || '');
    const biomarkerCount = this.countBiomarkers(test.description || '');
    
    return {
      id: test.id,
      name: test.test_name,
      provider: PROVIDER_NAMES[test.provider_id] || test.provider_id,
      price: test.price || 0,
      category: test.category,
      description: test.description || '',
      features: {
        turnaround: this.estimateTurnaround(test.provider_id),
        collection: this.getCollectionMethod(test.provider_id),
        bioMarkers: biomarkers
      },
      providerLogo: PROVIDER_LOGOS[test.provider_id] || '/placeholder.svg',
      available: test.is_active,
      accreditations: this.getAccreditations(test.provider_id),
      popularityScore: this.estimatePopularity(test.test_name, test.category),
      biomarkerCount: biomarkerCount,
      turnaroundDays: this.estimateTurnaroundDays(test.provider_id),
      userRating: undefined,
      url: test.url || undefined
    };
  }

  /**
   * Transform multiple test records
   */
  static transformMultiple(tests: LiveTestData[]): CompareTestData[] {
    return tests.map(test => this.transformSingle(test));
  }

  /**
   * Estimate turnaround time based on provider
   */
  private static estimateTurnaround(providerId: string): string {
    return providerService.estimateTurnaround(providerId);
  }

  /**
   * Get collection method based on provider
   */
  private static getCollectionMethod(providerId: string): string {
    return providerService.getCollectionMethod(providerId);
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
   * Count total biomarkers in test description
   */
  private static countBiomarkers(description: string): number {
    if (!description) return 0;
    
    const commonMarkers = [
      'cholesterol', 'hdl', 'ldl', 'triglycerides',
      'glucose', 'hba1c', 'insulin',
      'tsh', 't3', 't4', 'thyroid',
      'vitamin d', 'b12', 'folate', 'iron', 'ferritin',
      'testosterone', 'estrogen', 'oestradiol', 'progesterone',
      'cortisol', 'dhea', 'psa', 'liver', 'kidney',
      'crp', 'inflammation', 'full blood count'
    ];
    
    const found = commonMarkers.filter(marker => 
      description.toLowerCase().includes(marker)
    );
    
    // Estimate based on description keywords
    if (description.toLowerCase().includes('comprehensive') || 
        description.toLowerCase().includes('full panel')) {
      return Math.max(found.length, 20);
    }
    if (description.toLowerCase().includes('advanced')) {
      return Math.max(found.length, 15);
    }
    
    return Math.max(found.length, 5);
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
