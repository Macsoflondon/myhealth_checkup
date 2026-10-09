// Search Console adapter: daily clicks, impressions, CTR and position, plus
// top queries and pages, from the Search Analytics API. Two credential
// routes, in this order: the Lovable connector gateway (as
// gsc-resubmit-sitemap uses), then a Google service account. Request shapes
// and parsing live in gsc-normalise.ts (pure, tested).
import { OS_RANGE_DAYS } from "../../_shared/os/contract.ts";
import type {
  GscTopPages,
  GscTopQueries,
  OsRangeKey,
} from "../../_shared/os/contract.ts";
import { errorText, HttpError } from "../lib/http.ts";
import { describeGoogleError, googleAccessToken } from "./google-auth.ts";
import {
  GSC_DAILY_DAYS,
  GSC_DAILY_ROW_LIMIT,
  GSC_GATEWAY_BASE,
  GSC_GOOGLE_BASE,
  GSC_SCOPE,
  GSC_TOP_ROWS,
  gscDailyWindow,
  gscQueryBody,
  gscQueryPath,
  gscRangeWindows,
  gscTestWindow,
  gscTotalClicks,
  gscWindowEnding,
  gscYesterday,
  parseGscDaily,
  parseGscSiteUrl,
  parseGscTopPages,
  parseGscTopQueries,
  toRanged,
  trimGscDaily,
  type GscQueryBody,
} from "./gsc-normalise.ts";
import {
  ConfigError,
  requireString,
  type AdapterContext,
  type AdapterResult,
  type PluginAdapter,
} from "./types.ts";

type GscMode = "lovable" | "service_account";
type GscAuth = { mode: GscMode; base: string; headers: Record<string, string> };

const MODE_LABEL: Record<GscMode, string> = {
  lovable: "the Lovable connector",
  service_account: "the Google service account",
};

function secret(ctx: AdapterContext, key: string): string | null {
  const value = ctx.secrets[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function siteUrlFrom(config: Record<string, unknown>): string {
  const parsed = parseGscSiteUrl(
    requireString(config, "site_url", "Search Console property"),
  );
  if (!parsed.ok) throw new ConfigError(parsed.message);
  return parsed.siteUrl;
}

function errorMessage(e: unknown): string {
  const text = errorText(e, "The request failed").trim();
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

/** Gateway answers that the service account might get past. */
const FALLBACK_STATUSES = new Set([401, 403, 404]);

type GscClient = {
  query(body: GscQueryBody): Promise<unknown>;
  /** The route the most recent request used. */
  mode(): GscMode;
  /** Notes for the sync log, such as a fallback to the service account. */
  notes: string[];
};

function createClient(ctx: AdapterContext, siteUrl: string): GscClient {
  const lovableKey = secret(ctx, "LOVABLE_API_KEY");
  const connectionKey = secret(ctx, "GOOGLE_SEARCH_CONSOLE_API_KEY");
  const serviceAccountJson = secret(ctx, "GOOGLE_SERVICE_ACCOUNT_JSON");

  const gateway: GscAuth | null =
    lovableKey && connectionKey
      ? {
          mode: "lovable",
          base: GSC_GATEWAY_BASE,
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": connectionKey,
          },
        }
      : null;

  if (!gateway && !serviceAccountJson) {
    throw new ConfigError(
      "Search Console has no complete credentials. Add the Lovable connector keys or a Google service account key to Google Search Console in Plugins.",
    );
  }

  // One token request however many queries need it.
  let serviceAccountAuth: Promise<GscAuth> | null = null;
  const serviceAccount = (json: string): Promise<GscAuth> => {
    serviceAccountAuth ??= googleAccessToken(
      ctx.http,
      json,
      [GSC_SCOPE],
      ctx.now,
    ).then((token): GscAuth => ({
      mode: "service_account",
      base: GSC_GOOGLE_BASE,
      headers: { Authorization: `Bearer ${token}` },
    }));
    return serviceAccountAuth;
  };

  let current: GscAuth | null = gateway;
  const notes: string[] = [];
  const path = gscQueryPath(siteUrl);

  const send = async (auth: GscAuth, body: GscQueryBody): Promise<unknown> => {
    try {
      return await ctx.http.json<unknown>(`${auth.base}${path}`, {
        method: "POST",
        headers: { ...auth.headers, "content-type": "application/json" },
        body: JSON.stringify(body),
        timeoutMs: 30_000,
      });
    } catch (e) {
      throw describeGoogleError(
        e,
        `Search Console (through ${MODE_LABEL[auth.mode]})`,
      );
    }
  };

  const query = async (body: GscQueryBody): Promise<unknown> => {
    let auth = current;
    if (!auth) {
      if (!serviceAccountJson) {
        throw new ConfigError(
          "The Google service account key is not set. Add it to Google Search Console in Plugins.",
        );
      }
      auth = await serviceAccount(serviceAccountJson);
      current = auth;
    }
    try {
      return await send(auth, body);
    } catch (e) {
      if (
        auth.mode !== "lovable" ||
        !serviceAccountJson ||
        !(e instanceof HttpError) ||
        !FALLBACK_STATUSES.has(e.status)
      ) {
        throw e;
      }
      // The connector refused: an expired connection, or its Google account
      // has no access to this property. Try the service account once.
      let fallback: GscAuth;
      try {
        fallback = await serviceAccount(serviceAccountJson);
      } catch (saError) {
        throw new Error(
          `${errorMessage(e)} The Google service account could not take over: ${errorMessage(saError)}`,
        );
      }
      current = fallback;
      const note = `The Lovable connector answered ${e.status}, so the sync used the Google service account instead.`;
      if (!notes.includes(note)) notes.push(note);
      try {
        return await send(fallback, body);
      } catch (saError) {
        throw new Error(
          `${errorMessage(e)} The Google service account failed too: ${errorMessage(saError)}`,
        );
      }
    }
  };

  return {
    query,
    mode: () => current?.mode ?? "service_account",
    notes,
  };
}

async function sync(ctx: AdapterContext): Promise<AdapterResult> {
  const siteUrl = siteUrlFrom(ctx.config);
  const client = createClient(ctx, siteUrl);
  const yesterday = gscYesterday(ctx.now);

  // Daily first, on its own: it settles which credential route works before
  // the six ranged requests run in parallel.
  // The request reaches back past 90 days so that, after Google's
  // publishing delay, the series still holds 90 days of data.
  const dailyWindow = gscDailyWindow(ctx.now);
  const daily = trimGscDaily(
    parseGscDaily(
      await client.query(
        gscQueryBody(dailyWindow, ["date"], GSC_DAILY_ROW_LIMIT),
      ),
      siteUrl,
    ),
    GSC_DAILY_DAYS,
  );

  // Ranged windows end on the newest day Google has published, the same day
  // the dashboard's daily slices end on, so a 7-day table covers 7 days of
  // data rather than 4 or 5 days plus the publishing gap.
  const lastDay =
    daily.days.length > 0 ? daily.days[daily.days.length - 1].date : yesterday;
  const windows = gscRangeWindows(lastDay);
  const ranged = OS_RANGE_DAYS.map(
    (days) => windows[String(days) as OsRangeKey],
  );

  const [queryAnswers, pageAnswers] = await Promise.all([
    Promise.all(
      ranged.map((w) => client.query(gscQueryBody(w, ["query"], GSC_TOP_ROWS))),
    ),
    Promise.all(
      ranged.map((w) => client.query(gscQueryBody(w, ["page"], GSC_TOP_ROWS))),
    ),
  ]);

  const topQueries: GscTopQueries = {
    ranges: toRanged(queryAnswers.map(parseGscTopQueries)),
  };
  const topPages: GscTopPages = {
    ranges: toRanged(pageAnswers.map(parseGscTopPages)),
  };

  const warnings = [...client.notes];
  if (daily.days.length === 0) {
    warnings.push(
      `Search Console returned no search data for ${dailyWindow.startDate} to ${dailyWindow.endDate}. Check that the property is written exactly as Search Console lists it.`,
    );
  }

  const widest = windows["90"];
  const rangedPeriod = {
    period_start: widest.startDate,
    period_end: widest.endDate,
  };

  return {
    datasets: [
      {
        dataset: "daily",
        payload: daily,
        period_start: daily.days.length > 0 ? daily.days[0].date : null,
        period_end: daily.days.length > 0 ? lastDay : null,
      },
      { dataset: "top_queries", payload: topQueries, ...rangedPeriod },
      { dataset: "top_pages", payload: topPages, ...rangedPeriod },
    ],
    records: daily.days.length,
    warnings,
  };
}

const DAY_LABEL = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDay(isoDate: string): string {
  return DAY_LABEL.format(new Date(`${isoDate}T00:00:00Z`));
}

async function test(ctx: AdapterContext): Promise<string> {
  const siteUrl = siteUrlFrom(ctx.config);
  const client = createClient(ctx, siteUrl);
  const window = gscTestWindow(ctx.now);
  const { rows, clicks } = gscTotalClicks(
    await client.query(gscQueryBody(window, ["date"], 1)),
  );
  const via = MODE_LABEL[client.mode()];
  const day = formatDay(window.startDate);
  if (rows === 0) {
    return `Search Console property answered through ${via}. It has no final search data for ${day} yet.`;
  }
  const noun = clicks === 1 ? "click" : "clicks";
  return `Search Console property answered through ${via}: ${clicks.toLocaleString("en-GB")} ${noun} from Google Search on ${day}.`;
}

export const adapter: PluginAdapter = { id: "search_console", sync, test };
