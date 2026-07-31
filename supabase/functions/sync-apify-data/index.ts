import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7"
import { applyProviderRows, type ProviderDatasetRow } from "../_shared/scrape/applyProviderRows.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Only allow safe dataset ID characters (Apify IDs are alphanumeric)
const DATASET_ID_RE = /^[A-Za-z0-9_-]{1,64}$/
// Provider IDs are slugs stored on provider_tests.provider_id
const PROVIDER_ID_RE = /^[a-z0-9][a-z0-9-]{1,63}$/

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

    const { datasetId, providerId } = await req.json()
    if (!datasetId || typeof datasetId !== 'string' || !DATASET_ID_RE.test(datasetId)) {
      return new Response(JSON.stringify({ error: 'Invalid datasetId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    // A provider scope is mandatory: without it a fuzzy name could overwrite
    // pricing on every provider in the catalogue.
    if (!providerId || typeof providerId !== 'string' || !PROVIDER_ID_RE.test(providerId)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing providerId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const { count: providerRowCount } = await supabaseClient
      .from('provider_tests')
      .select('id', { count: 'exact', head: true })
      .eq('provider_id', providerId)
    if (!providerRowCount) {
      return new Response(JSON.stringify({ error: `Unknown providerId: ${providerId}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const apifyToken = Deno.env.get('APIFY_API_TOKEN')
    if (!apifyToken) {
      return new Response(JSON.stringify({ error: 'APIFY_API_TOKEN is not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const response = await fetch(
      `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?clean=true&format=json`,
      { headers: { Authorization: `Bearer ${apifyToken}` } },
    )
    if (!response.ok) {
      const body = await response.text()
      return new Response(JSON.stringify({ error: `Apify dataset read failed [${response.status}]: ${body.slice(0, 500)}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502,
      })
    }
    const items = await response.json() as ProviderDatasetRow[]
    if (!Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Apify dataset did not return an array' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502,
      })
    }

    console.log(`Syncing ${items.length} items from Apify dataset ${datasetId} for provider ${providerId}`)

    const result = await applyProviderRows(supabaseClient, providerId, items)

    return new Response(JSON.stringify({
      success: true,
      provider_id: providerId,
      dataset_id: datasetId,
      items: items.length,
      matched: result.matched,
      updated: result.updated,
      skipped_ambiguous: result.skipped_ambiguous,
      skipped_unmatched: result.skipped_unmatched,
      unmatched: result.unmatched.slice(0, 100),
      errors: result.errors.slice(0, 20),
    }), {
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
