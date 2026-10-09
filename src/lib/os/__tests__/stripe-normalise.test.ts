import { describe, expect, it } from "vitest";
import {
  aggregateStripeDaily,
  describeStripeOther,
  formatPence,
  isStripeTestKey,
  londonDate,
  londonDayStart,
  parseStripePage,
  penceToPounds,
  STRIPE_IGNORED_CATEGORIES,
  STRIPE_MAX_PAGES,
  stripeListUrl,
  stripeStatusMessage,
  stripeTestUrl,
  stripeWindow,
  type StripeBalanceRow,
} from "../../../../supabase/functions/os-plugins/adapters/stripe-normalise";
import { adapter as stripe } from "../../../../supabase/functions/os-plugins/adapters/stripe";
import type { AdapterContext } from "../../../../supabase/functions/os-plugins/adapters/types";
import {
  HttpError,
  type Http,
  type HttpInit,
} from "../../../../supabase/functions/os-plugins/lib/http";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";
import type { StripeDaily } from "../../../../supabase/functions/_shared/os/contract";

const NOW = new Date("2026-10-09T12:00:00Z");
const OCT = { firstDay: "2026-10-01", lastDay: "2026-10-03" };

function unix(iso: string): number {
  return Date.parse(iso) / 1000;
}

let nextId = 1;
function row(overrides: Partial<StripeBalanceRow> = {}): StripeBalanceRow {
  return {
    id: `txn_${nextId++}`,
    amount: 0,
    fee: 0,
    currency: "gbp",
    reporting_category: "charge",
    created: unix("2026-10-01T12:00:00Z"),
    ...overrides,
  };
}

function day(daily: StripeDaily, date: string) {
  return daily.days.find((d) => d.date === date);
}

describe("London dates", () => {
  it("finds London midnight either side of the clock change", () => {
    expect(londonDayStart("2026-10-25").toISOString()).toBe(
      "2026-10-24T23:00:00.000Z",
    );
    expect(londonDayStart("2026-10-26").toISOString()).toBe(
      "2026-10-26T00:00:00.000Z",
    );
  });

  it("puts 23:30 UTC in summer on the next London day", () => {
    expect(londonDate(new Date("2026-08-14T23:30:00Z"))).toBe("2026-08-15");
    expect(londonDate(new Date("2026-12-14T23:30:00Z"))).toBe("2026-12-14");
  });
});

describe("stripeWindow", () => {
  it("starts at London midnight 89 days before today", () => {
    expect(stripeWindow(NOW)).toEqual({
      firstDay: "2026-07-12",
      lastDay: "2026-10-09",
      createdGte: Date.UTC(2026, 6, 11, 23) / 1000,
    });
  });

  it("uses the offset of the first day, not of today", () => {
    // Today in winter, first day still in British Summer Time.
    expect(stripeWindow(new Date("2027-01-15T12:00:00Z"))).toMatchObject({
      firstDay: "2026-10-18",
      createdGte: Date.UTC(2026, 9, 17, 23) / 1000,
    });
    expect(stripeWindow(new Date("2027-03-15T12:00:00Z"))).toMatchObject({
      firstDay: "2026-12-16",
      createdGte: Date.UTC(2026, 11, 16) / 1000,
    });
  });
});

describe("request URLs and messages", () => {
  it("lists 100 at a time from the window start, then continues after the last id", () => {
    const first = new URL(stripeListUrl(1783810800, null));
    expect(`${first.origin}${first.pathname}`).toBe(
      "https://api.stripe.com/v1/balance_transactions",
    );
    expect(first.searchParams.get("limit")).toBe("100");
    expect(first.searchParams.get("created[gte]")).toBe("1783810800");
    expect(first.searchParams.has("starting_after")).toBe(false);
    const next = new URL(stripeListUrl(1783810800, "txn_9"));
    expect(next.searchParams.get("starting_after")).toBe("txn_9");
    expect(stripeTestUrl()).toBe(
      "https://api.stripe.com/v1/balance_transactions?limit=1",
    );
  });

  it("recognises test-mode keys", () => {
    expect(isStripeTestKey("rk_test_abc")).toBe(true);
    expect(isStripeTestKey("sk_test_abc")).toBe(true);
    expect(isStripeTestKey("rk_live_abc")).toBe(false);
  });

  it("explains refusals", () => {
    expect(stripeStatusMessage(401)).toContain("restricted key");
    expect(stripeStatusMessage(403)).toContain("Balance transactions");
    expect(stripeStatusMessage(500)).toBeNull();
  });
});

describe("parseStripePage", () => {
  it("reads rows, has_more and the last id", () => {
    const page = parseStripePage({
      object: "list",
      data: [
        {
          id: "txn_a",
          amount: 4999,
          fee: 175,
          net: 4824,
          currency: "GBP",
          type: "charge",
          reporting_category: "charge",
          created: 1790000000,
        },
        {
          id: "txn_b",
          amount: -500,
          fee: 0,
          currency: "gbp",
          type: "stripe_fee",
          created: 1790000100,
        },
      ],
      has_more: true,
    });
    expect(page.rows).toEqual([
      {
        id: "txn_a",
        amount: 4999,
        fee: 175,
        currency: "gbp",
        reporting_category: "charge",
        created: 1790000000,
      },
      {
        id: "txn_b",
        amount: -500,
        fee: 0,
        currency: "gbp",
        reporting_category: "fee",
        created: 1790000100,
      },
    ]);
    expect(page.hasMore).toBe(true);
    expect(page.lastId).toBe("txn_b");
    expect(page.malformed).toBe(0);
  });

  it("counts entries it cannot read but still pages past them", () => {
    const page = parseStripePage({
      data: [
        {
          id: "txn_1",
          amount: 1.5,
          fee: 0,
          currency: "gbp",
          reporting_category: "charge",
          created: 1,
        },
        {
          id: "txn_2",
          amount: 100,
          fee: 0,
          reporting_category: "charge",
          created: 1,
        },
        {
          amount: 100,
          fee: 0,
          currency: "gbp",
          reporting_category: "charge",
          created: 1,
        },
        "junk",
        {
          id: "txn_5",
          amount: 100,
          fee: "3",
          currency: "gbp",
          reporting_category: "charge",
          created: 1,
        },
      ],
      has_more: false,
    });
    expect(page.rows).toEqual([]);
    expect(page.malformed).toBe(5);
    expect(page.lastId).toBe("txn_5");
    expect(page.hasMore).toBe(false);
  });

  it("refuses an answer that is not a list", () => {
    expect(() => parseStripePage({ error: { message: "x" } })).toThrow(/shape/);
    expect(() => parseStripePage(null)).toThrow(/shape/);
  });
});

describe("penceToPounds and formatPence", () => {
  it("converts whole pence and never returns negative zero", () => {
    expect(penceToPounds(4999)).toBe(49.99);
    expect(penceToPounds(-150)).toBe(-1.5);
    expect(Object.is(penceToPounds(-0), 0)).toBe(true);
  });

  it("formats pounds from whole pence", () => {
    expect(formatPence(123405)).toBe("£1,234.05");
    expect(formatPence(-3000)).toBe("-£30.00");
    expect(formatPence(5)).toBe("£0.05");
  });
});

describe("aggregateStripeDaily", () => {
  it("splits charges, refunds and fees, and works out net", () => {
    const { daily, other } = aggregateStripeDaily(
      [
        row({ amount: 4999, fee: 175 }),
        row({ amount: 2500, fee: 98 }),
        row({ reporting_category: "refund", amount: -2500 }),
        row({ reporting_category: "partial_capture_reversal", amount: -100 }),
        row({ reporting_category: "fee", amount: -500 }),
      ],
      OCT,
      false,
    );
    expect(day(daily, "2026-10-01")).toEqual({
      date: "2026-10-01",
      gross: 74.99,
      fees: 7.73,
      refunds: 26,
      net: 41.26,
      count: 2,
    });
    expect(other).toEqual([]);
  });

  it("ignores payouts, transfers and top-ups before the currency check", () => {
    const moves = [...STRIPE_IGNORED_CATEGORIES].map((category) =>
      row({ reporting_category: category, amount: -10000, fee: 25 }),
    );
    const { daily } = aggregateStripeDaily(
      [
        ...moves,
        row({ reporting_category: "payout", currency: "eur", amount: -900 }),
        row({ amount: 1000 }),
      ],
      OCT,
      false,
    );
    expect(day(daily, "2026-10-01")).toEqual({
      date: "2026-10-01",
      gross: 10,
      fees: 0,
      refunds: 0,
      net: 10,
      count: 1,
    });
    expect(daily.non_gbp_skipped).toBe(0);
  });

  it("leaves other currencies out and counts them", () => {
    const { daily } = aggregateStripeDaily(
      [
        row({ currency: "eur", amount: 5000 }),
        row({ currency: "usd", reporting_category: "refund", amount: -5000 }),
        row({ currency: "GBP", amount: 700 }),
      ],
      OCT,
      false,
    );
    expect(daily.non_gbp_skipped).toBe(2);
    expect(day(daily, "2026-10-01")?.gross).toBe(7);
    expect(daily.currency).toBe("gbp");
  });

  it("lets a fee credit lower the day's fees", () => {
    const { daily } = aggregateStripeDaily(
      [
        row({ amount: 1000, fee: 50 }),
        row({ reporting_category: "fee", amount: -300 }),
        row({ reporting_category: "fee", amount: 100 }),
      ],
      OCT,
      false,
    );
    expect(day(daily, "2026-10-01")).toMatchObject({
      gross: 10,
      fees: 2.5,
      net: 7.5,
    });
  });

  it("reports other categories and counts their fees", () => {
    const { daily, other } = aggregateStripeDaily(
      [
        row({
          reporting_category: "dispute",
          amount: -3000,
          fee: 1500,
          created: unix("2026-10-02T10:00:00Z"),
        }),
        row({ reporting_category: "other_adjustment", amount: 150 }),
        row({ reporting_category: "other_adjustment", amount: 100 }),
      ],
      OCT,
      false,
    );
    expect(day(daily, "2026-10-02")).toMatchObject({
      gross: 0,
      fees: 15,
      net: -15,
    });
    expect(other).toEqual([
      { category: "dispute", count: 1, amount: -3000 },
      { category: "other_adjustment", count: 2, amount: 250 },
    ]);
    expect(describeStripeOther(other)).toBe(
      "Not counted in gross, refunds or net: dispute, 1 transaction, -£30.00; other adjustment, 2 transactions, £2.50",
    );
    expect(describeStripeOther([])).toBeNull();
  });

  it("zero-fills every day of the 90-day window, oldest first", () => {
    const window = stripeWindow(NOW);
    const { daily } = aggregateStripeDaily([], window, false);
    expect(daily.days).toHaveLength(90);
    expect(daily.days[0]).toEqual({
      date: "2026-07-12",
      gross: 0,
      fees: 0,
      refunds: 0,
      net: 0,
      count: 0,
    });
    expect(daily.days[89].date).toBe("2026-10-09");
    expect(daily.truncated).toBe(false);
  });

  it("places 23:30 UTC in summer on the next London day", () => {
    const { daily } = aggregateStripeDaily(
      [row({ amount: 1234, created: unix("2026-10-02T23:30:00Z") })],
      OCT,
      false,
    );
    expect(day(daily, "2026-10-02")?.gross).toBe(0);
    expect(day(daily, "2026-10-03")?.gross).toBe(12.34);

    const winter = aggregateStripeDaily(
      [row({ amount: 1234, created: unix("2026-12-02T23:30:00Z") })],
      { firstDay: "2026-12-01", lastDay: "2026-12-03" },
      false,
    );
    expect(day(winter.daily, "2026-12-02")?.gross).toBe(12.34);
  });

  it("sums whole pence, so totals carry no floating-point drift", () => {
    const tenPence = Array.from({ length: 10 }, () => row({ amount: 10 }));
    const { daily } = aggregateStripeDaily(
      [...tenPence, row({ amount: 20, created: unix("2026-10-02T12:00:00Z") })],
      OCT,
      false,
    );
    expect(day(daily, "2026-10-01")?.gross).toBe(1);
    expect(day(daily, "2026-10-01")?.count).toBe(10);
    // 0.1 + 0.2 in floating point is 0.30000000000000004.
    const mixed = aggregateStripeDaily(
      [row({ amount: 10 }), row({ amount: 20 })],
      OCT,
      false,
    );
    expect(day(mixed.daily, "2026-10-01")?.gross).toBe(0.3);
  });

  it("counts rows dated outside the window", () => {
    const out = aggregateStripeDaily(
      [row({ amount: 100, created: unix("2026-09-30T12:00:00Z") })],
      OCT,
      false,
    );
    expect(out.outside_window).toBe(1);
    expect(out.daily.days.every((d) => d.gross === 0)).toBe(true);
  });

  it("shows no days when a truncated read has no readable rows", () => {
    const out = aggregateStripeDaily([], OCT, true);
    expect(out.daily.days).toEqual([]);
    expect(out.incomplete_through).toBe("2026-10-03");
  });

  it("leaves out the oldest day read and everything before it when truncated", () => {
    const out = aggregateStripeDaily(
      [
        row({ amount: 300, created: unix("2026-10-03T09:00:00Z") }),
        row({ amount: 200, created: unix("2026-10-02T09:00:00Z") }),
      ],
      OCT,
      true,
    );
    expect(out.incomplete_through).toBe("2026-10-02");
    expect(out.daily.truncated).toBe(true);
    expect(out.daily.days.map((d) => d.date)).toEqual(["2026-10-03"]);
  });
});

// ---------------------------------------------------------------------------
// Adapter, with a fake Stripe
// ---------------------------------------------------------------------------

const LIVE_KEY = "rk_live_abcdefghijklmnop";

type Call = { url: URL; init: HttpInit | undefined };

function context(
  answer: (url: URL, call: number) => unknown,
  key = LIVE_KEY,
): { ctx: AdapterContext; calls: Call[] } {
  const plugin = getOsPlugin("stripe");
  if (!plugin) throw new Error("stripe is missing from the catalogue");
  const calls: Call[] = [];
  const http: Http = {
    json: async <T>(url: string, init?: HttpInit) => {
      const parsed = new URL(url);
      calls.push({ url: parsed, init });
      const out = answer(parsed, calls.length);
      if (out instanceof Error) throw out;
      return out as T;
    },
    raw: () => Promise.reject(new Error("not used")),
  };
  return {
    calls,
    ctx: {
      plugin,
      config: { ...plugin.defaultConfig },
      secrets: { STRIPE_SECRET_KEY: key },
      http,
      db: { rpc: () => Promise.reject(new Error("not used")) },
      previous: {},
      now: NOW,
    },
  };
}

function apiRow(id: string, amount: number, iso: string) {
  return {
    id,
    amount,
    fee: 0,
    net: amount,
    currency: "gbp",
    type: "charge",
    reporting_category: "charge",
    created: unix(iso),
  };
}

describe("stripe adapter", () => {
  it("pages with starting_after until has_more is false", async () => {
    const { ctx, calls } = context((_url, call) =>
      call === 1
        ? {
            data: [apiRow("txn_2", 2000, "2026-10-08T10:00:00Z")],
            has_more: true,
          }
        : {
            data: [apiRow("txn_1", 1000, "2026-10-07T10:00:00Z")],
            has_more: false,
          },
    );
    const out = await stripe.sync(ctx);
    expect(calls).toHaveLength(2);
    expect(calls[0].init?.headers?.Authorization).toBe(`Bearer ${LIVE_KEY}`);
    expect(calls[0].url.searchParams.get("created[gte]")).toBe(
      String(Date.UTC(2026, 6, 11, 23) / 1000),
    );
    expect(calls[1].url.searchParams.get("starting_after")).toBe("txn_2");
    const daily = out.datasets[0].payload as StripeDaily;
    expect(daily.truncated).toBe(false);
    expect(daily.days).toHaveLength(90);
    expect(day(daily, "2026-10-08")?.gross).toBe(20);
    expect(day(daily, "2026-10-07")?.gross).toBe(10);
    expect(out.records).toBe(2);
    expect(out.warnings).toEqual([]);
    expect(out.datasets[0]).toMatchObject({
      dataset: "daily",
      period_start: "2026-07-12",
      period_end: "2026-10-09",
    });
  });

  it("stops after 20 pages, marks the result truncated and drops partial days", async () => {
    const { ctx, calls } = context((_url, call) => ({
      data: [
        apiRow(
          `txn_${call}`,
          100,
          new Date(Date.UTC(2026, 9, 9 - call, 12)).toISOString(),
        ),
      ],
      has_more: true,
    }));
    const out = await stripe.sync(ctx);
    expect(calls).toHaveLength(STRIPE_MAX_PAGES);
    const daily = out.datasets[0].payload as StripeDaily;
    expect(daily.truncated).toBe(true);
    // The 20th page is dated 19 September, so days from 20 September on are complete.
    expect(daily.days[0].date).toBe("2026-09-20");
    expect(out.datasets[0].period_start).toBe("2026-09-20");
    expect(out.warnings?.[0]).toContain("at most 20 pages");
    expect(out.warnings?.[0]).toContain("2026-09-19");
  });

  it("keeps the pages already read when a later page fails", async () => {
    const { ctx, calls } = context((_url, call) =>
      call === 1
        ? {
            data: [apiRow("txn_2", 2000, "2026-10-08T10:00:00Z")],
            has_more: true,
          }
        : new HttpError(500, "api.stripe.com answered 500", ""),
    );
    const out = await stripe.sync(ctx);
    expect(calls).toHaveLength(2);
    const daily = out.datasets[0].payload as StripeDaily;
    expect(daily.truncated).toBe(true);
    expect(daily.days.map((d) => d.date)).toEqual(["2026-10-09"]);
    expect(out.warnings?.[0]).toContain(
      "Page 2 of balance transactions failed (api.stripe.com answered 500)",
    );
  });

  it("fails when the first page fails", async () => {
    const { ctx } = context(
      () => new HttpError(500, "api.stripe.com answered 500", ""),
    );
    await expect(stripe.sync(ctx)).rejects.toThrow(
      "api.stripe.com answered 500",
    );
  });

  it("warns that a test-mode key reads test payments", async () => {
    const { ctx } = context(
      () => ({ data: [], has_more: false }),
      "rk_test_abcdefghijk",
    );
    const out = await stripe.sync(ctx);
    expect(out.warnings?.[0]).toContain("test-mode key");
  });

  it("explains a refused key", async () => {
    const { ctx } = context(
      () => new HttpError(403, "api.stripe.com answered 403", ""),
    );
    await expect(stripe.sync(ctx)).rejects.toThrow(/Read access to Balance/);
  });

  it("tests the key with one balance transaction", async () => {
    const { ctx, calls } = context(() => ({ data: [], has_more: false }));
    await expect(stripe.test(ctx)).resolves.toBe("Stripe key accepted");
    expect(calls[0].url.searchParams.get("limit")).toBe("1");
  });
});
