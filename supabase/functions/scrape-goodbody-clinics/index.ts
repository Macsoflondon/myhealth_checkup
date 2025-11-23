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
    
    // Goodbody Clinic locations page
    const url = 'https://www.goodbodyclinic.com/locations';
    
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

    // Parse clinic locations - adjust selectors based on actual HTML structure
    // This is a template - you'll need to inspect the actual page and update selectors
    const locationElements = doc.querySelectorAll('.location-item, .clinic-card, [data-location]');
    
    for (const element of locationElements) {
      try {
        // Adjust these selectors based on actual HTML structure
        const nameEl = element.querySelector('.location-name, .clinic-name, h3, h4');
        const addressEl = element.querySelector('.location-address, .address, .location-details');
        const postcodeEl = element.querySelector('.postcode, .postal-code');
        
        if (nameEl && addressEl) {
          const name = nameEl.textContent?.trim() || '';
          const fullAddress = addressEl.textContent?.trim() || '';
          
          // Extract postcode from address if not in separate element
          let postalCode = postcodeEl?.textContent?.trim() || '';
          if (!postalCode) {
            // UK postcode regex pattern
            const postcodeMatch = fullAddress.match(/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/i);
            postalCode = postcodeMatch ? postcodeMatch[0] : '';
          }

          if (name && fullAddress) {
            clinics.push({
              name: `Goodbody Clinic - ${name}`,
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

    console.log(`Scraped ${clinics.length} Goodbody Clinic locations`);

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
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
