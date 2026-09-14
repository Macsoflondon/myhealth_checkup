/**
 * Canonical Health Intelligence contracts.
 *
 * These types are the single shape every ingestion route must produce and
 * every longitudinal surface must consume. No partner-specific field appears
 * here: Forth, a direct laboratory API, FHIR, PDF/OCR and manual entry all
 * converge on `InboundReport`.
 */

export type ReportStatus =
  | "draft"
  | "awaiting_review"
  | "reviewed"
  | "released"
  | "superseded"
  | "cancelled";

export type ReleasePolicy = "immediate" | "clinician_review" | "manual";

export type ValidationStatus = "pending" | "passed" | "failed" | "overridden";

export type VerificationStatus =
  | "unverified"
  | "confirmed"
  | "corrected"
  | "rejected";

export type ObservationValueType =
  | "quantitative"
  | "qualitative"
  | "ratio"
  | "titre"
  | "text";

export type ExtractionMethod =
  | "manual_entry"
  | "api"
  | "fhir"
  | "pdf_extraction"
  | "ocr"
  | "adapter";

export type CyclePhase =
  | "unknown"
  | "menstrual"
  | "follicular"
  | "ovulatory"
  | "luteal"
  | "not_applicable";

export type MenstrualStatus =
  | "unknown"
  | "regular_cycling"
  | "irregular_cycling"
  | "pregnant"
  | "postpartum"
  | "perimenopausal"
  | "postmenopausal"
  | "hormonal_contraception"
  | "hrt"
  | "not_applicable";

/** Physiological context captured alongside a measurement. */
export interface CycleContext {
  readonly cycleDay: number | null;
  readonly cyclePhase: CyclePhase;
  readonly menstrualStatus: MenstrualStatus;
  readonly hormoneMedicationContext: string | null;
}

/**
 * One measurement exactly as an upstream source reported it.
 *
 * `sourceValue` and `sourceUnit` are mandatory and immutable once stored.
 * Canonical values are derived deterministically afterwards — never by a
 * language model, and never in place of the source.
 */
export interface InboundObservation {
  readonly sourceBiomarkerLabel: string;
  readonly sourceValue: string;
  readonly sourceUnit: string | null;
  readonly sourceReferenceLow: number | null;
  readonly sourceReferenceHigh: number | null;
  readonly sourceReferenceText: string | null;
  readonly sourceFlag: string | null;
  readonly valueType: ObservationValueType;
  readonly collectedAt: string | null;
  readonly resultedAt: string | null;
  readonly method: string | null;
  readonly sourcePage: number | null;
  readonly sourceText: string | null;
  readonly extractionMethod: ExtractionMethod;
  /** 0–1. Null when extraction was deterministic rather than inferred. */
  readonly extractionConfidence: number | null;
  readonly cycleContext?: CycleContext;
}

/** One laboratory report, with its source evidence, from any adapter. */
export interface InboundReport {
  readonly adapterKey: string;
  readonly externalId: string | null;
  readonly laboratoryName: string | null;
  readonly panelName: string | null;
  readonly reportDate: string | null;
  readonly collectedAt: string | null;
  readonly resultedAt: string | null;
  readonly releasePolicy: ReleasePolicy;
  /** Storage path of the retained original document, when one exists. */
  readonly sourceDocumentPath: string | null;
  readonly observations: readonly InboundObservation[];
}

/** A stored measurement, as read back for longitudinal display. */
export interface ObservationRecord {
  readonly id: string;
  readonly biomarkerId: string | null;
  readonly biomarkerName: string | null;
  readonly sourceValue: string;
  readonly sourceUnit: string | null;
  readonly canonicalValue: number | null;
  readonly canonicalUnit: string | null;
  readonly sourceReferenceLow: number | null;
  readonly sourceReferenceHigh: number | null;
  readonly collectedAt: string | null;
  readonly resultedAt: string | null;
  readonly laboratoryName: string | null;
  readonly method: string | null;
  readonly validationStatus: ValidationStatus;
  readonly verificationStatus: VerificationStatus;
  readonly cyclePhase: CyclePhase;
  readonly cycleDay: number | null;
}

export type TrendDirection = "rising" | "falling" | "stable" | "indeterminate";

/**
 * Derived series arithmetic. Presented as measurement change only — never as
 * a diagnosis, an interpretation or a clinical conclusion.
 */
export interface BiomarkerSeriesSummary {
  readonly biomarkerId: string | null;
  readonly unit: string | null;
  readonly points: readonly ObservationRecord[];
  readonly latest: ObservationRecord | null;
  readonly previous: ObservationRecord | null;
  readonly absoluteChange: number | null;
  readonly percentageChange: number | null;
  readonly direction: TrendDirection;
  readonly intervalDays: number | null;
}
