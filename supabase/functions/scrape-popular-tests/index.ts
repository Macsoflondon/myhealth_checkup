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

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'medichecks',
    name: 'Medichecks',
    popularTestsUrl: 'https://www.medichecks.com/blood-tests/most-popular-tests',
    searchTerm: 'popular'
  },
  {
    id: 'goodbody-clinic',
    name: 'Goodbody Clinic',
    popularTestsUrl: 'https://www.goodbodyclinic.com/blood-tests',
    searchTerm: 'bestseller'
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

async function scrapeProviderPopularTests(
  provider: ProviderConfig,
  firecrawlApiKey: string
): Promise<ScrapedTest[]> {
  console.log(`Scraping popular tests from ${provider.name}...`);
  
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
        formats: ['markdown', 'links', {
          type: 'json',
          prompt: 'Extract a list of blood tests or health tests from this page. For each test, extract the test name and price in GBP if available. Return as an array of objects with "name" and "price" fields.',
          schema: {
            type: 'object',
            properties: {
              tests: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    price: { type: 'number' }
                  },
                  required: ['name']
                }
              }
            }
          }
        }],
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
    
    // Extract from JSON extraction if available
    const extractedJson = data.data?.json?.tests || data.data?.llm_extraction?.tests || [];
    if (Array.isArray(extractedJson) && extractedJson.length > 0) {
      for (const item of extractedJson) {
        if (item.name && typeof item.name === 'string' && item.name.length > 3) {
          tests.push({
            name: item.name.trim(),
            price: typeof item.price === 'number' ? item.price : undefined,
          });
        }
      }
      console.log(`Found ${tests.length} tests via JSON extraction from ${provider.name}`);
      if (tests.length > 0) {
        return tests.slice(0, 10);
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
      if (link.includes('/test') || link.includes('/blood-test') || link.includes('/package')) {
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
    return tests.slice(0, 10); // Return top 10 from each provider
    
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

    const allScrapedTests: { provider_id: string; tests: ScrapedTest[] }[] = [];

    // Scrape each provider
    for (const provider of PROVIDERS) {
      const tests = await scrapeProviderPopularTests(provider, firecrawlApiKey);
      allScrapedTests.push({ provider_id: provider.id, tests });
    }

    // Match scraped tests to database and update popularity
    let updatedCount = 0;
    let rank = 1;

    for (const { provider_id, tests } of allScrapedTests) {
      for (const scrapedTest of tests) {
        // Try to match by test name (fuzzy match)
        const { data: matchedTests, error } = await supabase
          .from('provider_tests')
          .select('id, test_name')
          .eq('provider_id', provider_id)
          .eq('is_active', true)
          .ilike('test_name', `%${scrapedTest.name.substring(0, 20)}%`)
          .limit(1);

        if (error) {
          console.error('Error matching test:', error);
          continue;
        }

        if (matchedTests && matchedTests.length > 0) {
          const testId = matchedTests[0].id;
          
          // Update the test with popularity data
          const { error: updateError } = await supabase
            .from('provider_tests')
            .update({
              is_popular: true,
              popularity_rank: rank,
            })
            .eq('id', testId);

          if (!updateError) {
            updatedCount++;
            rank++;
            console.log(`Marked as popular: ${matchedTests[0].test_name}`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped popular tests from ${PROVIDERS.length} providers`,
        scrapedData: allScrapedTests,
        updatedCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-popular-tests:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape popular tests';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
