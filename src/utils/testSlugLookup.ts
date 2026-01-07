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
  image_url: string | null;
  is_addon: boolean;
  original_price: number | null;
  discount_percentage: number | null;
  symptoms: string[] | null;
  conditions: string[] | null;
  who_should_test: string | null;
}

/**
 * Generates a URL-friendly slug from a test name
 */
export function generateTestSlug(testName: string): string {
  return testName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * Generates possible slug variations for lookup
 */
function generateSlugVariations(slug: string): string[] {
  const base = slug.toLowerCase().replace(/(^-|-$)/g, '');
  return [
    base,
    `${base}-blood-test`,
    `${base}-test`,
    base.replace(/-blood-test$/, ''),
    base.replace(/-test$/, ''),
  ];
}

const SELECT_FIELDS = `
  id, test_name, category, description, url, price, provider_test_id, 
  biomarkers_list, biomarker_count, image_url, is_addon, 
  original_price, discount_percentage, symptoms, conditions, who_should_test
`;

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
    .select(SELECT_FIELDS)
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
      .select(SELECT_FIELDS)
      .eq('provider_id', providerId)
      .eq('id', testId)
      .eq('is_active', true)
      .single();

    if (uuidMatch) {
      return parseTestData(uuidMatch);
    }
  }

  // Generate slug variations to try
  const variations = generateSlugVariations(testId);
  
  // Try each variation against provider_test_id
  for (const variation of variations) {
    const { data: variationMatch } = await supabase
      .from('provider_tests')
      .select(SELECT_FIELDS)
      .eq('provider_id', providerId)
      .eq('provider_test_id', variation)
      .eq('is_active', true)
      .single();
    
    if (variationMatch) {
      return parseTestData(variationMatch);
    }
  }

  // Fallback: match by slug generated from test_name
  const { data: allTests } = await supabase
    .from('provider_tests')
    .select(SELECT_FIELDS)
    .eq('provider_id', providerId)
    .eq('is_active', true);

  if (allTests) {
    // Try exact slug match first
    const slugMatch = allTests.find(t => generateTestSlug(t.test_name) === testId);
    if (slugMatch) {
      return parseTestData(slugMatch);
    }
    
    // Try partial match - URL slug contained in provider_test_id or vice versa
    const partialMatch = allTests.find(t => 
      t.provider_test_id?.includes(testId) || testId.includes(t.provider_test_id || '')
    );
    if (partialMatch) {
      return parseTestData(partialMatch);
    }
    
    // Try matching slug variations against test names
    for (const variation of variations) {
      const nameMatch = allTests.find(t => generateTestSlug(t.test_name) === variation);
      if (nameMatch) {
        return parseTestData(nameMatch);
      }
    }
  }

  return null;
}

function parseTestData(data: any): TestData {
  const biomarkers = data.biomarkers_list 
    ? (Array.isArray(data.biomarkers_list) ? data.biomarkers_list : null)
    : null;
  
  const symptoms = data.symptoms 
    ? (Array.isArray(data.symptoms) ? data.symptoms : null)
    : null;
  
  const conditions = data.conditions 
    ? (Array.isArray(data.conditions) ? data.conditions : null)
    : null;

  return { 
    ...data, 
    biomarkers_list: biomarkers,
    symptoms,
    conditions,
    is_addon: data.is_addon || false,
  };
}
