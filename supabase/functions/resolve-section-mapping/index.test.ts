/**
 * Integration tests for resolve-section-mapping.
 *
 * Uses an in-memory fake Supabase client that records upserts, fetches, and
 * updates. Exercises:
 *   - auth gate (missing header, non-admin user)
 *   - body validation (missing fields, bad canonical, blank section)
 *   - happy path for: conflict resolution (rows disagree with rule),
 *     unmapped section (new rule created), pending-review confirmation
 *   - normalisation of source_section before upsert + backfill matching
 *   - backfill: only matching active rows updated; count returned
 *
 * Run with: deno test supabase/functions/resolve-section-mapping/index.test.ts --allow-net --allow-env
 */

import {
  assertEquals,
  assertStringIncludes,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { createHandler, norm, type SbLike } from "./index.ts";

// ─── Fake client ───────────────────────────────────────────────────

type Row = Record<string, any>;
interface Recorded {
  upserts: { table: string; row: Row; opts: any }[];
  updates: { table: string; patch: Row; ids: string[] }[];
}

function makeFake(opts: {
  userId: string | null;
  isAdmin: boolean;
  providerTests?: Row[];
  recorded?: Recorded;
}): SbLike {
  const rec: Recorded = opts.recorded ?? { upserts: [], updates: [] };
  const tests = opts.providerTests ?? [];

  return {
    auth: {
      getUser: async () => ({
        data: { user: opts.userId ? { id: opts.userId } : null },
        error: opts.userId ? null : { message: "no user" },
      }),
    },
    from(table: string) {
      const ctx: any = { table, filters: {} as Record<string, any> };

      const chain: any = {
        select(_cols: string) {
          ctx.op = "select";
          return chain;
        },
        eq(col: string, val: any) {
          ctx.filters[col] = val;
          return chain;
        },
        in(col: string, vals: any[]) {
          ctx.filters[col] = { in: vals };
          return chain;
        },
        limit(_n: number) {
          // executes select
          if (table === "user_roles") {
            const rows = opts.isAdmin && ctx.filters.user_id === opts.userId
              ? [{ role: "admin" }]
              : [];
            return Promise.resolve({ data: rows, error: null });
          }
          if (table === "provider_tests") {
            const rows = tests.filter(
              (t) =>
                t.provider_id === ctx.filters.provider_id &&
                t.is_active === ctx.filters.is_active,
            );
            return Promise.resolve({ data: rows, error: null });
          }
          return Promise.resolve({ data: [], error: null });
        },
        upsert(row: Row, options: any) {
          rec.upserts.push({ table, row, opts: options });
          return Promise.resolve({ error: null });
        },
        update(patch: Row, options: any) {
          ctx.patch = patch;
          ctx.updateOpts = options;
          return {
            in(_col: string, vals: string[]) {
              rec.updates.push({ table, patch, ids: vals });
              // apply to in-memory rows so subsequent assertions can read them
              tests.forEach((t) => {
                if (vals.includes(t.id)) Object.assign(t, patch);
              });
              return Promise.resolve({ error: null, count: vals.length });
            },
          };
        },
      };
      return chain;
    },
  };
}

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://x/", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

const buildHandler = (fake: SbLike) =>
  createHandler({ userClientFor: () => fake, adminClient: fake });

// ─── norm() helper ───────────────────────────────────────────────────

Deno.test("norm() lower-cases, replaces non-alnum with '-', trims", () => {
  assertEquals(norm("Women's Health & Hormones!"), "women-s-health-hormones");
  assertEquals(norm("   --Thyroid--   "), "thyroid");
  assertEquals(norm("ALREADY-OK"), "already-ok");
  assertEquals(norm(""), "");
});

// ─── CORS / auth gate ───────────────────────────────────────────────

Deno.test("OPTIONS returns CORS preflight 200", async () => {
  const fake = makeFake({ userId: null, isAdmin: false });
  const res = await buildHandler(fake)(
    new Request("http://x/", { method: "OPTIONS" }),
  );
  assertEquals(res.status, 200);
  assertEquals(res.headers.get("Access-Control-Allow-Origin"), "*");
  await res.text();
});

Deno.test("missing Authorization header → 401", async () => {
  const fake = makeFake({ userId: null, isAdmin: false });
  const res = await buildHandler(fake)(post({}));
  assertEquals(res.status, 401);
  await res.text();
});

Deno.test("non-admin caller → 403", async () => {
  const fake = makeFake({ userId: "u1", isAdmin: false });
  const res = await buildHandler(fake)(
    post(
      { provider_id: "p", source_section: "women", canonical_category: "womens-health" },
      { Authorization: "Bearer x" },
    ),
  );
  assertEquals(res.status, 403);
  await res.text();
});

// ─── Body validation ────────────────────────────────────────────────

Deno.test("missing fields → 400", async () => {
  const fake = makeFake({ userId: "u1", isAdmin: true });
  const res = await buildHandler(fake)(post({}, { Authorization: "Bearer x" }));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertStringIncludes(body.error, "required");
});

Deno.test("unknown canonical_category → 400", async () => {
  const fake = makeFake({ userId: "u1", isAdmin: true });
  const res = await buildHandler(fake)(
    post(
      { provider_id: "p", source_section: "women", canonical_category: "made-up" },
      { Authorization: "Bearer x" },
    ),
  );
  assertEquals(res.status, 400);
  const body = await res.json();
  assertStringIncludes(body.error, "Unknown canonical_category");
});

Deno.test("blank source_section after normalisation → 400", async () => {
  const fake = makeFake({ userId: "u1", isAdmin: true });
  const res = await buildHandler(fake)(
    post(
      { provider_id: "p", source_section: "---", canonical_category: "thyroid" },
      { Authorization: "Bearer x" },
    ),
  );
  assertEquals(res.status, 400);
  const body = await res.json();
  assertStringIncludes(body.error, "Invalid source_section");
});

// ─── Happy paths ────────────────────────────────────────────────────

Deno.test("conflict resolution: upserts rule and backfills disagreeing rows", async () => {
  const tests: Row[] = [
    { id: "t1", provider_id: "medichecks", source_section: "Women's Health",
      category: null, is_active: true, canonical_category: "general-health" },
    { id: "t2", provider_id: "medichecks", source_section: "womens-health",
      category: null, is_active: true, canonical_category: "general-health" },
    { id: "t3", provider_id: "medichecks", source_section: "thyroid",
      category: null, is_active: true, canonical_category: "thyroid" },
    // inactive row must be ignored
    { id: "t4", provider_id: "medichecks", source_section: "Women's Health",
      category: null, is_active: false, canonical_category: "general-health" },
    // other provider must be ignored
    { id: "t5", provider_id: "randox", source_section: "Women's Health",
      category: null, is_active: true, canonical_category: "general-health" },
  ];
  const recorded: Recorded = { upserts: [], updates: [] };
  const fake = makeFake({ userId: "u1", isAdmin: true, providerTests: tests, recorded });

  const res = await buildHandler(fake)(
    post(
      {
        provider_id: "medichecks",
        source_section: "Women's Health",
        canonical_category: "womens-health",
      },
      { Authorization: "Bearer x" },
    ),
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.source_section, "women-s-health"); // normalised
  assertEquals(body.updated_rows, 2); // t1 + t2

  // Rule upserted with normalised section + mark_reviewed=true → needs_review=false
  assertEquals(recorded.upserts.length, 1);
  assertEquals(recorded.upserts[0].table, "provider_section_category_map");
  assertEquals(recorded.upserts[0].row.provider_id, "medichecks");
  assertEquals(recorded.upserts[0].row.source_section, "women-s-health");
  assertEquals(recorded.upserts[0].row.canonical_category, "womens-health");
  assertEquals(recorded.upserts[0].row.needs_review, false);
  assertEquals(recorded.upserts[0].opts.onConflict, "provider_id,source_section");

  // Backfill targeted only t1 + t2
  assertEquals(recorded.updates.length, 1);
  assertEquals(recorded.updates[0].ids.sort(), ["t1", "t2"]);
  assertEquals(tests.find((t) => t.id === "t1")!.canonical_category, "womens-health");
  assertEquals(tests.find((t) => t.id === "t3")!.canonical_category, "thyroid"); // untouched
  assertEquals(tests.find((t) => t.id === "t4")!.canonical_category, "general-health"); // inactive untouched
  assertEquals(tests.find((t) => t.id === "t5")!.canonical_category, "general-health"); // other provider untouched
});

Deno.test("unmapped section: creates new rule, backfills via category fallback", async () => {
  // rows have no source_section, only category — backfill must still match via fallback
  const tests: Row[] = [
    { id: "a", provider_id: "thriva", source_section: null,
      category: "Sports Performance", is_active: true, canonical_category: null },
    { id: "b", provider_id: "thriva", source_section: null,
      category: "sports-performance", is_active: true, canonical_category: null },
    { id: "c", provider_id: "thriva", source_section: null,
      category: "Gut Health", is_active: true, canonical_category: null },
  ];
  const recorded: Recorded = { upserts: [], updates: [] };
  const fake = makeFake({ userId: "u1", isAdmin: true, providerTests: tests, recorded });

  const res = await buildHandler(fake)(
    post(
      {
        provider_id: "thriva",
        source_section: "Sports Performance",
        canonical_category: "sports-performance",
      },
      { Authorization: "Bearer x" },
    ),
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.updated_rows, 2);
  assertEquals(recorded.updates[0].ids.sort(), ["a", "b"]);
});

Deno.test("pending-review confirmation: mark_reviewed=true clears needs_review without backfill when backfill=false", async () => {
  const recorded: Recorded = { upserts: [], updates: [] };
  const fake = makeFake({
    userId: "u1",
    isAdmin: true,
    providerTests: [
      { id: "x", provider_id: "randox", source_section: "hormones",
        category: null, is_active: true, canonical_category: "hormones" },
    ],
    recorded,
  });

  const res = await buildHandler(fake)(
    post(
      {
        provider_id: "randox",
        source_section: "hormones",
        canonical_category: "hormones",
        backfill: false,
        mark_reviewed: true,
      },
      { Authorization: "Bearer x" },
    ),
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.updated_rows, 0);
  assertEquals(recorded.upserts[0].row.needs_review, false);
  assertEquals(recorded.updates.length, 0);
});

Deno.test("mark_reviewed=false flags rule as needs_review=true", async () => {
  const recorded: Recorded = { upserts: [], updates: [] };
  const fake = makeFake({ userId: "u1", isAdmin: true, recorded });
  const res = await buildHandler(fake)(
    post(
      {
        provider_id: "p",
        source_section: "Heart",
        canonical_category: "heart",
        backfill: false,
        mark_reviewed: false,
      },
      { Authorization: "Bearer x" },
    ),
  );
  assertEquals(res.status, 200);
  await res.text();
  assertEquals(recorded.upserts[0].row.needs_review, true);
});

Deno.test("backfill no-op when no rows match section", async () => {
  const recorded: Recorded = { upserts: [], updates: [] };
  const fake = makeFake({
    userId: "u1",
    isAdmin: true,
    providerTests: [
      { id: "z", provider_id: "p", source_section: "thyroid",
        category: null, is_active: true, canonical_category: "thyroid" },
    ],
    recorded,
  });
  const res = await buildHandler(fake)(
    post(
      { provider_id: "p", source_section: "gut", canonical_category: "gut" },
      { Authorization: "Bearer x" },
    ),
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.updated_rows, 0);
  assertEquals(recorded.updates.length, 0);
  assert(recorded.upserts.length === 1);
});
