import { supabase } from "@/integrations/supabase/client";
import { getSupportedProviderIds } from "@/constants/providers";
import { getCategorySearchTerms } from "@/constants/categories";

/**
 * Query builder for test-related database queries
 */
export class TestQueryBuilder {
  /**
   * Build query for tests by category
   */
  static buildCategoryQuery(category: string, providers: string[] = ['all']) {
    let query = supabase
      .from('provider_tests')
      .select('id, test_name, provider_id, category, price, description, is_active, image_url, url, created_at, updated_at')
      .eq('is_active', true)
      .order('price', { ascending: true })
      .limit(50);

    // Apply category filter
    if (category !== 'all') {
      const categorySearchTerms = getCategorySearchTerms(category);
      const orConditions = [
        `category.ilike.%${category}%`,
        `test_name.ilike.%${category}%`,
        ...categorySearchTerms.map(term => `test_name.ilike.%${term}%`),
        ...categorySearchTerms.map(term => `description.ilike.%${term}%`)
      ].join(',');
      
      query = query.or(orConditions);
    }

    // Apply provider filter
    if (!providers.includes('all')) {
      query = query.in('provider_id', providers);
    } else {
      query = query.in('provider_id', getSupportedProviderIds());
    }

    return query;
  }

  /**
   * Build search query for tests
   */
  static buildSearchQuery(searchTerm: string, providers: string[] = ['all']) {
    if (!searchTerm.trim()) {
      throw new Error('Search term cannot be empty');
    }

    let query = supabase
      .from('provider_tests')
      .select('id, test_name, provider_id, category, price, description, is_active, image_url, url, created_at, updated_at')
      .eq('is_active', true)
      .or(`test_name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%, category.ilike.%${searchTerm}%`)
      .order('price', { ascending: true })
      .limit(50);

    // Apply provider filter
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
      .select('category')
      .eq('is_active', true)
      .in('provider_id', getSupportedProviderIds());
  }
}
