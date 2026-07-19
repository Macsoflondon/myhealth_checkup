// refresh-live-comparison-panels
// Hourly scraper that visits each provider URL in every live comparison panel,
// extracts a £-prefixed price, and updates the panel row. Falls back to the
// previously stored price if scraping fails.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Row = {
  name: string;
  bio: string;
  badge: string;
  variant: string;
  price: string;
  url?: string;
  providerId?: string;
  method?: "at_home" | "clinic";
  methodLabel?: string;
};

const approvedMethodLabel: Record<"at_home" | "clinic", string> = {
  at_home: "At-home test kit",
  clinic: "In-clinic test",
};

function normaliseMethod(row: Row): "at_home" | "clinic" | null {
  if (row.method === "at_home" || row.method === "clinic") return row.method;
  const text = `${row.methodLabel ?? ""} ${row.bio ?? ""} ${row.badge ?? ""}`.toLowerCase();
  if (text.includes("at-home") || text.includes("home kit") || text.includes("home test")) return "at_home";
  if (text.includes("in-clinic") || text.includes("clinic")) return "clinic";
  return null;
}

function hasForbiddenWording(row: Row): boolean {
  const text = `${row.methodLabel ?? ""} ${row.bio ?? ""} ${row.badge ?? ""}`.toLowerCase();
  return text.includes("walk-in") || text.includes("walk in") || text.includes("clinic-based");
}

function providerKey(row: Row): string {
  return (row.providerId || row.name).trim().toLowerCase();
}

function sanitiseRows(rows: Row[]): Row[] {
  const firstMethod = rows.map(normaliseMethod).find((method): method is "at_home" | "clinic" => method !== null);
  if (!firstMethod) return [];

  const seenProviders = new Set<string>();
  const methodLabel = approvedMethodLabel[firstMethod];
  return rows.filter((row) => {
    const key = providerKey(row);
    const keep = normaliseMethod(row) === firstMethod && key !== "" && !seenProviders.has(key) && !hasForbiddenWording(row);
    if (keep) seenProviders.add(key);
    return keep;
  }).map((row) => ({ ...row, method: firstMethod, methodLabel, bio: methodLabel, badge: methodLabel }));
}

async function scrapePrice(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MyHealthCheckupBot/1.0; +https://myhealthcheckup.co.uk)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();

    // 1. Try JSON-LD offers.price
    const ldMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const m of ldMatches) {
      try {
        const data = JSON.parse(m[1].trim());
        const nodes = Array.isArray(data) ? data : [data];
        for (const node of nodes) {
          const offers = node?.offers;
          const offerArr = Array.isArray(offers) ? offers : offers ? [offers] : [];
          for (const o of offerArr) {
            const p = o?.price ?? o?.lowPrice;
            if (p) {
              const num = Number(String(p).replace(/[^0-9.]/g, ""));
              if (num > 0 && num < 10000) return `£${Math.round(num)}`;
            }
          }
        }
      } catch { /* ignore */ }
    }

    // 2. Try meta product:price:amount
    const metaPrice = html.match(/<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i);
    if (metaPrice?.[1]) {
      const num = Number(metaPrice[1].replace(/[^0-9.]/g, ""));
      if (num > 0 && num < 10000) return `£${Math.round(num)}`;
    }

    // 3. Regex first £ price in body (between £1 and £9999)
    const m = html.match(/£\s?(\d{1,4})(?:\.(\d{2}))?/);
    if (m) {
      const num = Number(m[1]);
      if (num > 0 && num < 10000) return `£${num}`;
    }
  } catch (e) {
    console.warn("scrapePrice failed", url, e);
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Auth: service-role bearer only (called by pg_cron / internal jobs).
  const authHeader = req.headers.get("Authorization") ?? "";
  if (authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: panels, error } = await supabase
    .from("live_comparison_panels")
    .select("id, slug, rows");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const summary: Array<{ slug: string; updated: number; total: number }> = [];

  for (const panel of panels ?? []) {
    const rows = sanitiseRows((panel.rows as Row[]) ?? []);
    let updated = 0;
    const newRows: Row[] = [];
    for (const row of rows) {
      if (row.url) {
        const newPrice = await scrapePrice(row.url);
        if (newPrice && newPrice !== row.price) {
          updated++;
          newRows.push({ ...row, price: newPrice });
          continue;
        }
      }
      newRows.push(row);
    }
    await supabase
      .from("live_comparison_panels")
      .update({ rows: newRows, last_scraped_at: new Date().toISOString() })
      .eq("id", panel.id);
    summary.push({ slug: panel.slug, updated, total: rows.length });
  }

  return new Response(JSON.stringify({ success: true, summary }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
