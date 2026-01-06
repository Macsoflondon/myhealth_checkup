/**
 * Service for abstracting localStorage operations for user preferences
 * Provides a single source of truth for user-specific local storage
 */

import { logger } from "@/lib/logger";

export class UserPreferencesService {
  private static readonly PREFIX = 'myhealthcheckup';

  // Storage key generators
  static keys = {
    favoriteOrder: (userId: string) => `${this.PREFIX}-favorite-order-${userId}`,
    orderSort: (userId: string) => `${this.PREFIX}-order-sort-${userId}`,
    savedFilters: (userId: string) => `${this.PREFIX}-saved-filters-${userId}`,
    recentSearches: (userId: string) => `${this.PREFIX}-recent-searches-${userId}`,
    compareSelection: (userId: string) => `${this.PREFIX}-compare-selection-${userId}`,
    theme: () => `${this.PREFIX}-theme`,
    cookieConsent: () => `${this.PREFIX}-cookie-consent`,
  };

  // Generic get/set methods with type safety
  static get<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return defaultValue;
      return JSON.parse(stored) as T;
    } catch (error) {
      logger.warn(`Failed to parse localStorage key: ${key}`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.error(`Failed to set localStorage key: ${key}`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.warn(`Failed to remove localStorage key: ${key}`, error);
    }
  }

  // Favorite order operations
  static getFavoriteOrder(userId: string): string[] {
    return this.get(this.keys.favoriteOrder(userId), []);
  }

  static setFavoriteOrder(userId: string, orderIds: string[]): void {
    this.set(this.keys.favoriteOrder(userId), orderIds);
  }

  // Order sort operations
  static getOrderSort(userId: string): string[] {
    return this.get(this.keys.orderSort(userId), []);
  }

  static setOrderSort(userId: string, orderIds: string[]): void {
    this.set(this.keys.orderSort(userId), orderIds);
  }

  // Saved filters operations
  static getSavedFilters(userId: string): Record<string, any> {
    return this.get(this.keys.savedFilters(userId), {});
  }

  static setSavedFilters(userId: string, filters: Record<string, any>): void {
    this.set(this.keys.savedFilters(userId), filters);
  }

  // Recent searches
  static getRecentSearches(userId: string): string[] {
    return this.get(this.keys.recentSearches(userId), []);
  }

  static addRecentSearch(userId: string, search: string, maxItems = 10): void {
    const searches = this.getRecentSearches(userId);
    const filtered = searches.filter(s => s !== search);
    const updated = [search, ...filtered].slice(0, maxItems);
    this.set(this.keys.recentSearches(userId), updated);
  }

  // Theme operations (not user-specific)
  static getTheme(): 'light' | 'dark' | 'system' {
    return this.get(this.keys.theme(), 'system');
  }

  static setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.set(this.keys.theme(), theme);
  }

  // Cookie consent (not user-specific)
  static getCookieConsent(): boolean {
    return this.get(this.keys.cookieConsent(), false);
  }

  static setCookieConsent(consent: boolean): void {
    this.set(this.keys.cookieConsent(), consent);
  }

  // Clear all user-specific data
  static clearUserData(userId: string): void {
    Object.values(this.keys).forEach(keyFn => {
      if (typeof keyFn === 'function') {
        try {
          const key = keyFn(userId);
          if (key.includes(userId)) {
            this.remove(key);
          }
        } catch {
          // Skip non-user-specific keys
        }
      }
    });
  }
}

export const userPreferencesService = new UserPreferencesService();
