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
      expect(await checkMhcSyncSecret(url(SECRET), client, "t")).toEqual({
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

  it("reads the header, falls back to ?secret= only without one", async () => {
    const check = createMhcSyncSecretCheck({ log: quiet });
    const { client } = db({ data: SECRET, error: null });
    expect(await check(hdr(SECRET), client, "t")).toEqual({
      ok: true,
      source: "vault",
      via: "header",
    });
    expect(await check(url(SECRET), client, "t")).toEqual({
      ok: true,
      source: "vault",
      via: "query",
    });
    expect((await check(hdr("wrong"), client, "t")).ok).toBe(false);
    expect((await check(url(), client, "t")).ok).toBe(false);
    expect((await check(url(""), client, "t")).ok).toBe(false);
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
