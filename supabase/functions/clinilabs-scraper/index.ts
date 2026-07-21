/**
 * Clinilabs scraper — CRUX rebuild.
 * Shopify /products.json is authoritative. Writes through the shared
 * provenance pipeline (history + change events + safety rails).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
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

const PROVIDER_ID = 'clinilabs';
const SHOPIFY_BASE = 'https://www.clinilabs.co.uk';

// Clinilabs: clinic-only phlebotomy; venous blood; phlebotomy fee assumed included in list price.
const HOME_KIT_AVAILABLE = false;
const CLINIC_VISIT_FEE = 0;

interface ShopifyVariant { price: string; compare_at_price: string | null; available: boolean; sku: string }
interface ShopifyProduct {
  id: number; title: string; handle: string; body_html: string; product_type: string;
  tags: string[]; variants: ShopifyVariant[]; images: { src: string }[];
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function determineCategory(title: string, description: string, tags: string[]): string {
  const text = (title + ' ' + description + ' ' + tags.join(' ')).toLowerCase();
  if (/cancer|tumour|psa|ca125|cea/.test(text)) return 'Cancer Screening';
  if (/heart|cardiovascular|cholesterol|lipid|cardiac/.test(text)) return 'Heart Health';
  if (/diabetes|glucose|hba1c/.test(text)) return 'Diabetes';
  if (/thyroid|tsh|t3|t4/.test(text)) return 'Thyroid';
  if (/fertility|amh|ovarian/.test(text)) return 'Fertility';
  if (/menopause|female|women|pcos/.test(text)) return "Women's Health";
  if (/testosterone|prostate|men's|male/.test(text)) return "Men's Health";
  if (/sti|std|sexual|hepatitis|hiv/.test(text)) return 'Sexual Health';
  if (/sport|fitness|performance/.test(text)) return 'Sports & Fitness';
  if (/vitamin|mineral|b12|folate/.test(text)) return 'Vitamins & Minerals';
  if (/iron|ferritin|anaemia/.test(text)) return 'Iron & Anaemia';
  if (/liver|hepatic/.test(text)) return 'Liver Function';
  if (/kidney|renal/.test(text)) return 'Kidney Function';
  if (/hormone|cortisol|dhea/.test(text)) return 'Hormones';
  return 'General Health';
}

function extractBiomarkersFromHtml(html: string): string[] {
  const items = new Set<string>();
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(html)) !== null) {
    const text = stripHtml(m[1]);
    if (!text || text.length < 2 || text.length > 80) continue;
    if (/\b(add to|buy|log in|reviews?|delivery|privacy)\b/i.test(text)) continue;
    items.add(text);
    if (items.size > 200) break;
  }
  return normaliseBiomarkers(Array.from(items));
}

function extractTurnaroundText(text: string): string | null {
  const patterns: RegExp[] = [
    /results?\s+(?:in|within|typically\s+in)\s+((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /turnaround(?:\s+time)?[:\-]?\s*((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /(\d+\s*(?:-|to|–)\s*\d+\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /\b(\d+\s+working\s+days?)\b/i,
    /\b(\d+\s+(?:business\s+)?days?)\b(?=[^a-z]|$)/i,
    /\b(\d+\s+hours?)\b(?=[^a-z]|$)/i,
    /(next\s+working\s+day)/i,
    /(same[\s-]?day)/i,
  ];
  for (const re of patterns) {
    const mm = text.match(re);
    if (mm && mm[1]) {
      const s = mm[1].trim().replace(/\s+/g, ' ');
      const num = s.match(/(\d+)/);
      if (num) {
        const n = parseInt(num[1], 10);
        if (n === 0 || n > 60) continue;
      }
      return s;
    }
  }
  return null;
}

async function fetchShopifyPage(page: number): Promise<ShopifyProduct[]> {
  const url = `${SHOPIFY_BASE}/products.json?limit=250&page=${page}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'MyHealthCheckup/1.0', 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Shopify products.json HTTP ${res.status}`);
  const json = await res.json();
  return json.products || [];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
  const counters = newCounters();
  const runId = await startScrapeRun(supabase, PROVIDER_ID, 'clinilabs-scraper', {
    started_at: new Date().toISOString(),
  });

  try {
    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'running', last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    const all: ShopifyProduct[] = [];
    for (let page = 1; page <= 10; page++) {
      const batch = await fetchShopifyPage(page);
      if (batch.length === 0) break;
      all.push(...batch);
      if (batch.length < 250) break;
    }
    console.log(`[clinilabs] ${all.length} products`);
    counters.tests_seen = all.length;

    for (const p of all) {
      const variant = p.variants?.[0];
      const priceNum = variant ? parseFloat(variant.price) : NaN;
      const price = Number.isFinite(priceNum) && priceNum > 0 ? priceNum : null;
      const wasNum = variant?.compare_at_price ? parseFloat(variant.compare_at_price) : NaN;
      const wasPrice = Number.isFinite(wasNum) && wasNum > (price ?? 0) ? wasNum : null;
      const inStock = variant?.available !== false && price !== null;

      const bodyText = stripHtml(p.body_html || '');
      const biomarkers = extractBiomarkersFromHtml(p.body_html || '');
      const biomarkersList = biomarkers.length > 0 ? biomarkers : null;
      const biomarkerCount = biomarkersList?.length ?? null;
      const turnaroundRaw = extractTurnaroundText(bodyText);
      const parsedTurn = parseTurnaround(turnaroundRaw);
      const category = determineCategory(p.title, bodyText, p.tags || []);
      const url = `${SHOPIFY_BASE}/products/${p.handle}`;

      const result = await upsertWithProvenance(supabase, {
        provider_id: PROVIDER_ID,
        provider_test_id: `clinilabs-${p.handle}`,
        test_name: p.title,
        url,
        price,
        was_price: wasPrice,
        collection_fee: CLINIC_VISIT_FEE,
        home_visit_fee: null,
        gp_review_fee: 0,
        total_expected_cost: price,
        biomarker_count: biomarkerCount,
        biomarkers_list: biomarkersList,
        turnaround_raw: turnaroundRaw,
        turnaround_hours: parsedTurn.hours,
        turnaround_days: parsedTurn.days,
        turnaround_unit: parsedTurn.unit,
        sample_type: 'Venous blood',
        collection_method: 'Clinic phlebotomy',
        in_stock: inStock,
        scrape_source_url: url,
      }, { scrapeRunId: runId, outOfStock: !inStock });

      if (!result.ok) { counters.errors.push({ test: p.title, message: result.error ?? 'upsert failed' }); continue; }
      if (result.action === 'inserted') counters.tests_new++;
      else if (result.action === 'updated') counters.tests_updated++;

      if (result.providerTestId) {
        await supabase.from('provider_tests').update({
          description: bodyText.substring(0, 500) || `${p.title} from Clinilabs.`,
          category,
          image_url: p.images?.[0]?.src ?? null,
          original_price: wasPrice,
          home_kit_available: HOME_KIT_AVAILABLE,
          clinic_visit_available: true,
          phlebotomy_included: true,
          clinic_phlebotomy_cost: CLINIC_VISIT_FEE,
          lab_ukas_accredited: true,
          url_verified: true,
          url_verified_at: new Date().toISOString(),
          scraped_at: new Date().toISOString(),
        }).eq('id', result.providerTestId);
      }
    }

    await supabase.from('scraping_jobs').update({
      status: 'completed', error_message: null,
      next_scrape: new Date(Date.now() + 24 * 3600000).toISOString(),
      last_test_count: counters.tests_new + counters.tests_updated,
    }).eq('provider_id', PROVIDER_ID);

    await finishScrapeRun(supabase, runId, counters, counters.errors.length > 0 ? 'partial' : 'success');
    return new Response(JSON.stringify({
      success: true, provider: PROVIDER_ID, run_id: runId,
      tests_seen: counters.tests_seen, tests_new: counters.tests_new, tests_updated: counters.tests_updated,
      errors: counters.errors.slice(0, 10),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error('[clinilabs] fatal:', msg);
    await supabase.from('scraping_jobs').update({ status: 'failed', error_message: msg }).eq('provider_id', PROVIDER_ID);
    await finishScrapeRun(supabase, runId, counters, 'error');
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
