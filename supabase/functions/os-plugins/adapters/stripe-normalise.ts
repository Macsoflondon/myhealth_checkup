// Pure request builders and the daily aggregation for the Stripe adapter
// (Balance Transactions API). Sums whole pence and converts to pounds once,
// at the end. No runtime APIs and only relative pure imports, so vitest and
// the Deno edge function load the same code.
import type { StripeDaily } from "../../_shared/os/contract.ts";

export const STRIPE_API_BASE = "https://api.stripe.com/v1";
/** London calendar days each sync covers, today included. */
export const STRIPE_DAYS = 90;
export const STRIPE_PAGE_SIZE = 100;
export const STRIPE_MAX_PAGES = 20;

/** Money moving between balances, not revenue. */
export const STRIPE_IGNORED_CATEGORIES: ReadonlySet<string> = new Set([
  "payout",
  "payout_reversal",
  "transfer",
  "transfer_reversal",
  "topup",
  "topup_reversal",
]);

const REFUND_CATEGORIES: ReadonlySet<string> = new Set([
  "refund",
  "partial_capture_reversal",
]);

/** The fields the aggregation reads. Amounts in pence, signed. */
export type StripeBalanceRow = {
  id: string;
  amount: number;
  fee: number;
  currency: string;
  reporting_category: string;
  /** Unix seconds. */
  created: number;
};

// ---------------------------------------------------------------------------
// London dates
// ---------------------------------------------------------------------------

const LONDON_PARTS = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function londonParts(at: Date): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of LONDON_PARTS.formatToParts(at)) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  // Some engines print midnight as 24 even with h23.
  out.hour = (out.hour ?? 0) % 24;
  return out;
}

/** The calendar date in Europe/London as YYYY-MM-DD. */
export function londonDate(at: Date): string {
  const p = londonParts(at);
  return `${String(p.year).padStart(4, "0")}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

function londonOffsetMs(at: Date): number {
  const p = londonParts(at);
  const asUtc = Date.UTC(
    p.year,
    p.month - 1,
    p.day,
    p.hour,
    p.minute,
    p.second,
  );
  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
}

/** Midnight in Europe/London at the start of the date, as an instant. */
export function londonDayStart(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  // Two passes settle the offset across a clock change.
  let t = guess - londonOffsetMs(new Date(guess));
  t = guess - londonOffsetMs(new Date(t));
  return new Date(t);
}

/** Adds whole days to a YYYY-MM-DD date. */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

export type StripeWindow = {
  /** First London day, YYYY-MM-DD (89 days before today). */
  firstDay: string;
  /** Today in London, YYYY-MM-DD. */
  lastDay: string;
  /** Unix seconds of London midnight at the start of firstDay. */
  createdGte: number;
};

export function stripeWindow(now: Date): StripeWindow {
  const lastDay = londonDate(now);
  const firstDay = addDays(lastDay, -(STRIPE_DAYS - 1));
  return {
    firstDay,
    lastDay,
    createdGte: Math.floor(londonDayStart(firstDay).getTime() / 1000),
  };
}

export function stripeListUrl(
  createdGte: number,
  startingAfter: string | null,
): string {
  const params = new URLSearchParams({
    limit: String(STRIPE_PAGE_SIZE),
    "created[gte]": String(createdGte),
  });
  if (startingAfter) params.set("starting_after", startingAfter);
  return `${STRIPE_API_BASE}/balance_transactions?${params}`;
}

export function stripeTestUrl(): string {
  return `${STRIPE_API_BASE}/balance_transactions?limit=1`;
}

/** Test-mode keys read test payments, not real revenue. */
export function isStripeTestKey(key: string): boolean {
  return /^(sk|rk)_test_/.test(key.trim());
}

/** Plain explanation for statuses that need action, null for the rest. */
export function stripeStatusMessage(status: number): string | null {
  if (status === 401) {
    return "Stripe refused the key (401). Check the restricted key in Plugins.";
  }
  if (status === 403) {
    return "Stripe refused access (403). The restricted key needs Read access to Balance transactions.";
  }
  if (status === 429) {
    return "Stripe is limiting requests (429). The next hourly sync will try again.";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function minorUnits(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value)
    ? value
    : null;
}

/**
 * reporting_category when present. Older API versions only carry `type`, so
 * the common types map to their category and the rest keep the type name.
 */
const TYPE_CATEGORIES: Record<string, string> = {
  charge: "charge",
  payment: "charge",
  refund: "refund",
  payment_refund: "refund",
  stripe_fee: "fee",
  payout: "payout",
  payout_cancel: "payout_reversal",
  payout_failure: "payout_reversal",
  transfer: "transfer",
  transfer_cancel: "transfer_reversal",
  transfer_failure: "transfer_reversal",
  transfer_refund: "transfer_reversal",
  topup: "topup",
  topup_reversal: "topup_reversal",
};

function category(tx: Record<string, unknown>): string | null {
  if (typeof tx.reporting_category === "string" && tx.reporting_category) {
    return tx.reporting_category;
  }
  if (typeof tx.type === "string" && tx.type) {
    return TYPE_CATEGORIES[tx.type] ?? tx.type;
  }
  return null;
}

export type StripePage = {
  rows: StripeBalanceRow[];
  /** Entries without a whole-pence amount and fee, a currency, a category or a time. */
  malformed: number;
  hasMore: boolean;
  /** Id of the page's last entry, for starting_after. */
  lastId: string | null;
};

export function parseStripePage(res: unknown): StripePage {
  if (!isRecord(res) || !Array.isArray(res.data)) {
    throw new Error("Stripe answered in a shape the sync does not recognise.");
  }
  const rows: StripeBalanceRow[] = [];
  let malformed = 0;
  let lastId: string | null = null;
  for (const tx of res.data) {
    const id = isRecord(tx) && typeof tx.id === "string" ? tx.id : null;
    if (id) lastId = id;
    if (!isRecord(tx) || !id) {
      malformed += 1;
      continue;
    }
    const amount = minorUnits(tx.amount);
    const fee = minorUnits(tx.fee);
    const created = minorUnits(tx.created);
    const cat = category(tx);
    if (
      amount === null ||
      fee === null ||
      created === null ||
      cat === null ||
      typeof tx.currency !== "string"
    ) {
      malformed += 1;
      continue;
    }
    rows.push({
      id,
      amount,
      fee,
      currency: tx.currency.toLowerCase(),
      reporting_category: cat,
      created,
    });
  }
  return { rows, malformed, hasMore: res.has_more === true, lastId };
}

// ---------------------------------------------------------------------------
// Daily aggregation
// ---------------------------------------------------------------------------

/** Pence to pounds, rounded to the penny, never -0. */
export function penceToPounds(pence: number): number {
  const pounds = Math.round(pence) / 100;
  return pounds === 0 ? 0 : pounds;
}

export type StripeOtherCategory = {
  category: string;
  count: number;
  /** Signed sum of amount, pence. */
  amount: number;
};

export type StripeAggregate = {
  daily: StripeDaily;
  /**
   * GBP categories outside gross, refunds and fees (disputes, adjustments).
   * Their Stripe fees still count in fees.
   */
  other: StripeOtherCategory[];
  /** GBP rows dated outside the window. */
  outside_window: number;
  /**
   * When truncated: the last London day that may be missing transactions.
   * Days up to and including it are left out of `days`.
   */
  incomplete_through: string | null;
};

type DayTotals = {
  gross: number;
  fees: number;
  refunds: number;
  count: number;
};

/**
 * GBP totals per London day across the window, oldest first, zero-filled.
 * gross: charges. refunds: refunds and partial capture reversals, as a
 * positive sum. fees: the fee of every counted row plus Stripe fee rows
 * (their negative amounts, as a positive sum; a fee credit lowers it).
 * net = gross - refunds - fees. Payouts, transfers and top-ups move money
 * between balances and are ignored before the currency check, so
 * non_gbp_skipped counts only rows that would otherwise have counted.
 *
 * Stripe lists newest first, so when the read was truncated the oldest day
 * read may be partial: that day and every day before it are left out rather
 * than shown as zero.
 */
export function aggregateStripeDaily(
  rows: readonly StripeBalanceRow[],
  window: Pick<StripeWindow, "firstDay" | "lastDay">,
  truncated: boolean,
): StripeAggregate {
  const days = new Map<string, DayTotals>();
  for (let d = window.firstDay; d <= window.lastDay; d = addDays(d, 1)) {
    days.set(d, { gross: 0, fees: 0, refunds: 0, count: 0 });
  }
  const other = new Map<string, StripeOtherCategory>();
  let nonGbp = 0;
  let outside = 0;
  let oldest: number | null = null;

  for (const row of rows) {
    if (oldest === null || row.created < oldest) oldest = row.created;
    const cat = row.reporting_category;
    if (STRIPE_IGNORED_CATEGORIES.has(cat)) continue;
    if (row.currency.toLowerCase() !== "gbp") {
      nonGbp += 1;
      continue;
    }
    const day = days.get(londonDate(new Date(row.created * 1000)));
    if (!day) {
      outside += 1;
      continue;
    }
    day.fees += row.fee;
    if (cat === "charge") {
      day.gross += row.amount;
      day.count += 1;
    } else if (REFUND_CATEGORIES.has(cat)) {
      // Refunds take money out (negative amounts); negating gives the
      // positive refund, and a rare credit lowers the total.
      day.refunds -= row.amount;
    } else if (cat === "fee") {
      day.fees -= row.amount;
    } else {
      const entry = other.get(cat) ?? { category: cat, count: 0, amount: 0 };
      entry.count += 1;
      entry.amount += row.amount;
      other.set(cat, entry);
    }
  }

  // Truncated with no readable row: no day is known to be complete.
  const incompleteThrough = !truncated
    ? null
    : oldest === null
      ? window.lastDay
      : londonDate(new Date(oldest * 1000));

  const out: StripeDaily["days"] = [];
  for (const [date, t] of days) {
    if (incompleteThrough !== null && date <= incompleteThrough) continue;
    out.push({
      date,
      gross: penceToPounds(t.gross),
      fees: penceToPounds(t.fees),
      refunds: penceToPounds(t.refunds),
      net: penceToPounds(t.gross - t.refunds - t.fees),
      count: t.count,
    });
  }

  return {
    daily: {
      currency: "gbp",
      days: out,
      truncated,
      non_gbp_skipped: nonGbp,
    },
    other: [...other.values()].sort((a, b) =>
      a.category < b.category ? -1 : a.category > b.category ? 1 : 0,
    ),
    outside_window: outside,
    incomplete_through: incompleteThrough,
  };
}

/** "£1,234.05" or "-£30.00", built from whole pence. */
export function formatPence(pence: number): string {
  const abs = Math.abs(Math.round(pence));
  const pounds = Math.floor(abs / 100).toLocaleString("en-GB");
  const sign = pence < 0 && abs > 0 ? "-" : "";
  return `${sign}£${pounds}.${String(abs % 100).padStart(2, "0")}`;
}

/** One sentence naming the GBP rows that are not in gross, refunds or net. */
export function describeStripeOther(
  other: readonly StripeOtherCategory[],
): string | null {
  if (other.length === 0) return null;
  const parts = other.map((o) => {
    const noun = o.count === 1 ? "transaction" : "transactions";
    return `${o.category.replace(/_/g, " ")}, ${o.count.toLocaleString("en-GB")} ${noun}, ${formatPence(o.amount)}`;
  });
  return `Not counted in gross, refunds or net: ${parts.join("; ")}`;
}
