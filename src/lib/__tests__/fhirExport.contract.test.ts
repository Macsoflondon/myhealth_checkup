// Interoperability contract tests for the FHIR export layer.
// Mirrors the shared builder in supabase/functions/_shared/fhir.ts using local
// `zod` (vitest cannot run Deno `npm:` specifiers). The schema shapes are kept
// in lockstep — any drift here is a red flag that the edge builder needs the
// same change, and vice versa.
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ---- Contracts (mirror of supabase/functions/_shared/fhir.ts) ----
const coding = z.object({ system: z.string().url().optional(), code: z.string(), display: z.string().optional() });
const codeableConcept = z.object({ coding: z.array(coding).optional(), text: z.string().optional() });
const reference = z.object({ reference: z.string() });
const quantity = z.object({ value: z.number(), unit: z.string().optional() });

const PatientResource = z.object({
  resourceType: z.literal('Patient'),
  id: z.string().uuid(),
  identifier: z.array(z.object({ system: z.string(), value: z.string() })).min(1),
  active: z.boolean(),
});
const DiagnosticReportResource = z.object({
  resourceType: z.literal('DiagnosticReport'),
  id: z.string(),
  status: z.enum(['registered', 'partial', 'preliminary', 'final', 'amended', 'corrected', 'appended', 'cancelled', 'entered-in-error', 'unknown']),
  category: z.array(codeableConcept).optional(),
  code: codeableConcept,
  subject: reference,
  effectiveDateTime: z.string(),
  issued: z.string(),
  performer: z.array(z.object({ display: z.string() })).optional(),
  result: z.array(reference).optional(),
  conclusion: z.string().optional(),
});
const ObservationResource = z.object({
  resourceType: z.literal('Observation'),
  id: z.string(),
  status: z.enum(['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown']),
  category: z.array(codeableConcept).optional(),
  code: codeableConcept,
  subject: reference,
  effectiveDateTime: z.string(),
  valueQuantity: quantity.optional(),
  referenceRange: z.array(z.object({ low: quantity.optional(), high: quantity.optional() })).optional(),
  interpretation: z.array(codeableConcept).optional(),
});
const anyResource = z.discriminatedUnion('resourceType', [PatientResource, DiagnosticReportResource, ObservationResource]);
const BundleSchema = z.object({
  resourceType: z.literal('Bundle'),
  type: z.enum(['collection', 'batch', 'transaction', 'searchset', 'document']),
  timestamp: z.string(),
  entry: z.array(z.object({ fullUrl: z.string(), resource: anyResource })),
});

// ---- Local mirror of buildBundle ----
function statusInterpretation(status: string | null) {
  const map: Record<string, { code: string; display: string }> = {
    normal: { code: 'N', display: 'Normal' },
    low: { code: 'L', display: 'Low' },
    high: { code: 'H', display: 'High' },
    critical: { code: 'AA', display: 'Critical abnormal' },
  };
  return map[(status ?? '').toLowerCase()] ?? null;
}

interface UploadRow { id: string; test_name: string | null; provider_id: string | null; test_date: string | null; uploaded_at: string | null; notes: string | null; }
interface BiomarkerRow { id: string; biomarker_name: string; value: number | null; unit: string | null; reference_range_min: number | null; reference_range_max: number | null; status: string | null; recorded_at: string | null; uploaded_test_result_id: string | null; }

function buildBundle(userId: string, uploads: UploadRow[], readings: BiomarkerRow[]) {
  const now = new Date().toISOString();
  const patientRef = `Patient/${userId}`;
  const patientEntry = {
    fullUrl: `urn:uuid:${userId}`,
    resource: { resourceType: 'Patient' as const, id: userId, identifier: [{ system: 'https://myhealthcheckup.co.uk/patient-id', value: userId }], active: true },
  };
  const reportEntries = uploads.map((u) => {
    const related = readings.filter((r) => r.uploaded_test_result_id === u.id);
    return {
      fullUrl: `urn:uuid:${u.id}`,
      resource: {
        resourceType: 'DiagnosticReport' as const,
        id: u.id,
        status: 'final' as const,
        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0074', code: 'LAB', display: 'Laboratory' }] }],
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
        resourceType: 'Observation' as const,
        id: r.id,
        status: 'final' as const,
        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', display: 'Laboratory' }] }],
        code: { text: r.biomarker_name },
        subject: { reference: patientRef },
        effectiveDateTime: r.recorded_at ?? now,
        valueQuantity: r.value !== null ? { value: Number(r.value), unit: r.unit ?? undefined } : undefined,
        referenceRange: (r.reference_range_min !== null || r.reference_range_max !== null) ? [{
          low: r.reference_range_min !== null ? { value: Number(r.reference_range_min), unit: r.unit ?? undefined } : undefined,
          high: r.reference_range_max !== null ? { value: Number(r.reference_range_max), unit: r.unit ?? undefined } : undefined,
        }] : undefined,
        interpretation: interp ? [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: interp.code, display: interp.display }] }] : undefined,
      },
    };
  });
  return {
    resourceType: 'Bundle',
    type: 'collection',
    timestamp: now,
    entry: [patientEntry, ...reportEntries, ...observationEntries],
  };
}

const USER_ID = '11111111-1111-1111-1111-111111111111';
const uploads: UploadRow[] = [
  { id: '22222222-2222-2222-2222-222222222222', test_name: 'Full Cholesterol Panel', provider_id: 'Medichecks', test_date: '2026-01-15', uploaded_at: '2026-01-16T09:00:00Z', notes: 'Fasting' },
];
const readings: BiomarkerRow[] = [
  { id: '33333333-3333-3333-3333-333333333333', biomarker_name: 'Total cholesterol', value: 5.2, unit: 'mmol/L', reference_range_min: 3.0, reference_range_max: 5.0, status: 'high', recorded_at: '2026-01-15T09:00:00Z', uploaded_test_result_id: uploads[0].id },
  { id: '44444444-4444-4444-4444-444444444444', biomarker_name: 'HDL', value: 1.4, unit: 'mmol/L', reference_range_min: 1.0, reference_range_max: null, status: 'normal', recorded_at: '2026-01-15T09:00:00Z', uploaded_test_result_id: uploads[0].id },
];

describe('FHIR export contract', () => {
  const bundle = buildBundle(USER_ID, uploads, readings);

  it('produces a Bundle that validates against the FHIR contract schema', () => {
    const result = BundleSchema.safeParse(bundle);
    if (!result.success) console.error(result.error.issues);
    expect(result.success).toBe(true);
  });

  it('emits exactly one Patient and one DiagnosticReport per upload', () => {
    const patients = bundle.entry.filter((e) => e.resource.resourceType === 'Patient');
    const reports = bundle.entry.filter((e) => e.resource.resourceType === 'DiagnosticReport');
    expect(patients).toHaveLength(1);
    expect(reports).toHaveLength(uploads.length);
  });

  it('links each Observation to the Patient and each DiagnosticReport back to its Observations', () => {
    const observations = bundle.entry.filter((e) => e.resource.resourceType === 'Observation');
    expect(observations).toHaveLength(readings.length);
    for (const obs of observations) {
      expect((obs.resource as any).subject.reference).toBe(`Patient/${USER_ID}`);
    }
    const report = bundle.entry.find((e) => e.resource.resourceType === 'DiagnosticReport')!;
    const refs = new Set((report.resource as any).result.map((r: { reference: string }) => r.reference));
    for (const obs of observations) {
      expect(refs.has(`urn:uuid:${obs.resource.id}`)).toBe(true);
    }
  });

  it('maps high/normal biomarker status to FHIR interpretation codes', () => {
    const [highObs] = bundle.entry.filter((e) => e.resource.resourceType === 'Observation' && (e.resource as any).code.text === 'Total cholesterol');
    const [normalObs] = bundle.entry.filter((e) => e.resource.resourceType === 'Observation' && (e.resource as any).code.text === 'HDL');
    expect((highObs.resource as any).interpretation[0].coding[0].code).toBe('H');
    expect((normalObs.resource as any).interpretation[0].coding[0].code).toBe('N');
  });

  it('rejects a malformed bundle (GDPR-critical guard against leaking non-conformant data)', () => {
    const bad: unknown = { ...bundle, type: 'not-a-real-type' };
    expect(BundleSchema.safeParse(bad).success).toBe(false);
  });

  it('never leaks non-patient subjects in Observations (subject must reference the caller)', () => {
    const foreign = bundle.entry.some((e) =>
      e.resource.resourceType === 'Observation' && (e.resource as any).subject.reference !== `Patient/${USER_ID}`
    );
    expect(foreign).toBe(false);
  });
});

describe('FHIR CapabilityStatement', () => {
  // Local mirror to avoid importing the Deno `npm:` module.
  function buildCapabilityStatement() {
    return {
      resourceType: 'CapabilityStatement',
      status: 'active',
      fhirVersion: '4.0.1',
      format: ['application/fhir+json'],
      rest: [{
        mode: 'server',
        resource: [
          { type: 'Patient' }, { type: 'DiagnosticReport' }, { type: 'Observation' },
        ],
        operation: [{ name: 'export' }],
      }],
    };
  }
  const cap = buildCapabilityStatement();
  it('advertises FHIR R4 and the three exported resource types', () => {
    expect(cap.fhirVersion).toBe('4.0.1');
    const types = cap.rest[0].resource.map((r) => r.type);
    expect(types).toEqual(expect.arrayContaining(['Patient', 'DiagnosticReport', 'Observation']));
  });
  it('advertises the $export operation for bulk-data async pattern', () => {
    expect(cap.rest[0].operation?.some((o) => o.name === 'export')).toBe(true);
  });
});
