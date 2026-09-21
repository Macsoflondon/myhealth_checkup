// mhc-page-scrape — myhealth checkup
// 2026-09-02: write descriptionScraped straight into the customer-facing description
// field too (verbatim, no LLM rewrite) — description must always be the provider's own text.
// 2026-09-21: this file was previously deployed straight from the Supabase dashboard and
// not tracked in this repo at all — pulled in here for reviewability as part of a platform
// audit. SECRET below intentionally has NO hardcoded fallback in this copy: the deployed
// function's real fallback value is a rotated secret that must never be committed to git.
// Set the MHC_SYNC_SECRET edge function secret in the Supabase dashboard; this file will not
// authenticate correctly until you do, by design.
import { createClient } from "npm:@supabase/supabase-js@2";

const SECRET = Deno.env.get("MHC_SYNC_SECRET") ?? "";

const PROVIDERS: Record<string, { sitemaps: string[]; urlMatch: RegExp; urlExclude: RegExp }> = {
  "medical-diagnosis": {
    sitemaps: ["https://www.medical-diagnosis.co.uk/product-sitemap.xml","https://www.medical-diagnosis.co.uk/product-sitemap2.xml"],
    urlMatch: /\/exam\/(profiles|all-tests)\//i,
    urlExclude: /uncategorized|\/param/i,
  },
};

function stripTags(s: string): string { return (s || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&#8211;/g,"-").replace(/\s+/g," ").trim(); }
function norm(s: string): string { return (s||"").toLowerCase().replace(/&amp;/g,"&").replace(/[^a-z0-9]+/g," ").replace(/\bblood\b|\btest\b|\bprofile\b|\bkit\b|\bmix\b|\bmatch\b/g," ").replace(/\s+/g," ").trim(); }
function slugNorm(url: string): string { const seg = url.replace(/\/+$/,"").split("/").pop() || ""; return norm(seg.replace(/-/g," ")); }

// 2026-09-01, v4: v3's JSON-LD match was picking up this site's generic
// sitewide Organization/company description ("Medical Diagnosis is a
// private clinical pathology laboratory...") instead of a test-specific one
// — real text, valid length, but identical on every single page and useless
// as a per-test summary. Exclude it explicitly so these pages fall back to
// the position-bounded per-page slice, which does carry real per-test copy.
const GENERIC_COMPANY_BOILERPLATE = /private clinical pathology laboratory/i;

function extractJsonLdDescription(html: string): string | null {
  const matches = [...html.matchAll(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/gi)];
  let best: string | null = null;
  for (const m of matches) {
    const val = m[1].replace(/\\\//g, "/").replace(/\\n/g, " ").replace(/\\"/g, '"').replace(/\s+/g, " ").trim();
    if (GENERIC_COMPANY_BOILERPLATE.test(val)) continue;
    if (val.length > 40 && (!best || val.length > best.length)) best = val;
  }
  return best && best.length > 40 ? best.slice(0, 4000) : null;
}
function extractDescriptionScraped(html: string, name: string | null): string | null {
  const jsonLd = extractJsonLdDescription(html);
  if (jsonLd) return stripTags(jsonLd).slice(0, 4000);
  const cleanedHtml = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const text = stripTags(cleanedHtml);
  let startIdx = 0;
  if (name) {
    const idx = text.indexOf(name);
    if (idx >= 0) startIdx = idx + name.length;
  }
  const landmarks = ["Price:", "Turnaround Time", "Sample Requirements", "Tests Included", "Special Instructions", "Status:"];
  let endIdx = text.length;
  for (const lm of landmarks) {
    const i = text.indexOf(lm, startIdx);
    if (i >= 0 && i < endIdx) endIdx = i;
  }
  const slice = text.slice(startIdx, endIdx).trim();
  return slice && slice.length > 20 && !GENERIC_COMPANY_BOILERPLATE.test(slice) ? slice.slice(0, 4000) : null;
}

function parsePage(html: string) {
  let name: string | null = null;
  const og = html.match(/property="og:title"\s+content="([^"]+)"/i);
  if (og) name = og[1].replace(/^Medical Diagnosis\s*[-–]\s*/i,"").trim();
  if (!name) {
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) { const t = stripTags(h1[1]).replace(/^Medical Diagnosis\s*[-–]\s*/i,"").trim(); if (t) name = t; }
  }
  if (!name) {
    const t = html.match(/<title>([^<]+)<\/title>/i);
    if (t) { const cleaned = t[1].split(/[-–|]/)[0].replace(/^Medical Diagnosis\s*/i,"").trim(); if (cleaned) name = cleaned; }
  }
  let price: number | null = null;
  const pIdx = html.search(/Price:/i);
  if (pIdx >= 0) { const m = html.slice(pIdx, pIdx+300).match(/£\s*([\d.,]+)/); if (m) price = parseFloat(m[1].replace(/,/g,"")); }
  let taText: string | null = null, taDays: number | null = null, taHours: number | null = null;
  const tIdx = html.search(/Turnaround Time/i);
  if (tIdx >= 0) {
    const seg = stripTags(html.slice(tIdx, tIdx+400)).replace(/Turnaround Time:?/i,"").trim();
    const val = seg.split(/Special Instructions|Status:|Tests Included|Sample/i)[0].trim();
    const hm = val.match(/(\d+)\s*hour/i); const dm = val.match(/(\d+)\s*(?:working\s*)?day/i);
    if (hm) { taHours = parseInt(hm[1],10); taText = `Results in ${taHours} hour${taHours>1?"s":""}`; }
    else if (dm) { taDays = parseInt(dm[1],10); taText = `Results in ${taDays} working day${taDays>1?"s":""}`; }
  }
  let sample: string | null = null;
  const sIdx = html.search(/Sample Requirements/i);
  if (sIdx >= 0) { const sm = html.slice(sIdx, sIdx+600).match(/(Blood|Urine|Stool|Saliva|Swab|Semen)/i); if (sm) sample = sm[1]; }
  let bios: string[] = [];
  const bIdx = html.search(/Tests Included/i);
  if (bIdx >= 0) {
    const ul = html.slice(bIdx, bIdx+6000).match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
    if (ul) { bios = [...ul[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => stripTags(m[1])).filter(x => x && x.length > 1 && x.length < 120); }
  }
  const descriptionScraped = extractDescriptionScraped(html, name);
  return { name, price, taText, taDays, taHours, sample, bios, descriptionScraped };
}

async function getUrls(cfg: any): Promise<{ urls: string[]; fetchFailures: number; sitemapsTried: number }> {
  const urls: string[] = [];
  let fetchFailures = 0;
  for (const sm of cfg.sitemaps) {
    try {
      const r = await fetch(sm, { headers: { "User-Agent":"myhealthcheckup-sync/1.0" } });
      if (!r.ok) { fetchFailures++; continue; }
      const xml = await r.text();
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/gi)) { const url = m[1].trim(); if (cfg.urlMatch.test(url) && !cfg.urlExclude.test(url)) urls.push(url); }
    } catch (_e) { fetchFailures++; }
  }
  return { urls: [...new Set(urls)].sort(), fetchFailures, sitemapsTried: cfg.sitemaps.length };
}

Deno.serve(async (req) => {
  const u = new URL(req.url);
  if (u.searchParams.get("secret") !== SECRET) return new Response("unauthorized", { status: 401 });
  const startedAt = new Date().toISOString();
  const providerId = u.searchParams.get("provider") || "";
  const dry = u.searchParams.get("dry") === "1";
  const urlsOnly = u.searchParams.get("urls_only") === "1";
  const offset = parseInt(u.searchParams.get("offset") || "0", 10);
  const limit = parseInt(u.searchParams.get("limit") || "25", 10);
  const cfg = PROVIDERS[providerId];
  if (!cfg) return new Response(JSON.stringify({ ok:false, error:"unknown provider" }), { status:400, headers:{"content-type":"application/json"} });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: rows } = await supabase.from("provider_tests").select("id, test_name, biomarker_count").eq("provider_id", providerId).eq("is_active", true);
  const byNorm = new Map<string, any>(); for (const r of rows||[]) byNorm.set(norm(r.test_name), r);
  const keySet = new Set([...byNorm.keys()].filter(k => k.length > 2));
  const { urls: sitemapUrls, fetchFailures, sitemapsTried } = await getUrls(cfg);
  const sitemapFullyFailed = sitemapsTried > 0 && fetchFailures === sitemapsTried;
  const allUrls = sitemapUrls.filter(url => keySet.has(slugNorm(url)));
  if (urlsOnly) return new Response(JSON.stringify({ ok:true, matched_urls: allUrls.length, db_active: rows?.length||0, sitemap_fetch_failures: fetchFailures, sample_urls: allUrls.slice(0,15) }, null, 2), { headers:{"content-type":"application/json"} });
  const slice = allUrls.slice(offset, offset + limit);
  const results: any[] = []; let written = 0, matched = 0, nameSkips = 0;
  for (const url of slice) {
    let html = ""; try { const r = await fetch(url, { headers: { "User-Agent":"myhealthcheckup-sync/1.0" } }); if (!r.ok) continue; html = await r.text(); } catch (_e) { continue; }
    const p = parsePage(html);
    if (!p.name || p.name.includes("[PARAM]")) { nameSkips++; continue; }
    const row = byNorm.get(slugNorm(url)) || byNorm.get(norm(p.name));
    if (!row) continue;
    matched++;
    if (results.length < 8) results.push({ url, db_name: row.test_name, price: p.price, biomarkers: p.bios.length, turnaround: p.taText, sample: p.sample, sample_bios: p.bios.slice(0,6), has_description: !!p.descriptionScraped });
    if (!dry) {
      const upd: any = { url, scrape_source_url: url, url_verified: true, last_validated_at: new Date().toISOString() };
      if (p.price && p.price > 0) { upd.price = p.price; upd.base_price = p.price; upd.total_expected_cost = p.price; upd.price_not_stated = false; }
      if (p.bios.length > 0) { upd.biomarker_count = p.bios.length; upd.biomarkers_list = p.bios; upd.biomarkers_not_stated = false; }
      if (p.taText) { upd.turnaround_days_text = p.taText; upd.turnaround_days = p.taDays; upd.turnaround_hours = p.taHours; upd.turnaround_not_stated = false; }
      if (p.sample) upd.sample_type = p.sample;
      if (p.descriptionScraped) {
        upd.description_scraped = p.descriptionScraped;
        upd.description = p.descriptionScraped;
        upd.description_source = "scraped_verbatim";
        upd.description_generated_at = new Date().toISOString();
      }
      const { error } = await supabase.from("provider_tests").update(upd).eq("id", row.id);
      if (!error) written++;
    }
  }
  const runStatus = sitemapFullyFailed ? "error" : ((slice.length > 0 && nameSkips > slice.length / 2) ? "partial" : "success");
  try{await supabase.from("scrape_runs").insert({provider_id:providerId,scraper_function:"mhc-page-scrape",started_at:startedAt,finished_at:new Date().toISOString(),status:runStatus,tests_seen:slice.length,tests_new:0,tests_updated:written,tests_deactivated:0,tests_unchanged:Math.max(0,matched-written),errors:sitemapFullyFailed?[{message:"sitemap fetch failed for all configured sitemaps"}]:[],metadata:{matched_urls:allUrls.length,offset,limit,matched,dry,name_extraction_failures:nameSkips,sitemap_fetch_failures:fetchFailures,sitemaps_tried:sitemapsTried}});}catch(_e){/* logging must never block the scrape response */}
  return new Response(JSON.stringify({ ok:true, provider:providerId, dry, matched_urls: allUrls.length, offset, limit, processed: slice.length, matched, written, sitemap_fetch_failures: fetchFailures, sample: results }, null, 2), { headers:{"content-type":"application/json"} });
});
