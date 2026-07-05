// FHIR R4 export + async bulk-data pattern + consent-based sharing grants.
//
// Routes (all under /fhir-export):
//   GET  /metadata            -> FHIR CapabilityStatement
//   GET  /consent             -> current export consent status
//   POST /consent             -> grant/withdraw consent { grant: boolean }
//   GET  /                    -> synchronous FHIR Bundle download (kept for backward compat)
//   POST /$export             -> async export kickoff (202 + Content-Location)
//   GET  /status/:jobId       -> async export status/manifest
//   GET  /output/:jobId       -> download completed bundle
//   GET  /grants              -> list caller's data-sharing grants
//   POST /grants              -> create grant { recipient_email, recipient_org?, purpose, expires_in_days? }
//   POST /grants/:id/revoke   -> revoke grant { reason }
//   GET  /shared/:token       -> anonymous fetch by grant access token (recipient view)
import { createClient } from 'npm:@supabase/supabase-js@2';
import { buildBundle, buildCapabilityStatement, validateBundle } from '../_shared/fhir.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const CONSENT_TYPE = 'fhir_data_export';

function json(status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...extra },
  });
}

function fhirJson(status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json', ...extra },
  });
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randomToken(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function fetchUserData(supabase: ReturnType<typeof createClient>, userId: string) {
  const [uploadsRes, readingsRes] = await Promise.all([
    supabase
      .from('uploaded_test_results')
      .select('id, test_name, provider_id, test_date, uploaded_at, notes')
      .eq('user_id', userId),
    supabase
      .from('biomarker_readings')
      .select('id, biomarker_name, value, unit, reference_range_min, reference_range_max, status, recorded_at, uploaded_test_result_id')
      .eq('user_id', userId),
  ]);
  if (uploadsRes.error) throw new Error(uploadsRes.error.message);
  if (readingsRes.error) throw new Error(readingsRes.error.message);
  return { uploads: (uploadsRes.data as any[]) ?? [], readings: (readingsRes.data as any[]) ?? [] };
}

async function activeConsent(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from('user_consents')
    .select('id')
    .eq('user_id', userId)
    .eq('consent_type', CONSENT_TYPE)
    .eq('consent_given', true)
    .is('consent_withdrawn_date', null)
    .order('consent_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  return !!data;
}

async function auditRead(supabase: ReturnType<typeof createClient>, reason: string, purpose: string) {
  try {
    await supabase.rpc('log_data_access_with_reason', {
      _table_name: 'uploaded_test_results',
      _record_id: null,
      _reason_code: reason,
      _purpose: purpose,
      _classification: 'C3',
    });
  } catch (_) { /* non-fatal */ }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const url = new URL(req.url);
  // The function is mounted under /functions/v1/fhir-export/... — normalise the path
  const path = url.pathname.replace(/^.*\/fhir-export/, '') || '/';

  // ---------- Public routes (no auth) ----------
  if (req.method === 'GET' && path === '/metadata') {
    return fhirJson(200, buildCapabilityStatement(url.origin + '/functions/v1/fhir-export'));
  }

  // Recipient anonymous fetch via grant access token
  const sharedMatch = path.match(/^\/shared\/([a-f0-9]{32,})$/);
  if (req.method === 'GET' && sharedMatch) {
    const token = sharedMatch[1];
    const tokenHash = await sha256Hex(token);
    const svc = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: grant } = await svc
      .from('data_sharing_grants')
      .select('id, user_id, status, expires_at, scope')
      .eq('access_token_hash', tokenHash)
      .maybeSingle();
    if (!grant) return json(404, { error: 'not_found' });
    if (grant.status !== 'active') return json(410, { error: 'grant_' + grant.status });
    if (new Date(grant.expires_at as string).getTime() < Date.now()) {
      await svc.from('data_sharing_grants').update({ status: 'expired' }).eq('id', grant.id);
      return json(410, { error: 'grant_expired' });
    }
    try {
      const { uploads, readings } = await fetchUserData(svc, grant.user_id as string);
      const bundle = validateBundle(buildBundle(grant.user_id as string, uploads, readings));
      await svc.from('data_sharing_grants').update({
        last_accessed_at: new Date().toISOString(),
        access_count: (grant as any).access_count ? (grant as any).access_count + 1 : 1,
      }).eq('id', grant.id);
      await auditRead(svc, 'DATA_SHARING_GRANT_ACCESS', `Recipient accessed grant ${grant.id}`);
      return fhirJson(200, bundle);
    } catch (e) {
      return json(500, { error: e instanceof Error ? e.message : 'export_failed' });
    }
  }

  // ---------- Authenticated routes ----------
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return json(401, { error: 'Unauthorized' });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace('Bearer ', '');
  const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
  if (claimsErr || !claimsData?.claims?.sub) return json(401, { error: 'Unauthorized' });
  const userId = claimsData.claims.sub as string;

  // ---- consent ----
  if (path === '/consent') {
    if (req.method === 'GET') {
      const { data } = await supabase
        .from('user_consents')
        .select('consent_given, consent_date, consent_withdrawn_date, version')
        .eq('user_id', userId)
        .eq('consent_type', CONSENT_TYPE)
        .order('consent_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      const active = !!data?.consent_given && !data?.consent_withdrawn_date;
      return json(200, { active, record: data ?? null });
    }
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const grant = body?.grant === true;
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
      const ua = req.headers.get('user-agent') ?? null;
      if (grant) {
        const { error } = await supabase.from('user_consents').insert({
          user_id: userId,
          consent_type: CONSENT_TYPE,
          consent_given: true,
          consent_date: new Date().toISOString(),
          ip_address: ip,
          user_agent: ua,
          version: '1.0',
        });
        if (error) return json(400, { error: error.message });
        return json(200, { active: true });
      }
      const { data: latest } = await supabase
        .from('user_consents')
        .select('id')
        .eq('user_id', userId)
        .eq('consent_type', CONSENT_TYPE)
        .eq('consent_given', true)
        .is('consent_withdrawn_date', null)
        .order('consent_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (latest?.id) {
        await supabase.from('user_consents')
          .update({ consent_withdrawn_date: new Date().toISOString() })
          .eq('id', latest.id);
      }
      return json(200, { active: false });
    }
  }

  // ---- Async $export (kickoff) ----
  if (req.method === 'POST' && path === '/$export') {
    if (!(await activeConsent(supabase, userId))) {
      return json(403, { error: 'consent_required' });
    }
    const params = await req.json().catch(() => ({}));
    const { data: job, error } = await supabase.from('fhir_export_jobs').insert({
      user_id: userId,
      status: 'accepted',
      request_params: params ?? {},
    }).select('id').single();
    if (error || !job) return json(500, { error: error?.message ?? 'insert_failed' });

    // Process inline (edge functions have no queue) — small dataset per user, well within CPU budget.
    (async () => {
      const svc = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      await svc.from('fhir_export_jobs').update({ status: 'in-progress' }).eq('id', job.id);
      try {
        const { uploads, readings } = await fetchUserData(svc, userId);
        const bundle = validateBundle(buildBundle(userId, uploads, readings));
        await svc.from('fhir_export_jobs').update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          output: {
            transactionTime: new Date().toISOString(),
            request: `${url.origin}/functions/v1/fhir-export/$export`,
            requiresAccessToken: true,
            output: [
              { type: 'Bundle', url: `${url.origin}/functions/v1/fhir-export/output/${job.id}`, count: bundle.entry.length },
            ],
            error: [],
            bundle,
          },
        }).eq('id', job.id);
        await auditRead(svc, 'FHIR_ASYNC_EXPORT', `Async $export job ${job.id}`);
      } catch (e) {
        await svc.from('fhir_export_jobs').update({
          status: 'error',
          error_message: e instanceof Error ? e.message : String(e),
          completed_at: new Date().toISOString(),
        }).eq('id', job.id);
      }
    })();

    const contentLocation = `${url.origin}/functions/v1/fhir-export/status/${job.id}`;
    return new Response(null, {
      status: 202,
      headers: { ...corsHeaders, 'Content-Location': contentLocation },
    });
  }

  // ---- Async status polling ----
  const statusMatch = path.match(/^\/status\/([0-9a-f-]{36})$/);
  if (req.method === 'GET' && statusMatch) {
    const jobId = statusMatch[1];
    const { data: job, error } = await supabase
      .from('fhir_export_jobs')
      .select('id, user_id, status, output, error_message, requested_at, completed_at, expires_at')
      .eq('id', jobId)
      .maybeSingle();
    if (error || !job) return json(404, { error: 'job_not_found' });
    if (job.user_id !== userId) return json(403, { error: 'forbidden' });
    if (job.status === 'accepted' || job.status === 'in-progress') {
      return new Response(null, { status: 202, headers: { ...corsHeaders, 'X-Progress': job.status } });
    }
    if (job.status === 'error') return json(500, { error: job.error_message ?? 'export_failed' });
    // completed — return manifest (Bulk Data spec: exclude the inline bundle from manifest)
    const output = (job.output as any) ?? {};
    const { bundle: _drop, ...manifest } = output;
    return json(200, manifest);
  }

  // ---- Async output download ----
  const outputMatch = path.match(/^\/output\/([0-9a-f-]{36})$/);
  if (req.method === 'GET' && outputMatch) {
    const jobId = outputMatch[1];
    const { data: job } = await supabase
      .from('fhir_export_jobs')
      .select('user_id, status, output, expires_at')
      .eq('id', jobId)
      .maybeSingle();
    if (!job) return json(404, { error: 'job_not_found' });
    if (job.user_id !== userId) return json(403, { error: 'forbidden' });
    if (job.status !== 'completed') return json(425, { error: 'not_ready' });
    if (new Date(job.expires_at as string).getTime() < Date.now()) return json(410, { error: 'expired' });
    const bundle = (job.output as any)?.bundle;
    if (!bundle) return json(404, { error: 'no_bundle' });
    const filename = `myhealthcheckup-fhir-${userId}-${new Date().toISOString().slice(0, 10)}.json`;
    return fhirJson(200, bundle, {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    });
  }

  // ---- Sharing grants ----
  if (path === '/grants') {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('data_sharing_grants')
        .select('id, recipient_email, recipient_org, purpose, status, scope, granted_at, expires_at, revoked_at, revoked_reason, last_accessed_at, access_count')
        .eq('user_id', userId)
        .order('granted_at', { ascending: false });
      if (error) return json(500, { error: error.message });
      return json(200, { grants: data ?? [] });
    }
    if (req.method === 'POST') {
      if (!(await activeConsent(supabase, userId))) return json(403, { error: 'consent_required' });
      const body = await req.json().catch(() => ({}));
      const recipient_email = String(body?.recipient_email ?? '').trim().toLowerCase();
      const purpose = String(body?.purpose ?? '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient_email)) return json(400, { error: 'invalid_email' });
      if (purpose.length < 10 || purpose.length > 500) return json(400, { error: 'purpose_length_10_500' });
      const expires_in_days = Math.min(90, Math.max(1, Number(body?.expires_in_days ?? 30)));
      const rawToken = randomToken(32);
      const access_token_hash = await sha256Hex(rawToken);
      const { data, error } = await supabase.from('data_sharing_grants').insert({
        user_id: userId,
        recipient_email,
        recipient_org: body?.recipient_org ? String(body.recipient_org).slice(0, 200) : null,
        purpose,
        access_token_hash,
        expires_at: new Date(Date.now() + expires_in_days * 86400_000).toISOString(),
        scope: body?.scope ?? { resources: ['Patient', 'DiagnosticReport', 'Observation'] },
      }).select('id, expires_at').single();
      if (error || !data) return json(500, { error: error?.message ?? 'insert_failed' });
      const shareUrl = `${url.origin}/functions/v1/fhir-export/shared/${rawToken}`;
      return json(201, { id: data.id, expires_at: data.expires_at, access_token: rawToken, share_url: shareUrl });
    }
  }

  const revokeMatch = path.match(/^\/grants\/([0-9a-f-]{36})\/revoke$/);
  if (req.method === 'POST' && revokeMatch) {
    const id = revokeMatch[1];
    const body = await req.json().catch(() => ({}));
    const reason = String(body?.reason ?? '').trim();
    if (reason.length < 3) return json(400, { error: 'reason_required' });
    const { error } = await supabase.from('data_sharing_grants').update({
      status: 'revoked',
      revoked_at: new Date().toISOString(),
      revoked_reason: reason,
    }).eq('id', id).eq('user_id', userId);
    if (error) return json(500, { error: error.message });
    return json(200, { revoked: true });
  }

  // ---- Legacy synchronous download (kept for backward compat) ----
  if (req.method === 'GET' && (path === '/' || path === '')) {
    if (!(await activeConsent(supabase, userId))) {
      return json(403, { error: 'consent_required', message: 'Grant FHIR export consent before downloading.' });
    }
    try {
      const { uploads, readings } = await fetchUserData(supabase, userId);
      const bundle = validateBundle(buildBundle(userId, uploads, readings));
      await auditRead(supabase, 'FHIR_SELF_EXPORT', 'Patient-initiated FHIR R4 export (Art.20 portability).');
      const filename = `myhealthcheckup-fhir-${userId}-${new Date().toISOString().slice(0, 10)}.json`;
      return fhirJson(200, bundle, {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      });
    } catch (e) {
      return json(500, { error: e instanceof Error ? e.message : 'export_failed' });
    }
  }

  return json(404, { error: 'not_found', path });
});
