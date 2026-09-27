import { supabase } from "@/integrations/supabase/client";
import type {
  BiomarkerSeriesSummary,
  CyclePhase,
  ObservationRecord,
  ValidationStatus,
  VerificationStatus,
} from "@/types/health-intelligence";
import { buildBiomarkerSeries, type SeriesOptions } from "@/lib/health/biomarker-series";

/**
 * Read layer for the personal health record.
 *
 * Every read goes through row-level security as the signed-in user, and the
 * database only returns observations belonging to a released report — the
 * release gate is enforced in the database, not here.
 */

interface ObservationRow {
  id: string;
  biomarker_id: string | null;
  source_value: string;
  source_unit: string | null;
  canonical_value: number | null;
  canonical_unit: string | null;
  source_reference_low: number | null;
  source_reference_high: number | null;
  collected_at: string | null;
  resulted_at: string | null;
  laboratory_name: string | null;
  method: string | null;
  validation_status: ValidationStatus;
  verification_status: VerificationStatus;
  cycle_phase: CyclePhase;
  cycle_day: number | null;
  biomarker_hub: { name: string | null } | { name: string | null }[] | null;
}

const biomarkerNameOf = (row: ObservationRow): string | null => {
  const joined = row.biomarker_hub;
  if (!joined) return null;
  return Array.isArray(joined) ? (joined[0]?.name ?? null) : joined.name;
};

export const toObservationRecord = (row: ObservationRow): ObservationRecord => ({
  id: row.id,
  biomarkerId: row.biomarker_id,
  biomarkerName: biomarkerNameOf(row),
  sourceValue: row.source_value,
  sourceUnit: row.source_unit,
  canonicalValue: row.canonical_value,
  canonicalUnit: row.canonical_unit,
  sourceReferenceLow: row.source_reference_low,
  sourceReferenceHigh: row.source_reference_high,
  collectedAt: row.collected_at,
  resultedAt: row.resulted_at,
  laboratoryName: row.laboratory_name,
  method: row.method,
  validationStatus: row.validation_status,
  verificationStatus: row.verification_status,
  cyclePhase: row.cycle_phase,
  cycleDay: row.cycle_day,
});

const OBSERVATION_SELECT = `
  id, biomarker_id, source_value, source_unit, canonical_value, canonical_unit,
  source_reference_low, source_reference_high, collected_at, resulted_at,
  laboratory_name, method, validation_status, verification_status,
  cycle_phase, cycle_day, biomarker_hub ( name )
` as const;

export interface HealthProfileSummary {
  readonly id: string;
  readonly displayName: string | null;
  readonly isPrimary: boolean;
}

export const listHealthProfiles = async (): Promise<HealthProfileSummary[]> => {
  const { data, error } = await supabase
    .from("health_profiles")
    .select("id, display_name, is_primary")
    .order("is_primary", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    displayName: row.display_name,
    isPrimary: row.is_primary,
  }));
};

/** All released observations for one biomarker, oldest first. */
export const fetchBiomarkerObservations = async (
  healthProfileId: string,
  biomarkerId: string,
): Promise<ObservationRecord[]> => {
  const { data, error } = await supabase
    .from("observations")
    .select(OBSERVATION_SELECT)
    .eq("health_profile_id", healthProfileId)
    .eq("biomarker_id", biomarkerId)
    .order("collected_at", { ascending: true });

  if (error) throw error;
  return (data as unknown as ObservationRow[]).map(toObservationRecord);
};

export const fetchBiomarkerSeries = async (
  healthProfileId: string,
  biomarkerId: string,
  options?: SeriesOptions,
): Promise<BiomarkerSeriesSummary> =>
  buildBiomarkerSeries(
    await fetchBiomarkerObservations(healthProfileId, biomarkerId),
    options,
  );

/** The release audit trail for a report the signed-in user can already see. */
export const fetchReleaseHistory = async (diagnosticReportId: string) => {
  const { data, error } = await supabase
    .from("result_release_events")
    .select("id, from_status, to_status, actor_kind, reason, occurred_at")
    .eq("diagnostic_report_id", diagnosticReportId)
    .order("occurred_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

/** Released clinician commentary attached to a report. Never clinical truth. */
export const fetchReleasedCommentary = async (diagnosticReportId: string) => {
  const { data, error } = await supabase
    .from("clinical_review_comments")
    .select("id, body, author_display_name, author_registration, released_at")
    .eq("diagnostic_report_id", diagnosticReportId)
    .eq("is_released", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
};
