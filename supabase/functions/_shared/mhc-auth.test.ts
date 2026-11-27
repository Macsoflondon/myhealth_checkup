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

const BASE = "https://x.supabase.co/functions/v1/mhc-test";
const hdr = (secret: string) =>
  new Request(BASE, { headers: { "x-mhc-sync-secret": secret } });
const qry = (secret?: string) => {
  const url = new URL(BASE);
  if (secret !== undefined) url.searchParams.set("secret", secret);
  return new Request(url);
};

Deno.test("constantTimeEqual", () => {
  assert(constantTimeEqual("abc", "abc"));
  assert(!constantTimeEqual("abc", "abd"));
  assert(!constantTimeEqual("abc", "ab"));
  assert(!constantTimeEqual("", "a"));
});

Deno.test("header with the Vault value is accepted", async () => {
  const { db, calls } = fakeDb({ data: SECRET, error: null });
  const check = createMhcSyncSecretCheck();
  assertEquals(await check(hdr(SECRET), db, "t"), {
    ok: true,
    source: "vault",
  });
  assertEquals(calls, ["mhc_sync_secret"]);
});

Deno.test("wrong header is refused", async () => {
  const { db } = fakeDb({ data: SECRET, error: null });
  const check = createMhcSyncSecretCheck();
  const mismatch = { ok: false, reason: "mismatch" } as const;
  assertEquals(await check(hdr(SECRET + "x"), db, "t"), mismatch);
  assertEquals(await check(hdr(""), db, "t"), mismatch);
  assertEquals(await check(hdr("x".repeat(5000)), db, "t"), mismatch);
});

Deno.test("missing secret is refused", async () => {
  const { db } = fakeDb({ data: SECRET, error: null });
  const check = createMhcSyncSecretCheck();
  assertEquals(await check(qry(), db, "t"), { ok: false, reason: "mismatch" });
});

Deno.test(
  "query value is refused, warning names the caller and not the value",
  async () => {
    const { db, calls } = fakeDb({ data: SECRET, error: null });
    const { lines, log } = capture();
    const check = createMhcSyncSecretCheck({ log });
    const refused = { ok: false, reason: "secret_in_url" } as const;
    assertEquals(await check(qry(SECRET), db, "mhc-caller"), refused);
    assertEquals(await check(qry(""), db, "mhc-caller"), refused);
    assertEquals(calls.length, 0);
    assert(
      lines.length === 2 &&
        lines.every((l) => l.includes("mhc-caller") && !l.includes(SECRET)),
    );
  },
);

Deno.test("query value plus a correct header is refused", async () => {
  const { db } = fakeDb({ data: SECRET, error: null });
  const { lines, log } = capture();
  const check = createMhcSyncSecretCheck({ log });
  const both = new Request(`${BASE}?secret=${SECRET}`, {
    headers: { "x-mhc-sync-secret": SECRET },
  });
  assertEquals(await check(both, db, "t"), {
    ok: false,
    reason: "secret_in_url",
  });
  assert(lines.every((l) => !l.includes(SECRET)));
});

Deno.test(
  "Vault failure refuses (no env fallback), logging no secret",
  async () => {
    const prev = Deno.env.get("MHC_SYNC_SECRET");
    for (const reply of [
      { data: null, error: { message: "boom" } },
      new Error("network"),
      { data: null, error: null },
      { data: "   ", error: null },
    ] as Reply[]) {
      const { db } = fakeDb(reply);
      const { lines, log } = capture();
      const check = createMhcSyncSecretCheck({ log });
      assertEquals(await check(hdr(SECRET), db, "t"), {
        ok: false,
        reason: "not_configured",
      });
      assert(lines.every((l) => !l.includes(SECRET)));
    }
    assertEquals(Deno.env.get("MHC_SYNC_SECRET"), prev);
  },
);

Deno.test("caches a Vault value for the TTL, never a failure", async () => {
  let t = 0;
  const { db, calls } = fakeDb(
    { data: null, error: { message: "x" } },
    { data: SECRET, error: null },
  );
  const check = createMhcSyncSecretCheck({
    now: () => t,
    ttlMs: 1000,
    log: capture().log,
  });
  assertEquals((await check(hdr(SECRET), db, "t")).ok, false);
  assertEquals((await check(hdr(SECRET), db, "t")).ok, true);
  t = 500;
  assertEquals((await check(hdr(SECRET), db, "t")).ok, true);
  assertEquals(calls.length, 2);
});

Deno.test("concurrent first requests share one Vault read", async () => {
  const { db, calls } = fakeDb({ data: SECRET, error: null });
  const check = createMhcSyncSecretCheck();
  const results = await Promise.all(
    [1, 2, 3, 4].map(() => check(hdr(SECRET), db, "t")),
  );
  assert(results.every((r) => r.ok));
  assertEquals(calls.length, 1);
});
