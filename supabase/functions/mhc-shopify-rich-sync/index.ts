// mhc-shopify-rich-sync — myhealth checkup
// 2026-09-02: write description_scraped straight into the customer-facing description
// field too (verbatim, no LLM rewrite) — description must always be the provider's own text.
// 2026-09-21: this file was previously deployed straight from the Supabase dashboard and
// not tracked in this repo at all — pulled in here for reviewability as part of a platform
// audit.
// Auth: ../_shared/mhc-auth.ts checks the x-mhc-sync-secret header (?secret= still
// accepted during the 27/11/2026 transition) against Vault mhc_sync_secret only.
// No secret is committed here.
import { createClient } from "npm:@supabase/supabase-js@2";
import { shopifyProductHandle } from "../_shared/scrape/product-url.ts";
import { htmlToText } from "../_shared/scrape/html.ts";
import { checkMhcSyncSecret } from "../_shared/mhc-auth.ts";
import { turnaroundColumns } from "../_shared/scrape/parseTurnaround.ts";
import {
  fetchShopifyFeedPage,
  shopifyFeedUrl,
} from "../_shared/scrape/shopify-feed.ts";

type Variant = { price: string; option1?: string; title?: string };
type Product = {
  title: string;
  handle: string;
  body_html?: string;
  variants?: Variant[];
};
const PROVIDERS: Record<
  string,
  { domain: string; junk: (p: Product) => boolean }
> = {
  "goodbody-clinic": {
    domain: "https://goodbodyclinic.com",
    junk: (p) =>
      /gift card|deposit|consultation|membership|cancellation|appointment|recharge test product|tube and|lancets/i.test(
        p.title || "",
      ),
  },
  "london-health-company": {
    domain: "https://londonhealthcompany.co.uk",
    junk: (p) =>
      /gift card|deposit|consultation|membership|subscription|tube and|lancets|add-on/i.test(
        p.title || "",
      ),
  },
};

const STOP = new Set([
  "blood",
  "test",
  "kit",
  "uk",
  "home",
  "at",
  "athome",
  "the",
  "with",
  "lab",
  "laboratory",
  "analysis",
  "available",
  "across",
  "results",
  "result",
  "report",
  "numerical",
  "verified",
  "delivered",
  "sample",
  "collection",
  "for",
  "and",
  "panel",
  "profile",
  "screening",
  "health",
  "biomarkers",
  "biomarker",
  "parameters",
  "parameter",
  "including",
  "check",
  "hormone",
  "hormones",
]);

function tokens(s: string): Set<string> {
  return new Set(
    (s || "")
      .toLowerCase()
      .replace(/™|®/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((t) => t && t.length > 1 && !STOP.has(t)),
  );
}
function normKey(s: string): string {
  return [...tokens(s)].sort().join(" ");
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
function bioInTitle(s: string): number | null {
  const m = (s || "").match(/(\d+)\s*(?:biomarkers?|parameters?|markers?)/i);
  return m ? parseInt(m[1], 10) : null;
}
function parseTurnaround(html: string): {
  text: string | null;
  days: number | null;
} {
  if (!html) return { text: null, days: null };
  const h = html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&");
  let m = h.match(/(\d+)\s*(?:to|[-–])\s*(\d+)\s*working days/i);
  if (m)
    return {
      text: `Results in ${m[1]}–${m[2]} working days`,
      days: parseInt(m[2], 10),
    };
  m = h.match(/within\s*(\d+)\s*working days/i);
  if (m)
    return {
      text: `Results within ${m[1]} working days`,
      days: parseInt(m[1], 10),
    };
  m = h.match(/(\d+)\s*working days/i);
  if (m)
    return {
      text: `Results in ${m[1]} working days`,
      days: parseInt(m[1], 10),
    };
  if (/same[- ]day results/i.test(h))
    return { text: "Same-day results available", days: 1 };
  return { text: null, days: null };
}
function pricing(variants: Variant[]): {
  base: number | null;
  clinicFee: number | null;
  homeFee: number | null;
} {
  const prices = variants
    .map((v) => parseFloat(v.price))
    .filter((n) => !isNaN(n) && n > 0);
  if (prices.length === 0)
    return { base: null, clinicFee: null, homeFee: null };
  const base = Math.min(...prices);
  let clinic: number | null = null,
    home: number | null = null;
  for (const v of variants) {
    const opt = (v.option1 || v.title || "").toLowerCase();
    const pr = parseFloat(v.price);
    if (isNaN(pr)) continue;
    if (/clinic/.test(opt)) clinic = Math.max(0, +(pr - base).toFixed(2));
    else if (/nurse|home/.test(opt))
      home = Math.max(0, +(pr - base).toFixed(2));
  }
  return { base, clinicFee: clinic, homeFee: home };
}
function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  const text = htmlToText(html);
  return text ? text.slice(0, 4000) : null;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  // Fail closed: an unreadable Vault secret answers 503; a wrong or missing
  // secret header answers 401.
  const auth = await checkMhcSyncSecret(req, supabase, "mhc-shopify-rich-sync");
  if (!auth.ok && auth.reason === "not_configured")
    return new Response("sync secret not configured", { status: 503 });
  if (!auth.ok) return new Response("unauthorized", { status: 401 });
  const startedAt = new Date().toISOString();
  const providerId = url.searchParams.get("provider") || "";
  const dry = url.searchParams.get("dry") === "1";
  const fuzzy = url.searchParams.get("fuzzy") !== "0";
  const minScore = parseFloat(url.searchParams.get("min_score") || "0.6");
  const cfg = PROVIDERS[providerId];
  if (!cfg)
    return new Response(
      JSON.stringify({ ok: false, error: "unknown provider" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  const { data: rows, error: rErr } = await supabase
    .from("provider_tests")
    .select("id, test_name, biomarker_count, url")
    .eq("provider_id", providerId)
    .eq("is_active", true);
  if (rErr)
    return new Response(JSON.stringify({ ok: false, error: rErr.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });

  // Falls back to the database's copy when Shopify refuses the edge (429).
  // A page that cannot be read ends the feed; when page 1 cannot be read the
  // run writes nothing and records the reason.
  const products: Product[] = [];
  const feedSources: string[] = [];
  let feedError: string | null = null;
  for (let page = 1; page <= 6; page++) {
    let batch: Product[];
    try {
      const fp = await fetchShopifyFeedPage(
        shopifyFeedUrl(cfg.domain, page),
        supabase,
        { headers: { "User-Agent": "myhealthcheckup-sync/1.0" } },
      );
      batch = fp.products.filter((p: unknown): p is Product => {
        if (!p || typeof p !== "object") return false;
        const candidate = p as Record<string, unknown>;
        return (
          typeof candidate["title"] === "string" &&
          typeof candidate["handle"] === "string"
        );
      });
      feedSources.push(fp.source);
    } catch (e) {
      if (page === 1) feedError = e instanceof Error ? e.message : String(e);
      break;
    }
    if (batch.length === 0) break;
    products.push(...batch);
    if (batch.length < 250) break;
  }
  const feed = products
    .filter((p) => !cfg.junk(p))
    .map((p) => {
      const pr = pricing(p.variants || []);
      const ta = parseTurnaround(p.body_html || "");
      return {
        title: p.title,
        handle: p.handle,
        url: `${cfg.domain}/products/${p.handle}`,
        base: pr.base,
        clinicFee: pr.clinicFee,
        homeFee: pr.homeFee,
        ta,
        key: normKey(p.title),
        toks: tokens(p.title),
        bio: bioInTitle(p.title),
        descriptionScraped: stripHtml(p.body_html),
      };
    });
  type FeedEntry = (typeof feed)[number];
  const feedByKey = new Map<string, FeedEntry>();
  const feedByHandle = new Map(feed.map((f) => [f.handle.toLowerCase(), f]));
  for (const f of feed) feedByKey.set(f.key, f);

  type Decision = {
    db_id: string;
    db_name: string;
    db_bio: number | null;
    method: string;
    score: number;
    confident: boolean;
    feed_title: string | null;
    url: string | null;
    base_price: number | null;
    clinic_fee: number | null;
    home_fee: number | null;
    feed_bio: number | null;
    turnaround_text: string | null;
    turnaround_days: number | null;
    description_scraped: string | null;
  };
  const decisions: Decision[] = [];
  const usedFeed = new Set<string>();
  // Resolve URL owners first, so a name match cannot steal a stable handle.
  const orderedRows = [...(rows || [])].sort(
    (a, b) =>
      Number(feedByHandle.has(shopifyProductHandle(b.url, cfg.domain) ?? "")) -
      Number(feedByHandle.has(shopifyProductHandle(a.url, cfg.domain) ?? "")),
  );
  for (const r of orderedRows) {
    const rk = normKey(r.test_name);
    const rToks = tokens(r.test_name);
    const handle = shopifyProductHandle(r.url, cfg.domain);
    const urlMatch = handle ? feedByHandle.get(handle) : undefined;
    const exactMatch = feedByKey.get(rk);
    let best =
      urlMatch && !usedFeed.has(urlMatch.handle)
        ? urlMatch
        : exactMatch && !usedFeed.has(exactMatch.handle)
          ? exactMatch
          : null;
    let score = best ? 1 : 0;
    let method = best === urlMatch && best ? "url" : best ? "exact" : "";
    if (!best && fuzzy) {
      for (const f of feed) {
        if (usedFeed.has(f.handle)) continue;
        let s = jaccard(rToks, f.toks);
        if (r.biomarker_count && f.bio) {
          if (r.biomarker_count === f.bio) s += 0.25;
          else s -= 0.15;
        }
        if (s > score) {
          score = s;
          best = f;
          method = "fuzzy";
        }
      }
    }
    const confident = Boolean(
      best &&
      (method === "url" || method === "exact" || score >= minScore) &&
      best.base != null &&
      !usedFeed.has(best.handle),
    );
    if (best && confident) usedFeed.add(best.handle);
    decisions.push({
      db_id: r.id,
      db_name: r.test_name,
      db_bio: r.biomarker_count,
      method,
      score: +score.toFixed(2),
      confident,
      feed_title: best?.title || null,
      url: best?.url || null,
      base_price: best?.base ?? null,
      clinic_fee: best?.clinicFee ?? null,
      home_fee: best?.homeFee ?? null,
      feed_bio: best?.bio ?? null,
      turnaround_text: best?.ta.text ?? null,
      turnaround_days: best?.ta.days ?? null,
      description_scraped: best?.descriptionScraped ?? null,
    });
  }

  let written = 0;
  const writeErrors: string[] = [];
  if (!dry) {
    for (const d of decisions) {
      if (!d.confident || d.base_price == null) continue;
      const upd: Record<string, unknown> = {
        url: d.url,
        base_price: d.base_price,
        total_expected_cost: d.base_price,
        price: d.base_price,
        price_not_stated: false,
        last_validated_at: new Date().toISOString(),
        scrape_source_url: d.url,
      };
      // Write a phlebotomy fee only when the feed proves one, so a fee entered
      // by hand for a product without that variant is not wiped every run.
      if (d.clinic_fee != null) upd.clinic_phlebotomy_cost = d.clinic_fee;
      if (d.home_fee != null) upd.home_phlebotomy_cost = d.home_fee;
      if (d.turnaround_text) {
        upd.turnaround_days_text = d.turnaround_text;
        upd.turnaround_days = d.turnaround_days;
        upd.turnaround_not_stated = false;
        Object.assign(upd, turnaroundColumns(d.turnaround_text) ?? {});
      }
      if (d.description_scraped) {
        upd.description_scraped = d.description_scraped;
        upd.description = d.description_scraped;
        upd.description_source = "scraped_verbatim";
        upd.description_generated_at = new Date().toISOString();
      }
      const { error: uErr } = await supabase
        .from("provider_tests")
        .update(upd)
        .eq("id", d.db_id);
      if (!uErr) written++;
      else writeErrors.push(`${d.db_id}: ${uErr.message}`.slice(0, 300));
    }
  }
  const confidentCount = decisions.filter((d) => d.confident).length;
  const totalRows = rows?.length || 0;
  const needsReview = totalRows - confidentCount;
  const reviewRatio = totalRows ? needsReview / totalRows : 0;
  try {
    await supabase.from("scrape_runs").insert({
      provider_id: providerId,
      scraper_function: "mhc-shopify-rich-sync",
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      status: feedError
        ? "error"
        : writeErrors.length || reviewRatio > 0.25
          ? "partial"
          : "success",
      tests_seen: totalRows,
      tests_new: 0,
      tests_updated: written,
      tests_deactivated: 0,
      tests_unchanged: Math.max(0, totalRows - written),
      errors: [
        ...(feedError ? [`feed: ${feedError}`.slice(0, 300)] : []),
        ...writeErrors.slice(0, 50),
      ],
      metadata: {
        feed_products: feed.length,
        feed_sources: feedSources,
        confident: confidentCount,
        needs_review: needsReview,
        needs_review_ratio: +reviewRatio.toFixed(2),
        fuzzy,
        dry,
      },
    });
  } catch (_e) {
    /* logging must never block the scrape response */
  }
  return new Response(
    JSON.stringify(
      {
        ok: true,
        provider: providerId,
        dry,
        fuzzy,
        min_score: minScore,
        feed_products: feed.length,
        feed_sources: feedSources,
        feed_error: feedError,
        db_active: rows?.length || 0,
        confident: confidentCount,
        needs_review: (rows?.length || 0) - confidentCount,
        written,
        decisions,
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
});
