import { clientIp } from "@/lib/mcp/rate-limit";
import { hashVisitor } from "@/lib/affiliate/click-redirect";

/** Counts one hit for this visitor; resolves false once the window's limit is passed. */
export type RateHit = (ipHash: string, limit: number) => Promise<boolean>;

/**
 * Shared per-visitor limit for public write endpoints: salted, day-rotating
 * hash of the address (never the raw IP), counted per 10-minute window.
 * `scope` keeps each endpoint's budget separate.
 */
export async function withinVisitorLimit(
  request: Request,
  scope: string,
  limit: number,
  secret: string,
  hit: RateHit,
): Promise<boolean> {
  const ip = clientIp(request.headers);
  const ipHash = await hashVisitor(scope ? `${scope}|${ip}` : ip, secret);
  try {
    return await hit(ipHash, limit);
  } catch {
    return false;
  }
}

type AdminClient = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

/** Server-only admin client, loaded inside the handler. Null when the key is missing. */
export async function loadAdmin(): Promise<AdminClient | null> {
  if (!process.env["SUPABASE_SERVICE_ROLE_KEY"]) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export function rpcRateHit(admin: AdminClient): RateHit {
  return async (ipHash, limit) => {
    const { data, error } = await admin.rpc("affiliate_click_rate_hit", {
      p_ip_hash: ipHash,
      p_limit: limit,
    });
    return !error && data === true;
  };
}

/** True when the test is active in the catalogue and belongs to the provider. */
export async function catalogueTest(
  admin: AdminClient,
  testId: string,
): Promise<{ id: string; provider_id: string; url: string | null } | null> {
  const { data } = await admin
    .from("provider_tests")
    .select("id, provider_id, url, is_active")
    .eq("id", testId)
    .maybeSingle();
  return data && data.is_active !== false
    ? { id: data.id, provider_id: data.provider_id, url: data.url }
    : null;
}
