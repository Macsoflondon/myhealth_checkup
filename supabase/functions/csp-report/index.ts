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

    // Persist to csp_reports (admin-readable, service-role writable).
    const r = (parsed as any)?.['csp-report'] ?? parsed;
    await supabase.from('csp_reports').insert({
      ip_address: ip,
      user_agent: req.headers.get('user-agent')?.slice(0, 512) ?? null,
      report: parsed,
      document_uri: typeof r?.['document-uri'] === 'string' ? r['document-uri'].slice(0, 2048) : null,
      violated_directive: typeof r?.['violated-directive'] === 'string' ? r['violated-directive'].slice(0, 256) : null,
      blocked_uri: typeof r?.['blocked-uri'] === 'string' ? r['blocked-uri'].slice(0, 2048) : null,
    });

    return new Response(null, { status: 204, headers: corsHeaders });
  } catch {
    return new Response(null, { status: 500, headers: corsHeaders });
  }
});
