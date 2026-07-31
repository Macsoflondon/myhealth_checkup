/**
 * Data-freshness formatting.
 *
 * The platform's proposition is that it tells the truth about pricing, so a
 * freshness claim must always be derived from real `scraped_at` data. There is
 * deliberately no fallback string here: when the age is unknown the caller
 * must render no claim at all rather than guessing.
 */

/** Anything older than this gets a visible caution in the amber treatment. */
export const STALE_THRESHOLD_HOURS = 48;

/** Plain GB English relative age, e.g. "11 days ago", "3 hours ago". */
export const formatDataAge = (hours: number): string => {
  if (!Number.isFinite(hours) || hours < 0) return "";
  if (hours < 1) return "less than an hour ago";
  if (hours < 48) {
    const h = Math.floor(hours);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

/** Whole hours elapsed since an ISO timestamp, or null when unusable. */
export const hoursSince = (iso?: string | null): number | null => {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return Math.max(0, (Date.now() - then) / 3_600_000);
};

export const isStale = (hours: number | null): boolean =>
  hours !== null && hours > STALE_THRESHOLD_HOURS;

/** Full sentence for a known age. Returns null when the age is unknown. */
export const formatPriceCheckedLabel = (hours: number | null): string | null =>
  hours === null ? null : `Prices last checked ${formatDataAge(hours)}.`;

export const STALE_PRICE_CAUTION =
  "Prices may have changed since then — confirm with the provider before booking.";

export const CONFIRM_PRICING_NOTE =
  "Always confirm current pricing before booking.";
