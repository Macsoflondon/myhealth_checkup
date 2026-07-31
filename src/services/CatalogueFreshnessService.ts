import { supabase } from "@/integrations/supabase/client";

/**
 * Catalogue freshness + completeness, read from the `public.catalogue_freshness`
 * view. This is the single source of truth for any claim the site makes about
 * how recently prices were checked and how complete a provider's data is.
 */
export interface CatalogueFreshnessRow {
  providerName: string;
  activeTests: number;
  lastScrapedAt: string | null;
  hoursSinceScrape: number | null;
  missingBiomarkers: number;
  missingTurnaround: number;
  missingTotalCost: number;
}

export interface CatalogueFreshness {
  rows: CatalogueFreshnessRow[];
  /** Keyed by `provider_id` used across `provider_tests`. */
  byProviderId: Record<string, CatalogueFreshnessRow>;
  totalActiveTests: number;
  totalMissingBiomarkers: number;
  totalMissingTurnaround: number;
}

/**
 * `catalogue_freshness` groups by `provider_name`; comparison surfaces key on
 * `provider_id`. Keep the bridge in one place.
 */
const PROVIDER_ID_BY_NAME: Record<string, string> = {
  Clinilabs: "clinilabs",
  "Goodbody Clinic": "goodbody-clinic",
  "Lola Health": "lola-health",
  "London Health Company": "london-health-company",
  "London Medical Laboratory": "london-medical-laboratory",
  "Medical Diagnosis": "medical-diagnosis",
  Medichecks: "medichecks",
  "Randox Health": "randox",
  Thriva: "thriva",
};

/** Display aliases used across comparison surfaces → canonical `provider_id`. */
const PROVIDER_ID_ALIASES: Record<string, string> = {
  clinilabs: "clinilabs",
  "goodbody clinic": "goodbody-clinic",
  "goodbody health": "goodbody-clinic",
  goodbody: "goodbody-clinic",
  "lola health": "lola-health",
  lola: "lola-health",
  "london health company": "london-health-company",
  "london health co": "london-health-company",
  "london medical laboratory": "london-medical-laboratory",
  "london medical lab": "london-medical-laboratory",
  "medical diagnosis": "medical-diagnosis",
  medichecks: "medichecks",
  "randox health": "randox",
  randox: "randox",
  thriva: "thriva",
};

/** Resolve a provider display name (or id) to the canonical `provider_id`. */
export const resolveProviderId = (value?: string | null): string | null => {
  if (!value) return null;
  const key = value.trim().toLowerCase();
  return PROVIDER_ID_ALIASES[key] ?? (key.includes("-") ? key : null);
};

const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const fetchCatalogueFreshness = async (): Promise<CatalogueFreshness> => {
  const { data, error } = await supabase
    .from("catalogue_freshness")
    .select(
      "provider_name, active_tests, last_scraped_at, hours_since_scrape, missing_biomarkers, missing_turnaround, missing_total_cost",
    );

  if (error) throw error;

  const rows: CatalogueFreshnessRow[] = (data ?? []).map((row) => ({
    providerName: String(row.provider_name ?? ""),
    activeTests: toNumber(row.active_tests),
    lastScrapedAt: (row.last_scraped_at as string | null) ?? null,
    hoursSinceScrape:
      row.hours_since_scrape === null || row.hours_since_scrape === undefined
        ? null
        : toNumber(row.hours_since_scrape),
    missingBiomarkers: toNumber(row.missing_biomarkers),
    missingTurnaround: toNumber(row.missing_turnaround),
    missingTotalCost: toNumber(row.missing_total_cost),
  }));

  const byProviderId: Record<string, CatalogueFreshnessRow> = {};
  for (const row of rows) {
    const id = PROVIDER_ID_BY_NAME[row.providerName];
    if (id) byProviderId[id] = row;
  }

  return {
    rows,
    byProviderId,
    totalActiveTests: rows.reduce((sum, r) => sum + r.activeTests, 0),
    totalMissingBiomarkers: rows.reduce((sum, r) => sum + r.missingBiomarkers, 0),
    totalMissingTurnaround: rows.reduce((sum, r) => sum + r.missingTurnaround, 0),
  };
};
