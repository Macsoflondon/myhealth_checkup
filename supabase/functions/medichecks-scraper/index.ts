/**
 * Medichecks scraper — Shopify tags rebuild (v4).
 *
 * Medichecks runs on Shopify. Instead of fetching + parsing 200+ product pages
 * (which times out on the edge runtime), we discover the full catalogue via
 * /products.json and read structured fields from the product `tags` array
 * plus the variant price. Total requests: ~1 per 250 products.
 *
 * Verified tag scheme (22 Jul 2026):
 *   info_biomarkers_{N}                       => biomarker_count = N
 *   info_results_{N}                          => turnaround_days = N
 *   info_sample_blood_sample                  => sample_type = 'Blood'
 *   collection_method_blood_delivery          => free finger-prick home kit
 *   collection_method_blood_in-store          => clinic phlebotomy (£35)
 *   collection_method_blood_nurse-visit       => home nurse phlebotomy (£59)
 *   collection_method_blood_pro               => self-arrange professional (free)
 *
 * base_price = variants[0].price ; TEC = base_price + lowest available fee
 * (free options make TEC == base_price). gp_review_included = true (default).
 *
 * Handles starting `clinic-visit` / `clinic-visits` are partner-clinic LOCATION
 * pages, not tests — we mark those inactive and skip them.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { logProtectedCall } from '../_shared/audit.ts';
import { getErrorMessage } from '../_shared/errors.ts';
import {
  upsertWithProvenance,
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

const CLINIC_PHLEBOTOMY_FEE = 35;
const HOME_NURSE_FEE = 59;

interface ShopifyProduct {
  handle: string;
  title: string;
  tags: string[];
  price: number | null;
  compareAtPrice: number | null;
  productType: string | null;
  bodyHtml: string;
  imageUrl: string | null;
}

async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  const out: ShopifyProduct[] = [];
  for (let page = 1; page <= 25; page++) {
    const url = `${BASE}/products.json?limit=250&page=${page}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      console.warn(`[medichecks] products.json page ${page} => ${res.status}`);
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
      const tags: string[] = Array.isArray(p.tags)
        ? p.tags
        : typeof p.tags === 'string'
        ? p.tags.split(',').map((t: string) => t.trim())
        : [];
      out.push({
        handle: p.handle,
        title: (p.title ?? '').trim(),
        tags,
        price: Number.isFinite(price) && price! > 0 ? price! : null,
        compareAtPrice: Number.isFinite(compareAt) && compareAt! > 0 ? compareAt! : null,
        productType: p.product_type ?? null,
        bodyHtml: p.body_html ?? '',
        imageUrl: firstImage ?? null,
      });
    }
    if (products.length < 250) break;
    await new Promise((r) => setTimeout(r, 150));
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

function isJunkHandle(handle: string): boolean {
  const h = handle.toLowerCase();
  return h.startsWith('clinic-visit') || h.startsWith('clinic-visits');
}

interface ParsedTags {
  biomarkerCount: number | null;
  turnaroundDays: number | null;
  sampleType: string | null;
  homeKitAvailable: boolean;
  clinicVisitAvailable: boolean;
  homeNurseAvailable: boolean;
  selfArrangeAvailable: boolean;
}

function parseTags(tags: string[]): ParsedTags {
  const out: ParsedTags = {
    biomarkerCount: null,
    turnaroundDays: null,
    sampleType: null,
    homeKitAvailable: false,
    clinicVisitAvailable: false,
    homeNurseAvailable: false,
    selfArrangeAvailable: false,
  };
  for (const raw of tags) {
    const t = raw.trim().toLowerCase();
    let m: RegExpMatchArray | null;
    if ((m = t.match(/^info_biomarkers_(\d+)$/))) {
      const n = parseInt(m[1], 10);
      if (n > 0 && n <= 500) out.biomarkerCount = n;
    } else if ((m = t.match(/^info_results_(\d+)$/))) {
      const n = parseInt(m[1], 10);
      if (n > 0 && n <= 60) out.turnaroundDays = n;
    } else if (t === 'info_sample_blood_sample' || t.startsWith('info_sample_blood')) {
      out.sampleType = 'Blood';
    } else if (t === 'collection_method_blood_delivery') {
      out.homeKitAvailable = true;
    } else if (t === 'collection_method_blood_in-store' || t === 'collection_method_blood_in_store') {
      out.clinicVisitAvailable = true;
    } else if (t === 'collection_method_blood_nurse-visit' || t === 'collection_method_blood_nurse_visit') {
      out.homeNurseAvailable = true;
    } else if (t === 'collection_method_blood_pro') {
      out.selfArrangeAvailable = true;
    }
  }
  return out;
}

function computeTEC(basePrice: number | null, p: ParsedTags): number | null {
  if (basePrice === null) return null;
  const fees: number[] = [];
  if (p.homeKitAvailable) fees.push(0);
  if (p.selfArrangeAvailable) fees.push(0);
  if (p.clinicVisitAvailable) fees.push(CLINIC_PHLEBOTOMY_FEE);
  if (p.homeNurseAvailable) fees.push(HOME_NURSE_FEE);
  if (fees.length === 0) return basePrice;
  return basePrice + Math.min(...fees);
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
    method: 'shopify-tags',
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
    console.log(`[medichecks] fetched ${products.length} products from Shopify`);

    let junkSkipped = 0;

    for (const product of products) {
      if (isJunkHandle(product.handle)) {
        junkSkipped++;
        // Ensure any stray active row for a junk handle is marked inactive.
        await supabase
          .from('provider_tests')
          .update({ is_active: false })
          .eq('provider_id', PROVIDER_ID)
          .eq('provider_test_id', product.handle);
        continue;
      }

      const title = product.title;
      if (!title || title.length < 3) {
        counters.errors.push({ test: product.handle, message: 'no title' });
        continue;
      }

      const tagInfo = parseTags(product.tags);
      const basePrice = product.price;
      const wasPrice = product.compareAtPrice && product.compareAtPrice > (basePrice ?? 0)
        ? product.compareAtPrice
        : null;
      const inStock = basePrice !== null && basePrice > 0;
      const tec = computeTEC(basePrice, tagInfo);

      const turnDays = tagInfo.turnaroundDays;
      const turnRaw = turnDays !== null
        ? `Results in ${turnDays} working days (estimated)`
        : null;

      const bodyText = stripHtml(product.bodyHtml || '');
      const description = bodyText ? bodyText.substring(0, 500) : null;
      const productUrl = `${BASE}/products/${product.handle}`;
      const categoryText = `${title} ${bodyText} ${product.productType ?? ''} ${product.tags.join(' ')}`;
      const category = categoryFor(categoryText);
      const gender = genderFor(`${title} ${bodyText}`);

      const result = await upsertWithProvenance(
        supabase,
        {
          provider_id: PROVIDER_ID,
          provider_test_id: product.handle,
          test_name: title,
          url: productUrl,
          price: basePrice,
          was_price: wasPrice,
          collection_fee: tagInfo.homeKitAvailable
            ? 0
            : tagInfo.selfArrangeAvailable
            ? 0
            : null,
          home_visit_fee: tagInfo.homeNurseAvailable ? HOME_NURSE_FEE : null,
          gp_review_fee: 0,
          biomarker_count: tagInfo.biomarkerCount,
          biomarkers_list: null,
          turnaround_raw: turnRaw,
          turnaround_hours: turnDays !== null ? turnDays * 24 : null,
          turnaround_days: turnDays,
          turnaround_unit: turnDays !== null ? 'days' : 'not_stated',
          sample_type: tagInfo.sampleType ?? 'Blood',
          collection_method: 'Home finger-prick kit; optional home nurse or clinic phlebotomy',
          in_stock: inStock,
          scrape_source_url: productUrl,
        },
        { scrapeRunId: runId, outOfStock: !inStock },
      );

      if (!result.ok) {
        counters.errors.push({ test: title, message: result.error ?? 'upsert failed' });
        continue;
      }

      if (result.action === 'inserted') counters.tests_new++;
      else if (result.action === 'updated') counters.tests_updated++;

      const extras: Record<string, unknown> = {
        url: productUrl,
        image_url: product.imageUrl,
        provider_test_id: product.handle,
        description,
        category,
        original_price: wasPrice,
        base_price: basePrice,
        total_expected_cost: tec,
        turnaround_days_text: turnRaw,
        home_kit_available: tagInfo.homeKitAvailable,
        clinic_visit_available: tagInfo.clinicVisitAvailable,
        home_phlebotomy_option: tagInfo.homeNurseAvailable,
        home_phlebotomy_cost: tagInfo.homeNurseAvailable ? HOME_NURSE_FEE : null,
        clinic_phlebotomy_cost: tagInfo.clinicVisitAvailable ? CLINIC_PHLEBOTOMY_FEE : null,
        phlebotomy_cost: tagInfo.clinicVisitAvailable ? CLINIC_PHLEBOTOMY_FEE : null,
        phlebotomy_included: tagInfo.homeKitAvailable || tagInfo.selfArrangeAvailable,
        gp_review_included: true,
        gp_consultation_included: true,
        gender_specific: gender,
        lab_ukas_accredited: true,
        lab_cqc_regulated: true,
        lab_iso15189: true,
        url_verified: true,
        url_verified_at: new Date().toISOString(),
        scraped_at: new Date().toISOString(),
        is_active: true,
      };
      if (result.providerTestId) {
        const { error: extraErr } = await supabase
          .from('provider_tests')
          .update(extras)
          .eq('id', result.providerTestId);
        if (extraErr) console.warn(`[medichecks] extras update failed for ${title}:`, extraErr.message);
      }
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
        method: 'shopify-tags',
        catalogue_total: products.length,
        junk_skipped: junkSkipped,
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
