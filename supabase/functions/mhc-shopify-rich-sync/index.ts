// mhc-shopify-rich-sync — myhealth checkup
// 2026-09-02: write description_scraped straight into the customer-facing description
// field too (verbatim, no LLM rewrite) — description must always be the provider's own text.
// 2026-09-21: this file was previously deployed straight from the Supabase dashboard and
// not tracked in this repo at all — pulled in here for reviewability as part of a platform
// audit. SECRET below intentionally has NO hardcoded fallback in this copy: the deployed
// function's real fallback value is a rotated secret that must never be committed to git.
// Set the MHC_SYNC_SECRET edge function secret in the Supabase dashboard; this file will not
// authenticate correctly until you do, by design.
import { createClient } from "npm:@supabase/supabase-js@2";

const SECRET = Deno.env.get("MHC_SYNC_SECRET") ?? "";

const PROVIDERS: Record<string, { domain: string; junk: (p: any) => boolean }> = {
  "goodbody-clinic": { domain: "https://goodbodyclinic.com", junk: (p) => /gift card|deposit|consultation|membership|cancellation|appointment|recharge test product|tube and|lancets/i.test(p.title || "") },
  "london-health-company": { domain: "https://londonhealthcompany.co.uk", junk: (p) => /gift card|deposit|consultation|membership|subscription|tube and|lancets|add-on/i.test(p.title || "") },
};

const STOP = new Set(["blood","test","kit","uk","home","at","athome","the","with","lab","laboratory","analysis","available","across","results","result","report","numerical","verified","delivered","sample","collection","for","and","panel","profile","screening","health","biomarkers","biomarker","parameters","parameter","including","check","hormone","hormones"]);

function tokens(s: string): Set<string> {
  return new Set((s || "").toLowerCase().replace(/™|®/g,"").replace(/[^a-z0-9]+/g," ").split(" ").filter((t) => t && t.length > 1 && !STOP.has(t)));
}
function normKey(s: string): string {
  return [...tokens(s)].sort().join(" ");
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0; for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
function bioInTitle(s: string): number | null {
  const m = (s || "").match(/(\d+)\s*(?:biomarkers?|parameters?|markers?)/i);
  return m ? parseInt(m[1], 10) : null;
}
function parseTurnaround(html: string): { text: string | null; days: number | null } {
  if (!html) return { text: null, days: null };
  const h = html.replace(/<[^>]+>/g," ").replace(/&amp;/g,"&");
  let m = h.match(/(\d+)\s*(?:to|[-–])\s*(\d+)\s*working days/i);
  if (m) return { text: `Results in ${m[1]}–${m[2]} working days`, days: parseInt(m[2],10) };
  m = h.match(/within\s*(\d+)\s*working days/i);
  if (m) return { text: `Results within ${m[1]} working days`, days: parseInt(m[1],10) };
  m = h.match(/(\d+)\s*working days/i);
  if (m) return { text: `Results in ${m[1]} working days`, days: parseInt(m[1],10) };
  if (/same[- ]day results/i.test(h)) return { text: "Same-day results available", days: 1 };
  return { text: null, days: null };
}
function pricing(variants: any[]): { base: number | null; clinicFee: number | null; homeFee: number | null } {
  const prices = variants.map((v) => parseFloat(v.price)).filter((n) => !isNaN(n) && n > 0);
  if (prices.length === 0) return { base: null, clinicFee: null, homeFee: null };
  const base = Math.min(...prices);
  let clinic: number | null = null, home: number | null = null;
  for (const v of variants) {
    const opt = (v.option1 || v.title || "").toLowerCase(); const pr = parseFloat(v.price); if (isNaN(pr)) continue;
    if (/clinic/.test(opt)) clinic = Math.max(0, +(pr - base).toFixed(2));
    else if (/nurse|home/.test(opt)) home = Math.max(0, +(pr - base).toFixed(2));
  }
  return { base, clinicFee: clinic, homeFee: home };
}
function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.slice(0, 4000) : null;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (url.searchParams.get("secret") !== SECRET) return new Response("unauthorized", { status: 401 });
  const startedAt = new Date().toISOString();
  const providerId = url.searchParams.get("provider") || "";
  const dry = url.searchParams.get("dry") === "1";
  const fuzzy = url.searchParams.get("fuzzy") !== "0";
  const minScore = parseFloat(url.searchParams.get("min_score") || "0.6");
  const cfg = PROVIDERS[providerId];
  if (!cfg) return new Response(JSON.stringify({ ok:false, error:"unknown provider" }), { status:400, headers:{"content-type":"application/json"} });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: rows, error: rErr } = await supabase.from("provider_tests").select("id, test_name, biomarker_count").eq("provider_id", providerId).eq("is_active", true);
  if (rErr) return new Response(JSON.stringify({ ok:false, error:rErr.message }), { status:500, headers:{"content-type":"application/json"} });

  const products: any[] = [];
  for (let page = 1; page <= 6; page++) {
    const resp = await fetch(`${cfg.domain}/products.json?limit=250&page=${page}`, { headers: { "User-Agent": "myhealthcheckup-sync/1.0" } });
    if (!resp.ok) break; const j = await resp.json(); const batch = j.products || [];
    if (batch.length === 0) break; products.push(...batch); if (batch.length < 250) break;
  }
  const feed = products.filter((p) => !cfg.junk(p)).map((p) => {
    const pr = pricing(p.variants || []); const ta = parseTurnaround(p.body_html || "");
    return { title: p.title, handle: p.handle, url: `${cfg.domain}/products/${p.handle}`, base: pr.base, clinicFee: pr.clinicFee, homeFee: pr.homeFee, ta, key: normKey(p.title), toks: tokens(p.title), bio: bioInTitle(p.title), descriptionScraped: stripHtml(p.body_html) };
  });
  const feedByKey = new Map<string, any>(); for (const f of feed) feedByKey.set(f.key, f);

  const decisions: any[] = []; const usedFeed = new Set<string>();
  for (const r of rows || []) {
    const rk = normKey(r.test_name); const rToks = tokens(r.test_name);
    let best = feedByKey.get(rk) || null; let score = best ? 1 : 0; let method = best ? "exact" : "";
    if (!best && fuzzy) {
      for (const f of feed) {
        if (usedFeed.has(f.handle)) continue;
        let s = jaccard(rToks, f.toks);
        if (r.biomarker_count && f.bio) { if (r.biomarker_count === f.bio) s += 0.25; else s -= 0.15; }
        if (s > score) { score = s; best = f; method = "fuzzy"; }
      }
    }
    const confident = best && (method === "exact" || score >= minScore) && best.base != null && !usedFeed.has(best.handle);
    if (best && confident) usedFeed.add(best.handle);
    decisions.push({ db_id: r.id, db_name: r.test_name, db_bio: r.biomarker_count, method, score: +score.toFixed(2), confident, feed_title: best?.title || null, url: best?.url || null, base_price: best?.base ?? null, clinic_fee: best?.clinicFee ?? null, home_fee: best?.homeFee ?? null, feed_bio: best?.bio ?? null, turnaround_text: best?.ta.text ?? null, turnaround_days: best?.ta.days ?? null, description_scraped: best?.descriptionScraped ?? null });
  }

  let written = 0;
  if (!dry) {
    for (const d of decisions) {
      if (!d.confident || d.base_price == null) continue;
      const upd: any = { url: d.url, base_price: d.base_price, total_expected_cost: d.base_price, price: d.base_price, clinic_phlebotomy_cost: d.clinic_fee, home_phlebotomy_cost: d.home_fee, price_not_stated: false, last_validated_at: new Date().toISOString(), scrape_source_url: d.url };
      if (d.turnaround_text) { upd.turnaround_days_text = d.turnaround_text; upd.turnaround_days = d.turnaround_days; upd.turnaround_not_stated = false; }
      if (d.description_scraped) {
        upd.description_scraped = d.description_scraped;
        upd.description = d.description_scraped;
        upd.description_source = "scraped_verbatim";
        upd.description_generated_at = new Date().toISOString();
      }
      const { error: uErr } = await supabase.from("provider_tests").update(upd).eq("id", d.db_id);
      if (!uErr) written++;
    }
  }
  const confidentCount = decisions.filter((d) => d.confident).length;
  const totalRows = rows?.length || 0;
  const needsReview = totalRows - confidentCount;
  const reviewRatio = totalRows ? needsReview / totalRows : 0;
  try{await supabase.from("scrape_runs").insert({provider_id:providerId,scraper_function:"mhc-shopify-rich-sync",started_at:startedAt,finished_at:new Date().toISOString(),status:reviewRatio>0.25?"partial":"success",tests_seen:totalRows,tests_new:0,tests_updated:written,tests_deactivated:0,tests_unchanged:Math.max(0,totalRows-written),errors:[],metadata:{feed_products:feed.length,confident:confidentCount,needs_review:needsReview,needs_review_ratio:+reviewRatio.toFixed(2),fuzzy,dry}});}catch(_e){/* logging must never block the scrape response */}
  return new Response(JSON.stringify({ ok:true, provider:providerId, dry, fuzzy, min_score:minScore, feed_products:feed.length, db_active:rows?.length||0, confident:confidentCount, needs_review:(rows?.length||0)-confidentCount, written, decisions }, null, 2), { headers:{"content-type":"application/json"} });
});
