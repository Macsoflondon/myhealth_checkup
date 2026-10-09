// Awin adapter: reads the publisher's transactions for the last 90 London
// days (three 30-day requests, as Awin allows at most 31 days per request)
// and stores them in affiliate_conversions through
// os_upsert_network_conversions, which links each one to our click when its
// clickRef is one of our click ids. Parsing lives in awin-normalise.ts (pure,
// tested). The access token never appears in a URL that is logged: errors
// pass through lib/http.ts, which strips query strings and the token.
import { HttpError } from "../lib/http.ts";
import {
  addUpsertTotals,
  AWIN_UPSERT_CHUNK,
  awinAccountsUrl,
  awinStatusMessage,
  awinTransactionsUrl,
  awinWindows,
  awinWithAccessToken,
  buildAwinSummary,
  chunkRows,
  describeAwinAccounts,
  describeAwinInvalid,
  EMPTY_UPSERT_TOTALS,
  normaliseAwinTransactions,
  parseAwinPublisherId,
  parseUpsertResult,
} from "./awin-normalise.ts";
import {
  ConfigError,
  requireString,
  stringMap,
  type AdapterContext,
  type AdapterResult,
  type PluginAdapter,
} from "./types.ts";

const TOKEN_KEY = "AWIN_API_TOKEN";
/** The three windows run together, so one slow answer sets the pace. */
const REQUEST_TIMEOUT_MS = 35_000;
const UPSERT_FN = "os_upsert_network_conversions";

type Settings = { publisherId: string; token: string };

function readSettings(ctx: AdapterContext): Settings {
  const token = ctx.secrets[TOKEN_KEY];
  if (typeof token !== "string" || token.trim() === "") {
    throw new ConfigError(
      "The Awin API token is not set. Add it to Awin affiliate network in Plugins.",
    );
  }
  const parsed = parseAwinPublisherId(
    requireString(ctx.config, "publisher_id", "Awin publisher ID"),
  );
  if (!parsed.ok) throw new ConfigError(parsed.message);
  return { publisherId: parsed.id, token: token.trim() };
}

function describeError(e: unknown, publisherId: string): unknown {
  if (!(e instanceof HttpError)) return e;
  const message = awinStatusMessage(e.status, publisherId);
  return message ? new HttpError(e.status, message, e.body) : e;
}

function isRefusal(e: unknown): boolean {
  return e instanceof HttpError && (e.status === 401 || e.status === 403);
}

/**
 * GET with the token as a bearer header. Awin's reference also lists an
 * accessToken query parameter, so a 401 or 403 is retried once that way.
 */
async function awinGet(
  ctx: AdapterContext,
  settings: Settings,
  url: string,
): Promise<unknown> {
  try {
    return await ctx.http.json<unknown>(url, {
      headers: { Authorization: `Bearer ${settings.token}` },
      timeoutMs: REQUEST_TIMEOUT_MS,
    });
  } catch (e) {
    if (!isRefusal(e)) throw describeError(e, settings.publisherId);
  }
  try {
    return await ctx.http.json<unknown>(
      awinWithAccessToken(url, settings.token),
      { timeoutMs: REQUEST_TIMEOUT_MS },
    );
  } catch (e) {
    throw describeError(e, settings.publisherId);
  }
}

function withoutFinalStop(text: string): string {
  return text.trim().replace(/[.\s]+$/, "");
}

function plural(n: number, one: string, many: string): string {
  return `${n.toLocaleString("en-GB")} ${n === 1 ? one : many}`;
}

async function sync(ctx: AdapterContext): Promise<AdapterResult> {
  const settings = readSettings(ctx);
  const advertiserMap = stringMap(ctx.config, "advertiser_map");
  const windows = awinWindows(ctx.now);

  const batches = await Promise.all(
    windows.map((w) =>
      awinGet(ctx, settings, awinTransactionsUrl(settings.publisherId, w)),
    ),
  );
  const normalised = normaliseAwinTransactions(batches, advertiserMap);

  let totals = EMPTY_UPSERT_TOTALS;
  for (const rows of chunkRows(normalised.rows, AWIN_UPSERT_CHUNK)) {
    const { data, error } = await ctx.db.rpc(UPSERT_FN, {
      p_source: "awin",
      p_rows: rows,
    });
    if (error) {
      const stored =
        totals.upserted > 0
          ? ` ${plural(totals.upserted, "conversion was", "conversions were")} stored before the error.`
          : "";
      throw new Error(
        `Could not store the Awin conversions: ${withoutFinalStop(error.message)}.${stored}`,
      );
    }
    totals = addUpsertTotals(totals, parseUpsertResult(data));
  }

  const summary = buildAwinSummary(
    settings.publisherId,
    windows,
    normalised,
    totals,
  );

  const warnings: string[] = [];
  if (summary.unmapped_advertisers.length > 0) {
    warnings.push(
      `Map these Awin advertisers to providers in Plugins: ${summary.unmapped_advertisers.join(", ")}`,
    );
  }
  if (summary.non_gbp_skipped > 0) {
    warnings.push(
      `${plural(summary.non_gbp_skipped, "transaction", "transactions")} with a commission in a currency other than GBP ${summary.non_gbp_skipped === 1 ? "was" : "were"} skipped`,
    );
  }
  warnings.push(...describeAwinInvalid(normalised.invalid));
  if (totals.rejected > 0) {
    warnings.push(
      `The database did not store ${plural(totals.rejected, "row", "rows")} of the ${totals.received.toLocaleString("en-GB")} sent to it`,
    );
  }

  return {
    datasets: [
      {
        dataset: "summary",
        payload: summary,
        period_start: summary.window.from,
        period_end: summary.window.to,
      },
    ],
    records: summary.transactions_seen,
    warnings,
  };
}

async function test(ctx: AdapterContext): Promise<string> {
  const settings = readSettings(ctx);
  const check = describeAwinAccounts(
    await awinGet(ctx, settings, awinAccountsUrl()),
    settings.publisherId,
  );
  if (!check.ok) throw new Error(check.message);
  return check.message;
}

export const adapter: PluginAdapter = { id: "awin", sync, test };
