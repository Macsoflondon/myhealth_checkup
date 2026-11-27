import { describe, expect, it } from "vitest";
import {
  constantTimeEqual,
  createMhcSyncSecretCheck,
  checkMhcSyncSecret,
  type MhcRpcClient,
} from "../../../supabase/functions/_shared/mhc-auth";

const SECRET = "test-only-not-a-real-secret-0123456789";
const quiet = { warn: () => {}, error: () => {} };
const url = (s?: string) => {
  const u = new URL("https://x.supabase.co/functions/v1/mhc-test");
  if (s !== undefined) u.searchParams.set("secret", s);
  return new Request(u);
};
const hdr = (s: string) =>
  new Request("https://x.supabase.co/functions/v1/mhc-test", {
    headers: { "x-mhc-sync-secret": s },
  });
function db(
  reply: { data: unknown; error: { message: string } | null } | Error,
) {
  const calls: string[] = [];
  const client: MhcRpcClient = {
    rpc(fn: string) {
      calls.push(fn);
      return reply instanceof Error
        ? Promise.reject(reply)
        : Promise.resolve(reply);
    },
  };
  return { client, calls };
}

describe("mhc-auth (loads without a Deno global)", () => {
  it("has no Deno global here, and the default instance still fails closed", async () => {
    expect((globalThis as { Deno?: unknown }).Deno).toBeUndefined();
    const { client } = db({ data: null, error: null });
    const origError = console.error;
    console.error = () => {};
    try {
      expect(await checkMhcSyncSecret(hdr(SECRET), client, "t")).toEqual({
        ok: false,
        reason: "not_configured",
      });
    } finally {
      console.error = origError;
    }
  });

  it("compares in constant time and rejects length differences", () => {
    expect(constantTimeEqual(SECRET, SECRET)).toBe(true);
    expect(constantTimeEqual(SECRET, SECRET + "x")).toBe(false);
    expect(constantTimeEqual("", "x")).toBe(false);
  });

  it("accepts only the header and refuses wrong or missing secrets", async () => {
    const check = createMhcSyncSecretCheck({ log: quiet });
    const { client } = db({ data: SECRET, error: null });
    expect(await check(hdr(SECRET), client, "t")).toEqual({ ok: true, source: "vault" });
    expect(await check(hdr("wrong"), client, "t")).toEqual({ ok: false, reason: "mismatch" });
    expect(await check(url(), client, "t")).toEqual({ ok: false, reason: "mismatch" });
  });

  it("refuses a query value, with or without a correct header, logging no value", async () => {
    const warns: string[] = [];
    const check = createMhcSyncSecretCheck({
      log: { warn: (m: string) => warns.push(m), error: () => {} },
    });
    const { client } = db({ data: SECRET, error: null });
    const refused = { ok: false, reason: "secret_in_url" };
    expect(await check(url(SECRET), client, "caller-x")).toEqual(refused);
    const both = new Request(`https://x.supabase.co/functions/v1/mhc-test?secret=${SECRET}`, {
      headers: { "x-mhc-sync-secret": SECRET },
    });
    expect(await check(both, client, "caller-x")).toEqual(refused);
    expect(warns).toHaveLength(2);
    expect(warns.every((w) => w.includes("caller-x") && !w.includes(SECRET))).toBe(true);
  });

  it("a Vault failure refuses with no env fallback", async () => {
    const check = createMhcSyncSecretCheck({ log: quiet });
    const failing = db({ data: null, error: { message: "permission denied" } });
    expect(await check(hdr(SECRET), failing.client, "t")).toEqual({
      ok: false,
      reason: "not_configured",
    });
  });
});
