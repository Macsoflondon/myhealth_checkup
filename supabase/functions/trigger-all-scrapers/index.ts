// One-off admin trigger: fans out to all 9 provider scrapers using the
// edge runtime's own SUPABASE_SERVICE_ROLE_KEY, so vault/env drift can't
// cause an auth mismatch. Guarded by SCRAPE_TRIGGER_SECRET in the body.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCRAPERS: Array<{ id: string; fn: string }> = [
  { id: "lola-health", fn: "lola-health-scraper" },
  { id: "medichecks", fn: "medichecks-firecrawl" },
  { id: "goodbody-clinic", fn: "goodbody-scraper" },
  { id: "thriva", fn: "thriva-scraper" },
  { id: "randox", fn: "randox-scraper" },
  { id: "london-medical-laboratory", fn: "scrape-london-lab" },
  { id: "clinilabs", fn: "clinilabs-scraper" },
  { id: "medical-diagnosis", fn: "medical-diagnosis-scraper" },
  { id: "london-health-company", fn: "london-health-scraper" },
];

declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const triggerSecret = Deno.env.get("SCRAPE_TRIGGER_SECRET") ?? "";

  let body: { secret?: string; providerIds?: string[] } = {};
  try { body = await req.json(); } catch { /* noop */ }

  if (!triggerSecret || body.secret !== triggerSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const targets = body.providerIds?.length
    ? SCRAPERS.filter((s) => body.providerIds!.includes(s.id))
    : SCRAPERS;

  const fanOut = async () => {
    const results = await Promise.allSettled(
      targets.map(async (s) => {
        try {
          const res = await fetch(`${url}/functions/v1/${s.fn}`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${serviceKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });
          const text = await res.text().catch(() => "");
          console.log(`[trigger-all-scrapers] ${s.id} → ${res.status} ${text.slice(0, 200)}`);
          return { id: s.id, status: res.status, ok: res.ok };
        } catch (e) {
          console.error(`[trigger-all-scrapers] ${s.id} failed:`, e);
          return { id: s.id, status: 0, ok: false, error: String(e) };
        }
      }),
    );
    console.log("[trigger-all-scrapers] complete:", JSON.stringify(results));
  };

  // Kick off in background so the HTTP call returns immediately.
  try {
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
      EdgeRuntime.waitUntil(fanOut());
    } else {
      fanOut().catch((e) => console.error("[trigger-all-scrapers] bg err:", e));
    }
  } catch {
    fanOut().catch((e) => console.error("[trigger-all-scrapers] bg err:", e));
  }

  return new Response(
    JSON.stringify({ started: true, providers: targets.map((t) => t.id) }),
    { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
