// Shared FHIR R4 builders + Zod contracts for interoperability validation.
// Used by the fhir-export edge function and by unit tests (Deno + Vitest via npm:zod).
import { z } from 'npm:zod@3.23.8';

export const FHIR_BASE_URL = 'https://myhealthcheckup.co.uk/fhir';

// -- Zod contracts (subset of FHIR R4 relevant to blood-test exports) --
const coding = z.object({
  system: z.string().url().optional(),
  code: z.string(),
  display: z.string().optional(),
});

const codeableConcept = z.object({
  coding: z.array(coding).optional(),
  text: z.string().optional(),
});

const reference = z.object({ reference: z.string() });

const quantity = z.object({
  value: z.number(),
  unit: z.string().optional(),
  system: z.string().optional(),
  code: z.string().optional(),
});

export const PatientResource = z.object({
  resourceType: z.literal('Patient'),
  id: z.string().uuid(),
  identifier: z.array(z.object({ system: z.string(), value: z.string() })).min(1),
  active: z.boolean(),
});

export const DiagnosticReportResource = z.object({
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

export const ObservationResource = z.object({
  resourceType: z.literal('Observation'),
  id: z.string(),
  status: z.enum(['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown']),
  category: z.array(codeableConcept).optional(),
  code: codeableConcept,
  subject: reference,
  effectiveDateTime: z.string(),
  valueQuantity: quantity.optional(),
  referenceRange: z.array(z.object({
    low: quantity.optional(),
    high: quantity.optional(),
  })).optional(),
  interpretation: z.array(codeableConcept).optional(),
});

const anyResource = z.discriminatedUnion('resourceType', [
  PatientResource,
  DiagnosticReportResource,
  ObservationResource,
]);

export const BundleSchema = z.object({
  resourceType: z.literal('Bundle'),
  type: z.enum(['collection', 'batch', 'transaction', 'searchset', 'document']),
  timestamp: z.string(),
  meta: z.object({
    profile: z.array(z.string()).optional(),
    tag: z.array(coding).optional(),
  }).optional(),
  entry: z.array(z.object({
    fullUrl: z.string(),
    resource: anyResource,
  })),
});

export type Bundle = z.infer<typeof BundleSchema>;

// -- Builders --
export interface BiomarkerRow {
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

export interface UploadRow {
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

export function buildBundle(userId: string, uploads: UploadRow[], readings: BiomarkerRow[]): Bundle {
  const now = new Date().toISOString();
  const patientRef = `Patient/${userId}`;

  const patientEntry = {
    fullUrl: `urn:uuid:${userId}`,
    resource: {
      resourceType: 'Patient' as const,
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
        resourceType: 'DiagnosticReport' as const,
        id: u.id,
        status: 'final' as const,
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
        resourceType: 'Observation' as const,
        id: r.id,
        status: 'final' as const,
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

/** Validate a Bundle and return the typed value; throws with detailed issues on failure. */
export function validateBundle(bundle: unknown): Bundle {
  const parsed = BundleSchema.safeParse(bundle);
  if (!parsed.success) {
    const issues = parsed.error.issues.slice(0, 10).map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; ');
    throw new Error(`FHIR Bundle validation failed: ${issues}`);
  }
  return parsed.data;
}

/** Minimal FHIR CapabilityStatement describing what this server supports. */
export function buildCapabilityStatement(baseUrl: string = FHIR_BASE_URL) {
  const now = new Date().toISOString();
  return {
    resourceType: 'CapabilityStatement',
    status: 'active',
    date: now,
    publisher: 'MYHEALTHCHECKUP LTD',
    kind: 'instance',
    software: {
      name: 'myhealth checkup FHIR Export',
      version: '1.1.0',
    },
    implementation: {
      description: 'Patient-initiated FHIR R4 export of self-uploaded blood-test results (GDPR Art. 20 portability).',
      url: baseUrl,
    },
    fhirVersion: '4.0.1',
    format: ['application/fhir+json'],
    rest: [{
      mode: 'server',
      security: {
        cors: true,
        service: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/restful-security-service',
            code: 'OAuth',
            display: 'OAuth (Supabase JWT)',
          }],
        }],
      },
      resource: [
        { type: 'Patient', interaction: [{ code: 'read' }] },
        { type: 'DiagnosticReport', interaction: [{ code: 'read' }, { code: 'search-type' }] },
        { type: 'Observation', interaction: [{ code: 'read' }, { code: 'search-type' }] },
      ],
      operation: [
        {
          name: 'export',
          definition: 'http://hl7.org/fhir/uv/bulkdata/OperationDefinition/patient-export',
          documentation: 'Async patient-scoped bulk export. Returns 202 + Content-Location header pointing to a polling URL.',
        },
      ],
    }],
  };
}
