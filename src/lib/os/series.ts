/**
 * Pure helpers for the Traffic section of the AI OS dashboard: sums over
 * daily rows, impression-weighted search position, ratios and day spans. No
 * imports and no runtime APIs, so vitest and plain node load the file as it
 * is.
 */

const DAY_MS = 86_400_000;
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Keys of T whose values are numbers (or missing). */
export type NumericKeys<T> = {
  [P in keyof T]-?: T[P] extends number | null | undefined ? P : never;
}[keyof T];

/**
 * Sum of one numeric field across rows. Null, missing and non-finite values
 * are skipped, so an empty list sums to 0.
 */
export function sumBy<T, K extends keyof T & NumericKeys<T>>(
  rows: readonly T[],
  key: K,
): number {
  let total = 0;
  for (const row of rows) {
    const value = row[key] as unknown;
    if (typeof value === "number" && Number.isFinite(value)) total += value;
  }
  return total;
}

/** part / whole, or null when the whole is zero, negative or not a number. */
export function ratio(part: number, whole: number): number | null {
  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) {
    return null;
  }
  return part / whole;
}

/** Click-through rate (0 to 1): clicks / impressions, null without impressions. */
export function ctr(clicks: number, impressions: number): number | null {
  return ratio(clicks, impressions);
}

/**
 * Search position averaged over impressions, the way Search Console totals
 * it: sum(position * impressions) / sum(impressions). Rows without
 * impressions carry no weight. Null when no row has impressions.
 */
export function weightedPosition(
  rows: readonly { position: number; impressions: number }[],
): number | null {
  let weight = 0;
  let weighted = 0;
  for (const row of rows) {
    const { position, impressions } = row;
    if (!Number.isFinite(position) || !Number.isFinite(impressions)) continue;
    if (impressions <= 0) continue;
    weight += impressions;
    weighted += position * impressions;
  }
  return weight > 0 ? weighted / weight : null;
}

/** Days since 1970-01-01 for a YYYY-MM-DD date, NaN when it is not one. */
export function dayNumber(isoDate: string): number {
  const m = ISO_DAY.exec(isoDate);
  if (!m) return Number.NaN;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const t = Date.UTC(y, mo - 1, d);
  const check = new Date(t);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== mo - 1 ||
    check.getUTCDate() !== d
  ) {
    return Number.NaN;
  }
  return t / DAY_MS;
}

/**
 * Calendar days a daily series covers, first to last day inclusive. 0 for an
 * empty series. Gaps inside the series still count as covered days.
 */
export function daySpan(rows: readonly { date: string }[]): number {
  let first = Number.POSITIVE_INFINITY;
  let last = Number.NEGATIVE_INFINITY;
  for (const row of rows) {
    const n = dayNumber(row.date);
    if (Number.isNaN(n)) continue;
    if (n < first) first = n;
    if (n > last) last = n;
  }
  return Number.isFinite(first) ? last - first + 1 : 0;
}
