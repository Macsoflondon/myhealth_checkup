/**
 * Unit tests for the shared mhc-* sync-secret check.
 *
 * Run with:
 *   deno test supabase/functions/_shared/mhc-auth.test.ts
 * (no permissions needed: env and the database are injected fakes)
 */
import { assert, assertEquals } from "jsr:@std/assert@1.0.19";
import {
  constantTimeEqual,
  createMhcSyncSecretCheck,
  type MhcRpcClient,
} from "./mhc-auth.ts";

const SECRET = "test-only-not-a-real-secret-0123456789";

type Reply = { data: unknown; error: { message: string } | null } | Error;

function fakeDb(...replies: Reply[]) {
  const calls: string[] = [];
  const db: MhcRpcClient = {
    rpc(fn: string) {
      calls.push(fn);
      const r = replies.length > 1 ? replies.shift()! : replies[0];
      return r instanceof Error ? Promise.reject(r) : Promise.resolve(r);
    },
  };
  return { db, calls };
}

function capture() {
  const lines: string[] = [];
  return {
    lines,
    log: {
      warn: (...a: unknown[]) => lines.push(a.join(" ")),
      error: (...a: unknown[]) => lines.push(a.join(" ")),
    },
  };
}

const u = (secret?: string) => {
  const url = new URL("https://x.supabase.co/functions/v1/mhc-test");
  if (secret !== undefined) url.searchParams.set("secret", secret);
  return url;
};

Deno.test("constantTimeEqual", () => {
  assert(constantTimeEqual("abc", "abc"));
  assert(constantTimeEqual("", ""));
  assert(!constantTimeEqual("abc", "abd"));
  assert(!constantTimeEqual("abc", "ab"));
  assert(!constantTimeEqual("ab", "abc"));
  assert(!constantTimeEqual("abc\u0000", "abc"));
  assert(!constantTimeEqual("", "a"));
});

Deno.test("accepts the Vault value", async () => {
  const { db, calls } = fakeDb({ data: SECRET, error: null });
  const check = createMhcSyncSecretCheck({ getEnv: () => undefined });
  assertEquals(await check(u(SECRET), db, "t"), { ok: true, source: "vault" });
  assertEquals(calls, ["mhc_sync_secret"]);
});

Deno.test("rejects a wrong, empty or missing ?secret=", async () => {
  const { db } = fakeDb({ data: SECRET, error: null });
  const check = createMhcSyncSecretCheck({ getEnv: () => undefined });
  const mismatch = { ok: false, reason: "mismatch" } as const;
  assertEquals(await check(u(SECRET + "x"), db, "t"), mismatch);
  assertEquals(await check(u(SECRET.slice(0, -1)), db, "t"), mismatch);
  assertEquals(await check(u(""), db, "t"), mismatch);
  assertEquals(await check(u(), db, "t"), mismatch);
  assertEquals(await check(u("x".repeat(5000)), db, "t"), mismatch);
});

Deno.test(
  "Vault wins over a different env value and the drift is logged once without values",
  async () => {
    const { db } = fakeDb({ data: SECRET, error: null });
    const { lines, log } = capture();
    const check = createMhcSyncSecretCheck({
      getEnv: () => "stale-env-value",
      log,
      ttlMs: 0,
    });
    assertEquals(await check(u("stale-env-value"), db, "t"), {
      ok: false,
      reason: "mismatch",
    });
    assertEquals(await check(u(SECRET), db, "t"), {
      ok: true,
      source: "vault",
    });
    assertEquals(lines.filter((l) => l.includes("differs")).length, 1);
    assert(
      lines.every((l) => !l.includes(SECRET) && !l.includes("stale-env-value")),
    );
  },
);

Deno.test(
  "falls back to env when the RPC errors, throws or returns nothing",
  async () => {
    for (const reply of [
      {
        data: null,
        error: { message: "permission denied for function mhc_sync_secret" },
      },
      new Error("network down"),
      { data: null, error: null },
      { data: "   ", error: null },
      { data: 42, error: null },
    ] as Reply[]) {
      const { db } = fakeDb(reply);
      const { lines, log } = capture();
      const check = createMhcSyncSecretCheck({ getEnv: () => SECRET, log });
      assertEquals(await check(u(SECRET), db, "t"), {
        ok: true,
        source: "env",
      });
      assert(lines.every((l) => !l.includes(SECRET)));
    }
  },
);

Deno.test("fails closed when neither Vault nor env has a value", async () => {
  for (const env of [undefined, "", "  "]) {
    const { db } = fakeDb({ data: null, error: null });
    const check = createMhcSyncSecretCheck({
      getEnv: () => env,
      log: capture().log,
    });
    assertEquals(await check(u(""), db, "t"), {
      ok: false,
      reason: "not_configured",
    });
    assertEquals(await check(u(), db, "t"), {
      ok: false,
      reason: "not_configured",
    });
    assertEquals(await check(u("anything"), db, "t"), {
      ok: false,
      reason: "not_configured",
    });
  }
});

Deno.test(
  "caches a Vault value for ttlMs, then re-reads (rotation)",
  async () => {
    let t = 1_000;
    const { db, calls } = fakeDb(
      { data: "old-value-000000", error: null },
      { data: "new-value-111111", error: null },
    );
    const check = createMhcSyncSecretCheck({
      getEnv: () => undefined,
      now: () => t,
      ttlMs: 60_000,
    });
    assertEquals((await check(u("old-value-000000"), db, "t")).ok, true);
    t += 59_999;
    assertEquals((await check(u("old-value-000000"), db, "t")).ok, true);
    assertEquals(calls.length, 1);
    t += 1;
    assertEquals((await check(u("old-value-000000"), db, "t")).ok, false);
    assertEquals((await check(u("new-value-111111"), db, "t")).ok, true);
    assertEquals(calls.length, 2);
  },
);

Deno.test("does not cache a failed read or the env fallback", async () => {
  const { db, calls } = fakeDb(
    { data: null, error: { message: "boom" } },
    { data: SECRET, error: null },
  );
  const check = createMhcSyncSecretCheck({
    getEnv: () => "env-fallback-value",
    log: capture().log,
  });
  assertEquals(await check(u("env-fallback-value"), db, "t"), {
    ok: true,
    source: "env",
  });
  assertEquals(await check(u(SECRET), db, "t"), { ok: true, source: "vault" });
  assertEquals(calls.length, 2);
});

Deno.test("concurrent cold requests share one RPC", async () => {
  const { db, calls } = fakeDb({ data: SECRET, error: null });
  const check = createMhcSyncSecretCheck({ getEnv: () => undefined });
  const results = await Promise.all(
    [1, 2, 3, 4].map(() => check(u(SECRET), db, "t")),
  );
  assert(results.every((r) => r.ok));
  assertEquals(calls.length, 1);
});

Deno.test(
  "query-string decoding matches what the cron URL delivers",
  async () => {
    // The cron jobs concatenate the raw Vault value into the URL. URLSearchParams
    // turns '+' into a space, so such a value could never match; this pins that
    // behaviour so a future secret rotation keeps to URL-safe characters.
    const { db } = fakeDb({ data: "a+b", error: null });
    const check = createMhcSyncSecretCheck({ getEnv: () => undefined });
    const raw = new URL("https://x.supabase.co/f?secret=a+b");
    assertEquals((await check(raw, db, "t")).ok, false);
  },
);
