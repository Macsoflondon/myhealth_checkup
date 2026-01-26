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
  clinics?: unknown[];
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ============================================
    // AUTHENTICATION CHECK
    // ============================================
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create client with user's JWT to verify authentication
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // ADMIN ROLE CHECK
    // ============================================
    const { data: isAdmin, error: roleError } = await userClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Error checking user role' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isAdmin) {
      console.warn(`Non-admin user ${user.id} attempted to access scrape-all-clinics`);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin user ${user.id} authorized to run clinic scrapers`);

    // ============================================
    // SCRAPING LOGIC (with service role for database writes)
    // ============================================
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting scrape of all provider clinics...');

    const scrapers = [
      'scrape-goodbody-clinics',
      'scrape-randox-clinics',
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
            
            // Pass auth header to bulk-add-clinics (it also requires admin)
            const { error: uploadError } = await supabase.functions.invoke('bulk-add-clinics', {
              body: { clinics: data.clinics },
              headers: { Authorization: authHeader }
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
          error: err instanceof Error ? err.message : 'Unknown error'
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
        completedAt: new Date().toISOString(),
        triggeredBy: user.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-all-clinics:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
