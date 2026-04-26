import { CACHE_CONFIG } from "@/constants/config";
import { logger } from "@/lib/logger";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Generic cache service for managing in-memory data caching
 */
export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheEntry<any>>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Generate a cache key from method name and parameters
   */
  public generateKey(method: string, params: any): string {
    return `${method}_${JSON.stringify(params)}`;
  }

  /**
   * Get cached data if valid, otherwise return null
   */
  public get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp < CACHE_CONFIG.DURATION) {
      logger.debug(`Cache hit for key: ${key}`);
      return cached.data as T;
    }

    // Cache expired
    this.cache.delete(key);
    logger.debug(`Cache expired for key: ${key}`);
    return null;
  }

  /**
   * Set data in cache with current timestamp
   */
  public set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    logger.debug(`Cache set for key: ${key}`);
  }

  /**
   * Check if a key exists and is valid in cache
   */
  public has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    if (Date.now() - cached.timestamp < CACHE_CONFIG.DURATION) {
      return true;
    }
    
    this.cache.delete(key);
    return false;
  }

  /**
   * Clear a specific cache entry
   */
  public delete(key: string): void {
    this.cache.delete(key);
    logger.debug(`Cache cleared for key: ${key}`);
  }

  /**
   * Clear all cache entries
   */
  public clear(): void {
    this.cache.clear();
    logger.info('All cache cleared');
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clear expired entries
   */
  public clearExpired(): void {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= CACHE_CONFIG.DURATION) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      logger.info(`Cleared ${cleared} expired cache entries`);
    }
  }
}

export const cacheService = CacheService.getInstance();
