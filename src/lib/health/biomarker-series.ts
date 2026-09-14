import type {
  BiomarkerSeriesSummary,
  ObservationRecord,
  TrendDirection,
} from "@/types/health-intelligence";

/**
 * Longitudinal arithmetic over trusted observations.
 *
 * Pure and deterministic. It reports measurement change only: nothing here
 * infers a cause, a risk or a clinical conclusion, and no model output may be
 * substituted for these figures.
 */

/** Only confirmed observations are trusted enough to plot. */
export const isTrusted = (observation: ObservationRecord): boolean =>
  observation.verificationStatus === "confirmed" &&
  (observation.validationStatus === "passed" ||
    observation.validationStatus === "overridden");

const timestampOf = (observation: ObservationRecord): number => {
  const raw = observation.collectedAt ?? observation.resultedAt;
  return raw ? new Date(raw).getTime() : Number.NaN;
};

export const sortChronologically = (
  observations: readonly ObservationRecord[],
): ObservationRecord[] =>
  [...observations].sort((a, b) => timestampOf(a) - timestampOf(b));

export interface DateRangeFilter {
  readonly from?: string;
  readonly to?: string;
}

export const filterByDateRange = (
  observations: readonly ObservationRecord[],
  range: DateRangeFilter,
): ObservationRecord[] => {
  const from = range.from ? new Date(range.from).getTime() : Number.NEGATIVE_INFINITY;
  const to = range.to ? new Date(range.to).getTime() : Number.POSITIVE_INFINITY;
  return observations.filter((o) => {
    const at = timestampOf(o);
    return Number.isFinite(at) && at >= from && at <= to;
  });
};

/**
 * Percentage change is only meaningful for a ratio-scaled measurement with a
 * non-zero baseline, so it is withheld rather than fabricated otherwise.
 */
const percentageChange = (previous: number, latest: number): number | null =>
  previous === 0 ? null : ((latest - previous) / Math.abs(previous)) * 100;

/**
 * Direction uses a relative tolerance so that analytical noise is not
 * presented as movement. Default 5%, which is deliberately conservative.
 */
const directionOf = (
  previous: number,
  latest: number,
  tolerance: number,
): TrendDirection => {
  const band = Math.abs(previous) * tolerance;
  if (Math.abs(latest - previous) <= band) return "stable";
  return latest > previous ? "rising" : "falling";
};

const MILLISECONDS_PER_DAY = 86_400_000;

export interface SeriesOptions {
  readonly dateRange?: DateRangeFilter;
  /** Relative tolerance for calling a change "stable". Default 0.05. */
  readonly stableTolerance?: number;
}

export const buildBiomarkerSeries = (
  observations: readonly ObservationRecord[],
  options: SeriesOptions = {},
): BiomarkerSeriesSummary => {
  const tolerance = options.stableTolerance ?? 0.05;

  const trusted = observations.filter(isTrusted);
  const ranged = options.dateRange
    ? filterByDateRange(trusted, options.dateRange)
    : trusted;
  const points = sortChronologically(ranged);

  const latest = points.length > 0 ? points[points.length - 1]! : null;
  const previous = points.length > 1 ? points[points.length - 2]! : null;

  const latestValue = latest?.canonicalValue ?? null;
  const previousValue = previous?.canonicalValue ?? null;

  const comparable =
    latestValue !== null &&
    previousValue !== null &&
    latest !== null &&
    previous !== null &&
    latest.canonicalUnit === previous.canonicalUnit;

  const absoluteChange = comparable ? latestValue - previousValue : null;
  const intervalMs =
    latest && previous ? timestampOf(latest) - timestampOf(previous) : Number.NaN;

  return {
    biomarkerId: latest?.biomarkerId ?? points[0]?.biomarkerId ?? null,
    unit: latest?.canonicalUnit ?? null,
    points,
    latest,
    previous,
    absoluteChange,
    percentageChange: comparable ? percentageChange(previousValue, latestValue) : null,
    direction: comparable
      ? directionOf(previousValue, latestValue, tolerance)
      : "indeterminate",
    intervalDays: Number.isFinite(intervalMs)
      ? Math.round(intervalMs / MILLISECONDS_PER_DAY)
      : null,
  };
};
