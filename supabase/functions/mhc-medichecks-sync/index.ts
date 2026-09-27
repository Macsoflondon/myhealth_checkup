// mhc-medichecks-sync — myhealth checkup
// Shopify .json + tag-based sync for Medichecks. Built to the LOCKED Scraping Skills spec (s.6C).
// v2: tags may be an ARRAY (/products.json) or a STRING (single product .json) — handle both.
// v3 (2026-08-26): guard tag-derived fields so a Medichecks tag-scheme rename/drop can never
// blank out previously-good biomarker/sample/turnaround data across the whole catalogue in one
// run (this was writing explicit nulls unconditionally); add the same insert-conflict fallback
// mhc-shopify-sync already needed for Lola Health; label scrape_runs rows with scraper_function
// so this provider is no longer invisible to per-function monitoring.
// v4 (2026-09-01): capture body_html into description_scraped — already present in the same
// /products.json response, zero extra requests.
// v5 (2026-09-02): write description_scraped straight into the customer-facing description
// field too (verbatim, no LLM rewrite) — description must always be the provider's own text.
// v6 (2026-09-21): this file was previously deployed straight from the Supabase dashboard and
// not tracked in this repo at all — pulled in here for reviewability as part of a platform
// audit. SECRET below intentionally has NO hardcoded fallback in this copy: the deployed
// function's real fallback value is a rotated secret that must never be committed to git.
// Set the MHC_SYNC_SECRET edge function secret in the Supabase dashboard; this file will not
// authenticate correctly until you do, by design.
import { createClient } from "npm:@supabase/supabase-js@2";

const SECRET = Deno.env.get("MHC_SYNC_SECRET") ?? "";
const PROVIDER = "medichecks";
const BASE = "https://www.medichecks.com";
const CLINIC_FEE = 35;
const NURSE_FEE = 59;

function parseTags(tags: unknown) {
  const raw = Array.isArray(tags) ? tags.join(",") : (typeof tags === "string" ? tags : "");
  const t = raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const num = (prefix: string) => {
    const hit = t.find((x) => x.startsWith(prefix));
    if (!hit) return null;
    const n = parseInt(hit.slice(prefix.length), 10);
    return Number.isFinite(n) ? n : null;
  };
  const biomarkers = num("info_biomarkers_");
  const results = num("info_results_");
  const homeKit = t.includes("collection_method_blood_delivery");
  const clinic  = t.includes("collection_method_blood_in-store");
  const nurse   = t.includes("collection_method_blood_nurse-visit");
  const pro     = t.includes("collection_method_blood_pro");
  let sample: string | null = null;
  if (t.some((x) => x.includes("info_sample_blood"))) sample = "Blood";
  else if (t.some((x) => x.includes("info_sample_urine"))) sample = "Urine";
  else if (t.some((x) => x.includes("info_sample_stool"))) sample = "Stool";
  else if (t.some((x) => x.includes("info_sample_swab"))) sample = "Swab";
  return { biomarkers, results, homeKit, clinic, nurse, pro, sample };
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

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  if (url.searchParams.get("secret") !== SECRET) {
    return new Response(JSON.stringify({ error: "unauthorised" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "250", 10), 250);
  const dryRun = url.searchParams.get("dry") === "1";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const started = new Date().toISOString();
  let runId: string | null = null;
  if (!dryRun) {
    try {
      const { data } = await supabase.from("scrape_runs")
        .insert({ provider_id: PROVIDER, scraper_function: "mhc-medichecks-sync", status: "running", started_at: started }).select("id").single();
      runId = data?.id ?? null;
    } catch (_e) { /* non-fatal */ }
  }

  let seen = 0, updated = 0, inserted = 0, skippedJunk = 0, noPrice = 0, tagMissTotal = 0;
  const errors: string[] = [];
  const sample: unknown[] = [];

  try {
    const res = await fetch(`${BASE}/products.json?limit=${limit}&page=${page}`, {
      headers: { "User-Agent": "myhealthcheckup-comparison-bot/1.0 (+https://myhealthcheckup.co.uk)" },
    });
    if (!res.ok) throw new Error(`products.json HTTP ${res.status}`);
    const body = await res.json();
    const products: any[] = body?.products ?? [];

    for (const p of products) {
      seen++;
      const handle: string = p.handle ?? "";
      const productUrl = `${BASE}/products/${handle}`;

      if (/^clinic-visit/i.test(handle)) {
        skippedJunk++;
        if (!dryRun) {
          await supabase.from("provider_tests").update({ is_active: false })
            .eq("provider_id", PROVIDER).eq("url", productUrl);
        }
        continue;
      }

      const tg = parseTags(p.tags);
      const basePrice = parseFloat(p?.variants?.[0]?.price ?? "");
      if (!Number.isFinite(basePrice) || basePrice <= 0) { noPrice++; continue; }

      const freeOption = tg.homeKit || tg.pro;
      const feeCandidates: number[] = [];
      if (freeOption) feeCandidates.push(0);
      if (tg.clinic) feeCandidates.push(CLINIC_FEE);
      if (tg.nurse) feeCandidates.push(NURSE_FEE);
      const collectionFee = feeCandidates.length ? Math.min(...feeCandidates) : 0;

      const descriptionScraped = stripHtml(p.body_html);
      const row: Record<string, unknown> = {
        provider_id: PROVIDER,
        test_name: p.title,
        url: productUrl,
        scrape_source_url: productUrl,
        base_price: basePrice,
        price: basePrice,
        home_kit_available: tg.homeKit,
        clinic_visit_available: tg.clinic,
        phlebotomy_included: freeOption,
        clinic_phlebotomy_cost: tg.clinic ? CLINIC_FEE : null,
        home_phlebotomy_cost: tg.nurse ? NURSE_FEE : null,
        collection_fee: collectionFee,
        gp_review_included: true,
        total_expected_cost: basePrice + collectionFee,
        is_active: true,
        last_validated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (descriptionScraped) {
        row.description_scraped = descriptionScraped;
        row.description = descriptionScraped;
        row.description_source = "scraped_verbatim";
        row.description_generated_at = new Date().toISOString();
      }

      if (tg.biomarkers != null) row.biomarker_count = tg.biomarkers; else tagMissTotal++;
      if (tg.sample != null) row.sample_type = tg.sample; else tagMissTotal++;
      if (tg.results != null) {
        row.turnaround_days = tg.results;
        row.turnaround_days_text = `Results in ${tg.results} working days (estimated)`;
        row.turnaround_unit = "days";
      } else {
        tagMissTotal++;
      }

      if (dryRun) { if (sample.length < 5) sample.push({ handle, title: p.title, basePrice, ...tg }); continue; }

      const { data: existing } = await supabase.from("provider_tests")
        .select("id").eq("provider_id", PROVIDER).eq("url", productUrl).maybeSingle();

      let rowId: string | null = null;
      if (existing?.id) {
        const { error } = await supabase.from("provider_tests").update(row).eq("id", existing.id);
        if (error) { errors.push(`${handle}: ${error.message}`); continue; }
        rowId = existing.id; updated++;
      } else {
        const { data: ins, error } = await supabase.from("provider_tests").insert(row).select("id").single();
        if (!error) {
          rowId = ins?.id ?? null; inserted++;
        } else if (error.code === "23505" || /duplicate key/i.test(error.message)) {
          const { data: conflict } = await supabase.from("provider_tests").select("id")
            .eq("provider_id", PROVIDER).eq("test_name", p.title).eq("is_active", true).maybeSingle();
          if (conflict?.id) {
            const { error: updErr } = await supabase.from("provider_tests").update(row).eq("id", conflict.id);
            if (updErr) { errors.push(`${handle}: ${updErr.message}`); continue; }
            rowId = conflict.id; updated++;
          } else {
            errors.push(`${handle}: ${error.message}`); continue;
          }
        } else {
          errors.push(`${handle}: ${error.message}`); continue;
        }
      }

      try {
        await supabase.from("provider_test_history").insert({
          provider_test_id: rowId,
          provider_id: PROVIDER,
          test_name: p.title,
          price: basePrice,
          total_expected_cost: basePrice + collectionFee,
          biomarker_count: tg.biomarkers,
          turnaround_days: tg.results,
          scrape_source_url: productUrl,
        });
      } catch (_e) { /* non-fatal */ }
    }

    const hasMore = products.length === limit;
    if (runId) {
      try {
        await supabase.from("scrape_runs").update({
          status: errors.length ? "partial" : "success",
          finished_at: new Date().toISOString(),
          tests_seen: seen, tests_updated: updated + inserted,
          errors: errors.slice(0, 20),
          metadata: { skipped_junk: skippedJunk, skipped_no_price: noPrice, tag_miss_total: tagMissTotal, page, dry: dryRun },
        }).eq("id", runId);
      } catch (_e) { /* non-fatal */ }
    }

    return new Response(JSON.stringify({
      ok: true, dry: dryRun, page, seen, updated, inserted,
      skipped_clinic_junk: skippedJunk, skipped_no_price: noPrice, tag_miss_total: tagMissTotal,
      errors: errors.slice(0, 10), has_more: hasMore, next_page: hasMore ? page + 1 : null,
      sample,
    }), { headers: { "Content-Type": "application/json" } });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (runId) {
      try {
        await supabase.from("scrape_runs").update({
          status: "error", finished_at: new Date().toISOString(),
          tests_seen: seen, tests_updated: updated + inserted, errors: [{ message: msg }],
        }).eq("id", runId);
      } catch (_e) { /* non-fatal */ }
    }
    return new Response(JSON.stringify({ ok: false, error: msg, page, seen }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
});
