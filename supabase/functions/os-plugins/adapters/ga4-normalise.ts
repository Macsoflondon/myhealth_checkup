// Pure request builders and response parsers for the GA4 adapter (Google
// Analytics Data API v1beta). No runtime APIs and only relative pure imports,
// so vitest and the Deno edge function load the same code.
import { OS_RANGE_DAYS } from "../../_shared/os/contract.ts";
import type {
  Ga4Channels,
  Ga4Daily,
  Ga4Day,
  Ga4OutboundClicks,
  Ga4TopPages,
  OsRangeDays,
  OsRangeKey,
  OsRanged,
} from "../../_shared/os/contract.ts";

export const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
export const GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta";
/** batchRunReports takes at most this many reports per call. */
export const GA4_BATCH_LIMIT = 5;

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

export type Ga4OrderBy =
  | { dimension: { dimensionName: string }; desc?: boolean }
  | { metric: { metricName: string }; desc?: boolean };

export type Ga4ReportRequest = {
  dateRanges: { startDate: string; endDate: string }[];
  dimensions?: { name: string }[];
  metrics: { name: string }[];
  dimensionFilter?: {
    filter: {
      fieldName: string;
      stringFilter: { matchType: "EXACT"; value: string };
    };
  };
  orderBys?: Ga4OrderBy[];
  keepEmptyRows?: boolean;
  limit?: number;
};

export type Ga4PropertyIdResult =
  { ok: true; id: string } | { ok: false; message: string };

/** Accepts "123456789" or a pasted "properties/123456789". */
export function parseGa4PropertyId(raw: string): Ga4PropertyIdResult {
  const id = raw
    .trim()
    .replace(/^properties\//i, "")
    .trim();
  if (/^\d+$/.test(id)) return { ok: true, id };
  if (/^G-/i.test(id)) {
    return {
      ok: false,
      message:
        "The GA4 property ID is the number in GA4 Admin, Property settings, not the G- measurement ID.",
    };
  }
  return {
    ok: false,
    message:
      "The GA4 property ID must be numbers only. Find it in GA4 Admin, Property settings.",
  };
}

export function ga4ReportUrl(
  propertyId: string,
  method: "runReport" | "batchRunReports",
): string {
  return `${GA4_API_BASE}/properties/${propertyId}:${method}`;
}

/** GA4 metric name behind each Ga4Day field. */
const DAILY_METRICS: Record<Exclude<keyof Ga4Day, "date">, string> = {
  sessions: "sessions",
  users: "totalUsers",
  new_users: "newUsers",
  engaged_sessions: "engagedSessions",
  page_views: "screenPageViews",
  key_events: "keyEvents",
};
type Ga4DayMetric = keyof typeof DAILY_METRICS;
const DAY_FIELDS = Object.keys(DAILY_METRICS) as Ga4DayMetric[];

function lastNDays(days: number): { startDate: string; endDate: string }[] {
  return [{ startDate: `${days}daysAgo`, endDate: "yesterday" }];
}

function byMetricDesc(metricName: string): Ga4OrderBy[] {
  return [{ metric: { metricName }, desc: true }];
}

/** 90 complete days to yesterday, one row per day. */
export function ga4DailyRequest(): Ga4ReportRequest {
  return {
    dateRanges: lastNDays(90),
    dimensions: [{ name: "date" }],
    metrics: DAY_FIELDS.map((field) => ({ name: DAILY_METRICS[field] })),
    orderBys: [{ dimension: { dimensionName: "date" } }],
    keepEmptyRows: true,
    limit: 1000,
  };
}

export function ga4TopPagesRequest(days: OsRangeDays): Ga4ReportRequest {
  return {
    dateRanges: lastNDays(days),
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "sessions" }],
    orderBys: byMetricDesc("screenPageViews"),
    limit: 15,
  };
}

export function ga4ChannelsRequest(days: OsRangeDays): Ga4ReportRequest {
  return {
    dateRanges: lastNDays(days),
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }, { name: "keyEvents" }],
    orderBys: byMetricDesc("sessions"),
    limit: 10,
  };
}

/** Enhanced measurement logs outbound link clicks as the "click" event. */
export function ga4OutboundRequest(days: OsRangeDays): Ga4ReportRequest {
  return {
    dateRanges: lastNDays(days),
    dimensions: [{ name: "linkDomain" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        stringFilter: { matchType: "EXACT", value: "click" },
      },
    },
    orderBys: byMetricDesc("eventCount"),
    limit: 25,
  };
}

/** The connection test: yesterday's sessions, one row. */
export function ga4TestRequest(): Ga4ReportRequest {
  return {
    dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
    metrics: [{ name: "sessions" }],
    limit: 1,
  };
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export type Ga4ReportRow = {
  dimensionValues?: { value?: unknown }[];
  metricValues?: { value?: unknown }[];
};

export type Ga4Report = {
  dimensionHeaders?: { name?: unknown }[];
  metricHeaders?: { name?: unknown }[];
  rows?: Ga4ReportRow[];
  rowCount?: unknown;
  metadata?: {
    dataLossFromOtherRow?: unknown;
    subjectToThresholding?: unknown;
    samplingMetadatas?: unknown;
    timeZone?: unknown;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** GA sends numbers as strings. Anything that is not a finite number reads as 0. */
export function ga4Number(value: unknown): number {
  if (typeof value !== "string" && typeof value !== "number") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function asGa4Report(value: unknown): Ga4Report {
  if (!isRecord(value)) {
    throw new Error(
      "GA4 returned a report in a shape the sync does not recognise.",
    );
  }
  if (value.rows !== undefined && !Array.isArray(value.rows)) {
    throw new Error(
      "GA4 returned report rows in a shape the sync does not recognise.",
    );
  }
  return value as Ga4Report;
}

/** The reports of a batchRunReports answer, checked against the number asked for. */
export function parseGa4Batch(res: unknown, expected: number): Ga4Report[] {
  const reports =
    isRecord(res) && Array.isArray(res.reports) ? res.reports : [];
  if (reports.length !== expected) {
    throw new Error(
      `GA4 returned ${reports.length} reports where ${expected} were requested.`,
    );
  }
  return reports.map(asGa4Report);
}

type Ga4ParsedRow = {
  dims: Record<string, string>;
  metrics: Record<string, number>;
};

function headerIndex(
  headers: { name?: unknown }[] | undefined,
  names: string[],
  kind: "dimension" | "metric",
): Record<string, number> {
  const list = Array.isArray(headers) ? headers : [];
  const out: Record<string, number> = {};
  for (const name of names) {
    const i = list.findIndex((h) => isRecord(h) && h.name === name);
    if (i < 0) {
      throw new Error(`GA4 left the ${name} ${kind} out of its report.`);
    }
    out[name] = i;
  }
  return out;
}

/**
 * Report rows keyed by header name. Values are matched to names through
 * dimensionHeaders and metricHeaders, never by assumed position.
 */
export function readGa4Rows(
  report: Ga4Report,
  dimensions: string[],
  metrics: string[],
): Ga4ParsedRow[] {
  const rows = Array.isArray(report.rows) ? report.rows : [];
  if (rows.length === 0) return [];
  const dimAt = headerIndex(report.dimensionHeaders, dimensions, "dimension");
  const metricAt = headerIndex(report.metricHeaders, metrics, "metric");
  return rows.filter(isRecord).map((row) => {
    const dimValues = Array.isArray(row.dimensionValues)
      ? row.dimensionValues
      : [];
    const metricValues = Array.isArray(row.metricValues)
      ? row.metricValues
      : [];
    const dims: Record<string, string> = {};
    for (const name of dimensions) {
      const v = dimValues[dimAt[name]];
      dims[name] = isRecord(v) && typeof v.value === "string" ? v.value : "";
    }
    const values: Record<string, number> = {};
    for (const name of metrics) {
      const v = metricValues[metricAt[name]];
      values[name] = isRecord(v) ? ga4Number(v.value) : 0;
    }
    return { dims, metrics: values };
  });
}

function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** GA4's YYYYMMDD to YYYY-MM-DD. Null for anything that is not a real date. */
export function ga4Date(value: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}`;
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10) === iso ? iso : null;
}

function emptyDay(date: string): Ga4Day {
  return {
    date,
    sessions: 0,
    users: 0,
    new_users: 0,
    engaged_sessions: 0,
    page_views: 0,
    key_events: 0,
  };
}

/** ga4 / daily: oldest first, with zero rows for any day missing between the first and last. */
export function parseGa4Daily(report: Ga4Report, propertyId: string): Ga4Daily {
  const metricNames = DAY_FIELDS.map((field) => DAILY_METRICS[field]);
  const byDate = new Map<string, Ga4Day>();
  for (const row of readGa4Rows(report, ["date"], metricNames)) {
    const date = ga4Date(row.dims.date);
    if (!date) continue;
    // One row per date is expected. Should GA split a date, its rows are
    // added together (exact for every field except users).
    const day = byDate.get(date) ?? emptyDay(date);
    for (const field of DAY_FIELDS) {
      day[field] += row.metrics[DAILY_METRICS[field]];
    }
    byDate.set(date, day);
  }
  const dates = [...byDate.keys()].sort();
  const days: Ga4Day[] = [];
  if (dates.length > 0) {
    const last = dates[dates.length - 1];
    for (let d = dates[0]; d <= last; d = addDays(d, 1)) {
      days.push(byDate.get(d) ?? emptyDay(d));
    }
  }
  return { property_id: propertyId, days };
}

export function parseGa4TopPages(
  report: Ga4Report,
): Ga4TopPages["ranges"]["7"] {
  return readGa4Rows(report, ["pagePath"], ["screenPageViews", "sessions"])
    .map((r) => ({
      path: r.dims.pagePath,
      views: r.metrics.screenPageViews,
      sessions: r.metrics.sessions,
    }))
    .filter((r) => r.path !== "")
    .sort((a, b) => b.views - a.views);
}

export function parseGa4Channels(
  report: Ga4Report,
): Ga4Channels["ranges"]["7"] {
  return readGa4Rows(
    report,
    ["sessionDefaultChannelGroup"],
    ["sessions", "keyEvents"],
  )
    .map((r) => ({
      channel: r.dims.sessionDefaultChannelGroup || "(not set)",
      sessions: r.metrics.sessions,
      key_events: r.metrics.keyEvents,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

/** Click events without a link domain are left out: they are not outbound clicks. */
export function parseGa4Outbound(
  report: Ga4Report,
): Ga4OutboundClicks["ranges"]["7"] {
  return readGa4Rows(report, ["linkDomain"], ["eventCount"])
    .map((r) => ({
      domain: r.dims.linkDomain.trim(),
      clicks: r.metrics.eventCount,
    }))
    .filter((r) => r.domain !== "" && r.domain !== "(not set)")
    .sort((a, b) => b.clicks - a.clicks);
}

/** Sum of one metric across a report's rows, for the connection test. */
export function ga4MetricTotal(report: Ga4Report, metric: string): number {
  return readGa4Rows(report, [], [metric]).reduce(
    (sum, r) => sum + r.metrics[metric],
    0,
  );
}

/** Values listed in OS_RANGE_DAYS order (7, 28, 90), keyed by range. */
export function toRanged<T>(values: readonly T[]): OsRanged<T> {
  if (values.length !== OS_RANGE_DAYS.length) {
    throw new Error(
      `Expected ${OS_RANGE_DAYS.length} ranged reports, got ${values.length}.`,
    );
  }
  const out = {} as OsRanged<T>;
  OS_RANGE_DAYS.forEach((days, i) => {
    out[String(days) as OsRangeKey] = values[i];
  });
  return out;
}

/** Stored when the outbound clicks report fails, so the dashboard can say why it is empty. */
export function unavailableOutbound(): Ga4OutboundClicks {
  return {
    available: false,
    ranges: toRanged(OS_RANGE_DAYS.map(() => [])),
  };
}

/** Plain notes on report metadata that makes figures less than complete. */
export function ga4ReportNotes(
  entries: { label: string; report: Ga4Report }[],
): string[] {
  const other: string[] = [];
  const thresholded: string[] = [];
  const sampled: string[] = [];
  for (const { label, report } of entries) {
    const meta = isRecord(report.metadata) ? report.metadata : null;
    if (!meta) continue;
    if (meta.dataLossFromOtherRow === true) other.push(label);
    if (meta.subjectToThresholding === true) thresholded.push(label);
    if (
      Array.isArray(meta.samplingMetadatas) &&
      meta.samplingMetadatas.length
    ) {
      sampled.push(label);
    }
  }
  const notes: string[] = [];
  if (other.length) {
    notes.push(
      `GA4 grouped some rows under "(other)" because the property has too many distinct values: ${other.join(", ")}.`,
    );
  }
  if (thresholded.length) {
    notes.push(
      `GA4 withheld some small figures to protect visitor privacy (thresholding), so totals may be low: ${thresholded.join(", ")}.`,
    );
  }
  if (sampled.length) {
    notes.push(
      `GA4 worked these reports out from a sample of visits rather than all of them: ${sampled.join(", ")}.`,
    );
  }
  return notes;
}

/** A note when the property's days are not UK days, or null. */
export function ga4TimeZoneNote(report: Ga4Report): string | null {
  const tz = isRecord(report.metadata) ? report.metadata.timeZone : undefined;
  if (typeof tz !== "string" || tz === "" || tz === "Europe/London") {
    return null;
  }
  return `The GA4 property counts days in ${tz} time, not UK time, so its daily figures will not line up exactly with first-party clicks.`;
}
