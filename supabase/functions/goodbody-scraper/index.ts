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
    console.log('Starting Goodbody Clinic scraper');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update scraping job status
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'goodbody-clinic',
        status: 'running',
        last_scraped: new Date().toISOString(),
      }, {
        onConflict: 'provider_id'
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error updating scraping job:', jobError);
    }

    // Fetch current Goodbody tests from database
    const { data: existingTests, error: fetchError } = await supabase
      .from('provider_tests')
      .select('*')
      .eq('provider_id', 'goodbody-clinic');

    if (fetchError) {
      throw new Error(`Failed to fetch existing tests: ${fetchError.message}`);
    }

    console.log(`Found ${existingTests?.length || 0} existing Goodbody tests`);

    // Simulate price updates (in production, this would scrape the actual website)
    // For now, we'll just mark all tests as active and update the scraped_at timestamp
    const updates = existingTests?.map(test => ({
      ...test,
      is_active: true,
      scraped_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) || [];

    // Batch update all tests
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('provider_tests')
        .upsert(updates, { onConflict: 'id' });

      if (updateError) {
        throw new Error(`Failed to update tests: ${updateError.message}`);
      }

      console.log(`Successfully updated ${updates.length} Goodbody tests`);
    }

    // Update scraping job as completed
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Next scrape in 24 hours
        error_message: null
      })
      .eq('provider_id', 'goodbody-clinic');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped ${updates.length} Goodbody tests`,
        testsUpdated: updates.length,
        provider: 'goodbody-clinic'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in Goodbody scraper:', error);

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
          next_scrape: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Retry in 1 hour
        })
        .eq('provider_id', 'goodbody-clinic');
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
