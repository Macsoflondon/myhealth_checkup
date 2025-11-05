import { supabase } from "@/integrations/supabase/client";
import { providerService } from "./ProviderService";
import { logger } from "@/lib/logger";

// ============================================================================
// Type Definitions
// ============================================================================

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

export interface CompareTestData {
  id: string;
  name: string;
  provider: string;
  price: number;
  category: string;
  description: string;
  features: {
    turnaround: string;
    collection: string;
    bioMarkers?: string;
  };
  providerLogo: string;
  available: boolean;
}

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// ============================================================================
// Compare Service - Unified service for test comparison functionality
// ============================================================================

export class CompareService {
  private static readonly PROVIDER_LOGOS: Record<string, string> = {
    'medichecks': '/lovable-uploads/provider-medichecks-new-v3.png',
    'thriva': '/lovable-uploads/provider-thriva.png',
    'randox': '/lovable-uploads/provider-randox.png',
    'london-medical-laboratory': '/lovable-uploads/provider-london-medical.png',
    'lola-health': '/lovable-uploads/provider-lola-health.png',
    'goodbody-clinic': '/lovable-uploads/provider-goodbody-new-v2.svg',
    'tuli-health': '/lovable-uploads/provider-tuli-health.png'
  };

  private static readonly PROVIDER_NAMES: Record<string, string> = {
    'medichecks': 'Medichecks',
    'thriva': 'Thriva',
    'randox': 'Randox',
    'london-medical-laboratory': 'London Medical Laboratory',
    'lola-health': 'Lola Health',
    'goodbody-clinic': 'GoodBody Clinic',
    'tuli-health': 'Tuli Health'
  };

  // ============================================================================
  // Cache Management
  // ============================================================================

  private static getCacheKey(method: string, params: any): string {
    return `${method}_${JSON.stringify(params)}`;
  }

  private static getCachedData<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(key);
    return null;
  }

  private static setCachedData<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  public static clearCache(): void {
    cache.clear();
  }

  // ============================================================================
  // Core Query Methods
  // ============================================================================

  static async getTestsByCategory(category: string, providers: string[] = ['all']): Promise<CompareTestData[]> {
    const cacheKey = this.getCacheKey('getTestsByCategory', { category, providers });
    const cached = this.getCachedData<CompareTestData[]>(cacheKey);
    if (cached) return cached;

    try {
      let query = supabase
        .from('provider_tests')
        .select('id, test_name, provider_id, category, price, description, is_active, image_url, url, created_at, updated_at')
        .eq('is_active', true)
        .order('price', { ascending: true })
        .limit(50);

      if (category !== 'all') {
        // Enhanced category matching with search terms
        const categorySearchTerms = this.getCategorySearchTerms(category);
        const orConditions = [
          `category.ilike.%${category}%`,
          `test_name.ilike.%${category}%`,
          ...categorySearchTerms.map(term => `test_name.ilike.%${term}%`),
          ...categorySearchTerms.map(term => `description.ilike.%${term}%`)
        ].join(',');
        
        query = query.or(orConditions);
      }

      if (!providers.includes('all')) {
        query = query.in('provider_id', providers);
      } else {
        query = query.in('provider_id', Object.keys(this.PROVIDER_LOGOS));
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching tests:', error);
        return [];
      }

      const result = this.transformToCompareData(data || []);
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      logger.error('Error in getTestsByCategory:', error);
      return [];
    }
  }

  static async searchTests(searchTerm: string, providers: string[] = ['all']): Promise<CompareTestData[]> {
    if (!searchTerm.trim()) return [];
    
    const cacheKey = this.getCacheKey('searchTests', { searchTerm, providers });
    const cached = this.getCachedData<CompareTestData[]>(cacheKey);
    if (cached) return cached;

    try {
      let query = supabase
        .from('provider_tests')
        .select('id, test_name, provider_id, category, price, description, is_active, image_url, url, created_at, updated_at')
        .eq('is_active', true)
        .or(`test_name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%, category.ilike.%${searchTerm}%`)
        .order('price', { ascending: true })
        .limit(50);

      if (!providers.includes('all')) {
        query = query.in('provider_id', providers);
      } else {
        query = query.in('provider_id', Object.keys(this.PROVIDER_LOGOS));
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error searching tests:', error);
        return [];
      }

      const result = this.transformToCompareData(data || []);
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      logger.error('Error in searchTests:', error);
      return [];
    }
  }

  static async getCategories(): Promise<Array<{ id: string; name: string; count: number }>> {
    const cacheKey = this.getCacheKey('getCategories', {});
    const cached = this.getCachedData<Array<{ id: string; name: string; count: number }>>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('provider_tests')
        .select('category')
        .eq('is_active', true)
        .in('provider_id', Object.keys(this.PROVIDER_LOGOS));

      if (error) {
        logger.error('Error fetching categories:', error);
        return [];
      }

      // Count tests per category
      const categoryMap = new Map<string, number>();
      data?.forEach(item => {
        if (item.category) {
          const count = categoryMap.get(item.category) || 0;
          categoryMap.set(item.category, count + 1);
        }
      });

      // Convert to array and sort by count
      const result = Array.from(categoryMap.entries())
        .map(([category, count]) => ({
          id: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: category,
          count
        }))
        .sort((a, b) => b.count - a.count);

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      logger.error('Error in getCategories:', error);
      return [];
    }
  }

  // ============================================================================
  // Data Transformation
  // ============================================================================

  private static transformToCompareData(tests: LiveTestData[]): CompareTestData[] {
    return tests.map(test => ({
      id: test.id,
      name: test.test_name,
      provider: this.PROVIDER_NAMES[test.provider_id] || test.provider_id,
      price: test.price || 0,
      category: test.category,
      description: test.description || '',
      features: {
        turnaround: this.estimateTurnaround(test.provider_id),
        collection: this.getCollectionMethod(test.provider_id),
        bioMarkers: this.extractBioMarkers(test.description || '')
      },
      providerLogo: this.PROVIDER_LOGOS[test.provider_id] || '/placeholder.svg',
      available: test.is_active
    }));
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private static getCategorySearchTerms(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
      'Blood Tests': ['blood', 'full blood count', 'fbc', 'biochemistry', 'blood panel'],
      'Hormone Tests': ['hormone', 'hormonal', 'testosterone', 'estrogen', 'progesterone', 'cortisol'],
      'Thyroid Tests': ['thyroid', 'tsh', 't3', 't4', 'thyroglobulin', 'thyroid antibodies'],
      'Vitamin & Mineral Tests': ['vitamin', 'mineral', 'b12', 'd3', 'folate', 'iron', 'zinc', 'magnesium', 'nutrient'],
      'Diabetes Testing': ['diabetes', 'diabetic', 'glucose', 'hba1c', 'insulin', 'blood sugar'],
      'Heart Health': ['heart', 'cardiac', 'cardiovascular', 'cholesterol', 'lipid', 'triglycerides', 'hdl', 'ldl'],
      'Liver Health': ['liver', 'hepatic', 'alt', 'ast', 'bilirubin', 'liver function'],
      'Kidney Health': ['kidney', 'renal', 'creatinine', 'urea', 'kidney function', 'egfr'],
      'Fertility Testing': ['fertility', 'reproductive', 'sperm', 'ovarian', 'amh', 'fsh', 'lh'],
      'General Health': ['general', 'comprehensive', 'health check', 'wellness', 'screening'],
      'Allergy Testing': ['allergy', 'allergic', 'intolerance', 'food sensitivity', 'ige'],
      'Cancer Screening': ['cancer', 'screening', 'tumour', 'psa', 'cea', 'ca125', 'oncology']
    };
    
    return categoryMap[category] || [category.toLowerCase()];
  }

  private static estimateTurnaround(providerId: string): string {
    return providerService.estimateTurnaround(providerId);
  }

  private static getCollectionMethod(providerId: string): string {
    return providerService.getCollectionMethod(providerId);
  }

  private static extractBioMarkers(description: string): string {
    if (!description) return '';
    
    // Simple extraction of common biomarkers mentioned in description
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

  // ============================================================================
  // Utility Methods
  // ============================================================================

  public static getProviderLogo(providerId: string): string {
    return this.PROVIDER_LOGOS[providerId] || '/placeholder.svg';
  }

  public static getProviderName(providerId: string): string {
    return this.PROVIDER_NAMES[providerId] || providerId;
  }

  public static getSupportedProviders(): string[] {
    return Object.keys(this.PROVIDER_LOGOS);
  }
}
