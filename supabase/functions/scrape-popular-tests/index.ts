import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProviderConfig {
  id: string;
  name: string;
  popularTestsUrl: string;
  searchTerm?: string;
}

// Updated URLs for best-sellers and popular tests pages
const PROVIDERS: ProviderConfig[] = [
  {
    id: 'medichecks',
    name: 'Medichecks',
    popularTestsUrl: 'https://www.medichecks.com/collections/best-sellers',
    searchTerm: 'bestseller'
  },
  {
    id: 'goodbody-clinic',
    name: 'Goodbody Clinic',
    popularTestsUrl: 'https://goodbodyclinic.com/pages/all-in-clinic-tests',
    searchTerm: 'popular'
  },
  {
    id: 'thriva',
    name: 'Thriva',
    popularTestsUrl: 'https://thriva.co/tests',
    searchTerm: 'popular'
  },
  {
    id: 'lola-health',
    name: 'Lola Health',
    popularTestsUrl: 'https://www.lolahealth.com/all-blood-tests',
    searchTerm: 'popular'
  },
  {
    id: 'randox',
    name: 'Randox Health',
    popularTestsUrl: 'https://www.randoxhealth.com/packages',
    searchTerm: 'popular'
  },
  {
    id: 'london-medical-laboratory',
    name: 'London Medical Laboratory',
    popularTestsUrl: 'https://www.londonmedicallaboratory.com/blood-tests',
    searchTerm: 'popular'
  }
];

interface ScrapedTest {
  name: string;
  url?: string;
  price?: number;
}

// ========== FUZZY MATCHING UTILITIES ==========

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  // Create matrix
  const matrix: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
  
  // Initialize first column
  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }
  
  // Initialize first row
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }
  
  return matrix[len1][len2];
}

/**
 * Calculate similarity ratio between two strings (0 to 1)
 */
function similarityRatio(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

/**
 * Normalize test name for comparison
 * Removes common prefixes/suffixes, converts to lowercase, removes special chars
 */
function normalizeTestName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(the|a|an)\s+/i, '')  // Remove articles
    .replace(/\s+(test|panel|profile|check|screen|blood test)\s*$/i, '')  // Remove common suffixes
    .replace(/[^\w\s]/g, ' ')  // Replace special chars with space
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .trim();
}

/**
 * Extract key terms from test name for matching
 */
function extractKeyTerms(name: string): string[] {
  const normalized = normalizeTestName(name);
  return normalized.split(' ').filter(term => term.length > 2);
}

/**
 * Calculate term overlap score between two test names
 */
function termOverlapScore(name1: string, name2: string): number {
  const terms1 = new Set(extractKeyTerms(name1));
  const terms2 = new Set(extractKeyTerms(name2));
  
  if (terms1.size === 0 || terms2.size === 0) return 0;
  
  let matchCount = 0;
  for (const term of terms1) {
    if (terms2.has(term)) {
      matchCount++;
    }
  }
  
  // Jaccard similarity coefficient
  const union = new Set([...terms1, ...terms2]).size;
  return matchCount / union;
}

/**
 * Calculate combined fuzzy match score between two test names
 * Returns a score from 0 to 1
 */
function fuzzyMatchScore(scrapedName: string, dbName: string): number {
  const normalizedScraped = normalizeTestName(scrapedName);
  const normalizedDb = normalizeTestName(dbName);
  
  // Exact match after normalization
  if (normalizedScraped === normalizedDb) return 1;
  
  // Calculate different similarity measures
  const levenshteinSimilarity = similarityRatio(normalizedScraped, normalizedDb);
  const termOverlap = termOverlapScore(scrapedName, dbName);
  
  // Check if one is a substring of the other
  const containsBonus = (normalizedDb.includes(normalizedScraped) || 
                          normalizedScraped.includes(normalizedDb)) ? 0.2 : 0;
  
  // Weighted combination
  const score = (levenshteinSimilarity * 0.5) + (termOverlap * 0.4) + containsBonus;
  
  return Math.min(score, 1);
}

interface TestMatch {
  id: string;
  test_name: string;
  score: number;
}

/**
 * Find best matching test from database for a scraped test name
 */
function findBestMatch(
  scrapedName: string,
  dbTests: { id: string; test_name: string }[],
  threshold: number = 0.45
): TestMatch | null {
  let bestMatch: TestMatch | null = null;
  
  for (const dbTest of dbTests) {
    const score = fuzzyMatchScore(scrapedName, dbTest.test_name);
    
    if (score >= threshold && (!bestMatch || score > bestMatch.score)) {
      bestMatch = {
        id: dbTest.id,
        test_name: dbTest.test_name,
        score
      };
    }
  }
  
  return bestMatch;
}

// ========== SCRAPING FUNCTIONS ==========

async function scrapeProviderPopularTests(
  provider: ProviderConfig,
  firecrawlApiKey: string
): Promise<ScrapedTest[]> {
  console.log(`Scraping popular tests from ${provider.name} at ${provider.popularTestsUrl}...`);
  
  try {
    // Use JSON extraction to get structured test data
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: provider.popularTestsUrl,
        formats: ['markdown', 'links', 'extract'],
        extract: {
          prompt: 'Extract a comprehensive list of ALL blood tests or health tests from this page. For each test, extract the exact test name as shown on the page and the price in GBP if available. Include ALL tests visible on the page, not just featured ones. Return as an array of objects with "name" and "price" fields.',
          schema: {
            type: 'object',
            properties: {
              tests: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'The exact name of the blood test as shown on the page' },
                    price: { type: 'number', description: 'Price in GBP (pounds sterling)' }
                  },
                  required: ['name']
                }
              }
            }
          }
        },
        onlyMainContent: true,
        waitFor: 5000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`Firecrawl error for ${provider.name}:`, data);
      return [];
    }

    const tests: ScrapedTest[] = [];
    
    // Extract from structured extraction if available
    const extractedJson = data.data?.extract?.tests || data.extract?.tests || [];
    if (Array.isArray(extractedJson) && extractedJson.length > 0) {
      for (const item of extractedJson) {
        if (item.name && typeof item.name === 'string' && item.name.length > 3) {
          tests.push({
            name: item.name.trim(),
            price: typeof item.price === 'number' ? item.price : undefined,
          });
        }
      }
      console.log(`Found ${tests.length} tests via extraction from ${provider.name}`);
      if (tests.length > 0) {
        return tests.slice(0, 15); // Return top 15 from each provider
      }
    }

    // Fallback: Parse markdown for test names and prices
    const markdown = data.data?.markdown || '';
    const links = data.data?.links || [];
    
    // Look for patterns like "Test Name - £XX" or "Test Name...£XX"
    const pricePattern = /([A-Za-z][A-Za-z0-9\s\-\(\)&,]+?)[\s\-–—]+£(\d+(?:\.\d{2})?)/g;
    let match;
    
    while ((match = pricePattern.exec(markdown)) !== null) {
      const testName = match[1].trim();
      const price = parseFloat(match[2]);
      
      // Skip if it looks like a header or navigation item
      if (testName.length > 5 && testName.length < 100 && !testName.includes('Cookie')) {
        tests.push({
          name: testName,
          price: price,
        });
      }
    }
    
    // Also extract test names from links that look like test pages
    for (const link of links) {
      if (link.includes('/test') || link.includes('/blood-test') || link.includes('/package') || link.includes('/product')) {
        const urlParts = link.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart && lastPart.length > 3) {
          const testName = lastPart
            .replace(/-/g, ' ')
            .replace(/\?.*$/, '')
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          if (!tests.find(t => t.name.toLowerCase() === testName.toLowerCase())) {
            tests.push({
              name: testName,
              url: link,
            });
          }
        }
      }
    }
    
    console.log(`Found ${tests.length} tests from ${provider.name}`);
    return tests.slice(0, 15);
    
  } catch (error) {
    console.error(`Error scraping ${provider.name}:`, error);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, reset all popularity data
    await supabase
      .from('provider_tests')
      .update({ is_popular: false, popularity_rank: null })
      .eq('is_active', true);

    const allScrapedTests: { provider_id: string; tests: ScrapedTest[] }[] = [];
    const matchingResults: { 
      scraped: string; 
      matched: string | null; 
      score: number; 
      provider: string 
    }[] = [];

    // Scrape each provider
    for (const provider of PROVIDERS) {
      const tests = await scrapeProviderPopularTests(provider, firecrawlApiKey);
      allScrapedTests.push({ provider_id: provider.id, tests });
    }

    // Get all active tests from database for fuzzy matching
    const { data: allDbTests, error: fetchError } = await supabase
      .from('provider_tests')
      .select('id, test_name, provider_id')
      .eq('is_active', true);

    if (fetchError) {
      console.error('Error fetching tests:', fetchError);
      throw new Error('Failed to fetch tests from database');
    }

    // Match scraped tests to database using fuzzy matching
    let updatedCount = 0;
    let globalRank = 1;

    for (const { provider_id, tests } of allScrapedTests) {
      // Get tests for this provider
      const providerDbTests = allDbTests?.filter(t => t.provider_id === provider_id) || [];
      
      console.log(`Matching ${tests.length} scraped tests against ${providerDbTests.length} DB tests for ${provider_id}`);

      for (const scrapedTest of tests) {
        // Use fuzzy matching to find best match
        const match = findBestMatch(scrapedTest.name, providerDbTests, 0.40);

        if (match) {
          matchingResults.push({
            scraped: scrapedTest.name,
            matched: match.test_name,
            score: match.score,
            provider: provider_id
          });

          // Update the test with popularity data
          const { error: updateError } = await supabase
            .from('provider_tests')
            .update({
              is_popular: true,
              popularity_rank: globalRank,
            })
            .eq('id', match.id);

          if (!updateError) {
            updatedCount++;
            globalRank++;
            console.log(`✓ Matched "${scrapedTest.name}" → "${match.test_name}" (score: ${match.score.toFixed(2)})`);
          }
        } else {
          matchingResults.push({
            scraped: scrapedTest.name,
            matched: null,
            score: 0,
            provider: provider_id
          });
          console.log(`✗ No match for "${scrapedTest.name}" in ${provider_id}`);
        }
      }
    }

    // Sort matching results by score for debugging
    matchingResults.sort((a, b) => b.score - a.score);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped popular tests from ${PROVIDERS.length} providers`,
        scrapedData: allScrapedTests,
        matchingResults: matchingResults.slice(0, 50), // Return top 50 for debugging
        stats: {
          totalScraped: allScrapedTests.reduce((sum, p) => sum + p.tests.length, 0),
          matched: updatedCount,
          dbTestsCount: allDbTests?.length || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-popular-tests:', error);
    const errorMessage = error instanceof Error ? (error instanceof Error ? error.message : String(error)) : 'Failed to scrape popular tests';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
