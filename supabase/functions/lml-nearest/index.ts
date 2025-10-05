import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LML_ENDPOINT = "https://api.londonmedicallaboratory.com/api/test_location/nearest";

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("LML_BEARER_TOKEN");
    if (!token) {
      return new Response(JSON.stringify({ error: "LML_BEARER_TOKEN not set" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lat, lon, maxPages = 3 } = await req.json();
    if (typeof lat !== "number" || typeof lon !== "number") {
      return new Response(JSON.stringify({ error: "lat and lon are required numbers" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    async function fetchPage(page: number) {
      const url = `${LML_ENDPOINT}/${lat}/${lon}?page=${page}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
      });
      if (!res.ok) throw new Error(`LML API error: ${res.status}`);
      return res.json();
    }

    // Collect and dedupe across pages
    let all: any[] = [];
    for (let p = 1; p <= Math.max(1, Math.min(10, maxPages)); p++) {
      try {
        const data = await fetchPage(p);
        const items = Array.isArray(data.items) ? data.items : [];
        all = all.concat(items);
        if (items.length < 20) break; // pagination heuristic
      } catch (e) {
        if (p === 1) throw e;
        break;
      }
    }

    const seen = new Set<string>();
    const dedup: any[] = [];
    for (const it of all) {
      const key = it.id || `${(it.name || "").toLowerCase()}|${(it.postal_code || "").toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        dedup.push(it);
      }
    }

    return new Response(JSON.stringify({ items: dedup }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("lml-nearest error:", error?.message || error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
