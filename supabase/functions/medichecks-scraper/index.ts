/**
 * Medichecks scraper — CRUX rebuild.
 *
 * Discovers the full active catalogue via Shopify /products.json, fetches each
 * product page for the field-level detail (turnaround, biomarkers, description),
 * and writes through the shared provenance pipeline so:
 *   - provider_test_history gets a snapshot per row per run (SKILL 08)
 *   - scrape_change_events logs field diffs
 *   - last_validated_at + scrape_source_url are stamped every write
 *   - a scrape_runs summary row is created
 *
 * Never writes £0 to base_price on an active row; if no price is shown, the
 * row is marked in_stock=false and logged. Biomarkers are captured as a
 * de-duplicated list of individual marker names (not just a count).
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

// Medichecks-verified TEC inputs (per locked spec):
//   home finger-prick kit: included (no fee)
//   optional home nurse phlebotomy: £59
//   optional clinic phlebotomy: £35
//   doctor's report/GP review: Included
const HOME_KIT_FEE = 0;
const HOME_NURSE_FEE = 59;
const CLINIC_VISIT_FEE = 35;

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
      if (!res.ok) {
        console.warn(`[medichecks] products.json page ${page} -> ${res.status}`);
        break;
      }
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
          tags: Array.isArray(p.tags) ? p.tags : typeof p.tags === 'string' ? p.tags.split(',').map((t: string) => t.trim()) : [],
          bodyHtml: p.body_html ?? '',
          imageUrl: firstImage ?? null,
        });
      }
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.warn(`[medichecks] products.json page ${page} error:`, getErrorMessage(err));
      break;
    }
  }
  // De-duplicate by handle (case-insensitive)
  const seen = new Set<string>();
  return out.filter((p) => {
    const key = p.handle.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractTurnaroundText(text: string): string | null {
  // Ordered from most-specific to least-specific. Every capture group is the
  // human-readable turnaround phrase — never the surrounding sentence.
  const patterns: RegExp[] = [
    // "Results in 2-3 working days", "Results within 24 hours", "Results typically in 5 days"
    /results?\s+(?:estimated\s+)?(?:in|within|typically\s+in)\s+((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    // "Turnaround: 2 working days", "Turnaround time: 24-48 hours"
    /turnaround(?:\s+time)?[:\-]?\s*((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    // "estimated 2 working days", "typically 5 working days"
    /(?:estimated|typically|approximately|approx\.?)\s+(\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    // Explicit ranges: "2-5 working days", "24-48 hours"
    /(\d+\s*(?:-|to|–)\s*\d+\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    // Bare "N working days (estimated)" — the Medichecks house style
    /(\d+\s+working\s+days?)\s*\(?\s*estimated\s*\)?/i,
    // Bare "N working days" / "N days" / "N hours"
    /\b(\d+\s+working\s+days?)\b/i,
    /\b(\d+\s+(?:business\s+)?days?)\b(?=[^a-z]|$)/i,
    /\b(\d+\s+hours?)\b(?=[^a-z]|$)/i,
    // Verbal same-day / next-day
    /(next\s+working\s+day)/i,
    /(same[\s-]?day)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) {
      const s = m[1].trim().replace(/\s+/g, ' ');
      // Reject nonsense (e.g. "0 days", years like "2024 days")
      const numMatch = s.match(/(\d+)/);
      if (numMatch) {
        const n = parseInt(numMatch[1], 10);
        if (n === 0 || n > 60) continue;
      }
      return s;
    }
  }
  return null;
}

function extractDescription(html: string): string | null {
  const meta = html.match(/name="description"\s+content="([^"]+)"/i)
    || html.match(/property="og:description"\s+content="([^"]+)"/i);
  if (meta && meta[1]) return meta[1].trim().substring(0, 500);
  return null;
}

// Extract biomarkers from a "What's included" / "Biomarkers" style list in the
// product HTML. Prefers <li> items inside a matching section; falls back to
// normalising strings found on the page.
function extractBiomarkersFromHtml(html: string): string[] {
  const items = new Set<string>();

  // Try to locate a biomarker/what's-included section and pull <li> text.
  const sectionRe = /(what['']?s\s+included|biomarkers?\s+tested|biomarkers?\s+included|what\s+we\s+test)[\s\S]{0,8000}/i;
  const sectionMatch = html.match(sectionRe);
  const searchScope = sectionMatch ? sectionMatch[0] : html;
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(searchScope)) !== null) {
    const text = stripHtml(m[1]);
    if (!text || text.length < 2 || text.length > 80) continue;
    // Reject navigation/marketing junk
    if (/\b(add to|buy|log in|sign up|reviews?|blog|shipping|delivery|privacy|cookie)\b/i.test(text)) continue;
    items.add(text);
    if (items.size > 200) break;
  }

  const list = Array.from(items);
  const normalised = normaliseBiomarkers(list);
  return normalised;
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
        'User-Agent': 'Mozilla/5.0 (compatible; MyHealthCheckup/1.0; +https://myhealthcheckup.co.uk)',
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

  const supabase = createClient(supabaseUrl, supabaseKey);
  const counters = newCounters();
  const runId = await startScrapeRun(supabase, PROVIDER_ID, 'medichecks-scraper', {
    started_at: new Date().toISOString(),
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

    console.log('[medichecks] discovering products via /products.json...');
    const products = await fetchShopifyProducts();
    console.log(`[medichecks] ${products.length} unique products discovered`);
    counters.tests_seen = products.length;

    // Optional: cap per-run for edge runtime safety
    const MAX_PER_RUN = 200;
    const scope = products.slice(0, MAX_PER_RUN);

    for (const product of scope) {
      const html = (await fetchProductHtml(product.url)) ?? '';
      const bodyText = stripHtml(product.bodyHtml || '');
      const combinedText = `${bodyText} ${stripHtml(html)}`;

      const title = product.title || extractTitleFromHtml(html, product.handle);
      if (!title || title.length < 3) {
        counters.errors.push({ test: product.handle, message: 'no title' });
        continue;
      }

      // Price handling: Shopify variant price is authoritative.
      const basePrice = product.price;
      const wasPrice = product.compareAtPrice && product.compareAtPrice > (basePrice ?? 0)
        ? product.compareAtPrice
        : null;
      const inStock = basePrice !== null && basePrice > 0;

      // Turnaround — try structured extraction from combined text
      const turnaroundRaw = extractTurnaroundText(combinedText);
      const parsedTurn = parseTurnaround(turnaroundRaw);

      // Biomarkers — prefer HTML list; fall back to body_html list; else null
      let biomarkers = extractBiomarkersFromHtml(html);
      if (biomarkers.length === 0 && product.bodyHtml) {
        biomarkers = extractBiomarkersFromHtml(product.bodyHtml);
      }
      const biomarkersList = biomarkers.length > 0 ? biomarkers : null;
      const biomarkerCount = biomarkersList ? biomarkersList.length : null;

      const description = extractDescription(html) ?? (bodyText ? bodyText.substring(0, 500) : null);
      const category = categoryFor(`${title} ${bodyText} ${product.productType ?? ''} ${(product.tags || []).join(' ')}`);
      const gender = genderFor(`${title} ${bodyText}`);

      // Provenance upsert (handles history + change events + safety rails)
      const result = await upsertWithProvenance(
        supabase,
        {
          provider_id: PROVIDER_ID,
          provider_test_id: product.handle,
          test_name: title,
          url: product.url,
          price: basePrice,
          was_price: wasPrice,
          collection_fee: HOME_KIT_FEE,
          home_visit_fee: HOME_NURSE_FEE,
          gp_review_fee: 0,
          total_expected_cost: basePrice ?? null,
          biomarker_count: biomarkerCount,
          biomarkers_list: biomarkersList,
          turnaround_raw: turnaroundRaw,
          turnaround_hours: parsedTurn.hours,
          turnaround_days: parsedTurn.days,
          turnaround_unit: parsedTurn.unit,
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

      // Second update pass for fields not tracked by upsertWithProvenance
      const extras: Record<string, unknown> = {
        url: product.url,
        image_url: product.imageUrl,
        provider_test_id: product.handle,
        description,
        category,
        original_price: wasPrice,
        home_kit_available: true,
        clinic_visit_available: true,
        phlebotomy_included: true,
        home_phlebotomy_cost: HOME_NURSE_FEE,
        clinic_phlebotomy_cost: CLINIC_VISIT_FEE,
        gp_review_included: true,
        gp_consultation_included: true,
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

      // Small delay to be polite
      await new Promise((r) => setTimeout(r, 400));
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
        tests_seen: counters.tests_seen,
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
