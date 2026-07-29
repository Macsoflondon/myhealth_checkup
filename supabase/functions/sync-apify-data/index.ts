import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Only allow safe dataset ID characters (Apify IDs are alphanumeric)
const DATASET_ID_RE = /^[A-Za-z0-9_-]{1,64}$/

async function isAuthorised(req: Request): Promise<boolean> {
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const cronSecret = Deno.env.get('SCRAPER_CRON_SECRET') ?? ''
  const authHeader = req.headers.get('authorization') ?? ''
  const bearer = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : ''

  // Allow service-role bearer (used by cron/admin tooling)
  if (serviceRoleKey && bearer && bearer === serviceRoleKey) return true
  // Allow scraper cron secret via header
  const cronHeader = req.headers.get('x-cron-secret') ?? ''
  if (cronSecret && cronHeader && cronHeader === cronSecret) return true

  // Otherwise require an authenticated admin user
  if (!bearer) return false
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${bearer}` } } },
    )
    const { data: userData } = await supabase.auth.getUser()
    const uid = userData?.user?.id
    if (!uid) return false
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: uid,
      _role: 'admin',
    })
    return isAdmin === true
  } catch {
    return false
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!(await isAuthorised(req))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { datasetId } = await req.json()
    if (!datasetId || typeof datasetId !== 'string' || !DATASET_ID_RE.test(datasetId)) {
      return new Response(JSON.stringify({ error: 'Invalid datasetId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const apifyToken = Deno.env.get('APIFY_API_TOKEN')
    const response = await fetch(
      `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?token=${apifyToken}`,
    )
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
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
