import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScraperResult {
  provider: string;
  success: boolean;
  count: number;
  clinics?: any[];
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting scrape of all provider clinics...');

    const scrapers = [
      'scrape-goodbody-clinics',
      'scrape-randox-clinics',
      'scrape-tuli-clinics',
      'scrape-london-medical-clinics'
    ];

    const results: ScraperResult[] = [];
    let totalClinics = 0;

    // Run each scraper
    for (const scraperName of scrapers) {
      console.log(`Running scraper: ${scraperName}...`);
      
      try {
        const { data, error } = await supabase.functions.invoke(scraperName);
        
        if (error) {
          console.error(`Error invoking ${scraperName}:`, error);
          results.push({
            provider: scraperName,
            success: false,
            count: 0,
            error: error.message
          });
        } else if (data.success) {
          console.log(`${scraperName} found ${data.count} clinics`);
          results.push({
            provider: data.provider,
            success: true,
            count: data.count,
            clinics: data.clinics
          });
          totalClinics += data.count;

          // Automatically upload clinics if any were found
          if (data.clinics && data.clinics.length > 0) {
            console.log(`Auto-uploading ${data.count} clinics from ${data.provider}...`);
            
            const { error: uploadError } = await supabase.functions.invoke('bulk-add-clinics', {
              body: { clinics: data.clinics }
            });

            if (uploadError) {
              console.error(`Error uploading clinics from ${scraperName}:`, uploadError);
            } else {
              console.log(`Successfully uploaded clinics from ${data.provider}`);
            }
          }
        } else {
          results.push({
            provider: scraperName,
            success: false,
            count: 0,
            error: data.error || 'Unknown error'
          });
        }

        // Rate limiting between scrapers
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.error(`Error with ${scraperName}:`, err);
        results.push({
          provider: scraperName,
          success: false,
          count: 0,
          error: err.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Scraping complete: ${successCount} succeeded, ${failCount} failed, ${totalClinics} total clinics`);

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          totalScrapers: scrapers.length,
          successCount,
          failCount,
          totalClinics
        },
        results,
        completedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-all-clinics:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
