import { supabase } from "@/integrations/supabase/client";

export interface TestData {
  id: string;
  test_name: string;
  category: string | null;
  description: string | null;
  url: string | null;
  price: number | null;
  provider_test_id: string | null;
  biomarkers_list: string[] | null;
  biomarker_count: number | null;
}

/**
 * Generates a URL-friendly slug from a test name
 */
export function generateTestSlug(testName: string): string {
  return testName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * Finds a test by provider_test_id, UUID id, or slug generated from test_name
 */
export async function findTestByIdOrSlug(
  providerId: string, 
  testId: string
): Promise<TestData | null> {
  // First try exact match on provider_test_id
  const { data: exactMatch } = await supabase
    .from('provider_tests')
    .select('id, test_name, category, description, url, price, provider_test_id, biomarkers_list, biomarker_count')
    .eq('provider_id', providerId)
    .eq('provider_test_id', testId)
    .eq('is_active', true)
    .single();

  if (exactMatch) {
    return parseTestData(exactMatch);
  }

  // Try UUID match on id field
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(testId)) {
    const { data: uuidMatch } = await supabase
      .from('provider_tests')
      .select('id, test_name, category, description, url, price, provider_test_id, biomarkers_list, biomarker_count')
      .eq('provider_id', providerId)
      .eq('id', testId)
      .eq('is_active', true)
      .single();

    if (uuidMatch) {
      return parseTestData(uuidMatch);
    }
  }

  // Fallback: match by slug generated from test_name
  const { data: allTests } = await supabase
    .from('provider_tests')
    .select('id, test_name, category, description, url, price, provider_test_id, biomarkers_list, biomarker_count')
    .eq('provider_id', providerId)
    .eq('is_active', true);

  if (allTests) {
    const slugMatch = allTests.find(t => generateTestSlug(t.test_name) === testId);
    if (slugMatch) {
      return parseTestData(slugMatch);
    }
  }

  return null;
}

function parseTestData(data: any): TestData {
  const biomarkers = data.biomarkers_list 
    ? (Array.isArray(data.biomarkers_list) ? data.biomarkers_list : null)
    : null;
  return { ...data, biomarkers_list: biomarkers };
}
