// Shared ?secret= check for the six mhc-* scraper functions.
//
// The mhc-* cron jobs build their URL from the Vault entry mhc_sync_secret.
// This helper reads the same entry through public.mhc_sync_secret()
// (SECURITY DEFINER, EXECUTE for service_role only; migration
// 20260930151340), so the jobs and the functions share one value and cannot
// drift apart. The MHC_SYNC_SECRET env var is used only when that read fails
// or returns nothing. Vault wins whenever it has a value.
//
// Fails closed: an empty expected value or a missing ?secret= never matches.
// The secret is never logged or returned.
//
// The module imports nothing from Deno, npm or esm.sh, so Vitest can load it
// too (src/lib/__tests__/mhc-auth.test.ts). Deno is reached via globalThis.
import { getErrorMessage } from "./errors.ts";

/** The part of a supabase-js client this helper uses. Pass a service-role client. */
export type MhcRpcClient = {
  rpc(
    fn: string,
  ): PromiseLike<{ data: unknown; error: { message: string } | null }>;
};

export type MhcAuthResult =
  | { ok: true; source: "vault" | "env" }
  | { ok: false; reason: "not_configured" | "mismatch" };

export type MhcAuthDeps = {
  /** Reads an env var. Defaults to Deno.env.get. */
  getEnv?: (key: string) => string | undefined;
  /** Milliseconds since the epoch. Defaults to Date.now. */
  now?: () => number;
  /** How long a value read from Vault is reused in this isolate. */
  ttlMs?: number;
  log?: Pick<Console, "warn" | "error">;
};

export const MHC_SECRET_CACHE_MS = 60_000;
export const MHC_SECRET_ENV = "MHC_SYNC_SECRET";
export const MHC_SECRET_RPC = "mhc_sync_secret";
// Longer values are treated as unusable, which bounds the compare loop.
const MAX_SECRET_CHARS = 4096;

function denoEnv(key: string): string | undefined {
  const deno = (
    globalThis as {
      Deno?: { env: { get(k: string): string | undefined } };
    }
  ).Deno;
  try {
    return deno?.env.get(key);
  } catch {
    // No env permission (e.g. deno test without --allow-env).
    return undefined;
  }
}

/**
 * True when a and b are identical. The loop always runs over the longer
 * string and never exits early, so its time does not depend on where the
 * strings first differ.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function usable(v: unknown): string | null {
  if (typeof v !== "string") return null;
  if (v.trim() === "" || v.length > MAX_SECRET_CHARS) return null;
  return v;
}

export function createMhcSyncSecretCheck(deps: MhcAuthDeps = {}) {
  const getEnv = deps.getEnv ?? denoEnv;
  const now = deps.now ?? Date.now;
  const ttlMs = deps.ttlMs ?? MHC_SECRET_CACHE_MS;
  const log = deps.log ?? console;

  // Only a value read from Vault is cached. A failed read is retried on the
  // next request, and the env fallback is read fresh each time.
  let cached: { value: string; expiresAt: number } | null = null;
  let inflight: Promise<string | null> | null = null;
  let driftWarned = false;

  async function readVault(
    db: MhcRpcClient,
    caller: string,
  ): Promise<string | null> {
    try {
      const { data, error } = await db.rpc(MHC_SECRET_RPC);
      if (error) {
        log.error(
          `[${caller}] ${MHC_SECRET_RPC}() failed: ${getErrorMessage(error).slice(0, 200)}`,
        );
        return null;
      }
      return usable(data);
    } catch (e) {
      log.error(
        `[${caller}] ${MHC_SECRET_RPC}() threw: ${getErrorMessage(e).slice(0, 200)}`,
      );
      return null;
    }
  }

  async function expected(
    db: MhcRpcClient,
    caller: string,
  ): Promise<{ value: string; source: "vault" | "env" } | null> {
    if (cached && now() < cached.expiresAt) {
      return { value: cached.value, source: "vault" };
    }
    if (!inflight) {
      inflight = readVault(db, caller).finally(() => {
        inflight = null;
      });
    }
    const fromVault = await inflight;
    const fromEnv = usable(getEnv(MHC_SECRET_ENV));
    if (fromVault !== null) {
      cached = { value: fromVault, expiresAt: now() + ttlMs };
      if (fromEnv !== null && fromEnv !== fromVault && !driftWarned) {
        driftWarned = true;
        log.warn(
          `[${caller}] ${MHC_SECRET_ENV} differs from Vault ${MHC_SECRET_RPC}; using Vault. Unset the env var.`,
        );
      }
      return { value: fromVault, source: "vault" };
    }
    cached = null;
    if (fromEnv !== null) {
      log.warn(
        `[${caller}] Vault ${MHC_SECRET_RPC} unavailable; using the ${MHC_SECRET_ENV} fallback`,
      );
      return { value: fromEnv, source: "env" };
    }
    return null;
  }

  /**
   * Checks ?secret= on url. Resolves the expected value first, so a function
   * with no secret configured can answer differently (mhc-shopify-rich-sync
   * returns 503) from one given the wrong secret.
   */
  return async function checkMhcSyncSecret(
    url: URL,
    db: MhcRpcClient,
    caller: string,
  ): Promise<MhcAuthResult> {
    const exp = await expected(db, caller);
    if (exp === null) {
      log.error(
        `[${caller}] no sync secret: Vault ${MHC_SECRET_RPC} and ${MHC_SECRET_ENV} are both empty or unreadable`,
      );
      return { ok: false, reason: "not_configured" };
    }
    const presented = url.searchParams.get("secret");
    if (
      presented === null ||
      presented === "" ||
      presented.length > MAX_SECRET_CHARS ||
      !constantTimeEqual(presented, exp.value)
    ) {
      return { ok: false, reason: "mismatch" };
    }
    return { ok: true, source: exp.source };
  };
}

/** Per-isolate instance used by the mhc-* functions. */
export const checkMhcSyncSecret = createMhcSyncSecretCheck();
