import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LolaHealthProduct {
  test_name: string;
  provider_id: string;
  category: string;
  price: number;
  description: string;
  url: string;
  provider_test_id: string;
  is_active: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting Lola Health scraper...");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Lola Health collection page
    const collectionUrl = "https://lolahealth.com/collections/blood-tests";
    console.log(`Fetching ${collectionUrl}...`);
    
    const response = await fetch(collectionUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HealthCheckupBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Lola Health: ${response.status}`);
    }

    const html = await response.text();
    console.log("Successfully fetched Lola Health page");

    // Parse products from HTML (basic regex parsing)
    // In production, use a proper HTML parser like DOMParser or cheerio
    const productMatches = [...html.matchAll(/product-card.*?href="([^"]+)".*?title[^>]*>([^<]+)<.*?price[^>]*>£([0-9,.]+)/gs)];
    
    console.log(`Found ${productMatches.length} products on page`);

    const products: LolaHealthProduct[] = [];
    const priceUpdates = [];
    const priceHistory = [];

    for (const match of productMatches) {
      const [, relativeUrl, title, priceStr] = match;
      const fullUrl = `https://lolahealth.com${relativeUrl}`;
      const price = parseFloat(priceStr.replace(',', ''));
      const slug = relativeUrl.split('/').pop() || '';

      // Determine category based on title
      let category = 'General Health';
      if (title.match(/liver|albumin|alt|ast|alp|bilirubin/i)) {
        category = 'Liver Function';
      } else if (title.match(/heart|cardiovascular|cholesterol|apolipoprotein/i)) {
        category = 'Heart Health';
      } else if (title.match(/fertility|hormone|antimullerian|amh/i)) {
        category = 'Fertility';
      } else if (title.match(/thyroid|tsh|t3|t4/i)) {
        category = 'Thyroid';
      } else if (title.match(/vitamin|mineral|b12|d3|folate/i)) {
        category = 'Vitamins & Minerals';
      } else if (title.match(/diabetes|glucose|hba1c/i)) {
        category = 'Diabetes';
      } else if (title.match(/women|female|menopause/i)) {
        category = 'Women\'s Health';
      } else if (title.match(/men|male|testosterone|prostate/i)) {
        category = 'Men\'s Health';
      }

      products.push({
        test_name: title.trim(),
        provider_id: 'lola-health',
        category,
        price,
        description: `${title} from Lola Health with at-home phlebotomy service and doctor-reviewed results.`,
        url: fullUrl,
        provider_test_id: slug,
        is_active: true,
      });

      // Track price updates
      priceUpdates.push({
        test_id: slug,
        provider: 'lola-health',
        price,
        available: true,
        updated_at: new Date().toISOString(),
      });
    }

    console.log(`Parsed ${products.length} products from HTML`);

    // Update database with scraped products
    if (products.length > 0) {
      const { data, error } = await supabase
        .from('provider_tests')
        .upsert(products, {
          onConflict: 'provider_id,provider_test_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("Error upserting products:", error);
        throw error;
      }

      console.log(`Successfully updated ${products.length} products in database`);

      // Update scraping job status
      const { error: jobError } = await supabase
        .from('scraping_jobs')
        .upsert({
          provider_id: 'lola-health',
          status: 'completed',
          last_scraped: new Date().toISOString(),
          next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        }, {
          onConflict: 'provider_id'
        });

      if (jobError) {
        console.error("Error updating scraping job:", jobError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and updated ${products.length} Lola Health products`,
        products: products.length,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in lola-health-scraper:', error);
    
    // Update scraping job with error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'lola-health',
        status: 'failed',
        error_message: error.message,
        last_scraped: new Date().toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
