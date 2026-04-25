/**
 * Unit tests for the shared provider-upsert helper.
 *
 * These tests use an in-memory fake Supabase client that mimics the subset of
 * the PostgREST chain we rely on (`from().select().eq().eq()` and
 * `from().upsert()`), and lets each test inject behaviour:
 *   - existing rows in the DB (to simulate the partial unique index reservation)
 *   - whether a given upsert call should fail (and with what error message)
 *
 * Run with:
 *   deno test supabase/functions/_shared/provider-upsert.test.ts --allow-net --allow-env
 */

import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { upsertProviderTests } from "./provider-upsert.ts";

// ─── Fake Supabase client ───────────────────────────────────────────

interface FakeRow {
  provider_id: string;
  provider_test_id: string | null;
  test_name: string;
  is_active: boolean;
  [k: string]: unknown;
}

interface FakeOptions {
  /** Rows already present in the "DB" before the test runs. */
  existing?: FakeRow[];
  /**
   * Decide whether a given upsert call should fail. Receives the rows being
   * upserted in this call. Return null to succeed, or an error message to fail.
   * Called once per `upsert()` invocation (chunk OR per-row retry).
   */
  upsertBehaviour?: (rows: FakeRow[], callIndex: number) => string | null;
}

interface FakeClient {
  from: (table: string) => unknown;
  // expose for assertions
  _upsertCalls: FakeRow[][];
  _finalRows: FakeRow[];
}

function makeFakeSupabase(opts: FakeOptions = {}): FakeClient {
  const existing = opts.existing ?? [];
  const upsertCalls: FakeRow[][] = [];
  // Track current "table" state so we can produce a final row count if needed.
  const tableState: FakeRow[] = [...existing];

  const client: FakeClient = {
    _upsertCalls: upsertCalls,
    _finalRows: tableState,
    from(_table: string) {
      return {
        select(_cols: string) {
          return {
            eq(_col1: string, providerId: string) {
              return {
                eq(_col2: string, isActive: boolean) {
                  const data = existing.filter(
                    (r) => r.provider_id === providerId && r.is_active === isActive,
                  ).map((r) => ({
                    provider_test_id: r.provider_test_id,
                    test_name: r.test_name,
                  }));
                  return Promise.resolve({ data, error: null });
                },
              };
            },
          };
        },
        upsert(rows: FakeRow[], _opts: { onConflict: string }) {
          const callIndex = upsertCalls.length;
          upsertCalls.push(rows);
          const failMsg = opts.upsertBehaviour?.(rows, callIndex) ?? null;
          if (failMsg) {
            return Promise.resolve({ error: { message: failMsg } });
          }
          // Apply the upsert to tableState (replace by provider_test_id).
          for (const r of rows) {
            const idx = tableState.findIndex(
              (e) =>
                e.provider_id === r.provider_id &&
                e.provider_test_id === r.provider_test_id,
            );
            if (idx >= 0) tableState[idx] = { ...tableState[idx], ...r };
            else tableState.push({ ...r });
          }
          return Promise.resolve({ error: null });
        },
      };
    },
  };

  return client;
}

// ─── Tests ──────────────────────────────────────────────────────────

Deno.test("dedupes incoming rows by slug", async () => {
  const client = makeFakeSupabase();
  const rows = [
    { provider_id: "p1", provider_test_id: "p1-foo", test_name: "Foo" },
    { provider_id: "p1", provider_test_id: "p1-foo", test_name: "Foo dup" },
    { provider_id: "p1", provider_test_id: "p1-bar", test_name: "Bar" },
  ];
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-");
  assertEquals(result.finalRowCount, 2);
  assertEquals(result.upsertedCount, 2);
  assertEquals(result.errors.length, 0);
});

Deno.test("disambiguates name collision against existing reserved name", async () => {
  // DB already has slug "p1-old" owning the name "Iron Test".
  const client = makeFakeSupabase({
    existing: [
      {
        provider_id: "p1",
        provider_test_id: "p1-old",
        test_name: "Iron Test",
        is_active: true,
      },
    ],
  });
  const rows = [
    // New slug arrives wanting the same name → must be renamed.
    { provider_id: "p1", provider_test_id: "p1-new", test_name: "Iron Test" },
  ];
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-");
  assertEquals(result.upsertedCount, 1);
  assertEquals(result.errors.length, 0);

  // The single upsert call should contain a renamed row.
  const sentRow = client._upsertCalls[0][0];
  assertEquals(sentRow.provider_test_id, "p1-new");
  // test_name should have been suffixed with the slug fragment "new".
  assertStringIncludes(sentRow.test_name as string, "Iron Test");
  assertStringIncludes(sentRow.test_name as string, "new");
});

Deno.test("does NOT rename when same slug already owns the name", async () => {
  // DB already has slug "p1-iron" owning "Iron Test" — re-scrape of same slug
  // should pass through untouched.
  const client = makeFakeSupabase({
    existing: [
      {
        provider_id: "p1",
        provider_test_id: "p1-iron",
        test_name: "Iron Test",
        is_active: true,
      },
    ],
  });
  const rows = [
    { provider_id: "p1", provider_test_id: "p1-iron", test_name: "Iron Test" },
  ];
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-");
  assertEquals(result.upsertedCount, 1);
  const sentRow = client._upsertCalls[0][0];
  assertEquals(sentRow.test_name, "Iron Test");
});

Deno.test("disambiguates name collision within the same incoming batch", async () => {
  const client = makeFakeSupabase();
  const rows = [
    { provider_id: "p1", provider_test_id: "p1-a", test_name: "Same Name" },
    { provider_id: "p1", provider_test_id: "p1-b", test_name: "Same Name" },
  ];
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-");
  assertEquals(result.upsertedCount, 2);
  assertEquals(result.errors.length, 0);

  const sent = client._upsertCalls[0];
  const names = sent.map((r) => r.test_name);
  // Both names must be distinct after disambiguation.
  assertEquals(new Set(names).size, 2);
});

Deno.test("falls back to per-row upsert when chunk fails, recovering most rows", async () => {
  // Chunk size 2 → first chunk fails wholesale; per-row retries succeed.
  const client = makeFakeSupabase({
    upsertBehaviour: (rows, callIndex) => {
      // Call 0 = the first chunked upsert (2 rows). Fail it.
      if (callIndex === 0 && rows.length > 1) return "chunk failed";
      return null;
    },
  });
  const rows = [
    { provider_id: "p1", provider_test_id: "p1-a", test_name: "A" },
    { provider_id: "p1", provider_test_id: "p1-b", test_name: "B" },
  ];
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-", 2);
  assertEquals(result.upsertedCount, 2);
  assertEquals(result.errors.length, 0);
  // 1 chunk call + 2 per-row retries = 3 total upsert calls.
  assertEquals(client._upsertCalls.length, 3);
});

Deno.test("per-row fallback retries with renamed test_name on active-name unique violation", async () => {
  // Chunk fails; per-row first attempt also fails with the active-name unique
  // error; the helper should retry once with a `[suffix]`-renamed name.
  const perRowAttempts = new Map<string, number>();
  const client = makeFakeSupabase({
    upsertBehaviour: (rows, _callIndex) => {
      // Chunk call has >1 row → fail it.
      if (rows.length > 1) return "chunk failed";
      // Per-row: first attempt for each slug fails with the active-name unique.
      const slug = rows[0].provider_test_id ?? "";
      const n = (perRowAttempts.get(slug) ?? 0) + 1;
      perRowAttempts.set(slug, n);
      if (n === 1) {
        return "duplicate key value violates unique constraint \"provider_tests_unique_active\"";
      }
      return null; // retry succeeds
    },
  });
  const rows = [
    { provider_id: "p1", provider_test_id: "p1-foo", test_name: "Foo" },
    { provider_id: "p1", provider_test_id: "p1-bar", test_name: "Bar" },
  ];
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-", 10);
  assertEquals(result.upsertedCount, 2);
  assertEquals(result.errors.length, 0);

  // Inspect the renamed retry payloads (calls 3 and 5, i.e. the second attempt
  // for each slug). They must have a bracketed suffix.
  const retryCalls = client._upsertCalls.filter(
    (c) => c.length === 1 && /\[.+\]/.test(c[0].test_name as string),
  );
  assertEquals(retryCalls.length, 2);
  for (const call of retryCalls) {
    assertStringIncludes(call[0].test_name as string, "[");
    assertStringIncludes(call[0].test_name as string, "]");
  }
});

Deno.test("records errors for rows that fail every retry path", async () => {
  // Per-row upsert always fails with a non-recoverable error.
  const client = makeFakeSupabase({
    upsertBehaviour: (rows) => {
      if (rows.length > 1) return "chunk failed";
      return "permanent failure";
    },
  });
  const rows = [
    { provider_id: "p1", provider_test_id: "p1-x", test_name: "X" },
  ];
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-", 10);
  assertEquals(result.upsertedCount, 0);
  assertEquals(result.errors.length, 1);
  assertStringIncludes(result.errors[0], "p1-x");
  assertStringIncludes(result.errors[0], "permanent failure");
});

Deno.test("processes rows in chunks of the configured size", async () => {
  const client = makeFakeSupabase();
  const rows = Array.from({ length: 5 }, (_, i) => ({
    provider_id: "p1",
    provider_test_id: `p1-${i}`,
    test_name: `T${i}`,
  }));
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-", 2);
  assertEquals(result.upsertedCount, 5);
  // 5 rows in chunks of 2 → 3 upsert calls (2 + 2 + 1).
  assertEquals(client._upsertCalls.length, 3);
  assertEquals(client._upsertCalls[0].length, 2);
  assertEquals(client._upsertCalls[1].length, 2);
  assertEquals(client._upsertCalls[2].length, 1);
});

Deno.test("continues gracefully when initial reservation fetch fails", async () => {
  // Override the select chain to return an error.
  const client: FakeClient = {
    _upsertCalls: [],
    _finalRows: [],
    from(_table: string) {
      return {
        select(_cols: string) {
          return {
            eq(_c1: string, _v1: string) {
              return {
                eq(_c2: string, _v2: boolean) {
                  return Promise.resolve({
                    data: null,
                    error: { message: "select boom" },
                  });
                },
              };
            },
          };
        },
        upsert: (rows: FakeRow[]) => {
          client._upsertCalls.push(rows);
          return Promise.resolve({ error: null });
        },
      };
    },
  };
  const rows = [
    { provider_id: "p1", provider_test_id: "p1-a", test_name: "A" },
  ];
  // deno-lint-ignore no-explicit-any
  const result = await upsertProviderTests(client as any, "p1", rows, "p1-");
  assertEquals(result.upsertedCount, 1);
  assertEquals(result.errors.length, 0);
});
