// SIEM export: ships new audit / role / edge-function / CSP log rows to an
// external SIEM webhook (Datadog, Elastic, Splunk HEC, Panther, etc.).
//
// - Cron-triggered (or manually invocable by an admin token).
// - Never trusts caller for source selection; only known sources are pulled.
// - Batches are HMAC-signed with SIEM_HMAC_SECRET so the receiver can verify
//   authenticity independently of transport auth.
// - Cursor is stored in public.siem_export_cursor; rows in audit_logs are
//   stamped with siem_exported_at so re-runs are idempotent.
// - Fails soft: on any per-source error we record last_error and continue.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBHOOK = Deno.env.get('SIEM_WEBHOOK_URL') ?? '';
const HMAC_SECRET = Deno.env.get('SIEM_HMAC_SECRET') ?? '';
const CRON_SECRET = Deno.env.get('SCRAPER_CRON_SECRET') ?? '';
const BATCH_SIZE = 500;

type Source = 'audit_logs' | 'role_audit_log' | 'edge_function_logs' | 'csp_reports';
const SOURCES: readonly Source[] = ['audit_logs', 'role_audit_log', 'edge_function_logs', 'csp_reports'] as const;

const timeCol: Record<Source, string> = {
  audit_logs: 'created_at',
  role_audit_log: 'created_at',
  edge_function_logs: 'created_at',
  csp_reports: 'received_at',
};

async function hmacSign(body: string): Promise<string> {
  if (!HMAC_SECRET) return '';
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(HMAC_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function shipBatch(source: Source, records: unknown[]): Promise<void> {
  if (records.length === 0 || !WEBHOOK) return;
  const body = JSON.stringify({
    source,
    exported_at: new Date().toISOString(),
    count: records.length,
    records,
  });
  const sig = await hmacSign(body);
  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MHC-Source': source,
      'X-MHC-Signature': sig,
    },
    body,
  });
  if (!res.ok) throw new Error(`SIEM webhook ${res.status}: ${await res.text().catch(() => '')}`);
}

async function exportSource(sb: ReturnType<typeof createClient>, source: Source) {
  const { data: cursorRow } = await sb
    .from('siem_export_cursor')
    .select('last_exported_at, last_exported_id')
    .eq('source', source)
    .maybeSingle();
  const since: string = (cursorRow?.last_exported_at as string | undefined) ?? '1970-01-01T00:00:00Z';
  const col = timeCol[source];

  const { data: rows, error } = await sb
    .from(source)
    .select('*')
    .gt(col, since)
    .order(col, { ascending: true })
    .limit(BATCH_SIZE);
  if (error) throw error;
  const batch = rows ?? [];
  if (batch.length === 0) {
    await sb.from('siem_export_cursor').update({
      last_run_at: new Date().toISOString(), last_batch_size: 0, last_error: null,
    }).eq('source', source);
    return { source, exported: 0 };
  }

  await shipBatch(source, batch);
  const last = batch[batch.length - 1] as Record<string, unknown>;
  const lastTs = last[col] as string;
  const lastId = (last.id as string | undefined) ?? null;

  await sb.from('siem_export_cursor').update({
    last_exported_at: lastTs,
    last_exported_id: lastId,
    last_run_at: new Date().toISOString(),
    last_batch_size: batch.length,
    last_error: null,
  }).eq('source', source);

  if (source === 'audit_logs') {
    const ids = batch.map((r) => (r as { id: string }).id);
    await sb.from('audit_logs').update({ siem_exported_at: new Date().toISOString() }).in('id', ids);
  }
  return { source, exported: batch.length };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // AuthN: either the cron secret header (server-to-server) or an admin JWT.
  const cronHeader = req.headers.get('x-cron-secret');
  const authHeader = req.headers.get('Authorization') ?? '';
  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

  let allowed = Boolean(CRON_SECRET) && cronHeader === CRON_SECRET;
  if (!allowed && authHeader.startsWith('Bearer ')) {
    const jwt = authHeader.slice(7);
    const anon = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data } = await anon.auth.getClaims(jwt);
    const uid = data?.claims?.sub as string | undefined;
    if (uid) {
      const { data: role } = await sb.rpc('has_role', { _user_id: uid, _role: 'admin' });
      allowed = role === true;
    }
  }
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!WEBHOOK) {
    return new Response(JSON.stringify({
      skipped: true,
      reason: 'SIEM_WEBHOOK_URL not configured',
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const results: Array<{ source: Source; exported?: number; error?: string }> = [];
  for (const s of SOURCES) {
    try {
      results.push(await exportSource(sb, s));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await sb.from('siem_export_cursor').update({
        last_run_at: new Date().toISOString(),
        last_error: msg.slice(0, 500),
      }).eq('source', s);
      results.push({ source: s, error: msg });
    }
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
