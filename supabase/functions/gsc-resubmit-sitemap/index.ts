// Resubmits the sitemap to Google Search Console via the Lovable connector gateway.
// Trigger: HTTP (manual / webhook / GitHub Action) or pg_cron schedule.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY = 'https://connector-gateway.lovable.dev/google_search_console';
const SITE = 'https://www.myhealthcheckup.co.uk/';
const SITEMAP = 'https://www.myhealthcheckup.co.uk/sitemap.xml';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${SERVICE_KEY}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const GSC_KEY = Deno.env.get('GOOGLE_SEARCH_CONSOLE_API_KEY');
  if (!LOVABLE_API_KEY) return json({ error: 'LOVABLE_API_KEY missing' }, 500);
  if (!GSC_KEY) return json({ error: 'GOOGLE_SEARCH_CONSOLE_API_KEY missing' }, 500);

  const headers = {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    'X-Connection-Api-Key': GSC_KEY,
  };

  const site = encodeURIComponent(SITE);
  const sitemap = encodeURIComponent(SITEMAP);
  const url = `${GATEWAY}/webmasters/v3/sites/${site}/sitemaps/${sitemap}`;

  try {
    const res = await fetch(url, { method: 'PUT', headers });
    const body = await res.text();
    if (!res.ok) {
      console.error('GSC submit failed', res.status, body);
      return json({ ok: false, status: res.status, body }, 502);
    }
    // Verify
    const list = await fetch(`${GATEWAY}/webmasters/v3/sites/${site}/sitemaps`, { headers });
    const data = await list.json();
    return json({ ok: true, submittedAt: new Date().toISOString(), sitemap: SITEMAP, gsc: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('GSC submit error', msg);
    return json({ ok: false, error: msg }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
