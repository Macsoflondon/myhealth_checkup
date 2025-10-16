import { providersApi } from "@/api";

/**
 * Unified Provider Service
 * Consolidates provider data fetching and management
 */

export interface ProviderInfo {
  id: string;
  name: string;
  logo: string;
  description?: string;
  accreditations?: string[];
}

class ProviderService {
  // Provider metadata
  private readonly PROVIDERS: Record<string, ProviderInfo> = {
    goodbody: {
      id: "goodbody",
      name: "Goodbody Clinic",
      logo: "/lovable-uploads/provider-goodbody-new.png",
      description: "Premium health screening services",
      accreditations: ["CQC", "UKAS"],
    },
    medichecks: {
      id: "medichecks",
      name: "Medichecks",
      logo: "/lovable-uploads/provider-medichecks-new.png",
      description: "UK's leading blood testing service",
      accreditations: ["UKAS", "ISO 15189"],
    },
    "lola-health": {
      id: "lola-health",
      name: "Lola Health",
      logo: "/lovable-uploads/provider-lola-health.png",
      description: "Digital health testing platform",
      accreditations: ["UKAS"],
    },
    thriva: {
      id: "thriva",
      name: "Thriva",
      logo: "/lovable-uploads/provider-thriva.png",
      description: "Personalised health insights",
      accreditations: ["UKAS"],
    },
    "tuli-health": {
      id: "tuli-health",
      name: "Tuli Health",
      logo: "/lovable-uploads/provider-tuli-health.png",
      description: "Comprehensive health assessments",
      accreditations: ["CQC"],
    },
    "london-medical": {
      id: "london-medical",
      name: "London Medical Laboratory",
      logo: "/lovable-uploads/provider-london-medical.png",
      description: "Certified laboratory services",
      accreditations: ["UKAS", "ISO 15189"],
    },
    randox: {
      id: "randox",
      name: "Randox Health",
      logo: "/lovable-uploads/provider-randox.png",
      description: "Advanced health screening",
      accreditations: ["UKAS", "ISO 15189"],
    },
  };

  /**
   * Get provider information
   */
  getProviderInfo(providerId: string): ProviderInfo | null {
    return this.PROVIDERS[providerId] || null;
  }

  /**
   * Get all supported providers
   */
  getAllProviders(): ProviderInfo[] {
    return Object.values(this.PROVIDERS);
  }

  /**
   * Get provider logo URL
   */
  getProviderLogo(providerId: string): string {
    return this.PROVIDERS[providerId]?.logo || "/placeholder.svg";
  }

  /**
   * Get provider display name
   */
  getProviderName(providerId: string): string {
    return this.PROVIDERS[providerId]?.name || providerId;
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
    const turnaroundMap: Record<string, string> = {
      goodbody: "24-48 hours",
      medichecks: "1-3 days",
      "lola-health": "2-4 days",
      thriva: "2-5 days",
      "tuli-health": "3-5 days",
      "london-medical": "24-72 hours",
      randox: "2-4 days",
    };

    return turnaroundMap[providerId] || "3-5 days";
  }

  /**
   * Get collection method based on provider
   */
  getCollectionMethod(providerId: string): string {
    const methodMap: Record<string, string> = {
      goodbody: "Venous (clinic)",
      medichecks: "Finger-prick or Venous",
      "lola-health": "Finger-prick (home)",
      thriva: "Finger-prick (home)",
      "tuli-health": "Venous (clinic)",
      "london-medical": "Venous (clinic)",
      randox: "Venous (clinic)",
    };

    return methodMap[providerId] || "Varies";
  }
}

export const providerService = new ProviderService();
