/**
 * React Query hooks for Tests API
 */

import { useQuery } from "@tanstack/react-query";
import { testsApi, type Test } from "@/api";
import { logger } from "@/lib/logger";

export const testsQueryKeys = {
  all: ['tests'] as const,
  active: () => ['tests', 'active'] as const,
  byCategory: (category: string) => ['tests', 'category', category] as const,
  search: (query: string) => ['tests', 'search', query] as const,
  popular: (limit: number) => ['tests', 'popular', limit] as const,
};

export function useActiveTestsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: testsQueryKeys.active(),
    queryFn: async () => {
      const { data, error } = await testsApi.getActiveTests();
      if (error) {
        logger.error('Error fetching active tests:', error);
        throw error;
      }
      return data || [];
    },
    enabled: options?.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useTestsByCategoryQuery(category: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: testsQueryKeys.byCategory(category),
    queryFn: async () => {
      const { data, error } = await testsApi.getTestsByCategory(category);
      if (error) {
        logger.error(`Error fetching tests for category ${category}:`, error);
        throw error;
      }
      return data || [];
    },
    enabled: options?.enabled !== false && !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchTestsQuery(query: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: testsQueryKeys.search(query),
    queryFn: async () => {
      const { data, error } = await testsApi.searchTests(query);
      if (error) {
        logger.error(`Error searching tests for "${query}":`, error);
        throw error;
      }
      return data || [];
    },
    enabled: options?.enabled !== false && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePopularTestsQuery(limit: number = 10, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: testsQueryKeys.popular(limit),
    queryFn: async () => {
      const { data, error } = await testsApi.getPopularTests(limit);
      if (error) {
        logger.error('Error fetching popular tests:', error);
        throw error;
      }
      return data || [];
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
