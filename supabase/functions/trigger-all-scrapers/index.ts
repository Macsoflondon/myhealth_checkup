// trigger-all-scrapers — break-glass fallback: bypasses run-all-scrapers' normal auth path if it's ever broken by env/vault drift — secret-gated, not called from any UI, not part of the normal pipeline.
// One-off admin trigger: fans out to all 9 provider scrapers using the
// edge runtime's own SUPABASE_SERVICE_ROLE_KEY, so vault/env drift can't
// cause an auth mismatch. Guarded by SCRAPE_TRIGGER_SECRET in the body.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCRAPERS: Array<{ id: string; fn: string }> = [
  { id: "lola-health", fn: "lola-health-scraper" },
  { id: "medichecks", fn: "medichecks-firecrawl" },
  { id: "goodbody-clinic", fn: "goodbody-scraper" },
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

  const authHeader = req.headers.get("authorization") ?? "";
  const bearer = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : "";
  const serviceAuthed = !!serviceKey && bearer === serviceKey;
  const secretAuthed = !!triggerSecret && body.secret === triggerSecret;

  if (!serviceAuthed && !secretAuthed) {
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

    // Audit trail: one scrape_runs row per dispatched provider, so a
    // break-glass run appears in the same audit trail as everything else.
    try {
      const supabase = createClient(url, serviceKey);
      const finishedAt = new Date().toISOString();
      const rows = results.map((r, i) => {
        const target = targets[i];
        const value = r.status === "fulfilled" ? r.value : null;
        const ok = value?.ok === true;
        return {
          provider_id: target.id,
          scraper_function: "trigger-all-scrapers",
          status: ok ? "success" : "error",
          finished_at: finishedAt,
          errors: ok
            ? []
            : [{ message: `dispatch to ${target.fn} failed`, http_status: value?.status ?? 0 }],
          metadata: { break_glass: true, dispatched_function: target.fn },
        };
      });
      if (rows.length) await supabase.from("scrape_runs").insert(rows);
    } catch (e) {
      console.error("[trigger-all-scrapers] audit write failed:", e);
    }
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
