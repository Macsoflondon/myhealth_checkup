import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MedichecksTestUpdate {
  provider_test_id: string;
  test_name: string;
  price?: number;
  is_active: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting Medichecks scraper...');

    // Update scraping job status
    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'medichecks',
        status: 'running',
        last_scraped: new Date().toISOString(),
        next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    // Get existing Medichecks tests
    const { data: existingTests, error: fetchError } = await supabase
      .from('provider_tests')
      .select('provider_test_id, test_name, price')
      .eq('provider_id', 'medichecks')
      .eq('is_active', true);

    if (fetchError) {
      throw new Error(`Failed to fetch existing tests: ${fetchError.message}`);
    }

    console.log(`Found ${existingTests?.length || 0} existing Medichecks tests`);

    // In a production environment, this would scrape the Medichecks website
    // For now, we'll simulate price updates for demonstration
    const updates: MedichecksTestUpdate[] = (existingTests || []).map(test => ({
      provider_test_id: test.provider_test_id,
      test_name: test.test_name,
      price: test.price || null,
      is_active: true
    }));

    // Update tests in database
    let updatedCount = 0;
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('provider_tests')
        .update({
          price: update.price,
          is_active: update.is_active,
          updated_at: new Date().toISOString(),
          scraped_at: new Date().toISOString()
        })
        .eq('provider_id', 'medichecks')
        .eq('provider_test_id', update.provider_test_id);

      if (!updateError) {
        updatedCount++;
      } else {
        console.error(`Failed to update test ${update.provider_test_id}:`, updateError);
      }
    }

    // Update scraping job to completed
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        error_message: null
      })
      .eq('provider_id', 'medichecks');

    console.log(`Medichecks scraper completed. Updated ${updatedCount} tests.`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'medichecks',
        testsUpdated: updatedCount,
        totalTests: existingTests?.length || 0,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in Medichecks scraper:', error);

    // Update scraping job with error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from('scraping_jobs')
      .update({
        status: 'failed',
        error_message: error.message
      })
      .eq('provider_id', 'medichecks');

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
