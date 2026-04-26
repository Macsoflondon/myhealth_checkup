import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedTest {
  test_name: string;
  price: number;
  url: string;
  category: string;
  description: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting Medichecks scrape...');

    // Scrape key test pages from Medichecks
    const testUrls = [
      { url: 'https://www.medichecks.com/products/testosterone-blood-test', category: 'Hormone' },
      { url: 'https://www.medichecks.com/products/male-hormone-check-blood-test', category: 'Hormone' },
      { url: 'https://www.medichecks.com/products/ultimate-performance-blood-test', category: 'Sports Performance' },
      { url: 'https://www.medichecks.com/products/advanced-thyroid-function-blood-test', category: 'Thyroid' },
      { url: 'https://www.medichecks.com/products/well-woman-advanced-blood-test', category: "Women's Health" },
      { url: 'https://www.medichecks.com/products/well-man-advanced-blood-test', category: "Men's Health" },
      { url: 'https://www.medichecks.com/products/thyroid-function-blood-test', category: 'Thyroid' },
      { url: 'https://www.medichecks.com/products/vitamin-d-25-oh-blood-test', category: 'Vitamins' },
    ];

    const scrapedTests: ScrapedTest[] = [];
    const errors: string[] = [];

    for (const testUrl of testUrls) {
      try {
        console.log(`Fetching: ${testUrl.url}`);
        const response = await fetch(testUrl.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MyHealthCheckup/1.0)',
          },
        });

        if (!response.ok) {
          errors.push(`Failed to fetch ${testUrl.url}: ${response.status}`);
          continue;
        }

        const html = await response.text();
        
        // Extract test name from title or h1
        const titleMatch = html.match(/<title>([^<]+)</i) || html.match(/<h1[^>]*>([^<]+)</i);
        const testName = titleMatch ? titleMatch[1].replace(/\|.*$/, '').trim() : 'Unknown Test';

        // Extract price (looking for patterns like £29, £149, etc.)
        const priceMatch = html.match(/£(\d+(?:\.\d{2})?)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

        // Extract description from meta or first paragraph
        const descMatch = html.match(/<meta name="description" content="([^"]+)"/i) ||
                         html.match(/<p[^>]*>([^<]{50,})</i);
        const description = descMatch ? descMatch[1].trim() : '';

        if (testName && price > 0) {
          scrapedTests.push({
            test_name: testName,
            price,
            url: testUrl.url,
            category: testUrl.category,
            description: description.substring(0, 500),
          });
        }

        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        errors.push(`Error scraping ${testUrl.url}: ${(error instanceof Error ? error.message : String(error))}`);
        console.error(`Error scraping ${testUrl.url}:`, error);
      }
    }

    // Cache the scraped data with 1-hour expiry
    const cacheKey = 'medichecks_live_data';
    const cacheExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    
    // Store in a cache table or return directly
    // For now, just update the provider_tests table with scraped data
    for (const test of scrapedTests) {
      const { data: existing } = await supabase
        .from('provider_tests')
        .select('id')
        .eq('provider_id', 'medichecks')
        .eq('test_name', test.test_name)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('provider_tests')
          .update({
            price: test.price,
            url: test.url,
            description: test.description,
            scraped_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('provider_tests')
          .insert({
            provider_id: 'medichecks',
            test_name: test.test_name,
            price: test.price,
            url: test.url,
            category: test.category,
            description: test.description,
            is_active: true,
            scraped_at: new Date().toISOString(),
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped ${scrapedTests.length} tests from Medichecks`,
        tests: scrapedTests,
        errors: errors.length > 0 ? errors : undefined,
        cached_until: cacheExpiry,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-medichecks function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error instanceof Error ? error.message : String(error)),
        fallback: 'Will use database backup data' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
