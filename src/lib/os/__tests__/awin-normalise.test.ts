import { describe, expect, it } from "vitest";
import {
  addUpsertTotals,
  awinInstant,
  awinStatusMessage,
  awinTransactionsUrl,
  awinWindows,
  awinWithAccessToken,
  buildAwinSummary,
  chunkRows,
  describeAwinAccounts,
  describeAwinInvalid,
  EMPTY_UPSERT_TOTALS,
  invalidTotal,
  mapAwinStatus,
  normaliseAwinTransactions,
  parseAwinPublisherId,
  parseUpsertResult,
} from "../../../../supabase/functions/os-plugins/adapters/awin-normalise";
import { adapter as awin } from "../../../../supabase/functions/os-plugins/adapters/awin";
import type { AdapterContext } from "../../../../supabase/functions/os-plugins/adapters/types";
import {
  HttpError,
  type Http,
  type HttpInit,
} from "../../../../supabase/functions/os-plugins/lib/http";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";
import type { AwinSummary } from "../../../../supabase/functions/_shared/os/contract";

const NOW = new Date("2026-10-09T12:00:00Z");

/** An Awin transaction in the API's shape, GBP and approved by default. */
function tx(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 1001,
    advertiserId: 12345,
    commissionStatus: "approved",
    commissionAmount: { amount: 4.5, currency: "GBP" },
    saleAmount: { amount: 89, currency: "GBP" },
    transactionDate: "2026-09-01T12:00:00",
    clickRefs: { clickRef: "8f14e45f-ceea-4e7a-9c2b-1d2e3f4a5b6c" },
    type: "Commission group transaction",
    ...overrides,
  };
}

describe("parseAwinPublisherId", () => {
  it("accepts numbers only", () => {
    expect(parseAwinPublisherId(" 123456 ")).toEqual({
      ok: true,
      id: "123456",
    });
    expect(parseAwinPublisherId("pub-123").ok).toBe(false);
  });

  it("drops leading zeros so the id matches Awin's account ids", () => {
    expect(parseAwinPublisherId("0123456")).toEqual({
      ok: true,
      id: "123456",
    });
  });
});

describe("awinWindows", () => {
  it("covers the last 90 London days in three 30-day windows", () => {
    const windows = awinWindows(NOW);
    expect(windows).toEqual([
      {
        from: "2026-07-12",
        to: "2026-08-10",
        startDate: "2026-07-12T00:00:00",
        endDate: "2026-08-10T23:59:59",
      },
      {
        from: "2026-08-11",
        to: "2026-09-09",
        startDate: "2026-08-11T00:00:00",
        endDate: "2026-09-09T23:59:59",
      },
      {
        from: "2026-09-10",
        to: "2026-10-09",
        startDate: "2026-09-10T00:00:00",
        endDate: "2026-10-09T23:59:59",
      },
    ]);
  });

  it("keeps every window inside Awin's 31-day limit", () => {
    for (const w of awinWindows(NOW)) {
      const span = Date.parse(`${w.endDate}Z`) - Date.parse(`${w.startDate}Z`);
      expect(span < 31 * 86_400_000).toBe(true);
    }
  });

  it("uses the London date, not the UTC one", () => {
    const windows = awinWindows(new Date("2026-10-09T23:30:00Z"));
    expect(windows[windows.length - 1].to).toBe("2026-10-10");
  });
});

describe("request URLs", () => {
  const [window] = awinWindows(NOW);

  it("asks for transactions by transaction date in London time", () => {
    const url = new URL(awinTransactionsUrl("123456", window));
    expect(`${url.origin}${url.pathname}`).toBe(
      "https://api.awin.com/publishers/123456/transactions/",
    );
    expect(url.searchParams.get("startDate")).toBe("2026-07-12T00:00:00");
    expect(url.searchParams.get("endDate")).toBe("2026-08-10T23:59:59");
    expect(url.searchParams.get("timezone")).toBe("Europe/London");
    expect(url.searchParams.get("dateType")).toBe("transaction");
    expect(url.searchParams.has("accessToken")).toBe(false);
  });

  it("can select by validation date to catch late status changes", () => {
    const url = new URL(awinTransactionsUrl("123456", window, "validation"));
    expect(url.searchParams.get("dateType")).toBe("validation");
    expect(url.searchParams.get("startDate")).toBe("2026-07-12T00:00:00");
  });

  it("adds the access token as a query parameter for the retry", () => {
    expect(awinWithAccessToken("https://api.awin.com/accounts", "a b&c")).toBe(
      "https://api.awin.com/accounts?accessToken=a%20b%26c",
    );
    const retry = new URL(
      awinWithAccessToken(awinTransactionsUrl("1", window), "tok"),
    );
    expect(retry.searchParams.get("accessToken")).toBe("tok");
    expect(retry.searchParams.get("dateType")).toBe("transaction");
  });

  it("explains refusals", () => {
    expect(awinStatusMessage(401, "123456")).toContain("publisher 123456");
    expect(awinStatusMessage(403, "123456")).toContain("API token");
    expect(awinStatusMessage(500, "123456")).toBeNull();
  });
});

describe("mapAwinStatus", () => {
  it("maps Awin's commission statuses", () => {
    expect(mapAwinStatus("pending")).toBe("pending");
    expect(mapAwinStatus("approved")).toBe("confirmed");
    expect(mapAwinStatus("Declined")).toBe("reversed");
    expect(mapAwinStatus("deleted")).toBe("reversed");
    expect(mapAwinStatus("bonus")).toBeNull();
    expect(mapAwinStatus(undefined)).toBeNull();
  });
});

describe("awinInstant", () => {
  it("reads times without an offset as London wall time", () => {
    expect(awinInstant("2026-09-01T12:00:00")).toBe("2026-09-01T11:00:00.000Z");
    expect(awinInstant("2026-11-01T12:00:00")).toBe("2026-11-01T12:00:00.000Z");
  });

  it("keeps an explicit offset", () => {
    expect(awinInstant("2026-09-01T12:00:00Z")).toBe(
      "2026-09-01T12:00:00.000Z",
    );
    expect(awinInstant("2026-09-01T12:00:00.5+02:00")).toBe(
      "2026-09-01T10:00:00.500Z",
    );
  });

  it("rejects anything else", () => {
    expect(awinInstant("01/09/2026")).toBeNull();
    expect(awinInstant("2026-02-30T12:00:00")).toBeNull();
    expect(awinInstant(1790000000)).toBeNull();
  });
});

describe("normaliseAwinTransactions", () => {
  it("turns a GBP transaction into a conversion row", () => {
    const out = normaliseAwinTransactions([[tx()]], { "12345": "medichecks" });
    expect(out.rows).toEqual([
      {
        provider_id: "medichecks",
        network_reference: "1001",
        status: "confirmed",
        order_value_gbp: 89,
        commission_gbp: 4.5,
        converted_at: "2026-09-01T11:00:00.000Z",
        click_ref: "8f14e45f-ceea-4e7a-9c2b-1d2e3f4a5b6c",
      },
    ]);
    expect(out.unmapped_advertisers).toEqual([]);
    expect(out.transactions_seen).toBe(1);
  });

  it("maps every status and stores unknown ones as nothing", () => {
    const out = normaliseAwinTransactions(
      [
        [
          tx({ id: 1, commissionStatus: "pending" }),
          tx({ id: 2, commissionStatus: "approved" }),
          tx({ id: 3, commissionStatus: "declined" }),
          tx({ id: 4, commissionStatus: "deleted" }),
          tx({ id: 5, commissionStatus: "mystery" }),
        ],
      ],
      {},
    );
    expect(out.rows.map((r) => [r.network_reference, r.status])).toEqual([
      ["1", "pending"],
      ["2", "confirmed"],
      ["3", "reversed"],
      ["4", "reversed"],
    ]);
    expect(out.invalid.unknown_status).toBe(1);
  });

  it("skips transactions whose commission is not in GBP", () => {
    const out = normaliseAwinTransactions(
      [
        [
          tx({ id: 1, commissionAmount: { amount: 5, currency: "EUR" } }),
          tx({ id: 2, commissionAmount: undefined }),
          tx({ id: 3, commissionAmount: { amount: "2.10", currency: "gbp" } }),
        ],
      ],
      {},
    );
    expect(out.non_gbp_skipped).toBe(2);
    expect(out.rows).toHaveLength(1);
    expect(out.rows[0].commission_gbp).toBe(2.1);
  });

  it("drops the order value when the sale is in another currency", () => {
    const out = normaliseAwinTransactions(
      [[tx({ saleAmount: { amount: 100, currency: "USD" } })]],
      {},
    );
    expect(out.rows[0].order_value_gbp).toBeNull();
    expect(out.rows[0].commission_gbp).toBe(4.5);
  });

  it("stores unmapped advertisers as awin-<id> and lists them once", () => {
    const out = normaliseAwinTransactions(
      [
        [
          tx({ id: 1, advertiserId: 999 }),
          tx({ id: 2, advertiserId: 12345 }),
          tx({ id: 3, advertiserId: 999 }),
          tx({ id: 4, advertiserId: "77" }),
        ],
      ],
      { "12345": "randox" },
    );
    expect(out.rows.map((r) => r.provider_id)).toEqual([
      "awin-999",
      "randox",
      "awin-999",
      "awin-77",
    ]);
    expect(out.unmapped_advertisers).toEqual(["77", "999"]);
  });

  it("reads the advertiser map and ids without leading zeros", () => {
    const out = normaliseAwinTransactions(
      [[tx({ id: "0042", advertiserId: "012345" }), tx({ id: 42 })]],
      { "0012345": "medichecks", " ": "ignored", abc: "ignored" },
    );
    expect(out.rows).toHaveLength(1);
    expect(out.rows[0]).toMatchObject({
      network_reference: "42",
      provider_id: "medichecks",
    });
    expect(out.unmapped_advertisers).toEqual([]);
    expect(out.transactions_seen).toBe(1);
  });

  it("deduplicates by transaction id across windows", () => {
    const out = normaliseAwinTransactions(
      [[tx({ id: 1 }), tx({ id: 2 })], [tx({ id: 2 })], [tx({ id: "1" })]],
      {},
    );
    expect(out.rows.map((r) => r.network_reference)).toEqual(["1", "2"]);
    expect(out.transactions_seen).toBe(2);
  });

  it("stores a null click reference when clickRefs is missing or empty", () => {
    const out = normaliseAwinTransactions(
      [
        [
          tx({ id: 1, clickRefs: undefined }),
          tx({ id: 2, clickRefs: { clickRef: "  " } }),
          tx({ id: 3, clickRefs: { clickRef2: "abc" } }),
          tx({ id: 4, clickRefs: null }),
        ],
      ],
      {},
    );
    expect(out.rows.map((r) => r.click_ref)).toEqual([null, null, null, null]);
  });

  it("counts transactions it cannot use, so every one is accounted for", () => {
    const out = normaliseAwinTransactions(
      [
        [
          tx({ id: 1 }),
          tx({ id: undefined }),
          "not an object",
          tx({ id: 2, advertiserId: null }),
          tx({ id: 3, transactionDate: "soon" }),
          tx({ id: 4, commissionStatus: "unknown" }),
          tx({ id: 5, commissionAmount: { amount: 1, currency: "EUR" } }),
        ],
      ],
      {},
    );
    expect(out.invalid).toEqual({
      no_id: 2,
      no_advertiser: 1,
      unknown_status: 1,
      no_date: 1,
    });
    expect(out.transactions_seen).toBe(7);
    expect(
      out.rows.length + out.non_gbp_skipped + invalidTotal(out.invalid),
    ).toBe(out.transactions_seen);
    expect(describeAwinInvalid(out.invalid)).toEqual([
      "2 Awin transactions had no transaction id and were not stored",
      "1 Awin transaction had no advertiser id and was not stored",
      "1 Awin transaction had a commission status other than pending, approved, declined or deleted and was not stored",
      "1 Awin transaction had no readable transaction date and was not stored",
    ]);
  });

  it("treats an empty answer as no transactions and refuses other shapes", () => {
    expect(normaliseAwinTransactions([null, []], {}).transactions_seen).toBe(0);
    expect(() => normaliseAwinTransactions([{ error: "x" }], {})).toThrow(
      /shape/,
    );
  });
});

describe("upsert results", () => {
  it("reads the RPC answer and adds chunks together", () => {
    const a = parseUpsertResult({
      received: 500,
      upserted: 498,
      matched: 10,
      rejected: 2,
    });
    const b = parseUpsertResult({
      received: 3,
      upserted: 3,
      matched: 0,
      rejected: 0,
    });
    expect(addUpsertTotals(addUpsertTotals(EMPTY_UPSERT_TOTALS, a), b)).toEqual(
      { received: 503, upserted: 501, matched: 10, rejected: 2 },
    );
  });

  it("refuses an answer without the four counts", () => {
    expect(() => parseUpsertResult(null)).toThrow(/does not recognise/);
    expect(() =>
      parseUpsertResult({
        received: 1,
        upserted: "1",
        matched: 0,
        rejected: 0,
      }),
    ).toThrow(/does not recognise/);
  });

  it("splits rows into chunks of 500", () => {
    const rows = Array.from({ length: 1001 }, (_, i) => i);
    expect(chunkRows(rows, 500).map((c) => c.length)).toEqual([500, 500, 1]);
    expect(chunkRows([], 500)).toEqual([]);
  });

  it("counts transactions that never became rows as rejected in the summary", () => {
    const normalised = normaliseAwinTransactions(
      [[tx({ id: 1 }), tx({ id: 2, transactionDate: null })]],
      {},
    );
    const summary = buildAwinSummary("123456", awinWindows(NOW), normalised, {
      received: 1,
      upserted: 1,
      matched: 1,
      rejected: 0,
    });
    expect(summary).toEqual({
      publisher_id: "123456",
      window: { from: "2026-07-12", to: "2026-10-09" },
      transactions_seen: 2,
      upserted: 1,
      matched: 1,
      rejected: 1,
      non_gbp_skipped: 0,
      unmapped_advertisers: ["12345"],
    });
  });
});

describe("describeAwinAccounts", () => {
  it("counts the accounts and checks the publisher is one of them", () => {
    const res = {
      userId: 1,
      accounts: [
        { accountId: 123456, accountName: "myhealth checkup" },
        { accountId: 222, accountName: "Other" },
      ],
    };
    expect(describeAwinAccounts(res, "123456")).toEqual({
      ok: true,
      message: "Awin token accepted (2 accounts)",
    });
    const wrong = describeAwinAccounts(res, "999");
    expect(wrong.ok).toBe(false);
    expect(wrong.message).toContain("publisher 999");
  });

  it("fails when the token reaches no accounts, and accepts other shapes", () => {
    expect(describeAwinAccounts({ accounts: [] }, "1").ok).toBe(false);
    expect(describeAwinAccounts({ userId: 1 }, "1")).toEqual({
      ok: true,
      message: "Awin token accepted",
    });
  });
});

// ---------------------------------------------------------------------------
// Adapter, with a fake Awin and a fake database
// ---------------------------------------------------------------------------

const TOKEN = "awin-token-abcdef";

type Call = { url: URL; init: HttpInit | undefined };

function context(
  answer: (url: URL, init: HttpInit | undefined) => unknown,
  rpc: (args: Record<string, unknown>) => {
    data: unknown;
    error: { message: string } | null;
  } = (args) => {
    const n = (args.p_rows as unknown[]).length;
    return {
      data: { received: n, upserted: n, matched: 0, rejected: 0 },
      error: null,
    };
  },
): { ctx: AdapterContext; calls: Call[]; rpcCalls: Record<string, unknown>[] } {
  const plugin = getOsPlugin("awin");
  if (!plugin) throw new Error("awin is missing from the catalogue");
  const calls: Call[] = [];
  const rpcCalls: Record<string, unknown>[] = [];
  const http: Http = {
    json: async <T>(url: string, init?: HttpInit) => {
      const parsed = new URL(url);
      calls.push({ url: parsed, init });
      const out = answer(parsed, init);
      if (out instanceof Error) throw out;
      return out as T;
    },
    raw: () => Promise.reject(new Error("not used")),
  };
  return {
    calls,
    rpcCalls,
    ctx: {
      plugin,
      config: {
        ...plugin.defaultConfig,
        publisher_id: "123456",
        advertiser_map: { "12345": "medichecks" },
      },
      secrets: { AWIN_API_TOKEN: TOKEN },
      http,
      db: {
        rpc: async (fn, args) => {
          expect(fn).toBe("os_upsert_network_conversions");
          rpcCalls.push(args);
          return rpc(args);
        },
      },
      previous: {},
      now: NOW,
    },
  };
}

function windowOf(url: URL): string {
  return url.searchParams.get("startDate") ?? "";
}

describe("awin adapter", () => {
  it("reads three windows plus recent validations and upserts the GBP transactions as source awin", async () => {
    const { ctx, calls, rpcCalls } = context((url) =>
      windowOf(url).startsWith("2026-09-10")
        ? [tx({ id: 1 }), tx({ id: 2, advertiserId: 555 })]
        : [tx({ id: 3, commissionAmount: { amount: 1, currency: "EUR" } })],
    );
    const out = await awin.sync(ctx);
    expect(calls).toHaveLength(4);
    expect(
      calls.filter((c) => c.url.searchParams.get("dateType") === "validation")
        .length,
    ).toBe(1);
    expect(
      calls.every(
        (c) =>
          c.init?.headers?.Authorization === `Bearer ${TOKEN}` &&
          !c.url.searchParams.has("accessToken"),
      ),
    ).toBe(true);
    expect(rpcCalls).toHaveLength(1);
    expect(rpcCalls[0].p_source).toBe("awin");
    const summary = out.datasets[0].payload as AwinSummary;
    expect(summary).toMatchObject({
      transactions_seen: 3,
      upserted: 2,
      non_gbp_skipped: 1,
      unmapped_advertisers: ["555"],
    });
    expect(out.records).toBe(3);
    expect(out.warnings?.[0]).toBe(
      "Map these Awin advertisers to providers in Plugins: 555",
    );
  });

  it("retries a refused request once with the accessToken parameter", async () => {
    const { ctx, calls } = context((url) =>
      url.searchParams.get("accessToken") === TOKEN
        ? []
        : new HttpError(401, "api.awin.com answered 401", ""),
    );
    await awin.sync(ctx);
    expect(calls).toHaveLength(8);
    const retries = calls.filter((c) => c.url.searchParams.has("accessToken"));
    expect(retries).toHaveLength(4);
    expect(retries.every((c) => !c.init?.headers?.Authorization)).toBe(true);
  });

  it("explains a refusal that the retry does not fix", async () => {
    const { ctx } = context(
      () => new HttpError(403, "api.awin.com answered 403", ""),
    );
    await expect(awin.sync(ctx)).rejects.toThrow(/refused the API token/);
  });

  it("upserts in chunks of 500 and fails on a database error", async () => {
    const many = Array.from({ length: 1001 }, (_, i) => tx({ id: i + 1 }));
    const ok = context((url) =>
      windowOf(url).startsWith("2026-09-10") ? many : [],
    );
    const out = await awin.sync(ok.ctx);
    expect(ok.rpcCalls.map((a) => (a.p_rows as unknown[]).length)).toEqual([
      500, 500, 1,
    ]);
    expect((out.datasets[0].payload as AwinSummary).upserted).toBe(1001);

    let n = 0;
    const failing = context(
      (url) => (windowOf(url).startsWith("2026-09-10") ? many : []),
      (args) => {
        n += 1;
        if (n === 2)
          return { data: null, error: { message: "permission denied." } };
        const rows = (args.p_rows as unknown[]).length;
        return {
          data: { received: rows, upserted: rows, matched: 0, rejected: 0 },
          error: null,
        };
      },
    );
    await expect(awin.sync(failing.ctx)).rejects.toThrow(
      "Could not store the Awin conversions: permission denied. 500 conversions were stored before the error.",
    );
  });

  it("tests the token against the accounts list", async () => {
    const { ctx, calls } = context(() => ({
      accounts: [{ accountId: 123456 }],
    }));
    await expect(awin.test(ctx)).resolves.toBe(
      "Awin token accepted (1 account)",
    );
    expect(calls[0].url.pathname).toBe("/accounts");
  });
});
