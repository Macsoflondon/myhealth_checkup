// Pure request builders and response parsers for the Awin adapter (Publisher
// API, "Get List of Transactions"). Turns Awin transactions into rows for
// os_upsert_network_conversions. No runtime APIs and only relative pure
// imports, so vitest and the Deno edge function load the same code.
import type { AwinSummary } from "../../_shared/os/contract.ts";

export const AWIN_API_BASE = "https://api.awin.com";
export const AWIN_TIMEZONE = "Europe/London";
/** London calendar days each sync reads, today included. */
export const AWIN_DAYS = 90;
/** Awin allows at most 31 days per request. */
export const AWIN_WINDOW_DAYS = 30;
export const AWIN_UPSERT_CHUNK = 500;

export type AwinConversionStatus = "pending" | "confirmed" | "reversed";

/** One row for os_upsert_network_conversions. */
export type AwinConversionRow = {
  provider_id: string;
  network_reference: string;
  status: AwinConversionStatus;
  order_value_gbp: number | null;
  commission_gbp: number | null;
  /** ISO UTC instant. */
  converted_at: string;
  click_ref: string | null;
};

// ---------------------------------------------------------------------------
// London dates
// ---------------------------------------------------------------------------

const LONDON_PARTS = new Intl.DateTimeFormat("en-GB", {
  timeZone: AWIN_TIMEZONE,
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

/** The instant a London wall-clock time shows (date YYYY-MM-DD, time HH:MM:SS). */
export function londonWallTime(date: string, time = "00:00:00"): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm, ss] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm, ss || 0);
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

export type AwinPublisherIdResult =
  { ok: true; id: string } | { ok: false; message: string };

export function parseAwinPublisherId(raw: string): AwinPublisherIdResult {
  const id = raw.trim();
  if (/^\d{1,20}$/.test(id)) {
    return { ok: true, id: id.replace(/^0+(?=\d)/, "") };
  }
  return {
    ok: false,
    message:
      "The Awin publisher ID must be numbers only. Awin shows it next to your account name.",
  };
}

export type AwinWindow = {
  /** First London day, YYYY-MM-DD. */
  from: string;
  /** Last London day, YYYY-MM-DD. */
  to: string;
  /** Request values, London wall-clock times. */
  startDate: string;
  endDate: string;
};

/** The last 90 London days, today included, in windows of 30 days. */
export function awinWindows(now: Date): AwinWindow[] {
  const today = londonDate(now);
  const first = addDays(today, -(AWIN_DAYS - 1));
  const out: AwinWindow[] = [];
  for (
    let from = first;
    from <= today;
    from = addDays(from, AWIN_WINDOW_DAYS)
  ) {
    const end = addDays(from, AWIN_WINDOW_DAYS - 1);
    const to = end < today ? end : today;
    out.push({
      from,
      to,
      startDate: `${from}T00:00:00`,
      endDate: `${to}T23:59:59`,
    });
  }
  return out;
}

/**
 * dateType "transaction" selects by sale date; "validation" by the date the
 * advertiser confirmed or declined it, which catches status changes on sales
 * older than the transaction windows.
 */
export function awinTransactionsUrl(
  publisherId: string,
  window: AwinWindow,
  dateType: "transaction" | "validation" = "transaction",
): string {
  const params = new URLSearchParams({
    startDate: window.startDate,
    endDate: window.endDate,
    timezone: AWIN_TIMEZONE,
    dateType,
  });
  return `${AWIN_API_BASE}/publishers/${encodeURIComponent(publisherId)}/transactions/?${params}`;
}

/** Lists the accounts the token can read; used by the connection test. */
export function awinAccountsUrl(): string {
  return `${AWIN_API_BASE}/accounts`;
}

/**
 * The same request with the token as the accessToken query parameter, the
 * second way Awin's reference lists. Never log the result.
 */
export function awinWithAccessToken(url: string, token: string): string {
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}accessToken=${encodeURIComponent(token)}`;
}

/** Plain explanation for statuses that need action, null for the rest. */
export function awinStatusMessage(
  status: number,
  publisherId: string,
): string | null {
  if (status === 401 || status === 403) {
    return `Awin refused the API token (${status}). Check the token in Plugins, and that it belongs to an Awin user with access to publisher ${publisherId}.`;
  }
  if (status === 429) {
    return "Awin is limiting requests (429). The next hourly sync will try again.";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Awin ids are whole numbers; accepts them as numbers or numeric strings,
 * without leading zeros so "0123" and 123 are the same id.
 */
function readId(value: unknown): string | null {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) {
    return String(value);
  }
  if (typeof value === "string" && /^\d{1,20}$/.test(value.trim())) {
    return value.trim().replace(/^0+(?=\d)/, "");
  }
  return null;
}

function readAmount(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

type Money = { amount: number | null; currency: string | null };

function readMoney(value: unknown): Money {
  if (!isRecord(value)) return { amount: null, currency: null };
  const currency =
    typeof value.currency === "string" && value.currency.trim() !== ""
      ? value.currency.trim().toUpperCase()
      : null;
  return { amount: readAmount(value.amount), currency };
}

const STATUS_MAP: Record<string, AwinConversionStatus> = {
  pending: "pending",
  approved: "confirmed",
  declined: "reversed",
  deleted: "reversed",
};

export function mapAwinStatus(value: unknown): AwinConversionStatus | null {
  if (typeof value !== "string") return null;
  return STATUS_MAP[value.trim().toLowerCase()] ?? null;
}

const DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i;

/**
 * Awin's transactionDate as an ISO UTC instant. The request asks for
 * Europe/London, so a value without an offset is a London wall-clock time.
 */
export function awinInstant(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const m = DATE_TIME.exec(value.trim());
  if (!m) return null;
  const [, ys, ms, ds, hs = "00", mins = "00", ss = "00", frac, offset] = m;
  const y = Number(ys);
  const mo = Number(ms);
  const d = Number(ds);
  const check = new Date(Date.UTC(y, mo - 1, d));
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== mo - 1 ||
    check.getUTCDate() !== d ||
    Number(hs) > 23 ||
    Number(mins) > 59 ||
    Number(ss) > 59
  ) {
    return null;
  }
  const millis = frac ? Math.round(Number(`0.${frac}`) * 1000) : 0;
  let ms0: number;
  if (offset) {
    let offsetMinutes = 0;
    if (offset.toUpperCase() !== "Z") {
      const sign = offset.startsWith("-") ? -1 : 1;
      const digits = offset.slice(1).replace(":", "");
      offsetMinutes =
        sign * (Number(digits.slice(0, 2)) * 60 + Number(digits.slice(2, 4)));
    }
    ms0 =
      Date.UTC(y, mo - 1, d, Number(hs), Number(mins), Number(ss)) -
      offsetMinutes * 60_000;
  } else {
    ms0 = londonWallTime(`${ys}-${ms}-${ds}`, `${hs}:${mins}:${ss}`).getTime();
  }
  const t = ms0 + millis;
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

function readClickRef(value: unknown): string | null {
  if (!isRecord(value)) return null;
  const raw = value.clickRef;
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  if (typeof raw !== "string") return null;
  const ref = raw.trim();
  return ref === "" || ref.length > 200 ? null : ref;
}

/** Transactions Awin returned that could not become a row, by reason. */
export type AwinInvalidCounts = {
  /** Not an object, or no usable transaction id. */
  no_id: number;
  no_advertiser: number;
  unknown_status: number;
  no_date: number;
};

export type AwinNormalised = {
  rows: AwinConversionRow[];
  /** Distinct transactions across all windows. */
  transactions_seen: number;
  non_gbp_skipped: number;
  invalid: AwinInvalidCounts;
  /** Advertiser ids stored as awin-<id> because the map has no entry. */
  unmapped_advertisers: string[];
};

function batchItems(batch: unknown): unknown[] {
  if (batch === null || batch === undefined) return [];
  if (!Array.isArray(batch)) {
    throw new Error(
      "Awin returned transactions in a shape the sync does not recognise.",
    );
  }
  return batch;
}

/**
 * Turns the transaction lists of every window into conversion rows.
 * Transactions are deduplicated by id. Only GBP commissions are kept; the
 * order value is dropped (null) when the sale is in another currency.
 * transactions_seen = rows + non_gbp_skipped + every invalid count.
 */
export function normaliseAwinTransactions(
  batches: readonly unknown[],
  advertiserMap: Record<string, string>,
): AwinNormalised {
  // Map keys are typed by hand, so they get the same id clean-up.
  const providers = new Map<string, string>();
  for (const [key, provider] of Object.entries(advertiserMap)) {
    const advertiser = readId(key);
    if (advertiser !== null && provider.trim() !== "") {
      providers.set(advertiser, provider.trim());
    }
  }
  const rows: AwinConversionRow[] = [];
  const seenIds = new Set<string>();
  const unmapped = new Set<string>();
  const invalid: AwinInvalidCounts = {
    no_id: 0,
    no_advertiser: 0,
    unknown_status: 0,
    no_date: 0,
  };
  let seen = 0;
  let nonGbp = 0;

  for (const batch of batches) {
    for (const tx of batchItems(batch)) {
      const id = isRecord(tx) ? readId(tx.id) : null;
      if (id !== null) {
        if (seenIds.has(id)) continue;
        seenIds.add(id);
      }
      seen += 1;
      if (!isRecord(tx) || id === null) {
        invalid.no_id += 1;
        continue;
      }
      const commission = readMoney(tx.commissionAmount);
      if (commission.currency !== "GBP") {
        nonGbp += 1;
        continue;
      }
      const advertiserId = readId(tx.advertiserId);
      if (advertiserId === null) {
        invalid.no_advertiser += 1;
        continue;
      }
      const status = mapAwinStatus(tx.commissionStatus);
      if (status === null) {
        invalid.unknown_status += 1;
        continue;
      }
      const convertedAt = awinInstant(tx.transactionDate);
      if (convertedAt === null) {
        invalid.no_date += 1;
        continue;
      }
      const mapped = providers.get(advertiserId);
      if (mapped === undefined) unmapped.add(advertiserId);
      const sale = readMoney(tx.saleAmount);
      rows.push({
        provider_id: mapped ?? `awin-${advertiserId}`,
        network_reference: id,
        status,
        order_value_gbp: sale.currency === "GBP" ? sale.amount : null,
        commission_gbp: commission.amount,
        converted_at: convertedAt,
        click_ref: readClickRef(tx.clickRefs),
      });
    }
  }

  return {
    rows,
    transactions_seen: seen,
    non_gbp_skipped: nonGbp,
    invalid,
    unmapped_advertisers: [...unmapped].sort(
      (a, b) => Number(a) - Number(b) || (a < b ? -1 : a > b ? 1 : 0),
    ),
  };
}

export function invalidTotal(invalid: AwinInvalidCounts): number {
  return (
    invalid.no_id +
    invalid.no_advertiser +
    invalid.unknown_status +
    invalid.no_date
  );
}

/** Sentences for the sync log about transactions that were not stored. */
export function describeAwinInvalid(invalid: AwinInvalidCounts): string[] {
  const out: string[] = [];
  const say = (n: number, what: string) => {
    if (n > 0) {
      out.push(
        `${n} Awin ${n === 1 ? "transaction" : "transactions"} ${what} and ${n === 1 ? "was" : "were"} not stored`,
      );
    }
  };
  say(invalid.no_id, "had no transaction id");
  say(invalid.no_advertiser, "had no advertiser id");
  say(
    invalid.unknown_status,
    "had a commission status other than pending, approved, declined or deleted",
  );
  say(invalid.no_date, "had no readable transaction date");
  return out;
}

export function chunkRows<T>(rows: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

// ---------------------------------------------------------------------------
// Upsert results and summary
// ---------------------------------------------------------------------------

export type UpsertTotals = {
  received: number;
  upserted: number;
  matched: number;
  rejected: number;
};

export const EMPTY_UPSERT_TOTALS: UpsertTotals = {
  received: 0,
  upserted: 0,
  matched: 0,
  rejected: 0,
};

/** Reads os_upsert_network_conversions' answer; throws on anything else. */
export function parseUpsertResult(data: unknown): UpsertTotals {
  const keys = ["received", "upserted", "matched", "rejected"] as const;
  if (isRecord(data)) {
    const out = { ...EMPTY_UPSERT_TOTALS };
    let ok = true;
    for (const key of keys) {
      const n = data[key];
      if (typeof n === "number" && Number.isSafeInteger(n) && n >= 0) {
        out[key] = n;
      } else {
        ok = false;
      }
    }
    if (ok) return out;
  }
  throw new Error(
    "Storing the Awin conversions returned an answer the sync does not recognise.",
  );
}

export function addUpsertTotals(
  a: UpsertTotals,
  b: UpsertTotals,
): UpsertTotals {
  return {
    received: a.received + b.received,
    upserted: a.upserted + b.upserted,
    matched: a.matched + b.matched,
    rejected: a.rejected + b.rejected,
  };
}

/**
 * The summary payload. rejected counts both rows the database turned down
 * and transactions that never became a row, so seen = upserted + rejected +
 * non_gbp_skipped.
 */
export function buildAwinSummary(
  publisherId: string,
  windows: readonly AwinWindow[],
  normalised: AwinNormalised,
  totals: UpsertTotals,
): AwinSummary {
  return {
    publisher_id: publisherId,
    window: {
      from: windows.length > 0 ? windows[0].from : "",
      to: windows.length > 0 ? windows[windows.length - 1].to : "",
    },
    transactions_seen: normalised.transactions_seen,
    upserted: totals.upserted,
    matched: totals.matched,
    rejected: totals.rejected + invalidTotal(normalised.invalid),
    non_gbp_skipped: normalised.non_gbp_skipped,
    unmapped_advertisers: [...normalised.unmapped_advertisers],
  };
}

// ---------------------------------------------------------------------------
// Connection test
// ---------------------------------------------------------------------------

export type AwinAccountsCheck = { ok: boolean; message: string };

/**
 * Reads GET /accounts ({ userId, accounts: [{ accountId, ... }] }) and checks
 * the configured publisher is one of them when the answer lists ids.
 */
export function describeAwinAccounts(
  res: unknown,
  publisherId: string,
): AwinAccountsCheck {
  const list = Array.isArray(res)
    ? res
    : isRecord(res) && Array.isArray(res.accounts)
      ? res.accounts
      : null;
  if (list === null) return { ok: true, message: "Awin token accepted" };
  const accounts = list.filter(isRecord);
  const ids = accounts
    .map((a) => readId(a.accountId))
    .filter((id): id is string => id !== null);
  const n = accounts.length;
  if (n === 0) {
    return {
      ok: false,
      message:
        "Awin accepted the token, but it gives access to no accounts. Create the token as a user of the publisher account.",
    };
  }
  const counted = `Awin token accepted (${n} ${n === 1 ? "account" : "accounts"})`;
  if (ids.length > 0 && !ids.includes(publisherId)) {
    return {
      ok: false,
      message: `Awin accepted the token, but publisher ${publisherId} is not among the ${n} ${n === 1 ? "account" : "accounts"} it can read. Check the publisher ID.`,
    };
  }
  return { ok: true, message: counted };
}
