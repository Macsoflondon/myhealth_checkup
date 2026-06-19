// Cyber Essentials: CSP violation report sink.
// Accepts application/csp-report and application/reports+json.
// Rate-limited per IP, payload capped, never reflects input back.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const MAX_BODY_BYTES = 16_384;
const MAX_REPORTS_PER_HOUR = 200;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(null, { status: 405, headers: corsHeaders });
  }

  try {
    const ct = (req.headers.get('content-type') ?? '').toLowerCase();
    if (!ct.includes('csp-report') && !ct.includes('reports+json') && !ct.includes('application/json')) {
      return new Response(null, { status: 415, headers: corsHeaders });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 413, headers: corsHeaders });
    }

    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { return new Response(null, { status: 400, headers: corsHeaders }); }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const ip = (req.headers.get('cf-connecting-ip')
      ?? req.headers.get('x-forwarded-for')?.split(',')[0]
      ?? 'unknown').trim();

    const windowStart = new Date(Date.now() - 60 * 60_000).toISOString();
    const { count } = await supabase
      .from('api_rate_limits')
      .select('id', { count: 'exact', head: true })
      .eq('client_key', `csp:${ip}`)
      .eq('endpoint', 'csp-report')
      .gte('window_start', windowStart);
    if ((count ?? 0) >= MAX_REPORTS_PER_HOUR) {
      return new Response(null, { status: 429, headers: corsHeaders });
    }

    await supabase.from('api_rate_limits').insert({
      client_key: `csp:${ip}`,
      endpoint: 'csp-report',
      window_start: new Date().toISOString(),
    });

    // Persist as a security snapshot row (already RLS-protected, admin-only read).
    await supabase.from('security_scan_snapshots').insert({
      scanner: 'csp-report',
      severity: 'info',
      finding_id: 'csp_violation',
      title: 'CSP violation reported by browser',
      details: parsed as Record<string, unknown>,
      ip_address: ip,
    }).select('id').maybeSingle();

    return new Response(null, { status: 204, headers: corsHeaders });
  } catch {
    return new Response(null, { status: 500, headers: corsHeaders });
  }
});
