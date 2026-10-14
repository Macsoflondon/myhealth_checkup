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
  return u;
};
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

  it("Vault wins; env is only a fallback", async () => {
    const check = createMhcSyncSecretCheck({
      getEnv: () => "other-env",
      log: quiet,
    });
    const { client } = db({ data: SECRET, error: null });
    expect(await check(url(SECRET), client, "t")).toEqual({
      ok: true,
      source: "vault",
    });
    expect(await check(url("other-env"), client, "t")).toEqual({
      ok: false,
      reason: "mismatch",
    });

    const fallback = createMhcSyncSecretCheck({
      getEnv: () => "env-value-1234",
      log: quiet,
    });
    const failing = db({ data: null, error: { message: "permission denied" } });
    expect(await fallback(url("env-value-1234"), failing.client, "t")).toEqual({
      ok: true,
      source: "env",
    });
  });

  it("missing or empty ?secret= never matches", async () => {
    const check = createMhcSyncSecretCheck({
      getEnv: () => undefined,
      log: quiet,
    });
    const { client } = db({ data: SECRET, error: null });
    expect((await check(url(), client, "t")).ok).toBe(false);
    expect((await check(url(""), client, "t")).ok).toBe(false);
  });
});
