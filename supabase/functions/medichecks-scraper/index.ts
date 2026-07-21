/**
 * Medichecks scraper — CRUX rebuild (v3).
 *
 * Discovers full catalogue via /products.json, then parses each product page
 * for verified fields. Writes via upsertWithProvenance for history + safety
 * rails, then a second pass writes the CRUX extras (TEC, sample options,
 * gp_review_status, turnaround_days_text).
 *
 * Extraction patterns (verified against live product pages):
 *   - Turnaround: "Results in {N} working days (estimated)"
 *                 or "results securely online in {N} working days (estimated)"
 *   - Sample options in "How do you want to take your sample?" section:
 *       "finger-prick blood sample at home — Free"          => home kit, £0
 *       "venous draw at a clinic — Venous +£35"             => clinic £35
 *       "venous draw at home with a nurse — Venous +£59"    => nurse £59
 *       "Self-arrange a professional sample collection — Venous Free" => £0
 *   - GP review: "doctor's comments are included" => Included
 *                                (add-on wording) => Optional
 *                                                    else => None
 *   - Biomarker count: "{N} biomarker(s)"
 *   - base_price: og:price:amount meta OR Shopify variant price
 *
 * Batching: supports ?offset=N&limit=M to stay under edge runtime limits.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { logProtectedCall } from '../_shared/audit.ts';
import { getErrorMessage } from '../_shared/errors.ts';
import {
  upsertWithProvenance,
  parseTurnaround,
  normaliseBiomarkers,
  startScrapeRun,
  finishScrapeRun,
  newCounters,
} from '../_shared/scrape/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROVIDER_ID = 'medichecks';
const BASE = 'https://www.medichecks.com';

interface ProductSummary {
  handle: string;
  title: string;
  url: string;
  price: number | null;
  compareAtPrice: number | null;
  productType: string | null;
  tags: string[];
  bodyHtml: string;
  imageUrl: string | null;
}

async function fetchShopifyProducts(): Promise<ProductSummary[]> {
  const out: ProductSummary[] = [];
  for (let page = 1; page <= 25; page++) {
    const url = `${BASE}/products.json?limit=250&page=${page}`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MyHealthCheckup/1.0)',
          'Accept': 'application/json',
        },
      });
      if (!res.ok) break;
      const json = await res.json();
      const products = Array.isArray(json?.products) ? json.products : [];
      if (products.length === 0) break;
      for (const p of products) {
        const variant = Array.isArray(p.variants) && p.variants.length > 0 ? p.variants[0] : null;
        const price = variant?.price ? parseFloat(variant.price) : null;
        const compareAt = variant?.compare_at_price ? parseFloat(variant.compare_at_price) : null;
        const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0]?.src : null;
        out.push({
          handle: p.handle,
          title: (p.title ?? '').trim(),
          url: `${BASE}/products/${p.handle}`,
          price: Number.isFinite(price) && price! > 0 ? price : null,
          compareAtPrice: Number.isFinite(compareAt) && compareAt! > 0 ? compareAt : null,
          productType: p.product_type ?? null,
          tags: Array.isArray(p.tags)
            ? p.tags
            : typeof p.tags === 'string'
            ? p.tags.split(',').map((t: string) => t.trim())
            : [],
          bodyHtml: p.body_html ?? '',
          imageUrl: firstImage ?? null,
        });
      }
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.warn(`[medichecks] products.json page ${page} error:`, getErrorMessage(err));
      break;
    }
  }
  const seen = new Set<string>();
  return out.filter((p) => {
    const key = p.handle.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stripHtml(s: string): string {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&mdash;|&ndash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------- Turnaround ----------
function extractTurnaround(text: string): { raw: string | null; days: number | null } {
  // Primary Medichecks house style
  const patterns: RegExp[] = [
    /results?\s+(?:securely\s+online\s+)?in\s+(\d+)\s+working\s+days?\s*\(?\s*estimated\s*\)?/i,
    /results?\s+in\s+(\d+)\s+working\s+days?/i,
    /(\d+)\s+working\s+days?\s*\(\s*estimated\s*\)/i,
    /turnaround(?:\s+time)?[:\-\s]+(\d+)\s+working\s+days?/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > 0 && n <= 60) {
        return { raw: m[0].trim().replace(/\s+/g, ' '), days: n };
      }
    }
  }
  return { raw: null, days: null };
}

// ---------- Sample collection options + fees ----------
interface SampleOptions {
  home_kit_available: boolean;
  home_kit_fee: number | null; // £0 if free
  home_nurse_available: boolean;
  home_nurse_fee: number | null;
  clinic_visit_available: boolean;
  clinic_visit_fee: number | null;
  self_arrange_available: boolean;
  self_arrange_fee: number | null;
}

function parseFeeAfter(segment: string): number | null {
  // Matches "+£35", "£59", "Free", "included"
  if (/\b(free|included)\b/i.test(segment)) return 0;
  const m = segment.match(/£\s*(\d+(?:\.\d{1,2})?)/);
  if (m) {
    const n = parseFloat(m[1]);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

function extractSampleOptions(text: string): SampleOptions {
  const opts: SampleOptions = {
    home_kit_available: false,
    home_kit_fee: null,
    home_nurse_available: false,
    home_nurse_fee: null,
    clinic_visit_available: false,
    clinic_visit_fee: null,
    self_arrange_available: false,
    self_arrange_fee: null,
  };

  // Look at line-ish segments so a fee attaches to the correct option
  const segments = text.split(/(?=(?:Collect|Book|Self-arrange|Choose|Order|Take)\s)/i);

  for (const raw of segments) {
    const seg = raw.slice(0, 300); // fee always sits near the option label
    const lower = seg.toLowerCase();

    if (/finger[-\s]?prick/.test(lower) && /\b(at\s+home|home\s+kit|your\s+own)\b/.test(lower)) {
      opts.home_kit_available = true;
      opts.home_kit_fee = parseFeeAfter(seg) ?? 0;
    } else if (/nurse/.test(lower) && /\bhome\b/.test(lower)) {
      opts.home_nurse_available = true;
      opts.home_nurse_fee = parseFeeAfter(seg);
    } else if (/clinic/.test(lower) && /(venous|draw|blood)/.test(lower)) {
      opts.clinic_visit_available = true;
      opts.clinic_visit_fee = parseFeeAfter(seg);
    } else if (/self[-\s]?arrange/.test(lower)) {
      opts.self_arrange_available = true;
      opts.self_arrange_fee = parseFeeAfter(seg) ?? 0;
    }
  }

  // Fallback: if the section wording didn't segment well, look for canonical
  // Medichecks fees anywhere on the page.
  if (!opts.clinic_visit_available && /venous\s*\+?\s*£\s*35\b/i.test(text)) {
    opts.clinic_visit_available = true;
    opts.clinic_visit_fee = 35;
  }
  if (!opts.home_nurse_available && /nurse[^£]{0,80}£\s*59\b/i.test(text)) {
    opts.home_nurse_available = true;
    opts.home_nurse_fee = 59;
  }
  if (!opts.home_kit_available && /finger[-\s]?prick/i.test(text)) {
    opts.home_kit_available = true;
    opts.home_kit_fee = 0;
  }

  return opts;
}

function computeTotalExpectedCost(basePrice: number | null, opts: SampleOptions): number | null {
  if (basePrice === null) return null;
  const fees: number[] = [];
  if (opts.home_kit_available && opts.home_kit_fee !== null) fees.push(opts.home_kit_fee);
  if (opts.self_arrange_available && opts.self_arrange_fee !== null) fees.push(opts.self_arrange_fee);
  if (opts.clinic_visit_available && opts.clinic_visit_fee !== null) fees.push(opts.clinic_visit_fee);
  if (opts.home_nurse_available && opts.home_nurse_fee !== null) fees.push(opts.home_nurse_fee);
  if (fees.length === 0) return basePrice;
  return basePrice + Math.min(...fees);
}

// ---------- GP review status ----------
function extractGpReviewStatus(text: string): 'Included' | 'Optional' | 'None' {
  const t = text.toLowerCase();
  if (
    /doctor'?s?\s+comments?\s+are\s+included/.test(t) ||
    /includes?\s+(a\s+)?doctor'?s?\s+comments?/.test(t) ||
    /doctor'?s?\s+report\s+included/.test(t)
  ) {
    return 'Included';
  }
  if (
    /add[-\s]?on[^.]{0,80}(doctor|gp|review|consultation)/.test(t) ||
    /(doctor|gp)\s+(consultation|review)[^.]{0,60}(optional|available|add)/.test(t)
  ) {
    return 'Optional';
  }
  return 'None';
}

// ---------- Base price from meta ----------
function extractMetaPrice(html: string): number | null {
  const m = html.match(/property="og:price:amount"\s+content="([\d.]+)"/i)
    || html.match(/name="og:price:amount"\s+content="([\d.]+)"/i)
    || html.match(/"price"\s*:\s*"?([\d.]+)"?/);
  if (m) {
    const n = parseFloat(m[1]);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

// ---------- Biomarkers ----------
function extractBiomarkerCount(text: string): number | null {
  const m = text.match(/\b(\d+)\s+biomarkers?\b/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n > 0 && n <= 200) return n;
  }
  return null;
}

function extractBiomarkersFromHtml(html: string): string[] {
  const items = new Set<string>();
  const sectionRe = /(what['']?s\s+in\s+the\s+test|what['']?s\s+included|biomarkers?\s+tested|biomarkers?\s+included|what\s+we\s+test)[\s\S]{0,10000}/i;
  const sectionMatch = html.match(sectionRe);
  const searchScope = sectionMatch ? sectionMatch[0] : html;
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(searchScope)) !== null) {
    const text = stripHtml(m[1]);
    if (!text || text.length < 2 || text.length > 80) continue;
    if (/\b(add to|buy|log in|sign up|reviews?|blog|shipping|delivery|privacy|cookie|basket|checkout)\b/i.test(text)) continue;
    items.add(text);
    if (items.size > 200) break;
  }
  return normaliseBiomarkers(Array.from(items));
}

function extractDescription(html: string): string | null {
  const meta = html.match(/name="description"\s+content="([^"]+)"/i)
    || html.match(/property="og:description"\s+content="([^"]+)"/i);
  if (meta && meta[1]) return meta[1].trim().substring(0, 500);
  return null;
}

function extractTitleFromHtml(html: string, fallback: string): string {
  const ld = html.match(/"@type"\s*:\s*"Product"[\s\S]*?"name"\s*:\s*"([^"]+)"/i);
  if (ld && ld[1]) return ld[1].replace(/\s*\|\s*Medichecks.*$/i, '').trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1 && h1[1]) {
    const t = stripHtml(h1[1]);
    if (t.length > 3) return t;
  }
  return fallback;
}

function categoryFor(text: string): string {
  const t = text.toLowerCase();
  if (/thyroid|tsh|\bt3\b|\bt4\b/.test(t)) return 'Thyroid';
  if (/testosterone|oestrogen|estrogen|progesterone|dhea|cortisol|hormone/.test(t)) return 'Hormones';
  if (/vitamin|mineral|iron|ferritin|b12|folate|magnesium|zinc/.test(t)) return 'Vitamins & Minerals';
  if (/heart|cholesterol|cardio|lipid/.test(t)) return 'Heart Health';
  if (/diabet|hba1c|glucose|insulin/.test(t)) return 'Diabetes';
  if (/liver|hepatic|\balt\b|\bast\b|bilirubin/.test(t)) return 'Liver Health';
  if (/kidney|renal|creatinine|egfr/.test(t)) return 'Kidney Health';
  if (/prostate|\bpsa\b|well\s*man/.test(t)) return "Men's Health";
  if (/menopause|well\s*woman|pcos|female/.test(t)) return "Women's Health";
  if (/fertility|\bamh\b|sperm/.test(t)) return 'Fertility';
  if (/sport|fitness|athlete|performance/.test(t)) return 'Sports & Fitness';
  if (/fatigue|tiredness|energy/.test(t)) return 'Fatigue';
  if (/inflammation|\bcrp\b|\besr\b/.test(t)) return 'Inflammation';
  return 'General Health';
}

function genderFor(text: string): string | null {
  const t = text.toLowerCase();
  if (/well\s*woman|women|female|menopause|pcos/.test(t)) return 'female';
  if (/well\s*man|\bmen\b|male|prostate/.test(t)) return 'male';
  return null;
}

async function fetchProductHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-GB,en;q=0.9',
      },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.warn(`[medichecks] fetch ${url} failed:`, getErrorMessage(err));
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${supabaseKey}`) {
    await logProtectedCall({ functionName: 'medichecks-scraper', status: 'denied', req });
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  await logProtectedCall({ functionName: 'medichecks-scraper', status: 'allowed', req });

  const url = new URL(req.url);
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') ?? '0', 10) || 0);
  const limit = Math.min(40, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20', 10) || 20));
  const autoContinue = (url.searchParams.get('auto') ?? '1') !== '0';


  const supabase = createClient(supabaseUrl, supabaseKey);
  const counters = newCounters();
  const runId = await startScrapeRun(supabase, PROVIDER_ID, 'medichecks-scraper', {
    started_at: new Date().toISOString(),
    offset,
    limit,
  });

  try {
    await supabase
      .from('scraping_jobs')
      .upsert(
        {
          provider_id: PROVIDER_ID,
          status: 'running',
          last_scraped: new Date().toISOString(),
          next_scrape: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        },
        { onConflict: 'provider_id' },
      );

    const products = await fetchShopifyProducts();
    counters.tests_seen = products.length;
    const scope = products.slice(offset, offset + limit);
    console.log(`[medichecks] processing ${scope.length} of ${products.length} (offset=${offset}, limit=${limit})`);

    for (const product of scope) {
      const html = (await fetchProductHtml(product.url)) ?? '';
      const bodyText = stripHtml(product.bodyHtml || '');
      const pageText = stripHtml(html);
      const combinedText = `${pageText} ${bodyText}`;

      const title = product.title || extractTitleFromHtml(html, product.handle);
      if (!title || title.length < 3) {
        counters.errors.push({ test: product.handle, message: 'no title' });
        continue;
      }

      const metaPrice = extractMetaPrice(html);
      const basePrice = product.price ?? metaPrice;
      const wasPrice = product.compareAtPrice && product.compareAtPrice > (basePrice ?? 0)
        ? product.compareAtPrice
        : null;
      const inStock = basePrice !== null && basePrice > 0;

      // Turnaround — always try, both page + product body
      const { raw: turnaroundRaw, days: turnaroundDays } = extractTurnaround(combinedText);
      const parsedTurn = turnaroundRaw
        ? parseTurnaround(turnaroundRaw)
        : { hours: null, days: null, unit: 'not_stated' as const, raw: null };
      const finalTurnDays = turnaroundDays ?? parsedTurn.days;
      const finalTurnHours = finalTurnDays !== null ? finalTurnDays * 24 : parsedTurn.hours;
      const finalTurnUnit: 'days' | 'hours' | 'not_stated' =
        finalTurnDays !== null ? 'days' : (parsedTurn.unit as 'days' | 'hours' | 'not_stated');

      // Sample options + TEC
      const sampleOpts = extractSampleOptions(combinedText);
      const tec = computeTotalExpectedCost(basePrice, sampleOpts);

      // GP review
      const gpStatus = extractGpReviewStatus(combinedText);

      // Biomarkers
      let biomarkers = extractBiomarkersFromHtml(html);
      if (biomarkers.length === 0 && product.bodyHtml) {
        biomarkers = extractBiomarkersFromHtml(product.bodyHtml);
      }
      const biomarkersList = biomarkers.length > 0 ? biomarkers : null;
      const declaredCount = extractBiomarkerCount(combinedText);
      const biomarkerCount = biomarkersList ? biomarkersList.length : declaredCount;

      const description = extractDescription(html) ?? (bodyText ? bodyText.substring(0, 500) : null);
      const category = categoryFor(`${title} ${bodyText} ${product.productType ?? ''} ${(product.tags || []).join(' ')}`);
      const gender = genderFor(`${title} ${bodyText}`);

      const result = await upsertWithProvenance(
        supabase,
        {
          provider_id: PROVIDER_ID,
          provider_test_id: product.handle,
          test_name: title,
          url: product.url,
          price: basePrice,
          was_price: wasPrice,
          collection_fee: sampleOpts.home_kit_fee ?? sampleOpts.self_arrange_fee ?? null,
          home_visit_fee: sampleOpts.home_nurse_fee,
          gp_review_fee: gpStatus === 'Included' ? 0 : null,
          biomarker_count: biomarkerCount,
          biomarkers_list: biomarkersList,
          turnaround_raw: turnaroundRaw,
          turnaround_hours: finalTurnHours,
          turnaround_days: finalTurnDays,
          turnaround_unit: finalTurnUnit,
          sample_type: 'Blood',
          collection_method: 'Home finger-prick kit; optional home nurse or clinic phlebotomy',
          in_stock: inStock,
          scrape_source_url: product.url,
        },
        { scrapeRunId: runId, outOfStock: !inStock },
      );

      if (!result.ok) {
        counters.errors.push({ test: title, message: result.error ?? 'upsert failed' });
        continue;
      }

      if (result.action === 'inserted') counters.tests_new++;
      else if (result.action === 'updated') counters.tests_updated++;

      // Second update pass for CRUX extras + fields not tracked by upsertWithProvenance
      const extras: Record<string, unknown> = {
        url: product.url,
        image_url: product.imageUrl,
        provider_test_id: product.handle,
        description,
        category,
        original_price: wasPrice,
        base_price: basePrice,
        total_expected_cost: tec,
        turnaround_days_text: turnaroundRaw,
        home_kit_available: sampleOpts.home_kit_available,
        clinic_visit_available: sampleOpts.clinic_visit_available,
        home_phlebotomy_option: sampleOpts.home_nurse_available,
        home_phlebotomy_cost: sampleOpts.home_nurse_fee,
        clinic_phlebotomy_cost: sampleOpts.clinic_visit_fee,
        phlebotomy_cost: sampleOpts.clinic_visit_fee,
        phlebotomy_included: sampleOpts.home_kit_available && (sampleOpts.home_kit_fee ?? 0) === 0,
        gp_review_included: gpStatus === 'Included',
        gp_consultation_included: gpStatus === 'Included',
        gender_specific: gender,
        lab_ukas_accredited: true,
        lab_cqc_regulated: true,
        lab_iso15189: true,
        url_verified: true,
        url_verified_at: new Date().toISOString(),
        scraped_at: new Date().toISOString(),
      };
      if (result.providerTestId) {
        const { error: extraErr } = await supabase
          .from('provider_tests')
          .update(extras)
          .eq('id', result.providerTestId);
        if (extraErr) console.warn(`[medichecks] extras update failed for ${title}:`, extraErr.message);
      }

      await new Promise((r) => setTimeout(r, 250));
    }

    await supabase
      .from('scraping_jobs')
      .update({ status: 'completed', error_message: null })
      .eq('provider_id', PROVIDER_ID);

    await finishScrapeRun(supabase, runId, counters, counters.errors.length > 0 ? 'partial' : 'success');

    return new Response(
      JSON.stringify({
        success: true,
        provider: PROVIDER_ID,
        run_id: runId,
        offset,
        limit,
        catalogue_total: products.length,
        processed: scope.length,
        next_offset: offset + scope.length < products.length ? offset + scope.length : null,
        tests_new: counters.tests_new,
        tests_updated: counters.tests_updated,
        errors: counters.errors.slice(0, 10),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('[medichecks] fatal:', message);
    await supabase
      .from('scraping_jobs')
      .update({ status: 'failed', error_message: message })
      .eq('provider_id', PROVIDER_ID);
    await finishScrapeRun(supabase, runId, counters, 'error');
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
