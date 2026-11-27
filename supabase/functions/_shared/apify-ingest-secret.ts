// Shared secret for the Apify webhook (apify-scrape-provider -> Apify -> apify-ingest).
//
// The value lives in Vault (apify_ingest_secret) and is read through
// public.apify_ingest_secret(), executable by service_role only (migration
// 20261127031905). There is no environment fallback and never a fallback to
// the service role key, which must not reach Apify or any third party.
// The value travels only in the x-apify-ingest-secret header and is never
// logged. Imports nothing Deno-specific so Vitest can load it as well.
import { constantTimeEqual, type MhcRpcClient } from "./mhc-auth.ts";

export const APIFY_INGEST_SECRET_HEADER = "x-apify-ingest-secret";
export const APIFY_INGEST_SECRET_RPC = "apify_ingest_secret";
const MAX_SECRET_CHARS = 4096;

/** The Vault value, or null when it is empty, too long or unreadable. */
export async function readApifyIngestSecret(
  db: MhcRpcClient,
): Promise<string | null> {
  try {
    const { data, error } = await db.rpc(APIFY_INGEST_SECRET_RPC);
    if (error || typeof data !== "string") return null;
    if (data.trim() === "" || data.length > MAX_SECRET_CHARS) return null;
    return data;
  } catch {
    return null;
  }
}

export type ApifyIngestAuth = { ok: true } | { ok: false; status: 503 | 401 };

/** 503 when Vault has no value, 401 unless the header matches exactly. */
export async function checkApifyIngestSecret(
  req: Request,
  db: MhcRpcClient,
): Promise<ApifyIngestAuth> {
  const expected = await readApifyIngestSecret(db);
  if (expected === null) return { ok: false, status: 503 };
  const presented = req.headers.get(APIFY_INGEST_SECRET_HEADER);
  if (
    presented === null ||
    presented === "" ||
    presented.length > MAX_SECRET_CHARS ||
    !constantTimeEqual(presented, expected)
  ) {
    return { ok: false, status: 401 };
  }
  return { ok: true };
}

/** The headersTemplate Apify sends back on its webhook call. */
export function apifyWebhookHeadersTemplate(secret: string): string {
  return JSON.stringify({ [APIFY_INGEST_SECRET_HEADER]: secret });
}
