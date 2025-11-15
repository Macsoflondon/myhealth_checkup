import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import type { CompareTestData } from "@/types";

interface LiveDataCache {
  data: CompareTestData[];
  timestamp: number;
  expiresAt: number;
}

export class LiveDataService {
  private static cache = new Map<string, LiveDataCache>();
  private static CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  /**
   * Get live test data with fallback to database
   */
  static async getLiveTestData(
    providerId: string,
    category?: string
  ): Promise<{ data: CompareTestData[]; source: 'live' | 'cache' | 'database' }> {
    const cacheKey = `${providerId}-${category || 'all'}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      logger.info(`Using cached data for ${cacheKey}`);
      return { data: cached.data, source: 'cache' };
    }

    // Try to scrape live data
    try {
      logger.info(`Attempting to fetch live data for ${providerId}`);
      const liveData = await this.scrapeLiveData(providerId);
      
      if (liveData && liveData.length > 0) {
        // Cache the results
        this.cache.set(cacheKey, {
          data: liveData,
          timestamp: Date.now(),
          expiresAt: Date.now() + this.CACHE_DURATION,
        });
        
        logger.info(`Successfully fetched ${liveData.length} live tests from ${providerId}`);
        return { data: liveData, source: 'live' };
      }
    } catch (error) {
      logger.error(`Error fetching live data for ${providerId}:`, error);
    }

    // Fallback to database
    logger.info(`Falling back to database for ${providerId}`);
    const dbData = await this.getDatabaseFallback(providerId, category);
    return { data: dbData, source: 'database' };
  }

  /**
   * Scrape live data from provider website
   */
  private static async scrapeLiveData(providerId: string): Promise<CompareTestData[]> {
    const scraperMap: Record<string, string> = {
      'medichecks': 'scrape-medichecks',
      'london-medical-laboratory': 'scrape-london-lab',
      'goodbody': 'scrape-goodbody',
    };

    const scraperFunction = scraperMap[providerId];
    if (!scraperFunction) {
      logger.warn(`No scraper available for provider: ${providerId}`);
      return [];
    }

    try {
      const { data, error } = await supabase.functions.invoke(scraperFunction, {
        body: { refresh: true },
      });

      if (error) {
        logger.error(`Scraper error for ${providerId}:`, error);
        return [];
      }

      if (data?.success && data?.tests) {
        // Transform scraped data to CompareTestData format
        return data.tests.map((test: any) => ({
          id: `${providerId}-${test.test_name.toLowerCase().replace(/\s+/g, '-')}`,
          category: test.category,
          name: test.test_name,
          provider: this.getProviderName(providerId),
          price: test.price,
          available: true,
          description: test.description,
          features: {
            turnaround: this.getTurnaroundTime(providerId),
            collection: this.getCollectionMethod(providerId),
            bioMarkers: '4+ biomarkers',
          },
          providerLogo: this.getProviderLogo(providerId),
        }));
      }

      return [];
    } catch (error) {
      logger.error(`Failed to invoke scraper for ${providerId}:`, error);
      return [];
    }
  }

  /**
   * Get data from database as fallback
   */
  private static async getDatabaseFallback(
    providerId: string,
    category?: string
  ): Promise<CompareTestData[]> {
    let query = supabase
      .from('provider_tests')
      .select('*')
      .eq('provider_id', providerId)
      .eq('is_active', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Database fallback error:', error);
      return [];
    }

    return (data || []).map((test: any) => ({
      id: test.id,
      category: test.category || 'General Health',
      name: test.test_name,
      provider: this.getProviderName(providerId),
      price: test.price || 0,
      available: test.is_active,
      description: test.description || '',
      features: {
        turnaround: this.getTurnaroundTime(providerId),
        collection: this.getCollectionMethod(providerId),
        bioMarkers: '4+ biomarkers',
      },
      providerLogo: this.getProviderLogo(providerId),
    }));
  }

  /**
   * Manually trigger a scrape for a provider
   */
  static async refreshProviderData(providerId: string): Promise<boolean> {
    try {
      const scraperMap: Record<string, string> = {
        'medichecks': 'scrape-medichecks',
        'london-medical-laboratory': 'scrape-london-lab',
        'goodbody': 'scrape-goodbody',
      };

      const scraperFunction = scraperMap[providerId];
      if (!scraperFunction) {
        return false;
      }

      const { data, error } = await supabase.functions.invoke(scraperFunction);
      
      if (error) {
        logger.error(`Refresh error for ${providerId}:`, error);
        return false;
      }

      // Clear cache for this provider
      this.cache.forEach((_, key) => {
        if (key.startsWith(providerId)) {
          this.cache.delete(key);
        }
      });

      return data?.success || false;
    } catch (error) {
      logger.error(`Failed to refresh provider data:`, error);
      return false;
    }
  }

  /**
   * Clear all cached data
   */
  static clearCache(): void {
    this.cache.clear();
  }

  // Helper methods
  private static getProviderName(providerId: string): string {
    const names: Record<string, string> = {
      'medichecks': 'Medichecks',
      'london-medical-laboratory': 'London Medical Laboratory',
      'goodbody': 'Goodbody Clinic',
    };
    return names[providerId] || providerId;
  }

  private static getTurnaroundTime(providerId: string): string {
    const times: Record<string, string> = {
      'medichecks': '1-3 days',
      'london-medical-laboratory': '24-72 hours',
      'goodbody': '24-48 hours',
    };
    return times[providerId] || '2-5 days';
  }

  private static getCollectionMethod(providerId: string): string {
    const methods: Record<string, string> = {
      'medichecks': 'Finger-prick or Venous',
      'london-medical-laboratory': 'Venous (clinic)',
      'goodbody': 'Venous (clinic)',
    };
    return methods[providerId] || 'Various methods';
  }

  private static getProviderLogo(providerId: string): string {
    const logos: Record<string, string> = {
      'medichecks': '/lovable-uploads/provider-medichecks-new-v3.png',
      'london-medical-laboratory': '/lovable-uploads/provider-london-medical.png',
      'goodbody': '/lovable-uploads/provider-goodbody-new-v3.png',
    };
    return logos[providerId] || '';
  }
}
