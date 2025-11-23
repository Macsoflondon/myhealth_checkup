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
    console.log('Scraping Tuli Health locations...');
    
    // Tuli Health locations page
    const url = 'https://www.tulihealth.co.uk/locations';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MyHealthCheckup/1.0; +https://myhealthcheckup.co.uk)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    const clinics: ClinicData[] = [];

    // Parse clinic locations
    const locationElements = doc.querySelectorAll('.location, .clinic, [data-location-item]');
    
    for (const element of locationElements) {
      try {
        const nameEl = element.querySelector('.location-name, .clinic-title, h3, h4');
        const addressEl = element.querySelector('.location-address, .address');
        const postcodeEl = element.querySelector('.postcode');
        
        if (nameEl && addressEl) {
          const name = nameEl.textContent?.trim() || '';
          const fullAddress = addressEl.textContent?.trim() || '';
          
          let postalCode = postcodeEl?.textContent?.trim() || '';
          if (!postalCode) {
            const postcodeMatch = fullAddress.match(/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/i);
            postalCode = postcodeMatch ? postcodeMatch[0] : '';
          }

          if (name && fullAddress) {
            clinics.push({
              name: `Tuli Health - ${name}`,
              fullAddress,
              postalCode,
              appointmentRequired: true
            });
          }
        }
      } catch (err) {
        console.error('Error parsing location element:', err);
      }
    }

    console.log(`Scraped ${clinics.length} Tuli Health locations`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'tuli-health',
        count: clinics.length,
        clinics,
        scrapedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error scraping Tuli Health clinics:', error);
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
