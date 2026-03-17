import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PopularTest {
  id: string;
  test_name: string;
  provider_id: string;
  provider_name: string;
  price: number;
  biomarker_count: number;
  category: string;
  turnaround_time: string;
  sample_type: string;
  url: string;
  popularity_rank?: number;
  markers?: string[];
}

const providerDisplayNames: Record<string, string> = {
  'goodbody-clinic': 'Goodbody Clinic',
  'medichecks': 'Medichecks',
  'lola-health': 'Lola Health',
  'thriva': 'Thriva',
  'randox': 'Randox Health',
  'london-medical-laboratory': 'London Medical Laboratory'
};

/**
 * Fetches the most popular tests from all providers
 * Prioritizes tests marked as is_popular=true, ordered by popularity_rank
 * Falls back to price-based ordering if no popular tests are marked yet
 */
export const usePopularTestsFromDatabase = (limit: number = 10) => {
  return useQuery({
    queryKey: ['popular-tests-database', limit],
    queryFn: async (): Promise<PopularTest[]> => {
      // Get tests marked as popular, ordered by popularity_rank
      const { data: popularData, error: popularError } = await supabase
        .from('provider_tests')
        .select('id, test_name, provider_id, price, category, sample_type, url, biomarker_count, popularity_rank')
        .eq('is_active', true)
        .eq('is_popular', true)
        .not('price', 'is', null)
        .order('popularity_rank', { ascending: true, nullsFirst: false })
        .limit(limit);

      if (!popularError && popularData && popularData.length > 0) {
        // Return popular tests in database order (already mixed by popularity_rank)
        return popularData.map(test => ({
          id: test.id,
          test_name: test.test_name,
          provider_id: test.provider_id,
          provider_name: providerDisplayNames[test.provider_id] || test.provider_id,
          price: test.price || 0,
          biomarker_count: test.biomarker_count || 0,
          category: test.category || 'General Health',
          turnaround_time: 'Results in 2-4 days',
          sample_type: test.sample_type || 'Blood sample',
          url: test.url || '',
          popularity_rank: test.popularity_rank || undefined
        }));
      }

      // Fallback: Get diverse tests from all providers based on price
      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, provider_id, price, category, sample_type, url, biomarker_count')
        .eq('is_active', true)
        .not('price', 'is', null)
        .order('price', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching popular tests:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Ensure variety across providers - max 2 tests per provider
      const providerCounts: Record<string, number> = {};
      const diverseTests: PopularTest[] = [];

      for (const test of data) {
        const providerId = test.provider_id;
        const currentCount = providerCounts[providerId] || 0;
        
        if (currentCount < 2 && diverseTests.length < limit) {
          providerCounts[providerId] = currentCount + 1;
          diverseTests.push({
            id: test.id,
            test_name: test.test_name,
            provider_id: test.provider_id,
            provider_name: providerDisplayNames[providerId] || providerId,
            price: test.price || 0,
            biomarker_count: test.biomarker_count || 0,
            category: test.category || 'General Health',
            turnaround_time: 'Results in 2-4 days',
            sample_type: test.sample_type || 'Blood sample',
            url: test.url || ''
          });
        }
      }

      return diverseTests;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

/**
 * Get popular tests for navigation menu dropdown
 * Prioritizes tests marked as is_popular=true
 */
export const usePopularTestsForNavigation = () => {
  return useQuery({
    queryKey: ['popular-tests-navigation'],
    queryFn: async (): Promise<PopularTest[]> => {
      // First try to get tests marked as popular
      const { data: popularData, error: popularError } = await supabase
        .from('provider_tests')
        .select('id, test_name, provider_id, price, category, sample_type, url, biomarker_count, popularity_rank')
        .eq('is_active', true)
        .eq('is_popular', true)
        .not('price', 'is', null)
        .order('popularity_rank', { ascending: true, nullsFirst: false })
        .limit(8);

      if (!popularError && popularData && popularData.length >= 4) {
        return popularData.map(test => ({
          id: test.id,
          test_name: test.test_name,
          provider_id: test.provider_id,
          provider_name: providerDisplayNames[test.provider_id] || test.provider_id,
          price: test.price || 0,
          biomarker_count: test.biomarker_count || 0,
          category: test.category || 'General Health',
          turnaround_time: 'Results in 2-4 days',
          sample_type: test.sample_type || 'Blood sample',
          url: test.url || '',
          popularity_rank: test.popularity_rank || undefined
        }));
      }

      // Fallback: Get diverse tests from all providers
      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, provider_id, price, category, sample_type, url, biomarker_count')
        .eq('is_active', true)
        .not('price', 'is', null)
        .order('price', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching popular tests for navigation:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Ensure variety - max 2 per provider, return top 8
      const providerCounts: Record<string, number> = {};
      const diverseTests: PopularTest[] = [];

      for (const test of data) {
        const providerId = test.provider_id;
        const currentCount = providerCounts[providerId] || 0;
        
        if (currentCount < 2 && diverseTests.length < 8) {
          providerCounts[providerId] = currentCount + 1;
          diverseTests.push({
            id: test.id,
            test_name: test.test_name,
            provider_id: test.provider_id,
            provider_name: providerDisplayNames[test.provider_id] || test.provider_id,
            price: test.price || 0,
            biomarker_count: test.biomarker_count || 0,
            category: test.category || 'General Health',
            turnaround_time: 'Results in 2-4 days',
            sample_type: test.sample_type || 'Blood sample',
            url: test.url || ''
          });
        }
      }

      return diverseTests;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};
