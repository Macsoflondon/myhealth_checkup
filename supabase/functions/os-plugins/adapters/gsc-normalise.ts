// Pure request builders and response parsers for the Search Console adapter
// (Search Analytics API). No runtime APIs and only relative pure imports, so
// vitest and the Deno edge function load the same code.
import { OS_RANGE_DAYS } from "../../_shared/os/contract.ts";
import type {
  GscDaily,
  GscRow,
  GscTopPages,
  GscTopQueries,
  OsRangeKey,
  OsRanged,
} from "../../_shared/os/contract.ts";

export const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
export const GSC_GATEWAY_BASE =
  "https://connector-gateway.lovable.dev/google_search_console";
export const GSC_GOOGLE_BASE = "https://searchconsole.googleapis.com";
/** Length of the daily series, in days ending yesterday. */
export const GSC_DAILY_DAYS = 90;
/** Rows kept for each top queries and top pages range. */
export const GSC_TOP_ROWS = 25;
/** Enough rows for one per day across the daily window. */
export const GSC_DAILY_ROW_LIMIT = 1000;

export type GscDimension = "date" | "query" | "page";

export type GscWindow = { startDate: string; endDate: string };

export type GscQueryBody = GscWindow & {
  dimensions: GscDimension[];
  rowLimit: number;
  dataState: "final";
};

export type GscSiteUrlResult =
  { ok: true; siteUrl: string } | { ok: false; message: string };

/**
 * Accepts a URL-prefix property (https://www.example.co.uk/) or a domain
 * property (sc-domain:example.co.uk), unchanged, since Search Console
 * matches the property string exactly.
 */
export function parseGscSiteUrl(raw: string): GscSiteUrlResult {
  const siteUrl = raw.trim();
  if (/^sc-domain:[^\s/]+$/i.test(siteUrl)) return { ok: true, siteUrl };
  try {
    const url = new URL(siteUrl);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return { ok: true, siteUrl };
    }
  } catch {
    // Falls through to the message below.
  }
  return {
    ok: false,
    message:
      "The Search Console property must be a full address such as https://www.myhealthcheckup.co.uk/ or a domain property such as sc-domain:myhealthcheckup.co.uk.",
  };
}

/** Path under either base URL (the Lovable gateway or Google). */
export function gscQueryPath(siteUrl: string): string {
  return `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const LONDON_DATE = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The calendar date in Europe/London as YYYY-MM-DD. */
export function londonDate(now: Date): string {
  const parts: Record<string, string> = {};
  for (const p of LONDON_DATE.formatToParts(now)) parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Adds whole days to a YYYY-MM-DD date. */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Yesterday in London: the newest day a window ever asks for. */
export function gscYesterday(now: Date): string {
  return addDays(londonDate(now), -1);
}

/** The N days ending on endDate, endDate included. */
export function gscWindowEnding(endDate: string, days: number): GscWindow {
  return { startDate: addDays(endDate, -(days - 1)), endDate };
}

/**
 * Google publishes final data two or three days late, so the daily request
 * reaches this many days further back. trimGscDaily then keeps the 90 days
 * ending on the newest published day.
 */
export const GSC_PUBLISH_LAG_DAYS = 7;

/** The daily request: 97 days ending yesterday in London. */
export function gscDailyWindow(now: Date): GscWindow {
  return gscWindowEnding(
    gscYesterday(now),
    GSC_DAILY_DAYS + GSC_PUBLISH_LAG_DAYS,
  );
}

/** The `days` calendar days ending on the series' newest day. */
export function trimGscDaily(daily: GscDaily, days: number): GscDaily {
  const last = daily.days[daily.days.length - 1]?.date;
  if (!last) return daily;
  const first = addDays(last, -(days - 1));
  return { ...daily, days: daily.days.filter((d) => d.date >= first) };
}

/** 7, 28 and 90 day windows ending on endDate. */
export function gscRangeWindows(endDate: string): OsRanged<GscWindow> {
  return toRanged(OS_RANGE_DAYS.map((days) => gscWindowEnding(endDate, days)));
}

/**
 * The connection test asks for one day, three days before yesterday, which
 * Google has normally finalised by then.
 */
export function gscTestWindow(now: Date): GscWindow {
  const day = addDays(gscYesterday(now), -3);
  return { startDate: day, endDate: day };
}

export function gscQueryBody(
  window: GscWindow,
  dimensions: GscDimension[],
  rowLimit: number,
): GscQueryBody {
  return {
    startDate: window.startDate,
    endDate: window.endDate,
    dimensions,
    rowLimit,
    dataState: "final",
  };
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finite(value: unknown): number {
  if (typeof value !== "number" && typeof value !== "string") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export type GscParsedRow = { keys: string[]; row: GscRow };

/**
 * Rows of a searchAnalytics.query answer. Google leaves rows out entirely
 * when there is no data, which reads as an empty list. ctr (0 to 1) and
 * position pass through as Google computed them.
 */
export function gscRows(res: unknown): GscParsedRow[] {
  if (res === null || res === undefined) return [];
  if (!isRecord(res)) {
    throw new Error(
      "Search Console answered in a shape the sync does not recognise.",
    );
  }
  if (res.rows === undefined) return [];
  if (!Array.isArray(res.rows)) {
    throw new Error(
      "Search Console returned rows in a shape the sync does not recognise.",
    );
  }
  return res.rows.filter(isRecord).map((r) => ({
    keys: Array.isArray(r.keys) ? r.keys.map((k) => String(k)) : [],
    row: {
      clicks: finite(r.clicks),
      impressions: finite(r.impressions),
      ctr: finite(r.ctr),
      position: finite(r.position),
    },
  }));
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

/**
 * A day with no search data. Position is 0 because there is none to give;
 * anything averaging position must weight it by impressions.
 */
function emptyGscDay(date: string): GscRow & { date: string } {
  return { date, clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

/** Joins two rows for the same day: sums, CTR recomputed, position weighted by impressions. */
function mergeRows(a: GscRow, b: GscRow): GscRow {
  const clicks = a.clicks + b.clicks;
  const impressions = a.impressions + b.impressions;
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position:
      impressions > 0
        ? (a.position * a.impressions + b.position * b.impressions) /
          impressions
        : 0,
  };
}

/**
 * search_console / daily: oldest first. Gaps between the first and last day
 * Google returned are filled with zero days. Days after the last one are not
 * added: Google publishes two to three days late, and a zero there would
 * claim a day with no searches when the data has simply not arrived.
 */
export function parseGscDaily(res: unknown, siteUrl: string): GscDaily {
  const byDate = new Map<string, GscRow>();
  for (const { keys, row } of gscRows(res)) {
    const date = keys[0] ?? "";
    if (!isIsoDate(date)) continue;
    const existing = byDate.get(date);
    byDate.set(date, existing ? mergeRows(existing, row) : row);
  }
  const dates = [...byDate.keys()].sort();
  const days: GscDaily["days"] = [];
  if (dates.length > 0) {
    const last = dates[dates.length - 1];
    for (let d = dates[0]; d <= last; d = addDays(d, 1)) {
      const row = byDate.get(d);
      days.push(row ? { date: d, ...row } : emptyGscDay(d));
    }
  }
  return { site_url: siteUrl, days };
}

function byClicksDesc(a: GscRow, b: GscRow): number {
  return b.clicks - a.clicks || b.impressions - a.impressions;
}

/** Top queries for one window, most clicks first. */
export function parseGscTopQueries(res: unknown): GscTopQueries["ranges"]["7"] {
  return gscRows(res)
    .filter(({ keys }) => (keys[0] ?? "") !== "")
    .map(({ keys, row }) => ({ query: keys[0], ...row }))
    .sort(byClicksDesc);
}

/** Top pages for one window, most clicks first. Pages are full URLs as Google lists them. */
export function parseGscTopPages(res: unknown): GscTopPages["ranges"]["7"] {
  return gscRows(res)
    .filter(({ keys }) => (keys[0] ?? "") !== "")
    .map(({ keys, row }) => ({ page: keys[0], ...row }))
    .sort(byClicksDesc);
}

/** Clicks summed across a daily answer, for the connection test. */
export function gscTotalClicks(res: unknown): {
  rows: number;
  clicks: number;
} {
  const rows = gscRows(res);
  return {
    rows: rows.length,
    clicks: rows.reduce((sum, r) => sum + r.row.clicks, 0),
  };
}

/** Values listed in OS_RANGE_DAYS order (7, 28, 90), keyed by range. */
export function toRanged<T>(values: readonly T[]): OsRanged<T> {
  if (values.length !== OS_RANGE_DAYS.length) {
    throw new Error(
      `Expected ${OS_RANGE_DAYS.length} ranged answers, got ${values.length}.`,
    );
  }
  const out = {} as OsRanged<T>;
  OS_RANGE_DAYS.forEach((days, i) => {
    out[String(days) as OsRangeKey] = values[i];
  });
  return out;
}
