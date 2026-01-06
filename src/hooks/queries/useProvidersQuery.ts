/**
 * React Query hooks for Providers API
 */

import { useQuery } from "@tanstack/react-query";
import { providersApi, type ProviderTestData } from "@/api";
import { logger } from "@/lib/logger";

export const providersQueryKeys = {
  all: ['providers'] as const,
  tests: (providerId: string) => ['providers', providerId, 'tests'] as const,
  catalog: (providerId: string) => ['providers', providerId, 'catalog'] as const,
};

export function useProviderTestsQuery(providerId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: providersQueryKeys.tests(providerId),
    queryFn: async () => {
      const { data, error } = await providersApi.getProviderTests(providerId);
      if (error) {
        logger.error(`Error fetching tests for provider ${providerId}:`, error);
        throw error;
      }
      return data || [];
    },
    enabled: options?.enabled !== false && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProviderCatalogQuery(
  providerId: string, 
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: providersQueryKeys.catalog(providerId),
    queryFn: async () => {
      const { data, error } = await providersApi.getProviderCatalog(providerId);
      if (error) {
        logger.error(`Error fetching catalog for provider ${providerId}:`, error);
        throw error;
      }
      return data || [];
    },
    enabled: options?.enabled !== false && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
