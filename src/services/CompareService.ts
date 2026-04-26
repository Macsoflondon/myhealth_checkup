import { logger } from "@/lib/logger";
import type { CompareTestData } from "@/types";
import { cacheService } from "./CacheService";
import { TestDataTransformer } from "./transformers/testDataTransformer";
import { TestQueryBuilder } from "./queryBuilders/testQueryBuilder";
import { compareCategories } from "@/constants/categories";
import { LiveDataService } from "./LiveDataService";

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
  dataSource?: 'live' | 'cache' | 'database';
  lastUpdated?: string;
}

export class CompareService {

  // ============================================================================
  // Core Query Methods
  // ============================================================================

  static async getTestsByCategory(category: string, providers: string[] = ['all']): Promise<CompareTestData[]> {
    const cacheKey = cacheService.generateKey('getTestsByCategory', { category, providers });
    const cached = cacheService.get<CompareTestData[]>(cacheKey);
    if (cached) return cached;

    try {
      // If specific providers requested, try live data first
      if (providers.length > 0 && providers[0] !== 'all') {
        const liveResults: CompareTestData[] = [];
        
        for (const providerId of providers) {
          const { data, source } = await LiveDataService.getLiveTestData(providerId, category);
          // Attach data source metadata to each test
          const enrichedData = data.map(test => ({
            ...test,
            dataSource: source,
            lastUpdated: new Date().toISOString()
          }));
          liveResults.push(...enrichedData);
          
          if (source === 'live') {
            logger.info(`Using live data for ${providerId}`);
          } else {
            logger.info(`Using ${source} data for ${providerId}`);
          }
        }
        
        if (liveResults.length > 0) {
          cacheService.set(cacheKey, liveResults);
          return liveResults;
        }
      }

      // Fallback to database query
      const query = TestQueryBuilder.buildCategoryQuery(category, providers);
      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching tests:', error);
        return [];
      }

      const result = TestDataTransformer.transformMultiple(data || []).map(test => ({
        ...test,
        dataSource: 'database' as const,
        lastUpdated: new Date().toISOString()
      }));
      cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      logger.error('Error in getTestsByCategory:', error);
      return [];
    }
  }

  static async searchTests(searchTerm: string, providers: string[] = ['all']): Promise<CompareTestData[]> {
    if (!searchTerm.trim()) return [];
    
    const cacheKey = cacheService.generateKey('searchTests', { searchTerm, providers });
    const cached = cacheService.get<CompareTestData[]>(cacheKey);
    if (cached) return cached;

    try {
      const query = TestQueryBuilder.buildSearchQuery(searchTerm, providers);
      const { data, error } = await query;

      if (error) {
        logger.error('Error searching tests:', error);
        return [];
      }

      const result = TestDataTransformer.transformMultiple(data || []);
      cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      logger.error('Error in searchTests:', error);
      return [];
    }
  }

  static async getCategories(): Promise<Array<{ id: string; name: string; count: number }>> {
    const cacheKey = cacheService.generateKey('getCategories', {});
    const cached = cacheService.get<Array<{ id: string; name: string; count: number }>>(cacheKey);
    if (cached) return cached;

    try {
      const query = TestQueryBuilder.buildCategoriesQuery();
      const { data, error } = await query;

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

      cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      logger.error('Error in getCategories:', error);
      return [];
    }
  }

  // ============================================================================
  // Utility Methods (Delegated to other services)
  // ============================================================================

  public static clearCache(): void {
    cacheService.clear();
  }
}
