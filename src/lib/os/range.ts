import { londonDayStart, nextLondonDayStart } from "@/lib/affiliate/london-day";
import type { OsRangeKey } from "../../../supabase/functions/_shared/os/contract";

/** Date ranges the AI OS dashboard offers. Each one maps to a snapshot range. */
export const OS_RANGES = ["7d", "28d", "90d"] as const;
export type OsRange = (typeof OS_RANGES)[number];
export const DEFAULT_OS_RANGE: OsRange = "28d";

const DAYS: Record<OsRange, number> = { "7d": 7, "28d": 28, "90d": 90 };

export function isOsRange(value: unknown): value is OsRange {
  return (
    typeof value === "string" &&
    (OS_RANGES as readonly string[]).includes(value)
  );
}

export function parseOsRange(value: string | null | undefined): OsRange {
  return isOsRange(value) ? value : DEFAULT_OS_RANGE;
}

export function rangeDays(range: OsRange): number {
  return DAYS[range];
}

/** Key into the ranged plugin snapshots ("7" | "28" | "90"). */
export function snapshotRangeKey(range: OsRange): OsRangeKey {
  return String(DAYS[range]) as OsRangeKey;
}

/** Today's calendar date in Europe/London as YYYY-MM-DD. */
export function londonToday(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Adds whole days to a YYYY-MM-DD date. */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export type OsWindow = {
  range: OsRange;
  days: number;
  /** First London day in the window, YYYY-MM-DD. */
  firstDay: string;
  /** Last London day in the window (today), YYYY-MM-DD. */
  lastDay: string;
  /** Inclusive start instant. */
  from: Date;
  /** Exclusive end instant (London midnight after lastDay). */
  to: Date;
  label: string;
};

/**
 * The N London calendar days ending today, today included. First-party data
 * (clicks, conversions) is live, so today's partial figures count.
 */
export function osWindow(range: OsRange, now: Date = new Date()): OsWindow {
  const days = DAYS[range];
  const lastDay = londonToday(now);
  const firstDay = addDays(lastDay, -(days - 1));
  return {
    range,
    days,
    firstDay,
    lastDay,
    from: londonDayStart(firstDay),
    to: nextLondonDayStart(lastDay),
    label: `last ${days} days`,
  };
}

/**
 * Slices a daily series (oldest first, `date` as YYYY-MM-DD) to the last N
 * days it contains. Third-party data ends at its own latest complete day, so
 * the slice is anchored on the series, not on today.
 */
export function lastNDays<T extends { date: string }>(
  rows: readonly T[],
  days: number,
): T[] {
  if (rows.length === 0) return [];
  const end = rows[rows.length - 1].date;
  const start = addDays(end, -(days - 1));
  return rows.filter((r) => r.date >= start && r.date <= end);
}

/** The window of the same length immediately before lastNDays(rows, days). */
export function previousNDays<T extends { date: string }>(
  rows: readonly T[],
  days: number,
): T[] {
  if (rows.length === 0) return [];
  const end = addDays(rows[rows.length - 1].date, -days);
  const start = addDays(end, -(days - 1));
  return rows.filter((r) => r.date >= start && r.date <= end);
}
