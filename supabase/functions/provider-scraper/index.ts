import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ProviderConfig {
  id: string;
  baseUrl: string;
  testListPath: string;
  scraperConfig: {
    testSelector: string;
    nameSelector: string;
    priceSelector: string;
    linkSelector: string;
    categorySelector?: string;
  };
}

const providerConfigs: ProviderConfig[] = [
  {
    id: 'LondonMedicalLab',
    baseUrl: 'https://www.londonmedicallaboratory.com',
    testListPath: '/product-category/general-health',
    scraperConfig: {
      testSelector: '.product',
      nameSelector: '.woocommerce-loop-product__title',
      priceSelector: '.price .amount',
      linkSelector: 'a.woocommerce-loop-product__link',
      categorySelector: '.product-category'
    }
  },
  {
    id: 'Medichecks',
    baseUrl: 'https://www.medichecks.com',
    testListPath: '/health-tests',
    scraperConfig: {
      testSelector: '.product-tile',
      nameSelector: '.product-title',
      priceSelector: '.price',
      linkSelector: '.product-link'
    }
  }
];

async function scrapeProvider(providerId: string) {
  const config = providerConfigs.find(c => c.id === providerId);
  if (!config) {
    throw new Error(`Provider configuration not found for: ${providerId}`);
  }

  console.log(`Starting scrape for provider: ${providerId}`);
  
  try {
    // Mark scraping job as in progress
    await supabase.from('scraping_jobs').upsert({
      provider_id: providerId,
      status: 'in_progress',
      last_scraped: new Date().toISOString()
    });

    const url = `${config.baseUrl}${config.testListPath}`;
    console.log(`Fetching URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Parse HTML and extract test data
    const tests = await parseTestData(html, config);
    
    // Store in database
    if (tests.length > 0) {
      // Mark existing tests as inactive
      await supabase
        .from('provider_tests')
        .update({ is_active: false })
        .eq('provider_id', providerId);

      // Insert new/updated tests
      const { error } = await supabase
        .from('provider_tests')
        .upsert(tests.map(test => ({
          ...test,
          provider_id: providerId,
          is_active: true,
          scraped_at: new Date().toISOString()
        })));

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    }

    // Mark scraping job as completed
    await supabase.from('scraping_jobs').upsert({
      provider_id: providerId,
      status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    console.log(`Successfully scraped ${tests.length} tests for ${providerId}`);
    return { success: true, count: tests.length };

  } catch (error) {
    console.error(`Scraping failed for ${providerId}:`, error);
    
    // Mark scraping job as failed
    await supabase.from('scraping_jobs').upsert({
      provider_id: providerId,
      status: 'failed',
      error_message: error.message,
      last_scraped: new Date().toISOString()
    });

    throw error;
  }
}

async function parseTestData(html: string, config: ProviderConfig) {
  // Simple HTML parsing - in production, you'd use a proper HTML parser
  const tests = [];
  
  // Mock data for demonstration - replace with actual HTML parsing
  const mockTests = [
    {
      test_name: 'Full Blood Count',
      description: 'Complete blood analysis including red and white blood cells',
      price: 29.00,
      category: 'Blood Tests',
      url: `${config.baseUrl}/product/full-blood-count`,
      provider_test_id: 'fbc-001'
    },
    {
      test_name: 'Vitamin D Test',
      description: 'Check your vitamin D levels',
      price: 39.00,
      category: 'Vitamins',
      url: `${config.baseUrl}/product/vitamin-d-test`,
      provider_test_id: 'vit-d-001'
    },
    {
      test_name: 'Cholesterol Check',
      description: 'Comprehensive cholesterol and lipid profile',
      price: 49.00,
      category: 'Heart Health',
      url: `${config.baseUrl}/product/cholesterol-check`,
      provider_test_id: 'chol-001'
    }
  ];
  
  return mockTests;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { providerId, action } = await req.json();

    if (!providerId) {
      return new Response(
        JSON.stringify({ error: 'Provider ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'scrape') {
      const result = await scrapeProvider(providerId);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get tests for a provider
    const { data: tests, error } = await supabase
      .from('provider_tests')
      .select('*')
      .eq('provider_id', providerId)
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ tests }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in provider-scraper function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});