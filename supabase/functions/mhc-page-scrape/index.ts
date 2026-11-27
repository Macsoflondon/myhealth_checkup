// mhc-page-scrape — myhealth checkup
// 2026-09-02: write descriptionScraped straight into the customer-facing description
// field too (verbatim, no LLM rewrite) — description must always be the provider's own text.
// 2026-09-21: this file was previously deployed straight from the Supabase dashboard and
// not tracked in this repo at all — pulled in here for reviewability as part of a platform
// audit.
// Auth: ../_shared/mhc-auth.ts checks the x-mhc-sync-secret header (?secret= still
// accepted during the 27/11/2026 transition) against Vault mhc_sync_secret only.
// No secret is committed here.
import { createClient } from "npm:@supabase/supabase-js@2";
import { normalisedProductPath } from "../_shared/scrape/product-url.ts";
import { sitemapBatch } from "../_shared/scrape/sitemap-batch.ts";
import { htmlToText } from "../_shared/scrape/html.ts";
import { parseMedicalDiagnosisTestsIncluded } from "../_shared/scrape/biomarkerParsers.ts";
import { checkMhcSyncSecret } from "../_shared/mhc-auth.ts";
import { turnaroundColumns } from "../_shared/scrape/parseTurnaround.ts";

const PROVIDERS: Record<
  string,
  {
    sitemaps: string[];
    urlMatch: RegExp;
    urlExclude: RegExp;
    batchCount: number;
  }
> = {
  "medical-diagnosis": {
    batchCount: 5,
    sitemaps: [
      "https://www.medical-diagnosis.co.uk/product-sitemap.xml",
      "https://www.medical-diagnosis.co.uk/product-sitemap2.xml",
    ],
    urlMatch: /\/exam\/(profiles|all-tests)\//i,
    urlExclude: /uncategorized|\/param/i,
  },
};

function stripTags(s: string): string {
  return htmlToText(s || "");
}
function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bblood\b|\btest\b|\bprofile\b|\bkit\b|\bmix\b|\bmatch\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function slugNorm(url: string): string {
  const seg = url.replace(/\/+$/, "").split("/").pop() || "";
  return norm(seg.replace(/-/g, " "));
}

// 2026-09-01, v4: v3's JSON-LD match was picking up this site's generic
// sitewide Organization/company description ("Medical Diagnosis is a
// private clinical pathology laboratory...") instead of a test-specific one
// — real text, valid length, but identical on every single page and useless
// as a per-test summary. Exclude it explicitly so these pages fall back to
// the position-bounded per-page slice, which does carry real per-test copy.
const GENERIC_COMPANY_BOILERPLATE = /private clinical pathology laboratory/i;

function extractJsonLdDescription(html: string): string | null {
  const matches = [
    ...html.matchAll(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/gi),
  ];
  let best: string | null = null;
  for (const m of matches) {
    const val = m[1]
      .replace(/\\\//g, "/")
      .replace(/\\n/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\s+/g, " ")
      .trim();
    if (GENERIC_COMPANY_BOILERPLATE.test(val)) continue;
    if (val.length > 40 && (!best || val.length > best.length)) best = val;
  }
  return best && best.length > 40 ? best.slice(0, 4000) : null;
}
// 2026-10-28: the provider's own og:description carries the full verbatim
// product copy. Prefer it; the position-bounded slice captured site menus.
function decodeAttr(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
function extractOgDescription(html: string): string | null {
  const m = html.match(/property="og:description"\s+content="([^"]+)"/i);
  if (!m) return null;
  const val = decodeAttr(m[1])
    .replace(/[ \t]+/g, " ")
    .trim();
  if (val.length < 40 || GENERIC_COMPANY_BOILERPLATE.test(val)) return null;
  return val.slice(0, 4000);
}
function extractOgImage(html: string): string | null {
  const m = html.match(/property="og:image"\s+content="(https:\/\/[^"]+)"/i);
  return m ? decodeAttr(m[1]) : null;
}
function looksLikePageFurniture(s: string): boolean {
  return /No products in the cart|Recent Posts|Kid&#8217;s Health|-->/i.test(s);
}
function extractDescriptionScraped(
  html: string,
  name: string | null,
): string | null {
  const ogDesc = extractOgDescription(html);
  if (ogDesc) return ogDesc;
  const jsonLd = extractJsonLdDescription(html);
  if (jsonLd) return stripTags(jsonLd).slice(0, 4000);
  const text = stripTags(html);
  let startIdx = 0;
  if (name) {
    const idx = text.indexOf(name);
    if (idx >= 0) startIdx = idx + name.length;
  }
  const landmarks = [
    "Price:",
    "Turnaround Time",
    "Sample Requirements",
    "Tests Included",
    "Special Instructions",
    "Status:",
  ];
  let endIdx = text.length;
  for (const lm of landmarks) {
    const i = text.indexOf(lm, startIdx);
    if (i >= 0 && i < endIdx) endIdx = i;
  }
  const slice = text.slice(startIdx, endIdx).trim();
  return slice &&
    slice.length > 20 &&
    !GENERIC_COMPANY_BOILERPLATE.test(slice) &&
    !looksLikePageFurniture(slice)
    ? slice.slice(0, 4000)
    : null;
}

export function medicalDiagnosisPrice(html: string): number | null {
  const pIdx = html.search(/Price:/i);
  if (pIdx < 0) return null;
  const section =
    html
      .slice(pIdx)
      .split(/Sample Requirements|Turnaround Time|Tests Included/i)[0] ?? "";
  const amount = section.match(
    /<span\b[^>]*class=["'][^"']*\bwoocommerce-Price-amount\b[^"']*["'][^>]*>([\s\S]*?)<\/bdi>\s*<\/span>/i,
  );
  if (!amount) return null;
  const match = htmlToText(amount[1] ?? "").match(
    /^£\s*([\d,]+(?:\.\d{1,2})?)$/,
  );
  const price = match ? Number(match[1]?.replace(/,/g, "")) : NaN;
  return Number.isFinite(price) && price > 0 ? price : null;
}

export function medicalDiagnosisProductPage(
  html: string,
  finalUrl: string,
): boolean {
  try {
    const url = new URL(finalUrl);
    return (
      url.hostname.replace(/^www\./, "") === "medical-diagnosis.co.uk" &&
      /\/exam\/(profiles|all-tests)\/.+/i.test(url.pathname) &&
      /<body\b[^>]*class=["'][^"']*\bsingle-product\b/i.test(html)
    );
  } catch {
    return false;
  }
}

export function medicalDiagnosisCandidates(
  sitemapMatches: string[],
  storedUrls: Array<string | null>,
): string[] {
  const byPath = new Map<string, string>();
  for (const url of [...sitemapMatches, ...storedUrls]) {
    const path = normalisedProductPath(url);
    if (url && path && path !== "/" && !byPath.has(path)) byPath.set(path, url);
  }
  return [...byPath.values()];
}

export function automaticRelistIds(
  changes: Array<{
    provider_test_id: string;
    change_type: string;
    created_at: string;
  }>,
  now: number,
): Set<string> {
  const manual = new Set(
    changes
      .filter((c) => c.change_type === "delisted_manual")
      .map((c) => c.provider_test_id),
  );
  return new Set(
    changes
      .filter(
        (c) =>
          c.change_type === "delisted_auto" &&
          Date.parse(c.created_at) >= now - 14 * 86400000 &&
          !manual.has(c.provider_test_id),
      )
      .map((c) => c.provider_test_id),
  );
}

function parsePage(html: string) {
  let name: string | null = null;
  const og = html.match(/property="og:title"\s+content="([^"]+)"/i);
  if (og) name = og[1].replace(/^Medical Diagnosis\s*[-–]\s*/i, "").trim();
  if (!name) {
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) {
      const t = stripTags(h1[1])
        .replace(/^Medical Diagnosis\s*[-–]\s*/i, "")
        .trim();
      if (t) name = t;
    }
  }
  if (!name) {
    const t = html.match(/<title>([^<]+)<\/title>/i);
    if (t) {
      const cleaned = t[1]
        .split(/[-–|]/)[0]
        .replace(/^Medical Diagnosis\s*/i, "")
        .trim();
      if (cleaned) name = cleaned;
    }
  }
  const price = medicalDiagnosisPrice(html);
  let taText: string | null = null,
    taDays: number | null = null,
    taHours: number | null = null;
  const tIdx = html.search(/Turnaround Time/i);
  if (tIdx >= 0) {
    const seg = stripTags(html.slice(tIdx, tIdx + 400))
      .replace(/Turnaround Time:?/i, "")
      .trim();
    const val = seg
      .split(/Special Instructions|Status:|Tests Included|Sample/i)[0]
      .trim();
    const hm = val.match(/(\d+)\s*hour/i);
    const dm = val.match(/(\d+)\s*(?:working\s*)?day/i);
    if (hm) {
      taHours = parseInt(hm[1], 10);
      taText = `Results in ${taHours} hour${taHours > 1 ? "s" : ""}`;
    } else if (dm) {
      taDays = parseInt(dm[1], 10);
      taText = `Results in ${taDays} working day${taDays > 1 ? "s" : ""}`;
    }
  }
  let sample: string | null = null;
  const sIdx = html.search(/Sample Requirements/i);
  if (sIdx >= 0) {
    const sm = html
      .slice(sIdx, sIdx + 600)
      .match(/(Blood|Urine|Stool|Saliva|Swab|Semen)/i);
    if (sm) sample = sm[1];
  }
  // Read the provider's own "Tests Included" element whole. The previous
  // version searched a 6,000-character window after the first
  // case-insensitive "tests included", which on long pages is page furniture.
  const bios: string[] = parseMedicalDiagnosisTestsIncluded(html);
  const descriptionScraped = extractDescriptionScraped(html, name);
  const imageUrl = extractOgImage(html);
  return {
    imageUrl,
    name,
    price,
    taText,
    taDays,
    taHours,
    sample,
    bios,
    descriptionScraped,
  };
}

async function getUrls(cfg: {
  sitemaps: string[];
  urlMatch: RegExp;
  urlExclude: RegExp;
}): Promise<{ urls: string[]; fetchFailures: number; sitemapsTried: number }> {
  const urls: string[] = [];
  let fetchFailures = 0;
  for (const sm of cfg.sitemaps) {
    try {
      const r = await fetch(sm, {
        headers: { "User-Agent": "myhealthcheckup-sync/1.0" },
      });
      if (!r.ok) {
        fetchFailures++;
        continue;
      }
      const xml = await r.text();
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
        const url = m[1].trim();
        if (cfg.urlMatch.test(url) && !cfg.urlExclude.test(url)) urls.push(url);
      }
    } catch (_e) {
      fetchFailures++;
    }
  }
  return {
    urls: [...new Set(urls)].sort(),
    fetchFailures,
    sitemapsTried: cfg.sitemaps.length,
  };
}

Deno.serve(async (req) => {
  const u = new URL(req.url);
  const databaseUrl = Deno.env.get("SUPABASE_URL");
  const databaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!databaseUrl || !databaseKey)
    return new Response("service unavailable", { status: 503 });
  const supabase = createClient(databaseUrl, databaseKey);
  const auth = await checkMhcSyncSecret(req, supabase, "mhc-page-scrape");
  if (!auth.ok) return new Response("unauthorized", { status: 401 });
  const startedAt = new Date().toISOString();
  const providerId = u.searchParams.get("provider") || "";
  const dry = u.searchParams.get("dry") === "1";
  const urlsOnly = u.searchParams.get("urls_only") === "1";
  const offset = parseInt(u.searchParams.get("offset") || "0", 10);
  const limit = parseInt(u.searchParams.get("limit") || "25", 10);
  const cfg = PROVIDERS[providerId];
  if (!cfg)
    return new Response(
      JSON.stringify({ ok: false, error: "unknown provider" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  if (
    !Number.isSafeInteger(offset) ||
    offset < 0 ||
    !Number.isSafeInteger(limit) ||
    limit <= 0 ||
    Math.floor(offset / limit) >= cfg.batchCount
  )
    return new Response(
      JSON.stringify({ ok: false, error: "invalid batch position" }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  const { data: rows, error: rowsError } = await supabase
    .from("provider_tests")
    .select(
      "id, test_name, biomarker_count, biomarkers_list, clinic_phlebotomy_cost, image_url, url, price, is_active",
    )
    .eq("provider_id", providerId)
    .eq("is_active", true);
  const runErrors: { url?: string; message: string }[] = [];
  if (rowsError)
    runErrors.push({ message: `catalogue read failed: ${rowsError.message}` });
  const { data: autoChanges, error: autoError } = await supabase
    .from("product_change_log")
    .select("provider_test_id, change_type, created_at")
    .eq("provider_id", providerId)
    .eq("change_type", "delisted_auto")
    .gte("created_at", new Date(Date.now() - 14 * 86400000).toISOString());
  const autoIds = [
    ...new Set((autoChanges ?? []).map((c) => String(c.provider_test_id))),
  ];
  const { data: manualChanges, error: manualError } = autoIds.length
    ? await supabase
        .from("product_change_log")
        .select("provider_test_id, change_type, created_at")
        .eq("provider_id", providerId)
        .eq("change_type", "delisted_manual")
        .in("provider_test_id", autoIds)
    : { data: [], error: null };
  const relistIds = automaticRelistIds(
    [...(autoChanges ?? []), ...(manualChanges ?? [])],
    Date.now(),
  );
  const { data: hiddenRows, error: hiddenError } =
    relistIds.size && !autoError && !manualError
      ? await supabase
          .from("provider_tests")
          .select(
            "id, test_name, biomarker_count, biomarkers_list, clinic_phlebotomy_cost, image_url, url, price, is_active",
          )
          .eq("provider_id", providerId)
          .eq("is_active", false)
          .in("id", [...relistIds])
      : { data: [], error: null };
  for (const error of [autoError, manualError, hiddenError]) {
    if (error)
      runErrors.push({ message: "automatic re-list catalogue read failed" });
  }
  type CatalogueRow = {
    id: string;
    test_name: string;
    biomarker_count: number | null;
    biomarkers_list: string[] | null;
    clinic_phlebotomy_cost: number | null;
    image_url: string | null;
    url: string | null;
    price: number | null;
    is_active: boolean;
  };
  const byNorm = new Map<string, CatalogueRow>();
  const byPath = new Map<string, CatalogueRow>();
  for (const r of (rows || []) as CatalogueRow[]) {
    byNorm.set(norm(r.test_name), r);
    const path = normalisedProductPath(r.url);
    if (path) byPath.set(path, r);
  }
  // Active identities win over older hidden duplicate rows sharing their URL.
  for (const r of (hiddenRows ?? []) as CatalogueRow[]) {
    if (!relistIds.has(r.id)) continue;
    const path = normalisedProductPath(r.url);
    if (!path || byPath.has(path)) continue;
    byPath.set(path, r);
    if (!byNorm.has(norm(r.test_name))) byNorm.set(norm(r.test_name), r);
  }
  const keySet = new Set([...byNorm.keys()].filter((k) => k.length > 2));
  const {
    urls: sitemapUrls,
    fetchFailures,
    sitemapsTried,
  } = await getUrls(cfg);
  const sitemapFullyFailed =
    sitemapsTried > 0 && fetchFailures === sitemapsTried;
  const matchedUrls = sitemapUrls.filter(
    (url) =>
      byPath.has(normalisedProductPath(url) ?? "") || keySet.has(slugNorm(url)),
  );
  const {
    orderedUrls: allUrls,
    slice,
    batchIndex,
    batchCount,
    sliceSize,
  } = sitemapBatch(
    medicalDiagnosisCandidates(
      matchedUrls,
      [...byPath.values()].map((r) => r.url),
    ),
    offset,
    limit,
    cfg.batchCount,
  );
  const batchMetadata = {
    batch_index: batchIndex,
    batch_count: batchCount,
    slice_size: sliceSize,
  };
  if (urlsOnly)
    return new Response(
      JSON.stringify(
        {
          ok: true,
          matched_urls: allUrls.length,
          ...batchMetadata,
          db_active: rows?.length || 0,
          sitemap_fetch_failures: fetchFailures,
          sample_urls: allUrls.slice(0, 15),
        },
        null,
        2,
      ),
      { headers: { "content-type": "application/json" } },
    );
  const results: Record<string, unknown>[] = [];
  let written = 0,
    relisted = 0,
    matched = 0,
    nameSkips = 0;
  for (const url of slice) {
    let html = "";
    let finalUrl = url;
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": "myhealthcheckup-sync/1.0" },
      });
      if (!r.ok) {
        runErrors.push({ url, message: `HTTP ${r.status}` });
        continue;
      }
      html = await r.text();
      finalUrl = r.url || url;
    } catch (e) {
      runErrors.push({
        url,
        message: e instanceof Error ? e.message : String(e),
      });
      continue;
    }
    const p = parsePage(html);
    if (!medicalDiagnosisProductPage(html, finalUrl) || p.price === null) {
      runErrors.push({ url, message: "price not readable" });
      continue;
    }
    if (!p.name || p.name.includes("[PARAM]")) {
      nameSkips++;
      continue;
    }
    const row =
      byPath.get(normalisedProductPath(url) ?? "") ||
      byNorm.get(slugNorm(url)) ||
      byNorm.get(norm(p.name));
    if (!row) continue;
    matched++;
    if (results.length < 8)
      results.push({
        url,
        db_name: row.test_name,
        price: p.price,
        biomarkers: p.bios.length,
        turnaround: p.taText,
        sample: p.sample,
        sample_bios: p.bios.slice(0, 6),
        has_description: !!p.descriptionScraped,
      });
    if (!dry) {
      const upd: Record<string, unknown> = {
        url,
        scrape_source_url: url,
        url_verified: true,
        last_validated_at: new Date().toISOString(),
        scraped_at: new Date().toISOString(),
      };
      if (!row.is_active) {
        // Re-check manual exclusions immediately before restoring an inactive row.
        const { data: manual, error: manualCheckError } = await supabase
          .from("product_change_log")
          .select("id")
          .eq("provider_id", providerId)
          .eq("provider_test_id", row.id)
          .eq("change_type", "delisted_manual")
          .limit(1);
        if (manualCheckError || manual?.length || !relistIds.has(row.id))
          continue;
        upd.is_active = true;
        upd.data_status = "partial";
      }
      if (p.price && p.price > 0) {
        // Keep the stored clinic fee in the comparable total.
        const clinicFee =
          Number(row.clinic_phlebotomy_cost) > 0
            ? Number(row.clinic_phlebotomy_cost)
            : 0;
        upd.price = p.price;
        upd.base_price = p.price;
        upd.total_expected_cost = p.price + clinicFee;
        upd.price_not_stated = false;
      }
      const hasStoredList =
        Array.isArray(row.biomarkers_list) && row.biomarkers_list.length > 0;
      if (p.bios.length > 0 && !hasStoredList) {
        upd.biomarker_count = p.bios.length;
        upd.biomarkers_list = p.bios;
        upd.biomarkers_not_stated = false;
      } else if (
        p.bios.length > 0 &&
        JSON.stringify(p.bios) !== JSON.stringify(row.biomarkers_list)
      ) {
        // Never overwrite a stored list; report the difference instead.
        runErrors.push({
          url,
          message: `biomarker list differs from stored list (${p.bios.length} vs ${row.biomarkers_list?.length ?? 0}); not written`,
        });
      } else if (
        !Array.isArray(row.biomarkers_list) ||
        row.biomarkers_list.length === 0
      ) {
        // Page publishes no itemised list (e.g. Sputum, Stool Culture /
        // Bacteria PCR). Never invent names; flag it instead. An existing
        // list is left untouched.
        upd.biomarkers_not_stated = true;
      }
      if (p.taText) {
        upd.turnaround_days_text = p.taText;
        upd.turnaround_days = p.taDays;
        upd.turnaround_hours = p.taHours;
        upd.turnaround_not_stated = false;
        Object.assign(upd, turnaroundColumns(p.taText) ?? {});
      }
      if (p.sample) upd.sample_type = p.sample;
      // The provider's og:image is often a dead link; store it only if it loads.
      if (p.imageUrl && !row.image_url) {
        try {
          const head = await fetch(p.imageUrl, { method: "HEAD" });
          if (head.ok) upd.image_url = p.imageUrl;
        } catch {
          // Unreachable image: leave image_url empty so the neutral fallback shows.
        }
      }
      if (p.descriptionScraped) {
        upd.description_scraped = p.descriptionScraped;
        upd.description = p.descriptionScraped;
        upd.description_source = "scraped_verbatim";
        upd.description_generated_at = new Date().toISOString();
      }
      const { data: updatedRows, error } = await supabase
        .from("provider_tests")
        .update(upd)
        .eq("id", row.id)
        .eq("is_active", row.is_active)
        .select("id");
      if (!error && updatedRows?.length) {
        written++;
        if (!row.is_active) {
          relisted++;
          const { error: logError } = await supabase
            .from("product_change_log")
            .insert({
              provider_test_id: row.id,
              provider_id: providerId,
              change_type: "relisted_auto",
              old_value: { is_active: false, price: row.price },
              new_value: { is_active: true, price: p.price, url },
              changed_by: "mhc-page-scrape",
            });
          if (logError)
            runErrors.push({
              url,
              message: "automatic re-list audit write failed",
            });
        }
      } else if (error) runErrors.push({ url, message: error.message });
    }
  }
  const runStatus =
    sitemapFullyFailed || rowsError
      ? "error"
      : runErrors.length > 0 ||
          (slice.length > 0 && nameSkips > slice.length / 2)
        ? "partial"
        : "success";
  try {
    await supabase.from("scrape_runs").insert({
      provider_id: providerId,
      scraper_function: "mhc-page-scrape",
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      status: runStatus,
      tests_seen: slice.length,
      tests_new: 0,
      tests_updated: written,
      tests_deactivated: 0,
      tests_unchanged: Math.max(0, matched - written),
      errors: [
        ...(sitemapFullyFailed
          ? [{ message: "sitemap fetch failed for all configured sitemaps" }]
          : []),
        ...runErrors,
      ],
      metadata: {
        ...batchMetadata,
        matched_urls: allUrls.length,
        offset,
        limit,
        matched,
        relisted,
        dry,
        name_extraction_failures: nameSkips,
        sitemap_fetch_failures: fetchFailures,
        sitemaps_tried: sitemapsTried,
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
        matched_urls: allUrls.length,
        ...batchMetadata,
        offset,
        limit,
        processed: slice.length,
        matched,
        written,
        relisted,
        errors: runErrors,
        sitemap_fetch_failures: fetchFailures,
        sample: results,
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
});
