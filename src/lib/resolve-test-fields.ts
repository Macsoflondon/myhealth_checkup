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
    .replace(/[\s\]\[(),;|-]+$/, "")
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
  "2-5 days";

/**
 * Remove fee wording such as "(phlebotomy fee £21)" from collection text.
 * Fees come from provider_collection_fee_rules and are shown in their own
 * row, so a stale amount baked into scraped text must never be displayed.
 */
export const stripCollectionFeeText = (
  value: string | null | undefined,
): string => {
  if (!value) return "";
  return value
    .replace(/\s*\([^)]*\bfees?\b[^)]*\)/gi, "")
    .replace(/\s*[,;:\u2014\u2013-]+\s*$/, "")
    .trim();
};

export interface ParsedCollection {
  homeKit: boolean;
  clinic: boolean;
  label: string;
}

/**
 * Classify collection text. A plain "blood" sample with no finger-prick or
 * home-kit wording is a venous draw, matching unified_provider_tests.
 */
export const parseCollection = (collection: string): ParsedCollection => {
  const cleaned = stripCollectionFeeText(collection);
  const s = cleaned.toLowerCase();
  const homeKit = /finger-?prick|home kit|at-?home/.test(s);
  const clinic = /venous|clinic/.test(s) || (!homeKit && /\bblood\b/.test(s));
  let label = cleaned || "\u2014";
  if (homeKit && clinic) label = "At-home kit & venous draw";
  else if (homeKit) label = "At-home kit";
  else if (clinic) label = "Venous draw";
  return { homeKit, clinic, label };
};

const isPlainBlood = (value: string): boolean =>
  /^(whole\s+)?blood(\s+sample)?$/i.test(value);

export const resolveCollection = (
  row: CollectionRowFields,
  providerId: string,
): string => {
  const value =
    stripCollectionFeeText(row.collection_method) ||
    stripCollectionFeeText(row.sample_type);
  if (value) return isPlainBlood(value) ? "Venous blood draw" : value;
  return PROVIDER_COLLECTION_METHODS[providerId] || "Varies";
};

/**
 * Accreditation badges built from the row's real boolean flags. Returns null
 * when the row states none of them, so callers can decide their own fallback.
 */
export const resolveAccreditationsFromRow = (
  row: AccreditationRowFields,
): string[] | null => {
  const flags: string[] = [];
  if (row.lab_ukas_accredited) flags.push("UKAS");
  if (row.lab_cqc_regulated) flags.push("CQC");
  if (row.lab_iso15189) flags.push("ISO 15189");
  return flags.length > 0 ? flags : null;
};

export interface BiomarkerCountRowFields {
  biomarker_count?: number | null;
  biomarkers_list?: unknown;
}

/**
 * The biomarker count to display. When the row carries a list, the count is
 * its length, so the badge can never disagree with the markers shown. The
 * stored number is only used for rows with no list at all.
 */
export const displayBiomarkerCount = (row: BiomarkerCountRowFields): number => {
  const list = row.biomarkers_list;
  if (Array.isArray(list) && list.length > 0) return list.length;
  return row.biomarker_count ?? 0;
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

/**
 * True when a biomarker list entry names a whole panel (for example "Full
 * Blood Count (FBC) + Differential" or "Liver Profile") rather than a single
 * marker. Such entries must not be counted as one biomarker.
 */
export const isPanelEntry = (name: string): boolean => {
  const n = name.trim();
  if (!n) return false;
  if (/\b(full blood count|complete blood count|fbc)\b/i.test(n)) return true;
  return /\b(profile|panel)$/i.test(n.replace(/\s*\([^)]*\)\s*$/, ""));
};

const listEntries = (list: unknown): string[] => {
  if (!Array.isArray(list)) return [];
  return list
    .map((item: unknown) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && "value" in item) {
        const v = (item as { value: unknown }).value;
        return typeof v === "string" ? v.trim() : "";
      }
      return "";
    })
    .filter((v) => v.length > 0);
};

/**
 * Biomarker count and display label. When any listed entry is a panel the
 * provider has not itemised, the count is null and the label is the
 * provider's own entries, so a panel never shows as a bare number.
 */
export const describeBiomarkers = (
  row: BiomarkerCountRowFields,
): { count: number | null; label: string } => {
  const entries = listEntries(row.biomarkers_list);
  if (entries.some(isPanelEntry)) {
    return { count: null, label: entries.join(" + ") };
  }
  const count =
    entries.length > 0
      ? entries.length
      : row.biomarker_count != null && row.biomarker_count > 0
        ? row.biomarker_count
        : null;
  if (count === null) return { count: null, label: "Not stated by provider" };
  return { count, label: `${count} ${count === 1 ? "biomarker" : "biomarkers"}` };
};
