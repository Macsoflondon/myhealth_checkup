import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * MFA backup-code recovery.
 *
 * Body: { code: string }
 * Auth: Requires the caller's JWT (verify_jwt = true in config.toml).
 *
 * On success:
 *   - Marks the redeemed code as used.
 *   - Removes ALL TOTP factors on the account, restoring password-only sign-in
 *     so the user isn't permanently locked out.
 *   - Deletes remaining unused backup codes (they're only valid alongside the
 *     original enrolment).
 *
 * The caller should then `supabase.auth.refreshSession()` and prompt the user
 * to re-enrol a new authenticator app.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { ok: false, message: "Method not allowed" });

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!jwt) return json(401, { ok: false, message: "Not authenticated" });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Resolve caller identity
  const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser(jwt);
  if (userErr || !userData?.user) return json(401, { ok: false, message: "Not authenticated" });
  const userId = userData.user.id;

  let body: { code?: string };
  try { body = await req.json(); } catch { return json(400, { ok: false, message: "Bad request" }); }
  const raw = (body.code ?? "").trim();
  if (!raw) return json(400, { ok: false, message: "Missing code" });

  const normalised = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (normalised.length < 8) return json(400, { ok: false, message: "Code too short" });
  const codeHash = await sha256Hex(normalised);

  // Service-role admin for the mutations below.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: match, error: matchErr } = await admin
    .from("mfa_backup_codes")
    .select("id, used_at")
    .eq("user_id", userId)
    .eq("code_hash", codeHash)
    .maybeSingle();

  if (matchErr) {
    console.error("mfa-recovery lookup error", matchErr);
    return json(500, { ok: false, message: "Could not check that code. Please try again." });
  }
  if (!match) return json(400, { ok: false, message: "That code isn't recognised." });
  if (match.used_at) return json(400, { ok: false, message: "That backup code has already been used." });

  // Mark used
  await admin
    .from("mfa_backup_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", match.id);

  // Unenrol all TOTP factors so the user isn't locked out any more.
  try {
    const { data: factors } = await admin.auth.admin.mfa.listFactors({ userId });
    const totp = (factors?.factors ?? []).filter((f) => f.factor_type === "totp");
    for (const f of totp) {
      await admin.auth.admin.mfa.deleteFactor({ userId, id: f.id });
    }
  } catch (e) {
    console.error("mfa-recovery deleteFactor error", e);
    return json(500, {
      ok: false,
      message: "We couldn't reset your authenticator. Please contact support.",
    });
  }

  // Wipe remaining backup codes — the surviving set is tied to the deleted factor.
  await admin.from("mfa_backup_codes").delete().eq("user_id", userId);

  return json(200, {
    ok: true,
    message:
      "Two-step verification has been reset. Please sign in again and set up a new authenticator app from your account settings.",
  });
});
