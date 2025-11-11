import { providersApi } from "@/api";
import { PROVIDER_DETAILS, PROVIDER_TURNAROUND_TIMES, PROVIDER_COLLECTION_METHODS, getProviderLogo, getProviderName, getAllProviders } from "@/constants/providers";
import type { Provider } from "@/types";

class ProviderService {
  /**
   * Get provider information
   */
  getProviderInfo(providerId: string): Provider | null {
    return PROVIDER_DETAILS[providerId] || null;
  }

  /**
   * Get all supported providers
   */
  getAllProviders(): Provider[] {
    return getAllProviders();
  }

  /**
   * Get provider logo URL
   */
  getProviderLogo(providerId: string): string {
    return getProviderLogo(providerId);
  }

  /**
   * Get provider display name
   */
  getProviderName(providerId: string): string {
    return getProviderName(providerId);
  }

  /**
   * Get provider tests from API
   */
  async getProviderTests(providerId?: string) {
    return await providersApi.getProviderTests(providerId);
  }

  /**
   * Get price updates
   */
  async getPriceUpdates(testIds?: string[], provider?: string) {
    return await providersApi.getPriceUpdates(testIds, provider);
  }

  /**
   * Get latest price for a test
   */
  async getLatestPrice(testId: string, provider: string) {
    return await providersApi.getLatestPrice(testId, provider);
  }

  /**
   * Get active categories
   */
  async getCategories() {
    return await providersApi.getCategories();
  }

  /**
   * Check if real-time updates are enabled for a category
   */
  async isCategoryRealtimeEnabled(category: string) {
    return await providersApi.isCategoryRealtimeEnabled(category);
  }

  /**
   * Estimate turnaround time based on provider
   */
  estimateTurnaround(providerId: string): string {
    return PROVIDER_TURNAROUND_TIMES[providerId] || '3-5 days';
  }

  /**
   * Get collection method based on provider
   */
  getCollectionMethod(providerId: string): string {
    return PROVIDER_COLLECTION_METHODS[providerId] || 'Varies';
  }
}

export const providerService = new ProviderService();
