import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ToolContext } from "@lovable.dev/mcp-js";

type Result = {
  data?: unknown;
  error?: { message: string } | null;
  count?: number | null;
};
type Call = { table: string; method: string; args: unknown[] };

const state: {
  calls: Call[];
  tables: Record<string, Result[]>;
  rpc: Record<string, Result>;
  rpcCalls: Array<{ fn: string; args: unknown }>;
} = { calls: [], tables: {}, rpc: {}, rpcCalls: [] };

function builder(table: string) {
  const b: Record<string, unknown> = {};
  const record =
    (method: string) =>
    (...args: unknown[]) => {
      state.calls.push({ table, method, args });
      return b;
    };
  for (const m of [
    "select",
    "insert",
    "upsert",
    "delete",
    "eq",
    "neq",
    "in",
    "or",
    "gte",
    "lte",
    "lt",
    "is",
    "order",
    "limit",
    "range",
    "maybeSingle",
    "single",
    "ilike",
  ])
    b[m] = record(m);
  b.then = (resolve: (r: Result) => unknown) => {
    const queue = state.tables[table] ?? [];
    const next =
      queue.length > 1
        ? queue.shift()!
        : (queue[0] ?? { data: null, error: null });
    return Promise.resolve({ error: null, ...next }).then(resolve);
  };
  return b;
}

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (t: string) => builder(t),
    rpc: (fn: string, args: unknown) => {
      state.rpcCalls.push({ fn, args });
      return Promise.resolve({
        error: null,
        ...(state.rpc[fn] ?? { data: null }),
      });
    },
  }),
}));

import {
  accreditationStatus,
  escapeLike,
  ilikeContains,
  maskPii,
  truncate,
  withAccreditation,
} from "../shared";
import listProviders from "../tools/list-providers";
import searchTests from "../tools/search-tests";
import getTest, { testLimitations } from "../tools/get-test";
import saveFavourite from "../tools/save-favourite";
import listMyFavourites from "../tools/list-my-favourites";
import removeFavourite from "../tools/remove-favourite";
import listCategories from "../tools/list-categories";
import getProvider from "../tools/get-provider";
import compareTests, { biomarkerOverlap } from "../tools/compare-tests";
import findTestsByBiomarker from "../tools/find-tests-by-biomarker";
import getPriceMovements from "../tools/get-price-movements";
import getPerformanceSummary from "../tools/get-performance-summary";
import getBusinessSummary from "../tools/get-business-summary";
import getPlatformHealth from "../tools/get-platform-health";
import getAdminAuditTrail from "../tools/get-admin-audit-trail";
import getSecurityPosture from "../tools/get-security-posture";
import listScraperAlerts from "../tools/list-scraper-alerts";
import getCatalogueCoverage from "../tools/get-catalogue-coverage";
import listStaleTests from "../tools/list-stale-tests";
import getDataQuality from "../tools/get-data-quality";

const USER = "11111111-1111-4111-8111-111111111111";
const T1 = "22222222-2222-4222-8222-222222222222";
const T2 = "33333333-3333-4333-8333-333333333333";

function ctx(authenticated = true): ToolContext {
  return {
    isAuthenticated: () => authenticated,
    getUserId: () => (authenticated ? USER : undefined),
    getToken: () => "token",
  } as unknown as ToolContext;
}

type Handler = (
  args: unknown,
  c: ToolContext,
) => Promise<{
  isError?: boolean;
  structuredContent?: Record<string, unknown>;
  content: Array<{ text: string }>;
}>;
const run = (tool: { handler: unknown }, args: unknown, c = ctx()) =>
  (tool.handler as Handler)(args, c);

beforeEach(() => {
  state.calls = [];
  state.tables = {};
  state.rpc = {};
  state.rpcCalls = [];
});

describe("shared helpers", () => {
  it("escapes LIKE wildcards and quotes PostgREST operands", () => {
    expect(escapeLike("50%_a\\b")).toBe("50\\%\\_a\\\\b");
    expect(ilikeContains('b12, "x"')).toBe('"%b12, \\"x\\"%"');
  });
  it("truncates and masks emails and IPs", () => {
    expect(truncate("x".repeat(300))?.length).toBe(200);
    expect(maskPii("hit from 10.0.0.1 by a.b@c.com")).toBe(
      "hit from [ip masked] by [email masked]",
    );
  });
  it("derives accreditation_status from the flags", () => {
    expect(
      accreditationStatus({
        lab_ukas_accredited: true,
        lab_cqc_regulated: true,
        lab_iso15189: null,
      }),
    ).toBe("confirmed");
    expect(
      accreditationStatus({
        lab_ukas_accredited: true,
        lab_cqc_regulated: true,
        lab_iso15189: true,
      }),
    ).toBe("confirmed");
    expect(
      accreditationStatus({
        lab_ukas_accredited: null,
        lab_cqc_regulated: true,
        lab_iso15189: null,
      }),
    ).toBe("not_confirmed");
    expect(accreditationStatus({})).toBe("not_confirmed");
    expect(
      accreditationStatus({
        lab_ukas_accredited: true,
        lab_cqc_regulated: true,
        lab_iso15189: false,
      }),
    ).toBe("failed");
    expect(
      accreditationStatus({
        lab_ukas_accredited: null,
        lab_cqc_regulated: false,
        lab_iso15189: null,
      }),
    ).toBe("failed");
    expect(withAccreditation({ id: "a" })).toEqual({
      id: "a",
      lab_ukas_accredited: null,
      lab_cqc_regulated: null,
      lab_iso15189: null,
      accreditation_status: "not_confirmed",
    });
  });
});

describe("public tools", () => {
  it("list_providers lists every provider with flags and status", async () => {
    state.rpc.mcp_list_providers = {
      data: [
        {
          provider_id: "randox",
          provider_name: "Randox",
          test_count: "60",
          lab_ukas_accredited: true,
          lab_cqc_regulated: true,
          lab_iso15189: true,
          latest_updated_at: "2026-09-30",
        },
        {
          provider_id: "x",
          provider_name: "X",
          test_count: 5,
          lab_ukas_accredited: null,
          lab_cqc_regulated: true,
          lab_iso15189: null,
          latest_updated_at: null,
        },
      ],
    };
    const r = await run(listProviders, {});
    const s = r.structuredContent!;
    const providers = s.providers as Array<{
      provider_id: string;
      test_count: number;
      accreditation_status: string;
      lab_ukas_accredited: boolean | null;
    }>;
    expect(providers.length).toBe(2);
    expect(providers[0]).toMatchObject({
      provider_id: "randox",
      test_count: 60,
      accreditation_status: "confirmed",
    });
    expect(providers[1]).toMatchObject({
      provider_id: "x",
      accreditation_status: "not_confirmed",
      lab_ukas_accredited: null,
    });
    expect(s.excluded_providers).toBeUndefined();
  });

  it("search_tests escapes the keyword, filters, sorts and counts", async () => {
    state.tables.unified_provider_tests = [{ data: [{ id: T1 }], count: 42 }];
    const r = await run(searchTests, {
      query: "50%",
      sort: "biomarkers_desc",
      limit: 10,
      offset: 0,
      include_addons: false,
      min_biomarkers: 5,
      collection: "home_kit",
    });
    expect(r.structuredContent!.total_matches).toBe(42);
    const or = state.calls.find((c) => c.method === "or");
    expect(or?.args[0]).toContain("description.ilike");
    expect(or?.args[0]).toContain("\\\\%");
    const order = state.calls.find((c) => c.method === "order");
    expect(order?.args[0]).toBe("biomarker_count");
    expect(
      state.calls.some(
        (c) => c.method === "eq" && c.args[0] === "home_kit_available",
      ),
    ).toBe(true);
    expect(
      state.calls.some(
        (c) => c.method === "gte" && c.args[0] === "biomarker_count",
      ),
    ).toBe(true);
  });

  it("get_test uses explicit columns and reports limitations", async () => {
    state.tables.unified_provider_tests = [
      {
        data: {
          id: T1,
          price: 1,
          total_expected_cost: null,
          biomarker_count: 10,
          biomarkers_listed: 4,
          url_verified: null,
          collection_fee_type: null,
          turnaround_days_text: null,
        },
      },
    ];
    const r = await run(getTest, { id: T1 });
    const sel = state.calls.find((c) => c.method === "select");
    expect(sel?.args[0]).not.toBe("*");
    expect(
      (r.structuredContent!.limitations as string[]).length,
    ).toBeGreaterThanOrEqual(5);
    expect(
      testLimitations({
        price: 50,
        total_expected_cost: 50,
        biomarker_count: 3,
        biomarkers_listed: 3,
        url_verified: true,
        collection_fee_type: "none",
        turnaround_days_text: "2 days",
      }),
    ).toEqual([]);
  });

  it("list_categories returns slugs", async () => {
    state.rpc.mcp_list_categories = {
      data: [
        {
          slug: "thyroid",
          name: "Thyroid",
          active_tests: "12",
          providers: "4",
        },
      ],
    };
    const r = await run(listCategories, {});
    expect(r.structuredContent!.categories).toEqual([
      { slug: "thyroid", name: "Thyroid", active_tests: 12, providers: 4 },
    ]);
  });

  it("get_provider returns unconfirmed and failed providers with their status", async () => {
    state.rpc.mcp_get_provider = {
      data: {
        provider_id: "x",
        lab_ukas_accredited: null,
        lab_cqc_regulated: true,
        lab_iso15189: null,
      },
    };
    const unconfirmed = await run(getProvider, { provider_id: "x" });
    expect(unconfirmed.isError).toBeUndefined();
    expect(
      (
        unconfirmed.structuredContent!.provider as {
          accreditation_status: string;
        }
      ).accreditation_status,
    ).toBe("not_confirmed");
    state.rpc.mcp_get_provider = {
      data: {
        provider_id: "y",
        lab_ukas_accredited: false,
        lab_cqc_regulated: true,
        lab_iso15189: null,
      },
    };
    expect(
      (
        (await run(getProvider, { provider_id: "y" })).structuredContent!
          .provider as { accreditation_status: string }
      ).accreditation_status,
    ).toBe("failed");
    state.rpc.mcp_get_provider = {
      data: {
        provider_id: "randox",
        lab_ukas_accredited: true,
        lab_cqc_regulated: true,
        lab_iso15189: true,
      },
    };
    expect(
      (await run(getProvider, { provider_id: "randox" })).isError,
    ).toBeUndefined();
  });

  it("compare_tests returns shared and unique biomarkers", async () => {
    state.tables.unified_provider_tests = [
      {
        data: [
          { id: T1, biomarkers_list: ["TSH", "Free T4", "Ferritin"] },
          { id: T2, biomarkers_list: ["tsh", "Free T4", "B12"] },
        ],
      },
    ];
    const r = await run(compareTests, { test_ids: [T1, T2] });
    expect(r.structuredContent!.shared_biomarkers).toEqual(["TSH", "Free T4"]);
    expect(r.structuredContent!.unique_biomarkers).toEqual({
      [T1]: ["Ferritin"],
      [T2]: ["B12"],
    });
    expect(biomarkerOverlap([]).shared).toEqual([]);
  });

  it("find_tests_by_biomarker passes filters to SQL", async () => {
    state.rpc.mcp_find_tests_by_biomarker = {
      data: { total_matches: 1, tests: [{ id: T1 }] },
    };
    const r = await run(findTestsByBiomarker, {
      biomarker: "ferritin",
      max_price: 50,
      limit: 25,
    });
    expect(r.structuredContent!.total_matches).toBe(1);
    expect(state.rpcCalls[0].args).toEqual({
      p_name: "ferritin",
      p_max_price: 50,
      p_limit: 25,
    });
  });

  it("find_tests_by_biomarker attaches provider flags and status without filtering", async () => {
    state.rpc.mcp_find_tests_by_biomarker = {
      data: {
        total_matches: 2,
        tests: [
          { id: T1, provider_id: "randox" },
          { id: T2, provider_id: "lml" },
        ],
      },
    };
    state.rpc.mcp_list_providers = {
      data: [
        {
          provider_id: "randox",
          lab_ukas_accredited: true,
          lab_cqc_regulated: true,
          lab_iso15189: true,
        },
        {
          provider_id: "lml",
          lab_ukas_accredited: null,
          lab_cqc_regulated: null,
          lab_iso15189: null,
        },
      ],
    };
    const r = await run(findTestsByBiomarker, {
      biomarker: "ferritin",
      limit: 25,
    });
    const tests = r.structuredContent!.tests as Array<{
      accreditation_status: string;
    }>;
    expect(tests.map((t) => t.accreditation_status)).toEqual([
      "confirmed",
      "not_confirmed",
    ]);
  });

  it("search_tests keeps unaccredited providers and adds status", async () => {
    state.tables.unified_provider_tests = [
      {
        data: [
          {
            id: T1,
            lab_ukas_accredited: true,
            lab_cqc_regulated: true,
            lab_iso15189: null,
          },
          {
            id: T2,
            lab_ukas_accredited: null,
            lab_cqc_regulated: false,
            lab_iso15189: null,
          },
        ],
        count: 2,
      },
    ];
    const r = await run(searchTests, {
      sort: "price_asc",
      limit: 10,
      offset: 0,
      include_addons: false,
    });
    const results = r.structuredContent!.results as Array<{
      accreditation_status: string;
    }>;
    expect(results.map((t) => t.accreditation_status)).toEqual([
      "confirmed",
      "failed",
    ]);
    const sel = state.calls.find((c) => c.method === "select");
    expect(sel?.args[0]).toContain("lab_ukas_accredited");
  });
});

describe("favourites", () => {
  it("save_favourite looks up catalogue values and upserts on the unique constraint", async () => {
    state.tables.unified_provider_tests = [
      {
        data: {
          id: T1,
          test_name: "Thyroid",
          provider_name: "Randox",
          category_primary: "thyroid",
          price: 39,
        },
      },
    ];
    state.tables.favorites = [
      { data: null },
      { data: { id: "f1", test_id: T1 } },
    ];
    const r = await run(saveFavourite, { test_id: T1 });
    expect(r.isError).toBeUndefined();
    const upsert = state.calls.find((c) => c.method === "upsert");
    expect(upsert?.args[0]).toMatchObject({
      user_id: USER,
      test_id: T1,
      name: "Thyroid",
      provider: "Randox",
      price: 39,
    });
    expect(upsert?.args[1]).toEqual({
      onConflict: "user_id,test_id",
      ignoreDuplicates: true,
    });
  });

  it("save_favourite is idempotent when called twice", async () => {
    state.tables.unified_provider_tests = [
      {
        data: {
          id: T1,
          test_name: "T",
          provider_name: "P",
          category_primary: null,
          price: 1,
        },
      },
    ];
    state.tables.favorites = [{ data: { id: "f1", test_id: T1 } }];
    const a = await run(saveFavourite, { test_id: T1 });
    const b = await run(saveFavourite, { test_id: T1 });
    expect(a.structuredContent).toEqual(b.structuredContent);
  });

  it("save_favourite requires sign-in and rejects unknown tests", async () => {
    expect(
      (await run(saveFavourite, { test_id: T1 }, ctx(false))).isError,
    ).toBe(true);
    state.tables.unified_provider_tests = [{ data: null }];
    expect((await run(saveFavourite, { test_id: T1 })).isError).toBe(true);
  });

  it("list_my_favourites flags price changes", async () => {
    state.tables.favorites = [
      { data: [{ id: "f", test_id: T1, price: 40, created_at: "x" }] },
    ];
    state.tables.unified_provider_tests = [
      {
        data: [
          {
            id: T1,
            price: 45,
            total_expected_cost: 45,
            updated_at: "2026-09-30",
          },
        ],
      },
    ];
    const r = await run(listMyFavourites, { limit: 10 });
    const f = (
      r.structuredContent!.favourites as Array<Record<string, unknown>>
    )[0];
    expect(f.price_changed).toBe(true);
    expect(f.updated_at).toBe("2026-09-30");
  });

  it("remove_favourite scopes the delete to the caller", async () => {
    state.tables.favorites = [{ data: [{ id: "f" }] }];
    const r = await run(removeFavourite, { test_id: T1 });
    expect(r.structuredContent!.removed).toBe(1);
    expect(
      state.calls.some(
        (c) =>
          c.method === "eq" && c.args[0] === "user_id" && c.args[1] === USER,
      ),
    ).toBe(true);
    expect(removeFavourite.annotations?.destructiveHint).toBe(true);
  });
});

const adminTools: Array<
  [
    string,
    { handler: unknown; annotations?: { readOnlyHint?: boolean } },
    unknown,
  ]
> = [
  [
    "get_price_movements",
    getPriceMovements,
    { days: 30, direction: "up", min_change_percentage: 5, limit: 10 },
  ],
  ["get_performance_summary", getPerformanceSummary, { days: 7, limit: 20 }],
  ["get_business_summary", getBusinessSummary, { days: 90 }],
  ["get_platform_health", getPlatformHealth, { hours: 72 }],
  ["get_admin_audit_trail", getAdminAuditTrail, { days: 14, limit: 50 }],
  ["get_security_posture", getSecurityPosture, { days: 7 }],
  [
    "list_scraper_alerts",
    listScraperAlerts,
    { include_acknowledged: false, limit: 50 },
  ],
  ["get_catalogue_coverage", getCatalogueCoverage, { stale_after_days: 30 }],
  ["list_stale_tests", listStaleTests, { stale_after_days: 30, limit: 50 }],
  ["get_data_quality", getDataQuality, { sample_size: 5 }],
];

describe("admin tools", () => {
  it.each(adminTools)(
    "%s is read-only and denies non-admins with a logged attempt",
    async (name, tool, args) => {
      expect(tool.annotations?.readOnlyHint).toBe(true);
      state.rpc.has_role = { data: false };
      const r = await run(tool, args);
      expect(r.isError).toBe(true);
      expect(r.content[0].text).toMatch(/permission/);
      expect(state.rpcCalls).toContainEqual({
        fn: "mcp_log_denied_tool_call",
        args: { p_tool: name },
      });
      expect(state.calls.some((c) => c.table === "admin_activity_log")).toBe(
        false,
      );
    },
  );

  it.each(adminTools)(
    "%s logs before returning data for admins",
    async (name, tool, args) => {
      state.rpc.has_role = { data: true };
      const r = await run(tool, args);
      expect(r.isError).toBeUndefined();
      const insert = state.calls.find(
        (c) => c.table === "admin_activity_log" && c.method === "insert",
      );
      expect((insert?.args[0] as { action: string }).action).toBe(
        `mcp.${name}`,
      );
    },
  );

  it("returns no data when the audit write fails", async () => {
    state.rpc.has_role = { data: true };
    state.rpc.mcp_business_summary = { data: { orders_total: 3 } };
    state.tables.admin_activity_log = [{ error: { message: "rls" } }];
    const r = await run(getBusinessSummary, { days: 30 });
    expect(r.isError).toBe(true);
    expect(r.structuredContent).toBeUndefined();
  });

  it("get_price_movements passes provider, direction and threshold to SQL", async () => {
    state.rpc.has_role = { data: true };
    await run(getPriceMovements, {
      days: 30,
      provider: "randox",
      direction: "down",
      min_change_percentage: 10,
      limit: 5,
    });
    expect(
      state.rpcCalls.find((c) => c.fn === "mcp_price_movements")?.args,
    ).toEqual({
      p_days: 30,
      p_provider: "randox",
      p_direction: "down",
      p_min_change_percentage: 10,
      p_limit: 5,
    });
  });

  it("get_security_posture masks IPs and emails in incidents", async () => {
    state.rpc.has_role = { data: true };
    state.tables.soc_incidents = [
      {
        data: [
          {
            id: "i",
            severity: "high",
            entity: "192.168.1.9",
            title: "login by a@b.co",
          },
        ],
      },
    ];
    const r = await run(getSecurityPosture, { days: 7 });
    const inc = (
      r.structuredContent!.open_incidents as Array<{
        entity: string;
        title: string;
      }>
    )[0];
    expect(inc.entity).toBe("[ip masked]");
    expect(inc.title).toBe("login by [email masked]");
  });

  it("list_scraper_alerts truncates messages", async () => {
    state.rpc.has_role = { data: true };
    state.tables.scraper_alerts = [
      { data: [{ id: "a", message: "m".repeat(500) }], count: 1 },
    ];
    const r = await run(listScraperAlerts, {
      include_acknowledged: false,
      limit: 5,
    });
    expect(
      (r.structuredContent!.alerts as Array<{ message: string }>)[0].message
        .length,
    ).toBe(200);
  });

  it("get_platform_health reports SQL counts including in-progress", async () => {
    state.rpc.has_role = { data: true };
    state.rpc.mcp_platform_health_counts = {
      data: {
        providers: [
          { provider_id: "randox", success: 3, failure: 0, in_progress: 1 },
        ],
      },
    };
    const r = await run(getPlatformHealth, { hours: 24 });
    expect(
      (r.structuredContent!.providers as Array<{ in_progress: number }>)[0]
        .in_progress,
    ).toBe(1);
  });
});
