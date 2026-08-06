/**
 * Live count of active tests in the catalogue.
 * Used for public-facing claims so the figure is never stale.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Last verified catalogue size, used until the live count resolves. */
export const ACTIVE_TEST_COUNT_FALLBACK = 730;

export const activeTestCountQueryKey = ['catalogue', 'active-test-count'] as const;

export function useActiveTestCount(): number {
  const { data } = useQuery({
    queryKey: activeTestCountQueryKey,
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('provider_tests')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true);

      if (error) {
        logger.error('Error fetching active test count:', error);
        return ACTIVE_TEST_COUNT_FALLBACK;
      }
      return count && count > 0 ? count : ACTIVE_TEST_COUNT_FALLBACK;
    },
    staleTime: 60 * 60 * 1000,
  });

  return data ?? ACTIVE_TEST_COUNT_FALLBACK;
}
