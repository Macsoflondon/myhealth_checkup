import { clientIp as trustedClientIp } from "../_shared/client-ip.ts";
// Cyber Essentials: brute-force protection for sign-in.
// Call BEFORE supabase.auth.signInWithPassword from the client.
// Returns { allowed: boolean, retryAfter?: number }.
//
// Throttling key combines IP + lowercased email so attackers cannot lock
// victims out by guessing the email alone (we still throttle that bucket,
// but never lock anyone out of their own account from a different IP).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { internalErrorResponse } from "../_shared/errors.ts";
import { readThrottleInput } from "./request.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_ATTEMPTS = 10;
const WINDOW_MIN = 15;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    if (req.method !== "POST")
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders,
      });
    const input = await readThrottleInput(req);
    if (input.status !== 200) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: input.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { email, outcome } = input.data;
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey)
      throw new Error("Throttle configuration unavailable");

    const supabase = createClient(supabaseUrl, serviceKey);

    const ip = trustedClientIp(req.headers) ?? "unknown";
    const key = `auth:signin:${email.toLowerCase()}|${ip}`;
    const windowStart = new Date(
      Date.now() - WINDOW_MIN * 60_000,
    ).toISOString();

    // A claimed failure affects only this address-plus-email bucket.
    // Passwords are never accepted and Supabase Auth is never called here.
    if (outcome === "failure") {
      const { error } = await supabase.from("api_rate_limits").insert({
        client_key: key,
        endpoint: "auth:signin",
        window_start: new Date().toISOString(),
      });
      if (error) throw new Error("Throttle write failed");
    }

    const { count, error: countError } = await supabase
      .from("api_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("client_key", key)
      .eq("endpoint", "auth:signin")
      .gte("window_start", windowStart);
    if (countError) throw new Error("Throttle read failed");

    const used = count ?? 0;
    const allowed = used < MAX_ATTEMPTS;
    return new Response(
      JSON.stringify({
        allowed,
        remaining: Math.max(0, MAX_ATTEMPTS - used),
        retryAfter: allowed ? 0 : WINDOW_MIN * 60,
      }),
      {
        status: allowed ? 200 : 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          ...(allowed ? {} : { "Retry-After": String(WINDOW_MIN * 60) }),
        },
      },
    );
  } catch (e) {
    return internalErrorResponse("auth-throttle", e, corsHeaders);
  }
});
