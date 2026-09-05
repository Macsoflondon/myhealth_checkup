import {
  PROVIDER_TURNAROUND_TIMES,
  PROVIDER_COLLECTION_METHODS,
} from "@/constants/providers";

/**
 * Shared "real row data first" resolvers for provider_tests rows.
 *
 * Provider-level constants are only a last resort: whenever the scraped row
 * states a real value for that specific test, that value wins. Nothing here
 * invents or estimates data the database does not hold.
 */

export interface TurnaroundRowFields {
  turnaround_days_text?: string | null;
  turnaround_raw?: string | null;
}

export interface CollectionRowFields {
  collection_method?: string | null;
  sample_type?: string | null;
}

export interface AccreditationRowFields {
  lab_ukas_accredited?: boolean | null;
  lab_cqc_regulated?: boolean | null;
  lab_iso15189?: boolean | null;
}

/**
 * Scraped turnaround text sometimes carries markdown link debris, e.g.
 * "Results in 2 Working Days](https://provider.example/test". Strip anything
 * from the first markdown link tail or bare URL onwards, plus trailing
 * punctuation, so the comparison tables never render scrape artefacts.
 */
export const sanitiseTurnaroundText = (
  value: string | null | undefined,
): string | null => {
  if (!value) return null;
  const cleaned = value
    .split(/\]\(|https?:\/\//)[0]
    .replace(/[\s\]\[(),;|-]+$/, '')
    .trim();
  return cleaned.length > 0 ? cleaned : null;
};

export const resolveTurnaround = (
  row: TurnaroundRowFields,
  providerId: string,
): string =>
  sanitiseTurnaroundText(row.turnaround_days_text) ||
  sanitiseTurnaroundText(row.turnaround_raw) ||
  PROVIDER_TURNAROUND_TIMES[providerId] ||
  '2-5 days';

export const resolveCollection = (
  row: CollectionRowFields,
  providerId: string,
): string =>
  row.collection_method?.trim() ||
  row.sample_type?.trim() ||
  PROVIDER_COLLECTION_METHODS[providerId] ||
  'Varies';

/**
 * Accreditation badges built from the row's real boolean flags. Returns null
 * when the row states none of them, so callers can decide their own fallback.
 */
export const resolveAccreditationsFromRow = (
  row: AccreditationRowFields,
): string[] | null => {
  const flags: string[] = [];
  if (row.lab_ukas_accredited) flags.push('UKAS');
  if (row.lab_cqc_regulated) flags.push('CQC');
  if (row.lab_iso15189) flags.push('ISO 15189');
  return flags.length > 0 ? flags : null;
};

/**
 * Turnaround text fit for display. Some provider feeds captured fragments such
 * as "results" with no actual timeframe; showing those is worse than showing
 * nothing, so we only return text that states a real period.
 */
export const displayTurnaround = (
  value: string | null | undefined,
): string | null => {
  const cleaned = sanitiseTurnaroundText(value);
  if (!cleaned) return null;
  if (/\d/.test(cleaned)) return cleaned;
  if (/\b(same|next)\s+day\b/i.test(cleaned)) return cleaned;
  return null;
};
