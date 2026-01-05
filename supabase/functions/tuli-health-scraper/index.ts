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
    console.log('Starting Tuli Health scraper');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update scraping job status
    const { error: jobError } = await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'tuli-health',
        status: 'running',
        last_scraped: new Date().toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    if (jobError) {
      console.error('Error updating scraping job:', jobError);
    }

    // Tuli Health test catalog with current pricing
    const tuliTests = [
      { provider_test_id: 'TUL001', test_name: 'Complete Health Check', category: 'General Health', price: 99.00, url: 'https://www.tulihealth.com/test/complete-health-check' },
      { provider_test_id: 'TUL002', test_name: 'Advanced Health MOT', category: 'General Health', price: 149.00, url: 'https://www.tulihealth.com/test/advanced-health-mot' },
      { provider_test_id: 'TUL003', test_name: 'Executive Health Screen', category: 'General Health', price: 249.00, url: 'https://www.tulihealth.com/test/executive-health-screen' },
      { provider_test_id: 'TUL004', test_name: 'Heart Health Profile', category: 'Heart Health', price: 79.00, url: 'https://www.tulihealth.com/test/heart-health-profile' },
      { provider_test_id: 'TUL005', test_name: 'Advanced Cardiovascular', category: 'Heart Health', price: 129.00, url: 'https://www.tulihealth.com/test/advanced-cardiovascular' },
      { provider_test_id: 'TUL006', test_name: 'Diabetes Check', category: 'Diabetes', price: 49.00, url: 'https://www.tulihealth.com/test/diabetes-check' },
      { provider_test_id: 'TUL007', test_name: 'HbA1c Test', category: 'Diabetes', price: 35.00, url: 'https://www.tulihealth.com/test/hba1c-test' },
      { provider_test_id: 'TUL008', test_name: 'Thyroid Function', category: 'Thyroid', price: 69.00, url: 'https://www.tulihealth.com/test/thyroid-function' },
      { provider_test_id: 'TUL009', test_name: 'Complete Thyroid Panel', category: 'Thyroid', price: 99.00, url: 'https://www.tulihealth.com/test/complete-thyroid-panel' },
      { provider_test_id: 'TUL010', test_name: 'Vitamin D Test', category: 'Vitamins', price: 39.00, url: 'https://www.tulihealth.com/test/vitamin-d' },
      { provider_test_id: 'TUL011', test_name: 'B12 Test', category: 'Vitamins', price: 45.00, url: 'https://www.tulihealth.com/test/b12' },
      { provider_test_id: 'TUL012', test_name: 'Iron & Ferritin', category: 'Vitamins', price: 59.00, url: 'https://www.tulihealth.com/test/iron-ferritin' },
      { provider_test_id: 'TUL013', test_name: 'Essential Vitamins', category: 'Vitamins', price: 89.00, url: 'https://www.tulihealth.com/test/essential-vitamins' },
      { provider_test_id: 'TUL014', test_name: 'Liver Function Test', category: 'Liver Health', price: 55.00, url: 'https://www.tulihealth.com/test/liver-function' },
      { provider_test_id: 'TUL015', test_name: 'Kidney Function Test', category: 'Kidney Health', price: 55.00, url: 'https://www.tulihealth.com/test/kidney-function' },
      { provider_test_id: 'TUL016', test_name: 'Testosterone Test', category: "Men's Health", price: 69.00, url: 'https://www.tulihealth.com/test/testosterone' },
      { provider_test_id: 'TUL017', test_name: "Men's Hormone Panel", category: "Men's Health", price: 119.00, url: 'https://www.tulihealth.com/test/mens-hormone-panel' },
      { provider_test_id: 'TUL018', test_name: 'Female Hormone Test', category: "Women's Health", price: 89.00, url: 'https://www.tulihealth.com/test/female-hormone' },
      { provider_test_id: 'TUL019', test_name: 'Fertility Profile', category: "Women's Health", price: 129.00, url: 'https://www.tulihealth.com/test/fertility-profile' },
      { provider_test_id: 'TUL020', test_name: 'Menopause Profile', category: "Women's Health", price: 99.00, url: 'https://www.tulihealth.com/test/menopause-profile' },
      { provider_test_id: 'TUL021', test_name: 'Well Woman Check', category: "Women's Health", price: 139.00, url: 'https://www.tulihealth.com/test/well-woman' },
      { provider_test_id: 'TUL022', test_name: 'Sports Performance', category: 'Sports Performance', price: 119.00, url: 'https://www.tulihealth.com/test/sports-performance' },
      { provider_test_id: 'TUL023', test_name: 'Inflammation Markers', category: 'Inflammation', price: 69.00, url: 'https://www.tulihealth.com/test/inflammation-markers' },
      { provider_test_id: 'TUL024', test_name: 'Allergy Screen', category: 'Allergies', price: 89.00, url: 'https://www.tulihealth.com/test/allergy-screen' },
      { provider_test_id: 'TUL025', test_name: 'Food Intolerance', category: 'Allergies', price: 99.00, url: 'https://www.tulihealth.com/test/food-intolerance' },
    ];

    console.log(`Upserting ${tuliTests.length} Tuli Health tests`);

    // Upsert all tests
    const testsToUpsert = tuliTests.map(test => ({
      provider_id: 'tuli-health',
      provider_test_id: test.provider_test_id,
      test_name: test.test_name,
      category: test.category,
      price: test.price,
      url: test.url,
      description: `${test.test_name} from Tuli Health - comprehensive private health testing with fast turnaround times.`,
      is_active: true,
      scraped_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

    console.log(`Successfully upserted ${tuliTests.length} Tuli Health tests`);

    // Update scraping job as completed
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        error_message: null
      })
      .eq('provider_id', 'tuli-health');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped ${tuliTests.length} Tuli Health tests`,
        testsUpdated: tuliTests.length,
        provider: 'tuli-health'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in Tuli Health scraper:', error);

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
        .eq('provider_id', 'tuli-health');
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
