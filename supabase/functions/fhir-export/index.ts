// FHIR R4-shaped export of a user's own uploaded blood-test results.
// Consent-gated (user_consents.consent_type='fhir_data_export'), audit-logged
// (audit_logs), scoped strictly to the caller (auth.uid()).
//
// GET  /fhir-export           -> FHIR Bundle (application/fhir+json) download
// POST /fhir-export/consent   -> body { grant: boolean } (grants/withdraws)
// GET  /fhir-export/consent   -> current consent status
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const CONSENT_TYPE = 'fhir_data_export';

function json(status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...extra },
  });
}

interface BiomarkerRow {
  id: string;
  biomarker_name: string;
  value: number | null;
  unit: string | null;
  reference_range_min: number | null;
  reference_range_max: number | null;
  status: string | null;
  recorded_at: string | null;
  uploaded_test_result_id: string | null;
}

interface UploadRow {
  id: string;
  test_name: string | null;
  provider_id: string | null;
  test_date: string | null;
  uploaded_at: string | null;
  notes: string | null;
}

function statusInterpretation(status: string | null) {
  const map: Record<string, { code: string; display: string }> = {
    normal: { code: 'N', display: 'Normal' },
    low: { code: 'L', display: 'Low' },
    high: { code: 'H', display: 'High' },
    critical: { code: 'AA', display: 'Critical abnormal' },
  };
  return map[(status ?? '').toLowerCase()] ?? null;
}

function buildBundle(userId: string, uploads: UploadRow[], readings: BiomarkerRow[]) {
  const now = new Date().toISOString();
  const patientRef = `Patient/${userId}`;

  const patientEntry = {
    fullUrl: `urn:uuid:${userId}`,
    resource: {
      resourceType: 'Patient',
      id: userId,
      identifier: [{ system: 'https://myhealthcheckup.co.uk/patient-id', value: userId }],
      active: true,
    },
  };

  const reportEntries = uploads.map((u) => {
    const related = readings.filter((r) => r.uploaded_test_result_id === u.id);
    return {
      fullUrl: `urn:uuid:${u.id}`,
      resource: {
        resourceType: 'DiagnosticReport',
        id: u.id,
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
            code: 'LAB',
            display: 'Laboratory',
          }],
        }],
        code: { text: u.test_name ?? 'Uploaded blood test' },
        subject: { reference: patientRef },
        effectiveDateTime: u.test_date ?? u.uploaded_at ?? now,
        issued: u.uploaded_at ?? now,
        performer: u.provider_id ? [{ display: u.provider_id }] : undefined,
        result: related.map((r) => ({ reference: `urn:uuid:${r.id}` })),
        conclusion: u.notes ?? undefined,
      },
    };
  });

  const observationEntries = readings.map((r) => {
    const interp = statusInterpretation(r.status);
    return {
      fullUrl: `urn:uuid:${r.id}`,
      resource: {
        resourceType: 'Observation',
        id: r.id,
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'laboratory',
            display: 'Laboratory',
          }],
        }],
        code: { text: r.biomarker_name },
        subject: { reference: patientRef },
        effectiveDateTime: r.recorded_at ?? now,
        valueQuantity: r.value !== null ? {
          value: Number(r.value),
          unit: r.unit ?? undefined,
        } : undefined,
        referenceRange: (r.reference_range_min !== null || r.reference_range_max !== null) ? [{
          low: r.reference_range_min !== null ? { value: Number(r.reference_range_min), unit: r.unit ?? undefined } : undefined,
          high: r.reference_range_max !== null ? { value: Number(r.reference_range_max), unit: r.unit ?? undefined } : undefined,
        }] : undefined,
        interpretation: interp ? [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
            code: interp.code,
            display: interp.display,
          }],
        }] : undefined,
      },
    };
  });

  return {
    resourceType: 'Bundle',
    type: 'collection',
    timestamp: now,
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/Bundle'],
      tag: [{ system: 'https://myhealthcheckup.co.uk/tags', code: 'patient-self-export' }],
    },
    entry: [patientEntry, ...reportEntries, ...observationEntries],
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json(401, { error: 'Unauthorized' });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
  if (claimsErr || !claimsData?.claims?.sub) {
    return json(401, { error: 'Unauthorized' });
  }
  const userId = claimsData.claims.sub as string;

  const url = new URL(req.url);
  const isConsent = url.pathname.endsWith('/consent');

  // --- Consent management ---
  if (isConsent) {
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
      // withdraw: mark most recent active as withdrawn
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
    return json(405, { error: 'Method not allowed' });
  }

  // --- Export bundle (GET only) ---
  if (req.method !== 'GET') return json(405, { error: 'Method not allowed' });

  // Enforce active consent
  const { data: consent } = await supabase
    .from('user_consents')
    .select('consent_given, consent_withdrawn_date')
    .eq('user_id', userId)
    .eq('consent_type', CONSENT_TYPE)
    .eq('consent_given', true)
    .is('consent_withdrawn_date', null)
    .order('consent_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!consent) {
    return json(403, {
      error: 'consent_required',
      message: 'Grant FHIR export consent before downloading your data.',
    });
  }

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

  if (uploadsRes.error) return json(500, { error: uploadsRes.error.message });
  if (readingsRes.error) return json(500, { error: readingsRes.error.message });

  const bundle = buildBundle(userId, uploadsRes.data ?? [], readingsRes.data ?? []);

  // Audit-log the export via existing security-definer helper.
  await supabase.rpc('log_data_access_with_reason', {
    _table_name: 'uploaded_test_results',
    _record_id: null,
    _reason_code: 'FHIR_SELF_EXPORT',
    _purpose: 'Patient-initiated FHIR R4 export of own health data (GDPR Art.20 portability).',
    _classification: 'C3',
  });

  const filename = `myhealthcheckup-fhir-${userId}-${new Date().toISOString().slice(0, 10)}.json`;
  return new Response(JSON.stringify(bundle, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/fhir+json',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
});
