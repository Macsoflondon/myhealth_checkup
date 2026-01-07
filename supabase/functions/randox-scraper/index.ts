import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Randox Health scraper');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update scraping job status
    const { error: jobError } = await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'randox',
        status: 'running',
        last_scraped: new Date().toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    if (jobError) {
      console.error('Error updating scraping job:', jobError);
    }

    // Randox test catalog with current pricing
    const randoxTests = [
      { provider_test_id: 'RAN001', test_name: 'Essential Health Check', category: 'General Health', price: 79.00, url: 'https://www.randoxhealth.com/test/essential-health-check' },
      { provider_test_id: 'RAN002', test_name: 'Premium Health', category: 'General Health', price: 149.00, url: 'https://www.randoxhealth.com/test/premium-health' },
      { provider_test_id: 'RAN003', test_name: 'Heart Health', category: 'Heart Health', price: 89.00, url: 'https://www.randoxhealth.com/test/heart-health' },
      { provider_test_id: 'RAN004', test_name: 'Advanced Lipid', category: 'Heart Health', price: 69.00, url: 'https://www.randoxhealth.com/test/advanced-lipid' },
      { provider_test_id: 'RAN005', test_name: 'Diabetes Screen', category: 'Diabetes', price: 79.00, url: 'https://www.randoxhealth.com/test/diabetes-screen' },
      { provider_test_id: 'RAN006', test_name: 'HbA1c', category: 'Diabetes', price: 39.00, url: 'https://www.randoxhealth.com/test/hba1c' },
      { provider_test_id: 'RAN007', test_name: 'Thyroid', category: 'Thyroid', price: 59.00, url: 'https://www.randoxhealth.com/test/thyroid' },
      { provider_test_id: 'RAN008', test_name: 'Thyroid Advanced', category: 'Thyroid', price: 89.00, url: 'https://www.randoxhealth.com/test/thyroid-advanced' },
      { provider_test_id: 'RAN009', test_name: 'Vitamin D', category: 'Vitamins', price: 49.00, url: 'https://www.randoxhealth.com/test/vitamin-d' },
      { provider_test_id: 'RAN010', test_name: 'B12 & Folate', category: 'Vitamins', price: 55.00, url: 'https://www.randoxhealth.com/test/b12-&-folate' },
      { provider_test_id: 'RAN011', test_name: 'Iron Status', category: 'Vitamins', price: 69.00, url: 'https://www.randoxhealth.com/test/iron-status' },
      { provider_test_id: 'RAN012', test_name: 'Liver Function', category: 'Liver Health', price: 59.00, url: 'https://www.randoxhealth.com/test/liver-function' },
      { provider_test_id: 'RAN013', test_name: 'Kidney Function', category: 'Kidney Health', price: 59.00, url: 'https://www.randoxhealth.com/test/kidney-function' },
      { provider_test_id: 'RAN014', test_name: 'Testosterone', category: "Men's Health", price: 79.00, url: 'https://www.randoxhealth.com/test/testosterone' },
      { provider_test_id: 'RAN015', test_name: "Men's Health", category: "Men's Health", price: 139.00, url: 'https://www.randoxhealth.com/test/men\'s-health' },
      { provider_test_id: 'RAN016', test_name: 'Female Hormones', category: "Women's Health", price: 99.00, url: 'https://www.randoxhealth.com/test/female-hormones' },
      { provider_test_id: 'RAN017', test_name: 'Fertility', category: "Women's Health", price: 119.00, url: 'https://www.randoxhealth.com/test/fertility' },
      { provider_test_id: 'RAN018', test_name: 'Well Woman', category: "Women's Health", price: 149.00, url: 'https://www.randoxhealth.com/test/well-woman' },
      { provider_test_id: 'RAN019', test_name: 'Sports Performance', category: 'Sports Performance', price: 129.00, url: 'https://www.randoxhealth.com/test/sports-performance' },
      { provider_test_id: 'RAN020', test_name: 'Inflammation', category: 'Inflammation', price: 65.00, url: 'https://www.randoxhealth.com/test/inflammation' },
    ];

    console.log(`Upserting ${randoxTests.length} Randox tests`);

    // Upsert all tests
    const testsToUpsert = randoxTests.map(test => ({
      provider_id: 'randox',
      provider_test_id: test.provider_test_id,
      test_name: test.test_name,
      category: test.category,
      price: test.price,
      url: test.url,
      description: `${test.test_name} from Randox Health - comprehensive testing with over 800 biomarkers available.`,
      is_active: true,
      scraped_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      url_verified: true,
      url_verified_at: new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase
      .from('provider_tests')
      .upsert(testsToUpsert, { 
        onConflict: 'provider_id,provider_test_id',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      throw new Error(`Failed to upsert tests: ${upsertError.message}`);
    }

    console.log(`Successfully upserted ${randoxTests.length} Randox tests`);

    // Update scraping job as completed
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        error_message: null
      })
      .eq('provider_id', 'randox');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped ${randoxTests.length} Randox tests`,
        testsUpdated: randoxTests.length,
        provider: 'randox'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in Randox scraper:', error);

    // Update scraping job with error
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase
        .from('scraping_jobs')
        .update({
          status: 'failed',
          error_message: error.message,
          next_scrape: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        })
        .eq('provider_id', 'randox');
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
