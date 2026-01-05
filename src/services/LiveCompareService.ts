import { supabase } from "@/integrations/supabase/client";

export interface LiveTestData {
  id: string;
  test_name: string;
  provider_id: string;
  category: string;
  price: number | null;
  description: string | null;
  is_active: boolean;
  image_url: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompareTestData {
  id: string;
  name: string;
  provider: string;
  price: number;
  category: string;
  description: string;
  features: {
    turnaround: string;
    collection: string;
    bioMarkers?: string;
  };
  providerLogo: string;
  available: boolean;
}

export class LiveCompareService {
  private static readonly PROVIDER_LOGOS: Record<string, string> = {
    'medichecks': '/lovable-uploads/provider-medichecks.png',
    'thriva': '/lovable-uploads/provider-thriva.png',
    'randox': '/lovable-uploads/provider-randox.png',
    'london-medical-laboratory': '/lovable-uploads/provider-london-medical.png',
    'lola-health': '/lovable-uploads/provider-lola-health.png',
    'goodbody-clinic': '/lovable-uploads/provider-goodbody.png',
    'tuli-health': '/lovable-uploads/provider-tuli-health.png'
  };

  private static readonly PROVIDER_NAMES: Record<string, string> = {
    'medichecks': 'Medichecks',
    'thriva': 'Thriva',
    'randox': 'Randox',
    'london-medical-laboratory': 'London Medical Laboratory',
    'lola-health': 'Lola Health',
    'goodbody-clinic': 'GoodBody Clinic',
    'tuli-health': 'Tuli Health'
  };

  static async getTestsByCategory(category: string, providers: string[] = ['all']): Promise<CompareTestData[]> {
    try {
      let query = supabase
        .from('provider_tests')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      // Filter by category if not 'all'
      if (category !== 'all') {
        query = query.ilike('category', `%${category}%`);
      }

      // Filter by specific providers if not 'all'
      if (!providers.includes('all')) {
        query = query.in('provider_id', providers);
      } else {
        // Only show our supported providers
        query = query.in('provider_id', Object.keys(this.PROVIDER_LOGOS));
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tests:', error);
        return [];
      }

      return this.transformToCompareData(data || []);
    } catch (error) {
      console.error('Error in getTestsByCategory:', error);
      return [];
    }
  }

  static async searchTests(searchTerm: string, providers: string[] = ['all']): Promise<CompareTestData[]> {
    try {
      let query = supabase
        .from('provider_tests')
        .select('*')
        .eq('is_active', true)
        .or(`test_name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%`)
        .order('price', { ascending: true });

      // Filter by specific providers if not 'all'
      if (!providers.includes('all')) {
        query = query.in('provider_id', providers);
      } else {
        // Only show our supported providers
        query = query.in('provider_id', Object.keys(this.PROVIDER_LOGOS));
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching tests:', error);
        return [];
      }

      return this.transformToCompareData(data || []);
    } catch (error) {
      console.error('Error in searchTests:', error);
      return [];
    }
  }

  static async getCategories(): Promise<Array<{ id: string; name: string; count: number }>> {
    try {
      const { data, error } = await supabase
        .from('provider_tests')
        .select('category')
        .eq('is_active', true)
        .in('provider_id', Object.keys(this.PROVIDER_LOGOS));

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      // Count tests per category
      const categoryMap = new Map<string, number>();
      data?.forEach(item => {
        if (item.category) {
          const count = categoryMap.get(item.category) || 0;
          categoryMap.set(item.category, count + 1);
        }
      });

      // Convert to array and sort by count
      return Array.from(categoryMap.entries())
        .map(([category, count]) => ({
          id: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: category,
          count
        }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  }

  private static transformToCompareData(tests: LiveTestData[]): CompareTestData[] {
    return tests.map(test => ({
      id: test.id,
      name: test.test_name,
      provider: this.PROVIDER_NAMES[test.provider_id] || test.provider_id,
      price: test.price || 0,
      category: test.category || 'General',
      description: test.description || '',
      features: {
        turnaround: this.estimateTurnaround(test.provider_id),
        collection: this.getCollectionMethod(test.provider_id),
        bioMarkers: this.extractBioMarkers(test.description || '')
      },
      providerLogo: this.PROVIDER_LOGOS[test.provider_id] || '/placeholder.svg',
      available: test.is_active
    }));
  }

  private static estimateTurnaround(providerId: string): string {
    const turnarounds: Record<string, string> = {
      'medichecks': '2-3 days',
      'thriva': '2-5 days',
      'randox': '3-5 days',
      'london-medical-laboratory': '1-3 days',
      'lola-health': '2-4 days',
      'goodbody-clinic': '2-3 days',
      'tuli-health': '3-5 days'
    };
    return turnarounds[providerId] || '3-5 days';
  }

  private static getCollectionMethod(providerId: string): string {
    const methods: Record<string, string> = {
      'medichecks': 'Home kit or clinic',
      'thriva': 'Home kit',
      'randox': 'Clinic visit',
      'london-medical-laboratory': 'Clinic visit',
      'lola-health': 'Home kit or clinic',
      'goodbody-clinic': 'Clinic visit',
      'tuli-health': 'Home kit'
    };
    return methods[providerId] || 'Home kit or clinic';
  }

  private static extractBioMarkers(description: string): string {
    // Simple extraction - in production, you might want more sophisticated parsing
    if (description.toLowerCase().includes('biomarker')) {
      return 'Multiple biomarkers';
    }
    if (description.toLowerCase().includes('hormone')) {
      return 'Hormone levels';
    }
    if (description.toLowerCase().includes('vitamin')) {
      return 'Vitamin levels';
    }
    return 'Various markers';
  }
}