// Web Vitals RUM ingest.
// Accepts anonymous browser beacons, validates, writes to public.web_vitals via service role.
// No PII is stored; session_hash is a client-supplied opaque short string.

import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SampleSchema = z.object({
  metric: z.enum(["LCP", "CLS", "INP", "FCP", "TTFB", "FID"]),
  value: z.number().finite().min(0).max(60_000),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  route: z.string().max(300).optional(),
  device_type: z.enum(["mobile", "tablet", "desktop", "unknown"]).optional(),
  connection_type: z.string().max(30).optional(),
  session_hash: z.string().max(64).optional(),
  navigation_type: z.string().max(30).optional(),
});
const BodySchema = z.object({ samples: z.array(SampleSchema).min(1).max(20) });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ error: "server not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try { body = await req.json(); } catch { body = null; }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { error } = await supabase.from("web_vitals").insert(parsed.data.samples);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ ok: true, count: parsed.data.samples.length }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
