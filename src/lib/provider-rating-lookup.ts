import type { LiveProviderRating } from "@/services/provider-ratings-service";

/** Aliases that map alternative IDs to canonical provider IDs. */
const PROVIDER_ALIASES: Record<string, string> = {
  goodbody: "goodbody-clinic",
  "randox-health": "randox",
};

/** Display-name to provider ID mapping. */
const PROVIDER_NAME_MAP: Record<string, string> = {
  Medichecks: "medichecks",
  "GoodBody Clinic": "goodbody-clinic",
  "Goodbody Clinic": "goodbody-clinic",
  GOODBODY: "goodbody-clinic",
  "Randox Health": "randox",
  "London Medical Laboratory": "london-medical-laboratory",
  "Lola Health": "lola-health",
};

export type ProviderRatingLookup = (
  idOrName: string | null | undefined,
) => LiveProviderRating | null;

/** Builds an ID/alias/display-name lookup. Unknown providers return null. */
export function createProviderRatingLookup(
  ratings: readonly LiveProviderRating[],
): ProviderRatingLookup {
  const byId = new Map(ratings.map((r) => [r.providerId, r]));
  return (idOrName) => {
    if (!idOrName) return null;
    const key = idOrName.toLowerCase();
    return (
      byId.get(key) ??
      byId.get(PROVIDER_ALIASES[key] ?? "") ??
      byId.get(PROVIDER_NAME_MAP[idOrName] ?? "") ??
      null
    );
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "09 Nov 2026" from an ISO timestamp (UTC), or null when absent/invalid. */
export function formatCheckedDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export const formatReviewCount = (n: number): string => n.toLocaleString("en-GB");
