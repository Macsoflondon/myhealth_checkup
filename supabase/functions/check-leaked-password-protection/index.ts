/**
 * Probes whether Supabase Auth's "Leaked Password Protection" (HaveIBeenPwned
 * integration) is enabled on this project.
 *
 * Strategy: attempt to sign up an ephemeral fake user with a known-pwned
 * password ("Password123!"). If the project has the protection on, Supabase
 * returns error code `weak_password` with `reasons: ["pwned"]`. We immediately
 * delete the ephemeral user (if one was somehow created) using the service
 * role key, so this probe has no lasting side-effects.
 *
 * The probe ALSO requires the password to be otherwise valid (length, complexity)
 * so the only failure mode we care about is the pwned check.
 *
 * Auth: requires the caller to have the `admin` role.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getErrorMessage } from "../_shared/errors.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Status = "enabled" | "disabled" | "unknown";

interface ProbeResult {
  status: Status;
  detail: string;
  checked_at: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // --- 1. Verify caller is an admin -------------------------------------
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ error: "Invalid session" }, 401);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleRow, error: roleErr } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr || !roleRow) {
      return json({ error: "Forbidden: admin role required" }, 403);
    }

    // --- 2. Probe with a known-pwned password -----------------------------
    // Random ephemeral email so we never collide with a real account.
    const probeEmail = `lpp-probe-${crypto.randomUUID()}@probe.invalid`;
    const probePassword = "Password123!"; // appears in HIBP breach lists

    const probeClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data: signUpData, error: signUpErr } = await probeClient.auth
      .signUp({ email: probeEmail, password: probePassword });

    let result: ProbeResult;

    if (signUpErr) {
      const msg = signUpErr.message.toLowerCase();
      // Supabase returns: "Password is known to be weak and easy to guess,
      // please choose a different one." with code `weak_password` when HIBP
      // protection is on.
      if (
        msg.includes("pwned") ||
        msg.includes("known to be weak") ||
        msg.includes("compromised") ||
        (signUpErr as unknown as { code?: string }).code === "weak_password"
      ) {
        result = {
          status: "enabled",
          detail:
            "Supabase rejected a known-pwned password — leaked password protection is ACTIVE.",
          checked_at: new Date().toISOString(),
        };
      } else {
        // Some other signup error (rate limit, etc.) — we can't conclude.
        result = {
          status: "unknown",
          detail: `Probe inconclusive: ${signUpErr.message}`,
          checked_at: new Date().toISOString(),
        };
      }
    } else {
      // Signup succeeded with a pwned password → protection is OFF.
      result = {
        status: "disabled",
        detail:
          "Supabase accepted a known-pwned password — leaked password protection is OFF.",
        checked_at: new Date().toISOString(),
      };

      // Best-effort cleanup of the ephemeral user.
      if (signUpData.user?.id) {
        await admin.auth.admin.deleteUser(signUpData.user.id).catch(() => {});
      }
    }

    return json(result, 200);
  } catch (err) {
    return json(
      {
        status: "unknown" as Status,
        detail: `Probe failed: ${getErrorMessage(err)}`,
        checked_at: new Date().toISOString(),
      },
      500,
    );
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
