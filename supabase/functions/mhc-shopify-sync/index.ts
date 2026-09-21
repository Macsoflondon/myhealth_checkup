// mhc-shopify-sync — generic Shopify catalogue sync for myhealth checkup.
// Handles providers whose product .json has sparse tags (Clinilabs, Lola).
// Captures reliably-available fields: base_price, test_name, url, category. Never fabricates biomarkers/turnaround.
//
// 2026-09-01: capture body_html into description_scraped. Shopify already
// includes body_html in the same /products.json response this function was
// already fetching and parsing — this is a zero-extra-request change, not a
// new crawl.
// 2026-09-02: write description_scraped straight into the customer-facing
// description field too (verbatim, no LLM rewrite) — per explicit product
// decision, description must always be the provider's own text, never an
// AI paraphrase. generate-test-descriptions (the AI-rewrite function) must
// not be invoked against this provider's rows any more.
// 2026-09-21: this file was previously deployed straight from the Supabase dashboard and
// not tracked in this repo at all — pulled in here for reviewability as part of a platform
// audit. SECRET below intentionally has NO hardcoded fallback in this copy: the deployed
// function's real fallback value is a rotated secret that must never be committed to git.
// Set the MHC_SYNC_SECRET edge function secret in the Supabase dashboard; this file will not
// authenticate correctly until you do, by design.
import { createClient } from "npm:@supabase/supabase-js@2";

const SECRET = Deno.env.get("MHC_SYNC_SECRET") ?? "";

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

// per-provider config
const PROVIDERS: Record<string, { domain: string; junk: (title: string, ptype: string, tags: string[]) => boolean }> = {
  clinilabs: {
    domain: "https://www.clinilabs.co.uk",
    junk: (title, ptype, tags) =>
      ptype.toLowerCase() === "giftcard" || tags.includes("giftcard") || /gift ?card/i.test(title),
  },
  "lola-health": {
    domain: "https://lolahealth.com",
    junk: (title, ptype, tags) =>
      ptype.toLowerCase() === "giftcard" || tags.includes("giftcard") || tags.includes("category:gift-card") ||
      /gift ?card|membership|deposit|e-?voucher|nmn|supplement|consultation|top ?up/i.test(title),
  },
};

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  if (url.searchParams.get("secret") !== SECRET) {
    return new Response(JSON.stringify({ error: "unauthorised" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const provider = url.searchParams.get("provider") ?? "";
  const cfg = PROVIDERS[provider];
  if (!cfg) return new Response(JSON.stringify({ error: `unknown provider '${provider}'` }), { status: 400, headers: { "Content-Type": "application/json" } });

  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "250", 10), 250);
  const dryRun = url.searchParams.get("dry") === "1";

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const started = new Date().toISOString();
  let runId: string | null = null;
  if (!dryRun) {
    try { const { data } = await supabase.from("scrape_runs").insert({ provider_id: provider, scraper_function: "mhc-shopify-sync", status: "running", started_at: started }).select("id").single(); runId = data?.id ?? null; } catch (_e) {}
  }

  let seen = 0, updated = 0, inserted = 0, skippedJunk = 0, noPrice = 0;
  const errors: string[] = [];
  const sample: unknown[] = [];

  try {
    const res = await fetch(`${cfg.domain}/products.json?limit=${limit}&page=${page}`, {
      headers: { "User-Agent": "myhealthcheckup-comparison-bot/1.0 (+https://myhealthcheckup.co.uk)" },
    });
    if (!res.ok) throw new Error(`products.json HTTP ${res.status}`);
    const body = await res.json();
    const products: any[] = body?.products ?? [];

    for (const p of products) {
      seen++;
      const handle: string = p.handle ?? "";
      const productUrl = `${cfg.domain}/products/${handle}`;
      const tags: string[] = Array.isArray(p.tags) ? p.tags.map((t: string) => String(t).toLowerCase()) : String(p.tags ?? "").split(",").map((t) => t.trim().toLowerCase());
      const ptype: string = p.product_type ?? "";
      const title: string = p.title ?? "";

      if (cfg.junk(title, ptype, tags)) {
        skippedJunk++;
        if (!dryRun) await supabase.from("provider_tests").update({ is_active: false }).eq("provider_id", provider).eq("url", productUrl);
        continue;
      }

      const basePrice = parseFloat(p?.variants?.[0]?.price ?? "");
      if (!Number.isFinite(basePrice) || basePrice <= 0) { noPrice++; continue; }

      const category = ptype || (tags[0] ?? null);
      const descriptionScraped = stripHtml(p.body_html);
      const row: Record<string, unknown> = {
        provider_id: provider,
        test_name: title,
        url: productUrl,
        scrape_source_url: productUrl,
        base_price: basePrice,
        price: basePrice,
        category: category,
        total_expected_cost: basePrice,   // collection fees unknown for these — TEC = base for now
        collection_fee: 0,
        turnaround_unit: "not_stated",    // not published in feed — never fabricate
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

      if (dryRun) { if (sample.length < 6) sample.push({ handle, title, basePrice, category, has_description: !!descriptionScraped }); continue; }

      const existing = (await supabase.from("provider_tests").select("id").eq("provider_id", provider).eq("url", productUrl).maybeSingle()).data;
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
          const { data: conflict } = await supabase.from("provider_tests").select("id").eq("provider_id", provider).eq("test_name", title).eq("is_active", true).maybeSingle();
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
        await supabase.from("provider_test_history").insert({ provider_test_id: rowId, provider_id: provider, test_name: title, price: basePrice, total_expected_cost: basePrice, scrape_source_url: productUrl });
      } catch (_e) {}
    }

    const hasMore = products.length === limit;
    if (runId) { try { await supabase.from("scrape_runs").update({ status: errors.length ? "partial" : "success", finished_at: new Date().toISOString(), tests_seen: seen, tests_updated: updated + inserted, errors: errors.slice(0, 20) }).eq("id", runId); } catch (_e) {} }

    return new Response(JSON.stringify({ ok: true, provider, dry: dryRun, page, seen, updated, inserted, skipped_junk: skippedJunk, skipped_no_price: noPrice, errors: errors.slice(0, 10), has_more: hasMore, next_page: hasMore ? page + 1 : null, sample }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (runId) { try { await supabase.from("scrape_runs").update({ status: "error", finished_at: new Date().toISOString(), tests_seen: seen, errors: [{ message: msg }] }).eq("id", runId); } catch (_e) {} }
    return new Response(JSON.stringify({ ok: false, provider, error: msg, page, seen }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
