import { supabase } from "@/integrations/supabase/client";
import { cacheService } from "./CacheService";
import { logger } from "@/lib/logger";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface ProviderTest {
  id: string;
  provider_id: string;
  test_name: string;
  category: string;
  price: number;
  description?: string;
  url?: string;
  biomarkers?: string[];
  turnaround_days?: number;
  sample_type?: string;
  is_active: boolean;
  scraped_at: string;
  version: string;
}

export interface ProviderApiResponse {
  data: ProviderTest[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_updated: string;
    version: string;
  };
}

export interface RequestQueueItem {
  key: string;
  promise: Promise<any>;
  timestamp: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface ThrottleConfig {
  maxConcurrent: number;
  minInterval: number;
}

// ============================================================================
// Provider Data Service
// Uses centralized CacheService for caching
// ============================================================================

export class ProviderDataService {
  private static requestQueue = new Map<string, RequestQueueItem>();
  private static activeRequests = 0;
  private static lastRequestTime = 0;
  
  private static readonly API_VERSION = "v1";
  
  private static readonly RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };
  
  private static readonly THROTTLE_CONFIG: ThrottleConfig = {
    maxConcurrent: 5,
    minInterval: 200, // 200ms between requests
  };

  // ============================================================================
  // Cache Key Generation (using CacheService)
  // ============================================================================

  private static getCacheKey(provider: string, category?: string, search?: string): string {
    return cacheService.generateKey('provider', { provider, category, search });
  }

  public static clearCache(): void {
    cacheService.clear();
    logger.info('ProviderDataService: Cache cleared');
  }

  public static clearCacheByPattern(pattern: string): void {
    const stats = cacheService.getStats();
    stats.keys.filter(key => key.includes(pattern)).forEach(key => {
      cacheService.delete(key);
    });
    logger.debug(`ProviderDataService: Cleared cache entries matching pattern: ${pattern}`);
  }

  // ============================================================================
  // Request Throttling
  // ============================================================================

  private static async throttle(): Promise<void> {
    // Wait if too many concurrent requests
    while (this.activeRequests >= this.THROTTLE_CONFIG.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Enforce minimum interval between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.THROTTLE_CONFIG.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.THROTTLE_CONFIG.minInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  // ============================================================================
  // Retry Logic with Exponential Backoff
  // ============================================================================

  private static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.RETRY_CONFIG.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.RETRY_CONFIG.maxRetries) {
          logger.error(`${context}: Max retries reached`, error);
          throw error;
        }
        
        const delay = Math.min(
          this.RETRY_CONFIG.baseDelay * Math.pow(this.RETRY_CONFIG.backoffMultiplier, attempt),
          this.RETRY_CONFIG.maxDelay
        );
        
        logger.warn(`${context}: Retry ${attempt + 1}/${this.RETRY_CONFIG.maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  // ============================================================================
  // Request Deduplication
  // ============================================================================

  private static async deduplicate<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const existing = this.requestQueue.get(key);
    if (existing) {
      logger.debug(`ProviderDataService: Deduplicating request for key: ${key}`);
      return existing.promise;
    }
    
    const promise = fn();
    this.requestQueue.set(key, {
      key,
      promise,
      timestamp: Date.now(),
    });
    
    try {
      const result = await promise;
      return result;
    } finally {
      this.requestQueue.delete(key);
    }
  }

  // ============================================================================
  // Core Data Fetching Methods
  // ============================================================================

  public static async getTestsByProvider(
    providerId: string,
    options: {
      category?: string;
      search?: string;
      forceRefresh?: boolean;
    } = {}
  ): Promise<ProviderTest[]> {
    const { category, search, forceRefresh = false } = options;
    const cacheKey = this.getCacheKey(providerId, category, search);
    
    // Check cache first using CacheService
    if (!forceRefresh) {
      const cached = cacheService.get<ProviderTest[]>(cacheKey);
      if (cached) return cached;
    }
    
    // Deduplicate concurrent requests
    return this.deduplicate(cacheKey, async () => {
      await this.throttle();
      this.activeRequests++;
      
      try {
        const result = await this.retryWithBackoff(
          async () => {
            let query = supabase
              .from('provider_tests')
              .select('*')
              .eq('provider_id', providerId)
              .eq('is_active', true)
              .order('test_name');
            
            if (category) {
              query = query.eq('category', category);
            }
            
            if (search) {
              query = query.or(`test_name.ilike.%${search}%,description.ilike.%${search}%`);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return (data || []).map(test => ({
              ...test,
              version: this.API_VERSION,
            }));
          },
          `getTestsByProvider(${providerId})`
        );
        
        // Cache using CacheService
        cacheService.set(cacheKey, result);
        return result;
      } finally {
        this.activeRequests--;
      }
    });
  }

  public static async getAllProvidersTests(
    options: {
      category?: string;
      search?: string;
      providers?: string[];
      forceRefresh?: boolean;
    } = {}
  ): Promise<ProviderTest[]> {
    const { category, search, providers, forceRefresh = false } = options;
    const cacheKey = this.getCacheKey('all', category, search);
    
    if (!forceRefresh) {
      const cached = cacheService.get<ProviderTest[]>(cacheKey);
      if (cached) return cached;
    }
    
    return this.deduplicate(cacheKey, async () => {
      await this.throttle();
      this.activeRequests++;
      
      try {
        const result = await this.retryWithBackoff(
          async () => {
            let query = supabase
              .from('provider_tests')
              .select('*')
              .eq('is_active', true)
              .order('provider_id')
              .order('test_name');
            
            if (providers && providers.length > 0) {
              query = query.in('provider_id', providers);
            }
            
            if (category) {
              query = query.eq('category', category);
            }
            
            if (search) {
              query = query.or(`test_name.ilike.%${search}%,description.ilike.%${search}%`);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return (data || []).map(test => ({
              ...test,
              version: this.API_VERSION,
            }));
          },
          'getAllProvidersTests'
        );
        
        cacheService.set(cacheKey, result);
        return result;
      } finally {
        this.activeRequests--;
      }
    });
  }

  public static async getProviderCategories(providerId: string): Promise<string[]> {
    const cacheKey = cacheService.generateKey('categories', { providerId });
    
    const cached = cacheService.get<string[]>(cacheKey);
    if (cached) return cached;
    
    return this.deduplicate(cacheKey, async () => {
      await this.throttle();
      this.activeRequests++;
      
      try {
        const result = await this.retryWithBackoff(
          async () => {
            const { data, error } = await supabase
              .from('provider_tests')
              .select('category')
              .eq('provider_id', providerId)
              .eq('is_active', true);
            
            if (error) throw error;
            
            const categories = [...new Set(data?.map(d => d.category).filter(Boolean))];
            return categories;
          },
          `getProviderCategories(${providerId})`
        );
        
        cacheService.set(cacheKey, result);
        return result;
      } finally {
        this.activeRequests--;
      }
    });
  }

  // ============================================================================
  // API Versioning Support
  // ============================================================================

  public static async getMigrationPath(fromVersion: string, toVersion: string): Promise<string[]> {
    // Define version migration paths
    const migrations: Record<string, string[]> = {
      'v0-v1': ['normalize_biomarkers', 'add_metadata'],
      'v1-v2': ['update_pricing_structure'],
    };
    
    const key = `${fromVersion}-${toVersion}`;
    return migrations[key] || [];
  }

  public static isVersionCompatible(dataVersion: string, requiredVersion: string = this.API_VERSION): boolean {
    const parseVersion = (v: string) => parseInt(v.replace('v', ''), 10);
    return parseVersion(dataVersion) >= parseVersion(requiredVersion);
  }

  // ============================================================================
  // Health Check & Monitoring
  // ============================================================================

  public static getCacheStats() {
    const serviceStats = cacheService.getStats();
    return {
      size: serviceStats.size,
      activeRequests: this.activeRequests,
      queuedRequests: this.requestQueue.size,
      cacheKeys: serviceStats.keys.filter(k => k.includes('provider')),
    };
  }

  public static async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'down'; latency: number }> {
    const start = Date.now();
    
    try {
      const { error } = await supabase
        .from('provider_tests')
        .select('id')
        .limit(1);
      
      const latency = Date.now() - start;
      
      if (error) {
        return { status: 'down', latency };
      }
      
      return {
        status: latency < 1000 ? 'healthy' : 'degraded',
        latency,
      };
    } catch {
      return { status: 'down', latency: Date.now() - start };
    }
  }
}