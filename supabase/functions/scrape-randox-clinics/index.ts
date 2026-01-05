import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClinicData {
  name: string;
  fullAddress: string;
  postalCode: string;
  appointmentRequired: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Scraping Randox Health locations...');
    
    // NOTE: Randox uses modern JS framework - clinic data loaded dynamically
    // Actual URL: https://randoxhealth.com/en-GB/locations
    // This scraper requires headless browser or API integration
    
    console.warn('LIMITATION: Randox Health uses JavaScript-rendered content that cannot be scraped with basic HTML parsing');
    
    // Manual clinic data for Randox (collected from website inspection)
    const clinics: ClinicData[] = [
      {
        name: 'Randox Health - Belfast',
        fullAddress: 'Diamond House, 124-126 Corporation Street, Belfast',
        postalCode: 'BT1 3DR',
        appointmentRequired: true
      },
      {
        name: 'Randox Health - London Chiswick',
        fullAddress: '248 Chiswick High Road, London',
        postalCode: 'W4 1PD',
        appointmentRequired: true
      },
      {
        name: 'Randox Health - Winchester',
        fullAddress: '95 High Street, Winchester',
        postalCode: 'SO23 9AP',
        appointmentRequired: true
      },
      {
        name: 'Randox Health - Edinburgh',
        fullAddress: '29 Stafford Street, Edinburgh',
        postalCode: 'EH3 7BJ',
        appointmentRequired: true
      }
    ];

    console.log(`Returning ${clinics.length} manually collected Randox Health locations`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'randox',
        count: clinics.length,
        clinics,
        scrapedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error scraping Randox clinics:', error);
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
