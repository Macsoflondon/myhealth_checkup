// Stripe adapter: daily GBP gross, refunds, fees and net for the last 90
// London days from the Balance Transactions API, read with a restricted key
// that only needs Read access to balance transactions. Reads at most 20
// pages of 100 and says so when it stops short. The aggregation lives in
// stripe-normalise.ts (pure, tested).
import { HttpError } from "../lib/http.ts";
import {
  aggregateStripeDaily,
  describeStripeOther,
  isStripeTestKey,
  parseStripePage,
  STRIPE_MAX_PAGES,
  stripeListUrl,
  stripeStatusMessage,
  stripeTestUrl,
  stripeWindow,
  type StripeBalanceRow,
  type StripePage,
} from "./stripe-normalise.ts";
import {
  ConfigError,
  type AdapterContext,
  type AdapterResult,
  type PluginAdapter,
} from "./types.ts";

const KEY_NAME = "STRIPE_SECRET_KEY";
const PAGE_TIMEOUT_MS = 10_000;
/** Stop paging after this long so the store step fits the 60 s sync limit. */
const PAGING_BUDGET_MS = 40_000;

const TEST_MODE_NOTE =
  "This is a Stripe test-mode key, so these figures are test payments, not real revenue";

function secretKey(ctx: AdapterContext): string {
  const key = ctx.secrets[KEY_NAME];
  if (typeof key !== "string" || key.trim() === "") {
    throw new ConfigError(
      "The Stripe restricted key is not set. Add it to Stripe in Plugins.",
    );
  }
  return key.trim();
}

function describeError(e: unknown): unknown {
  if (!(e instanceof HttpError)) return e;
  const message = stripeStatusMessage(e.status);
  return message ? new HttpError(e.status, message, e.body) : e;
}

async function get(
  ctx: AdapterContext,
  key: string,
  url: string,
): Promise<unknown> {
  try {
    return await ctx.http.json<unknown>(url, {
      headers: { Authorization: `Bearer ${key}` },
      timeoutMs: PAGE_TIMEOUT_MS,
    });
  } catch (e) {
    throw describeError(e);
  }
}

function withoutFinalStop(text: string): string {
  return text.trim().replace(/[.\s]+$/, "");
}

function count(n: number, one: string, many: string): string {
  return `${n.toLocaleString("en-GB")} ${n === 1 ? one : many}`;
}

async function sync(ctx: AdapterContext): Promise<AdapterResult> {
  const key = secretKey(ctx);
  const span = stripeWindow(ctx.now);
  const started = Date.now();

  const rows: StripeBalanceRow[] = [];
  let malformed = 0;
  let pages = 0;
  /** Why paging stopped while Stripe still had more; null when it read everything. */
  let stopNote: string | null = null;
  let startingAfter: string | null = null;

  for (;;) {
    let page: StripePage;
    try {
      page = parseStripePage(
        await get(ctx, key, stripeListUrl(span.createdGte, startingAfter)),
      );
    } catch (e) {
      // Without the first page there is nothing to show. After it, keep what
      // was read and leave out the days it may not cover.
      if (pages === 0) throw e;
      const reason = e instanceof Error ? e.message : String(e);
      stopNote = `Page ${pages + 1} of balance transactions failed (${withoutFinalStop(reason)})`;
      break;
    }
    pages += 1;
    rows.push(...page.rows);
    malformed += page.malformed;
    if (!page.hasMore) break;
    if (page.lastId === null) {
      stopNote = "Stripe gave no transaction id to continue from";
      break;
    }
    if (pages >= STRIPE_MAX_PAGES) {
      stopNote = `The sync reads at most ${STRIPE_MAX_PAGES} pages of balance transactions`;
      break;
    }
    if (Date.now() - started > PAGING_BUDGET_MS) {
      stopNote = "Stripe answered too slowly to read every page in time";
      break;
    }
    startingAfter = page.lastId;
  }
  const truncated = stopNote !== null;

  const aggregate = aggregateStripeDaily(rows, span, truncated);
  const daily = aggregate.daily;
  const read = rows.length + malformed;

  const warnings: string[] = [];
  if (isStripeTestKey(key)) warnings.push(TEST_MODE_NOTE);
  if (truncated) {
    const through = aggregate.incomplete_through;
    warnings.push(
      `${stopNote}, so it read ${count(read, "transaction", "transactions")} and not all of the last 90 days.` +
        (through
          ? ` Days up to and including ${through} are left out because they may be incomplete`
          : ""),
    );
  }
  if (daily.non_gbp_skipped > 0) {
    warnings.push(
      `${count(daily.non_gbp_skipped, "transaction", "transactions")} in currencies other than GBP ${daily.non_gbp_skipped === 1 ? "was" : "were"} left out`,
    );
  }
  const other = describeStripeOther(aggregate.other);
  if (other) warnings.push(other);
  if (malformed > 0) {
    warnings.push(
      `${count(malformed, "balance transaction", "balance transactions")} could not be read and ${malformed === 1 ? "was" : "were"} left out`,
    );
  }
  if (aggregate.outside_window > 0) {
    warnings.push(
      `${count(aggregate.outside_window, "transaction", "transactions")} dated outside the last 90 days ${aggregate.outside_window === 1 ? "was" : "were"} left out`,
    );
  }

  const first = daily.days.length > 0 ? daily.days[0].date : null;
  return {
    datasets: [
      {
        dataset: "daily",
        payload: daily,
        period_start: first,
        period_end: first === null ? null : span.lastDay,
      },
    ],
    records: read,
    warnings,
  };
}

async function test(ctx: AdapterContext): Promise<string> {
  const key = secretKey(ctx);
  parseStripePage(await get(ctx, key, stripeTestUrl()));
  return isStripeTestKey(key)
    ? "Stripe key accepted. It is a test-mode key, so the sync will read test payments"
    : "Stripe key accepted";
}

export const adapter: PluginAdapter = { id: "stripe", sync, test };
