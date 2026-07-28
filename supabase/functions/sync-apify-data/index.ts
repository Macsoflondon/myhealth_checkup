import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { datasetId } = await req.json()
    if (!datasetId) throw new Error('No datasetId provided')

    const apifyToken = Deno.env.get('APIFY_API_TOKEN')
    const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`)
    const items = await response.json()

    console.log(`Syncing ${items.length} items from Apify dataset ${datasetId}`)

    for (const item of items) {
      if (!item.test_name) continue

      const { error } = await supabaseClient
        .from('provider_tests')
        .update({
          base_price: item.base_price,
          clinic_phlebotomy_cost: item.clinic_fee,
          home_phlebotomy_cost: item.home_nurse_fee,
          gp_review_included: item.gp_review_included,
          last_validated: new Date().toISOString().split('T')[0]
        })
        .ilike('test_name', `%${item.test_name}%`)
        .eq('is_active', true)

      if (error) console.error(`Error updating ${item.test_name}:`, error)
    }

    return new Response(JSON.stringify({ success: true, count: items.length }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})
