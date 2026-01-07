import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCRAPERS = [
  { id: 'lola-health', functionName: 'lola-health-scraper' },
  { id: 'medichecks', functionName: 'medichecks-scraper' },
  { id: 'goodbody', functionName: 'goodbody-scraper' },
  { id: 'thriva', functionName: 'thriva-scraper' },
  { id: 'tuli-health', functionName: 'tuli-health-scraper' },
  { id: 'randox', functionName: 'randox-scraper' },
  { id: 'london-medical-laboratory', functionName: 'scrape-london-lab' },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`[${new Date().toISOString()}] Starting scheduled scraping run for all providers`);

  const results: { provider: string; success: boolean; message: string }[] = [];

  for (const scraper of SCRAPERS) {
    console.log(`[${new Date().toISOString()}] Running ${scraper.id} scraper...`);
    
    try {
      // Call each scraper function
      const response = await fetch(`${supabaseUrl}/functions/v1/${scraper.functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ replace: true }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`[${new Date().toISOString()}] ${scraper.id} completed: ${JSON.stringify(data)}`);
      
      results.push({
        provider: scraper.id,
        success: true,
        message: data.message || 'Completed successfully',
      });

      // Small delay between scrapers to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ${scraper.id} failed:`, error);
      results.push({
        provider: scraper.id,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const summary = `Completed ${successCount}/${SCRAPERS.length} scrapers successfully`;
  
  console.log(`[${new Date().toISOString()}] ${summary}`);

  return new Response(
    JSON.stringify({
      success: successCount === SCRAPERS.length,
      message: summary,
      results,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
});
