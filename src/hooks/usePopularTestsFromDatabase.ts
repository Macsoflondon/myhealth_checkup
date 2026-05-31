import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const WEBSITE_ENRICHMENT_PROVIDERS = new Set([
  'lola-health',
  'london-medical-laboratory',
]);

const WEBSITE_ENRICHMENT_BATCH_SIZE = 12;

const PROVIDER_BASE_URLS: Record<string, string> = {
  'lola-health': 'https://lolahealth.com',
  'london-medical-laboratory': 'https://www.londonmedicallaboratory.com',
};

const hasAbsoluteImageUrl = (url?: string | null) => !!url && /^https?:\/\//i.test(url);

const hasMeaningfulPrice = (value?: number | null) => Number.isFinite(value) && Number(value) > 0;

const extractPriceFromText = (value?: string | null) => {
  if (!value) return null;
  const match = value.match(/£\s?(\d+(?:\.\d{1,2})?)/i);
  return match ? Number.parseFloat(match[1]) : null;
};

const normalizeProviderAssetUrl = (
  url: string | null | undefined,
  providerId: string,
  pageUrl?: string | null,
) => {
  if (!url) return null;
  if (hasAbsoluteImageUrl(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (!url.startsWith('/')) return null;

  const baseUrl = pageUrl ?? PROVIDER_BASE_URLS[providerId];
  if (!baseUrl) return null;

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return null;
  }
};

function normalizeTestRecord(test: PopularTest): PopularTest {
  const normalizedImage = normalizeProviderAssetUrl(test.image_url, test.provider_id, test.url);
  const descriptionPrice = extractPriceFromText(test.description);
  const fallbackPrice = hasMeaningfulPrice(test.price)
    ? test.price
    : hasMeaningfulPrice(test.base_price)
      ? test.base_price
      : descriptionPrice;

  return {
    ...test,
    image_url: normalizedImage ?? test.image_url,
    price: fallbackPrice ?? test.price,
    base_price:
      hasMeaningfulPrice(test.base_price) || test.provider_id !== 'lola-health'
        ? test.base_price
        : fallbackPrice ?? test.base_price,
  };
}

async function enrichTestsFromWebsite(tests: PopularTest[]): Promise<PopularTest[]> {
  const items = tests
    .filter(
      (test) =>
        WEBSITE_ENRICHMENT_PROVIDERS.has(test.provider_id) &&
        !!test.url &&
        (!hasAbsoluteImageUrl(test.image_url) || !test.description?.trim())
    )
    .map((test) => ({
      id: test.id,
      provider_id: test.provider_id,
      url: test.url,
      test_name: test.test_name,
    }));

  if (items.length === 0) return tests.map(normalizeTestRecord);

  const batches = Array.from(
    { length: Math.ceil(items.length / WEBSITE_ENRICHMENT_BATCH_SIZE) },
    (_, index) => items.slice(index * WEBSITE_ENRICHMENT_BATCH_SIZE, (index + 1) * WEBSITE_ENRICHMENT_BATCH_SIZE)
  );

  const responses = await Promise.all(
    batches.map(async (batch) => {
      const { data, error } = await supabase.functions.invoke('popular-test-website-data', {
        body: { items: batch },
      });

      if (error || !data?.items || !Array.isArray(data.items)) {
        console.warn('Popular test website enrichment failed:', error?.message || 'No enrichment data');
        return [];
      }

      return data.items as Array<{
        id?: string;
        title?: string;
        description?: string;
        image_url?: string;
        price?: number | null;
      }>;
    })
  );

  const enrichmentById = new Map<string, { title?: string; description?: string; image_url?: string; price?: number | null }>();

  for (const item of responses.flat()) {
    if (!item?.id) continue;
    enrichmentById.set(item.id, {
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      price: item.price,
    });
  }

  return tests.map((test) => {
    const enrichment = enrichmentById.get(test.id);
    const normalizedCurrentImage = normalizeProviderAssetUrl(test.image_url, test.provider_id, test.url);

    if (!enrichment) return normalizeTestRecord(test);

    const enrichedPrice = hasMeaningfulPrice(enrichment.price) ? Number(enrichment.price) : null;
    const nextPrice = hasMeaningfulPrice(test.price) ? test.price : enrichedPrice ?? test.price;
    const nextBasePrice = hasMeaningfulPrice(test.base_price)
      ? test.base_price
      : test.provider_id === 'lola-health'
        ? enrichedPrice ?? extractPriceFromText(enrichment.description) ?? test.base_price
        : test.base_price;

    return normalizeTestRecord({
      ...test,
      test_name: enrichment.title?.trim() || test.test_name,
      description: enrichment.description?.trim() || test.description,
      image_url: normalizeProviderAssetUrl(enrichment.image_url, test.provider_id, test.url) ?? normalizedCurrentImage ?? test.image_url,
      price: nextPrice,
      base_price: nextBasePrice,
    });
  });
}

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
  description?: string;
  image_url?: string;
  turnaround_days_text?: string;
  base_price?: number;
  collection_options?: Array<{ method: string; price_modifier: number; note?: string }>;
  is_popular?: boolean;
}

const providerDisplayNames: Record<string, string> = {
  'goodbody-clinic': 'GOODBODY',
  'medichecks': 'Medichecks',
  'lola-health': 'Lola Health',
  'thriva': 'Thriva',
  'randox': 'Randox Health',
  'london-medical-laboratory': 'London Medical Laboratory'
};

/** Extract clean biomarker names from the biomarkers_list JSON field */
function parseMarkers(raw: unknown): string[] {
  if (!raw || !Array.isArray(raw)) return [];
  // Filter to clean, short biomarker names (skip descriptions, headers, noise)
  return (raw as string[])
    .filter((m) => typeof m === 'string' && m.length > 1 && m.length < 50)
    .filter((m) => !/^\d+\s*Biomarkers/i.test(m))
    .filter((m) => !/cholesterol levels|ensure that|dedicated home/i.test(m))
    .slice(0, 8);
}

/**
 * Fetches the most popular tests from all providers
 * Prioritizes tests marked as is_popular=true, ordered by popularity_rank
 * Falls back to price-based ordering if no popular tests are marked yet
 */
export const usePopularTestsFromDatabase = (limit: number = 10) => {
  return useQuery({
    queryKey: ['popular-tests-database', limit],
    queryFn: async (): Promise<PopularTest[]> => {
      // Pull a wide pool of valid provider rows: must have a URL.
      // Prioritise is_popular + popularity_rank, then backfill with everything else.
      const { data: popularData, error: popularError } = await supabase
        .from('provider_tests')
        .select('id, test_name, provider_id, price, category, sample_type, url, biomarker_count, popularity_rank, biomarkers_list, description, image_url, turnaround_days_text, base_price, collection_options, is_popular')
        .eq('is_active', true)
        .not('price', 'is', null)
        .not('url', 'is', null)
        .order('is_popular', { ascending: false, nullsFirst: false })
        .order('popularity_rank', { ascending: true, nullsFirst: false })
        .limit(limit);

      if (!popularError && popularData && popularData.length > 0) {
        const mappedTests = popularData.map(test => ({
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
          popularity_rank: test.popularity_rank || undefined,
          markers: parseMarkers(test.biomarkers_list),
          description: test.description || undefined,
          image_url: (test as any).image_url || undefined,
          turnaround_days_text: (test as any).turnaround_days_text || undefined,
          base_price: (test as any).base_price ?? undefined,
          collection_options: (test as any).collection_options || undefined,
          is_popular: (test as any).is_popular ?? undefined,
        }));

        return enrichTestsFromWebsite(mappedTests);
      }

      // Fallback: Get diverse tests from all providers based on price
      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, provider_id, price, category, sample_type, url, biomarker_count, biomarkers_list, description')
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
            url: test.url || '',
            markers: parseMarkers(test.biomarkers_list),
            description: test.description || undefined,
          });
        }
      }

      return enrichTestsFromWebsite(diverseTests);
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
