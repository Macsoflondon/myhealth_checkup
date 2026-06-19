import { supabase } from "@/integrations/supabase/client";
import { getSupportedProviderIds } from "@/constants/providers";
import {
  getCategorySearchTerms,
  getCanonicalCategoriesForSlug,
} from "@/constants/categories";

const COMPARE_SELECT =
  "id, test_name, provider_id, category, canonical_category, price, description, is_active, image_url, url, biomarkers_list, biomarker_count, created_at, updated_at";

const DEFAULT_LIMIT = 600;

/**
 * Query builder for test-related database queries
 */
export class TestQueryBuilder {
  /**
   * Build query for tests by category. Prefers exact canonical_category
   * matching (so toolbar chips map to the actual DB values, including
   * legacy slugs like 'heart' / 'sports-performance'); falls back to
   * ilike on category / test_name / description.
   */
  static buildCategoryQuery(category: string, providers: string[] = ['all']) {
    let query = supabase
      .from('provider_tests')
      .select(COMPARE_SELECT)
      .eq('is_active', true)
      .order('price', { ascending: true })
      .limit(DEFAULT_LIMIT);

    if (category && category !== 'all') {
      const canonicals = getCanonicalCategoriesForSlug(category);
      if (canonicals && canonicals.length > 0) {
        query = query.in('canonical_category', canonicals);
      } else {
        const categorySearchTerms = getCategorySearchTerms(category);
        const orConditions = [
          `category.ilike.%${category}%`,
          `canonical_category.ilike.%${category}%`,
          `test_name.ilike.%${category}%`,
          ...categorySearchTerms.map(term => `test_name.ilike.%${term}%`),
          ...categorySearchTerms.map(term => `description.ilike.%${term}%`),
        ].join(',');
        query = query.or(orConditions);
      }
    }

    if (!providers.includes('all')) {
      query = query.in('provider_id', providers);
    } else {
      query = query.in('provider_id', getSupportedProviderIds());
    }

    return query;
  }

  /**
   * Build search query for tests. Scopes to the active category (if any)
   * and searches across name, description, category, canonical_category,
   * and biomarkers_list.
   */
  static buildSearchQuery(
    searchTerm: string,
    providers: string[] = ['all'],
    category?: string,
  ) {
    if (!searchTerm.trim()) {
      throw new Error('Search term cannot be empty');
    }

    const safeTerm = searchTerm.replace(/[(),]/g, ' ').trim();

    let query = supabase
      .from('provider_tests')
      .select(COMPARE_SELECT)
      .eq('is_active', true)
      .or(
        [
          `test_name.ilike.%${safeTerm}%`,
          `description.ilike.%${safeTerm}%`,
          `category.ilike.%${safeTerm}%`,
          `canonical_category.ilike.%${safeTerm}%`,
        ].join(',')
      )
      .order('price', { ascending: true })
      .limit(DEFAULT_LIMIT);

    if (category && category !== 'all') {
      const canonicals = getCanonicalCategoriesForSlug(category);
      if (canonicals && canonicals.length > 0) {
        query = query.in('canonical_category', canonicals);
      }
    }

    if (!providers.includes('all')) {
      query = query.in('provider_id', providers);
    } else {
      query = query.in('provider_id', getSupportedProviderIds());
    }

    return query;
  }

  /**
   * Build query for categories
   */
  static buildCategoriesQuery() {
    return supabase
      .from('provider_tests')
      .select('category, canonical_category')
      .eq('is_active', true)
      .in('provider_id', getSupportedProviderIds());
  }
}
