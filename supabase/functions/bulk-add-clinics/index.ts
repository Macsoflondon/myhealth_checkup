import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClinicData {
  name: string;
  fullAddress: string;
  postalCode?: string;
  appointmentRequired: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { clinics }: { clinics: ClinicData[] } = await req.json();
    
    if (!clinics || !Array.isArray(clinics)) {
      return new Response(
        JSON.stringify({ error: 'Clinics array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${clinics.length} clinics...`);
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Process clinics in batches to avoid rate limiting
    for (const clinic of clinics) {
      try {
        // Determine provider from clinic name
        const providerId = determineProvider(clinic.name);
        
        // Geocode the address
        const geocodeResponse = await fetch(`${supabaseUrl}/functions/v1/geocode-clinic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            address: clinic.fullAddress,
            postalCode: clinic.postalCode
          })
        });

        let latitude = null;
        let longitude = null;

        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json();
          latitude = geocodeData.latitude;
          longitude = geocodeData.longitude;
        } else {
          console.log(`Failed to geocode: ${clinic.name}`);
        }

        // Insert into database
        const { error } = await supabase
          .from('clinics')
          .insert({
            name: clinic.name,
            full_address: clinic.fullAddress,
            postal_code: clinic.postalCode,
            latitude,
            longitude,
            provider_id: providerId,
            access_note: clinic.appointmentRequired ? 'Appointment required' : 'No appointment required'
          });

        if (error) {
          console.error(`Error inserting ${clinic.name}:`, error);
          errorCount++;
          results.push({ name: clinic.name, status: 'error', error: error.message });
        } else {
          successCount++;
          results.push({ name: clinic.name, status: 'success' });
        }

        // Rate limiting - wait 1 second between geocoding requests
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing ${clinic.name}:`, error);
        errorCount++;
        results.push({ name: clinic.name, status: 'error', error: error.message });
      }
    }

    console.log(`Completed: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        total: clinics.length,
        successCount,
        errorCount,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bulk-add-clinics function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function determineProvider(clinicName: string): string {
  const name = clinicName.toLowerCase();
  
  if (name.includes('tuli health')) return 'tuli-health';
  if (name.includes('superdrug')) return 'superdrug';
  if (name.includes('ultrasound direct')) return 'ultrasound-direct';
  if (name.includes('medichecks')) return 'medichecks';
  if (name.includes('goodbody') || name.includes('good body')) return 'goodbody-clinic';
  if (name.includes('randox')) return 'randox';
  if (name.includes('london medical')) return 'london-medical-laboratory';
  if (name.includes('hospital') || name.includes('infirmary')) return 'nhs-hospitals';
  
  return 'independent';
}
