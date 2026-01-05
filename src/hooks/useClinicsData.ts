/**
 * Hook for fetching and managing clinics data
 * Now uses React Query for caching and automatic refetching
 */

import { useClinicsQuery } from './queries/useClinicsQuery';

export function useClinicsData() {
  const { data: clinics = [], isLoading: loading, error: queryError, refetch } = useClinicsQuery();
  
  const error = queryError ? 'Failed to load clinics. Please try again.' : null;

  return {
    clinics,
    loading,
    error,
    refetch,
  };
}
