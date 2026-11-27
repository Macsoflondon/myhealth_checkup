// Shared sync-secret check for the mhc-* scraper functions and randox-kit-images.
//
// Callers send the secret in the x-mhc-sync-secret request header. Supabase's
// edge logs keep the full URL but not custom headers, so a header keeps the
// secret out of function_edge_logs. Since 27/11/2026 (step 3 of 3) the
// header is the only accepted channel: any request whose URL carries a
// secret query parameter is refused, even with a correct header, because
// that URL has already been logged.
//
// The expected value is the Vault entry mhc_sync_secret, read through
// public.mhc_sync_secret() (SECURITY DEFINER, service_role only). There is
// no environment fallback: if Vault cannot be read the check fails closed.
// The secret is never logged or returned.
//
// The module imports nothing from Deno, npm or esm.sh, so Vitest can load it
// too (src/lib/__tests__/mhc-auth.test.ts).
import { getErrorMessage } from "./errors.ts";

/** The part of a supabase-js client this helper uses. Pass a service-role client. */
export type MhcRpcClient = {
  rpc(
    fn: string,
  ): PromiseLike<{ data: unknown; error: { message: string } | null }>;
};

export type MhcAuthResult =
  | { ok: true; source: "vault" }
  | { ok: false; reason: "not_configured" | "mismatch" | "secret_in_url" };

export type MhcAuthDeps = {
  /** Milliseconds since the epoch. Defaults to Date.now. */
  now?: () => number;
  /** How long a value read from Vault is reused in this isolate. */
  ttlMs?: number;
  log?: Pick<Console, "warn" | "error">;
};

export const MHC_SECRET_CACHE_MS = 60_000;
export const MHC_SECRET_HEADER = "x-mhc-sync-secret";
export const MHC_SECRET_RPC = "mhc_sync_secret";
// Longer values are treated as unusable, which bounds the compare loop.
const MAX_SECRET_CHARS = 4096;

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
  const now = deps.now ?? Date.now;
  const ttlMs = deps.ttlMs ?? MHC_SECRET_CACHE_MS;
  const log = deps.log ?? console;

  // Only a successful Vault read is cached; a failed read is retried next time.
  let cached: { value: string; expiresAt: number } | null = null;
  let inflight: Promise<string | null> | null = null;

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
  ): Promise<string | null> {
    if (cached && now() < cached.expiresAt) return cached.value;
    if (!inflight) {
      inflight = readVault(db, caller).finally(() => {
        inflight = null;
      });
    }
    const fromVault = await inflight;
    cached =
      fromVault === null
        ? null
        : { value: fromVault, expiresAt: now() + ttlMs };
    return fromVault;
  }

  /**
   * Checks the x-mhc-sync-secret header only. A URL carrying a secret
   * query parameter is refused outright (401) and a warning names the
   * caller, never the value. Otherwise the expected value is resolved first,
   * so a caller can answer 503 for "not configured" and 401 for a mismatch.
   */
  return async function checkMhcSyncSecret(
    req: Request,
    db: MhcRpcClient,
    caller: string,
  ): Promise<MhcAuthResult> {
    if (new URL(req.url).searchParams.has("secret")) {
      log.warn(
        `[${caller}] refused: request URL carries a secret query parameter (value not logged)`,
      );
      return { ok: false, reason: "secret_in_url" };
    }
    const exp = await expected(db, caller);
    if (exp === null) {
      log.error(
        `[${caller}] no sync secret: Vault ${MHC_SECRET_RPC} is empty or unreadable`,
      );
      return { ok: false, reason: "not_configured" };
    }
    const presented = req.headers.get(MHC_SECRET_HEADER);
    if (
      presented === null ||
      presented === "" ||
      presented.length > MAX_SECRET_CHARS ||
      !constantTimeEqual(presented, exp)
    ) {
      return { ok: false, reason: "mismatch" };
    }
    return { ok: true, source: "vault" };
  };
}

/** Per-isolate instance used by the sync functions. */
export const checkMhcSyncSecret = createMhcSyncSecretCheck();
