// Caller authentication for os-plugins. Two kinds of caller:
// - service: the hourly cron through public.call_edge_with_service_role,
//   which sends the service role key as its bearer token. Sync only.
// - admin: a signed-in admin with an MFA (AAL2) session, checked with
//   has_role() under the caller's own token.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";
import { logProtectedCall } from "../../_shared/audit.ts";
import { getErrorMessage } from "../../_shared/errors.ts";

export const FUNCTION_NAME = "os-plugins";

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export type Caller = { kind: "service" } | { kind: "admin"; userId: string };

export type AuthResult =
  { ok: true; caller: Caller } | { ok: false; response: Response };

/** Compares two strings in time that does not depend on where they differ. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Audit rows record the outcome and, for admins, the account id. The request
// is not passed on, so no IP address or user agent is stored.
async function deny(
  status: 401 | 403 | 500,
  error: string,
  reason: string,
  callerId: string | null = null,
): Promise<AuthResult> {
  await logProtectedCall({
    functionName: FUNCTION_NAME,
    status: "denied",
    callerId,
    details: { reason },
  });
  return { ok: false, response: json({ error }, status) };
}

export async function authenticate(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (serviceKey !== "" && safeEqual(authHeader, `Bearer ${serviceKey}`)) {
    await logProtectedCall({
      functionName: FUNCTION_NAME,
      status: "allowed",
      details: { caller: "service" },
    });
    return { ok: true, caller: { kind: "service" } };
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!/^Bearer\s/i.test(authHeader) || token === "") {
    return deny(401, "Sign in as an admin to use the AI OS.", "no_token");
  }

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  if (url === "" || anonKey === "") {
    console.error(`[${FUNCTION_NAME}] SUPABASE_URL or SUPABASE_ANON_KEY unset`);
    return deny(
      500,
      "The function is missing its Supabase settings.",
      "config",
    );
  }

  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } =
    await userClient.auth.getUser(token);
  const user = userData?.user ?? null;
  if (userError || !user) {
    return deny(
      401,
      "Your session has expired. Sign in again.",
      "invalid_token",
    );
  }

  // has_role() returns true for 'admin' only when this session is AAL2 (MFA),
  // so it must run with the caller's token, not the service role.
  const { data: isAdmin, error: roleError } = await userClient.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });
  if (roleError) {
    console.error(
      `[${FUNCTION_NAME}] has_role failed: ${getErrorMessage(roleError)}`,
    );
    return deny(
      403,
      "Could not confirm admin access.",
      "role_check_failed",
      user.id,
    );
  }
  if (isAdmin !== true) {
    return deny(
      403,
      "Admin access with multi-factor sign-in is required.",
      "not_admin_or_no_mfa",
      user.id,
    );
  }

  await logProtectedCall({
    functionName: FUNCTION_NAME,
    status: "allowed",
    callerId: user.id,
    details: { caller: "admin" },
  });
  return { ok: true, caller: { kind: "admin", userId: user.id } };
}
