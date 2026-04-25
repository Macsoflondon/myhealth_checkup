import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeocodeRequest {
  address: string;
  postalCode?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, postalCode }: GeocodeRequest = await req.json();
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use Nominatim (OpenStreetMap) for geocoding - free and reliable for UK addresses
    const searchQuery = postalCode ? `${address}, ${postalCode}, UK` : `${address}, UK`;
    const encodedQuery = encodeURIComponent(searchQuery);
    
    console.log('Geocoding address:', searchQuery);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&countrycodes=gb`,
      {
        headers: {
          'User-Agent': 'MyHealthCheckup/1.0 (contact@myhealthcheckup.co.uk)'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      console.log('No results found for:', searchQuery);
      return new Response(
        JSON.stringify({ 
          error: 'Address not found',
          latitude: null,
          longitude: null
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = data[0];
    
    return new Response(
      JSON.stringify({
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in geocode-clinic function:', error);
    return new Response(
      JSON.stringify({ error: (error instanceof Error ? error.message : String(error)) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
