// GA4 adapter: daily traffic, top pages, channels and outbound link clicks
// from the Google Analytics Data API v1beta, read with a Google service
// account. Request shapes and parsing live in ga4-normalise.ts (pure, tested).
import { OS_RANGE_DAYS } from "../../_shared/os/contract.ts";
import type {
  Ga4Channels,
  Ga4OutboundClicks,
  Ga4TopPages,
} from "../../_shared/os/contract.ts";
import { errorText, HttpError } from "../lib/http.ts";
import { describeGoogleError, googleAccessToken } from "./google-auth.ts";
import {
  asGa4Report,
  GA4_BATCH_LIMIT,
  GA4_SCOPE,
  ga4ChannelsRequest,
  ga4DailyRequest,
  ga4MetricTotal,
  ga4OutboundRequest,
  ga4ReportNotes,
  ga4ReportUrl,
  ga4TestRequest,
  ga4TimeZoneNote,
  ga4TopPagesRequest,
  parseGa4Batch,
  parseGa4Channels,
  ga4RequestedDays,
  parseGa4Daily,
  parseGa4Outbound,
  parseGa4PropertyId,
  parseGa4TopPages,
  toRanged,
  unavailableOutbound,
  type Ga4Report,
  type Ga4ReportRequest,
} from "./ga4-normalise.ts";
import {
  ConfigError,
  requireString,
  type AdapterContext,
  type AdapterResult,
  type PluginAdapter,
} from "./types.ts";

const SERVICE_ACCOUNT_KEY = "GOOGLE_SERVICE_ACCOUNT_JSON";
const SERVICE = "Google Analytics";

function propertyIdFrom(config: Record<string, unknown>): string {
  const parsed = parseGa4PropertyId(
    requireString(config, "property_id", "GA4 property ID"),
  );
  if (!parsed.ok) throw new ConfigError(parsed.message);
  return parsed.id;
}

async function accessToken(ctx: AdapterContext): Promise<string> {
  const key = ctx.secrets[SERVICE_ACCOUNT_KEY];
  if (typeof key !== "string" || key.trim() === "") {
    throw new ConfigError(
      "The Google service account key is not set. Add it to Google Analytics 4 in Plugins.",
    );
  }
  return await googleAccessToken(ctx.http, key, [GA4_SCOPE], ctx.now);
}

async function post(
  ctx: AdapterContext,
  token: string,
  url: string,
  body: unknown,
): Promise<unknown> {
  try {
    return await ctx.http.json<unknown>(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      timeoutMs: 30_000,
    });
  } catch (e) {
    throw describeGoogleError(e, SERVICE);
  }
}

async function runBatch(
  ctx: AdapterContext,
  token: string,
  propertyId: string,
  requests: Ga4ReportRequest[],
): Promise<Ga4Report[]> {
  if (requests.length > GA4_BATCH_LIMIT) {
    throw new Error(
      `GA4 takes at most ${GA4_BATCH_LIMIT} reports per batch; ${requests.length} were built.`,
    );
  }
  const res = await post(
    ctx,
    token,
    ga4ReportUrl(propertyId, "batchRunReports"),
    { requests },
  );
  return parseGa4Batch(res, requests.length);
}

type OutboundOutcome =
  | { ok: true; reports: Ga4Report[] }
  | { ok: false; status: number | null; message: string };

function rangeLabels(name: string): string[] {
  return OS_RANGE_DAYS.map((days) => `${name} (${days} days)`);
}

function withoutFinalStop(text: string): string {
  return text.trim().replace(/[.\s]+$/, "");
}

async function sync(ctx: AdapterContext): Promise<AdapterResult> {
  const propertyId = propertyIdFrom(ctx.config);
  const token = await accessToken(ctx);

  // Three batches in parallel. Outbound clicks run on their own because one
  // failing request fails its whole batch, and that report is the one most
  // likely to fail (properties without enhanced measurement).
  const mainRequests = [
    ga4DailyRequest(),
    ...OS_RANGE_DAYS.map(ga4TopPagesRequest),
  ];
  const channelRequests = OS_RANGE_DAYS.map(ga4ChannelsRequest);
  const outboundRequests = OS_RANGE_DAYS.map(ga4OutboundRequest);

  const outboundPromise: Promise<OutboundOutcome> = runBatch(
    ctx,
    token,
    propertyId,
    outboundRequests,
  ).then(
    (reports): OutboundOutcome => ({ ok: true, reports }),
    (e: unknown): OutboundOutcome => ({
      ok: false,
      status: e instanceof HttpError ? e.status : null,
      message: errorText(e, "The outbound clicks report failed."),
    }),
  );

  const [mainReports, channelReports, outbound] = await Promise.all([
    runBatch(ctx, token, propertyId, mainRequests),
    runBatch(ctx, token, propertyId, channelRequests),
    outboundPromise,
  ]);

  const [dailyReport, ...pageReports] = mainReports;
  const daily = parseGa4Daily(
    dailyReport,
    propertyId,
    ga4RequestedDays(dailyReport, ctx.now),
  );
  const topPages: Ga4TopPages = {
    ranges: toRanged(pageReports.map(parseGa4TopPages)),
  };
  const channels: Ga4Channels = {
    ranges: toRanged(channelReports.map(parseGa4Channels)),
  };

  const warnings: string[] = [];
  const timeZoneNote = ga4TimeZoneNote(dailyReport);
  if (timeZoneNote) warnings.push(timeZoneNote);
  if (daily.days.length === 0) {
    warnings.push(
      "GA4 returned no days of data. Check the property ID, and that the site's GA4 tag is collecting data.",
    );
  }

  const noteEntries: { label: string; report: Ga4Report }[] = [
    { label: "daily", report: dailyReport },
    ...pageReports.map((report, i) => ({
      label: rangeLabels("top pages")[i],
      report,
    })),
    ...channelReports.map((report, i) => ({
      label: rangeLabels("channels")[i],
      report,
    })),
  ];

  let outboundClicks: Ga4OutboundClicks;
  if (outbound.ok) {
    outboundClicks = {
      available: true,
      ranges: toRanged(outbound.reports.map(parseGa4Outbound)),
    };
    noteEntries.push(
      ...outbound.reports.map((report, i) => ({
        label: rangeLabels("outbound clicks")[i],
        report,
      })),
    );
    if (outboundClicks.ranges["90"].length === 0) {
      warnings.push(
        "GA4 recorded no outbound link clicks in the last 90 days. If that looks wrong, check that enhanced measurement (outbound clicks) is on for the web stream.",
      );
    }
  } else {
    outboundClicks = unavailableOutbound();
    warnings.push(
      outbound.status === 400
        ? `Outbound clicks are unavailable: ${withoutFinalStop(outbound.message)}. They need enhanced measurement (outbound clicks) turned on for the GA4 web stream.`
        : `Outbound clicks are unavailable this sync: ${withoutFinalStop(outbound.message)}.`,
    );
  }
  warnings.push(...ga4ReportNotes(noteEntries));

  const periodStart = daily.days.length > 0 ? daily.days[0].date : null;
  const periodEnd =
    daily.days.length > 0 ? daily.days[daily.days.length - 1].date : null;
  // The ranged reports cover 90daysAgo to yesterday, the same days as daily.
  const period = { period_start: periodStart, period_end: periodEnd };

  return {
    datasets: [
      { dataset: "daily", payload: daily, ...period },
      { dataset: "top_pages", payload: topPages, ...period },
      { dataset: "channels", payload: channels, ...period },
      { dataset: "outbound_clicks", payload: outboundClicks, ...period },
    ],
    records: daily.days.length,
    warnings,
  };
}

async function test(ctx: AdapterContext): Promise<string> {
  const propertyId = propertyIdFrom(ctx.config);
  const token = await accessToken(ctx);
  const report = asGa4Report(
    await post(
      ctx,
      token,
      ga4ReportUrl(propertyId, "runReport"),
      ga4TestRequest(),
    ),
  );
  const sessions = Math.round(ga4MetricTotal(report, "sessions"));
  const noun = sessions === 1 ? "session" : "sessions";
  return `GA4 property ${propertyId} answered: ${sessions.toLocaleString("en-GB")} ${noun} yesterday`;
}

export const adapter: PluginAdapter = { id: "ga4", sync, test };
