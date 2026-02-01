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
    // Server-side admin role validation
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's token to verify identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error('Failed to get user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate admin role using has_role() database function
    const adminClient = createClient(supabaseUrl, supabaseKey);
    
    const { data: isAdmin, error: roleError } = await adminClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Failed to check admin role:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isAdmin) {
      console.error(`User ${user.id} attempted admin operation without admin role`);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin ${user.id} authorized for bulk clinic add operation`);

    // Use admin client for database operations
    const supabase = adminClient;

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

        // Upsert into database (handles duplicates gracefully)
        const { error } = await supabase
          .from('clinics')
          .upsert({
            name: clinic.name,
            full_address: clinic.fullAddress,
            postal_code: clinic.postalCode,
            latitude,
            longitude,
            provider_id: providerId,
            access_note: clinic.appointmentRequired ? 'Appointment required' : 'No appointment required'
          }, {
            onConflict: 'name',
            ignoreDuplicates: true
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
  
  // Priority order matters - check specific providers first
  if (name.includes('tuli')) return 'tuli-health';
  if (name.includes('superdrug')) return 'superdrug';
  if (name.includes('ultrasound direct')) return 'ultrasound-direct';
  if (name.includes('medichecks')) return 'medichecks';
  if (name.includes('goodbody') || name.includes('good body')) return 'goodbody-clinic';
  if (name.includes('randox')) return 'randox';
  if (name.includes('london medical')) return 'london-medical-laboratory';
  if (name.includes('lola')) return 'lola-health';
  if (name.includes('thriva')) return 'thriva';
  
  // NHS and hospital locations
  if (name.includes('hospital') || name.includes('infirmary') || name.includes('nhs')) return 'nhs-hospitals';
  
  // Common partner/franchise clinics offering Medichecks services
  if (name.includes('firstsight')) return 'medichecks';
  if (name.includes('get a drip')) return 'medichecks';
  if (name.includes('bioma')) return 'medichecks';
  
  // Independent pharmacies and clinics
  if (name.includes('pharmacy')) return 'independent';
  if (name.includes('clinic')) return 'independent';
  if (name.includes('health centre') || name.includes('health center')) return 'independent';
  if (name.includes('medical')) return 'independent';
  if (name.includes('aesthetics')) return 'independent';
  if (name.includes('wellbeing')) return 'independent';
  
  return 'independent';
}
