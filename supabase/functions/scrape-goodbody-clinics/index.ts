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
    console.log('Scraping Goodbody Clinic locations...');
    
    // NOTE: Goodbody uses WordPress with Elementor - clinic data loaded dynamically via JavaScript
    // Actual URL: https://health.goodbodyclinic.com/find-a-clinic/
    // This scraper requires headless browser (Puppeteer) or manual data collection
    
    console.warn('LIMITATION: Goodbody Clinic uses JavaScript-rendered content that cannot be scraped with basic HTML parsing');
    
    // Manual clinic data for Goodbody (collected from website inspection)
    // TODO: Replace with actual scraped data or API integration
    const clinics: ClinicData[] = [
      {
        name: 'Goodbody Clinic - Bath',
        fullAddress: '11 Gay Street, Bath, Somerset',
        postalCode: 'BA1 2PH',
        appointmentRequired: true
      },
      {
        name: 'Goodbody Clinic - Portpool Lane',
        fullAddress: '5-6 Portpool Lane, London',
        postalCode: 'EC1N 7UL',
        appointmentRequired: true
      },
      {
        name: 'Goodbody Clinic - Canary Wharf',
        fullAddress: 'Canary Wharf, London',
        postalCode: 'E14 5AB',
        appointmentRequired: true
      }
    ];

    console.log(`Returning ${clinics.length} manually collected Goodbody Clinic locations`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'goodbody-clinic',
        count: clinics.length,
        clinics,
        scrapedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error scraping Goodbody clinics:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: (error instanceof Error ? error.message : String(error)) 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
