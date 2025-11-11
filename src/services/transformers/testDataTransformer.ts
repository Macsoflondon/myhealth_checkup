import { CompareTestData, LiveTestData } from "@/types";
import { PROVIDER_LOGOS, PROVIDER_NAMES } from "@/constants/providers";
import { providerService } from "../ProviderService";

/**
 * Transform raw test data from database into CompareTestData format
 */
export class TestDataTransformer {
  /**
   * Transform a single test record
   */
  static transformSingle(test: LiveTestData): CompareTestData {
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
        bioMarkers: this.extractBioMarkers(test.description || '')
      },
      providerLogo: PROVIDER_LOGOS[test.provider_id] || '/placeholder.svg',
      available: test.is_active
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
}
