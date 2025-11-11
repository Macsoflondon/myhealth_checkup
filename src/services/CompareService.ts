import { supabase } from "@/integrations/supabase/client";
import { providerService } from "./ProviderService";
import { logger } from "@/lib/logger";
import { PROVIDER_LOGOS, PROVIDER_NAMES, getSupportedProviderIds } from "@/constants/providers";
import { getCategorySearchTerms } from "@/constants/categories";
import { CACHE_CONFIG } from "@/constants/config";
import type { CompareTestData } from "@/types";

// Re-export for backwards compatibility
export type { CompareTestData };

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

// ============================================================================
// Cache Configuration
// ============================================================================

const cache = new Map<string, { data: any; timestamp: number }>();

export class CompareService {
  // ============================================================================
  // Cache Management
  // ============================================================================

  private static getCacheKey(method: string, params: any): string {
    return `${method}_${JSON.stringify(params)}`;
  }

  private static getCachedData<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.DURATION) {
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
        const categorySearchTerms = getCategorySearchTerms(category);
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
        query = query.in('provider_id', getSupportedProviderIds());
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
        query = query.in('provider_id', getSupportedProviderIds());
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
        .in('provider_id', getSupportedProviderIds());

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
    }));
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

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
    return PROVIDER_LOGOS[providerId] || '/placeholder.svg';
  }

  public static getProviderName(providerId: string): string {
    return PROVIDER_NAMES[providerId] || providerId;
  }

  public static getSupportedProviders(): string[] {
    return getSupportedProviderIds();
  }
}
