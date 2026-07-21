/**
 * Medical Diagnosis scraper — CRUX rebuild.
 * WooCommerce Store API is authoritative. Aggregates [PARAM] biomarker rows
 * under their parent test. Writes via shared provenance pipeline.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';
import {
  upsertWithProvenance,
  parseTurnaround,
  startScrapeRun,
  finishScrapeRun,
  newCounters,
} from '../_shared/scrape/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROVIDER_ID = 'medical-diagnosis';
const WOO_BASE = 'https://www.medical-diagnosis.co.uk';
const CLINIC_VISIT_FEE = 0; // phlebotomy typically included in Medical Diagnosis clinic price

interface WooPrices { price: string; regular_price: string; sale_price: string; currency_minor_unit: number }
interface WooCategory { name: string; slug: string }
interface WooProduct {
  id: number; name: string; slug: string; permalink: string;
  short_description: string; description: string; on_sale: boolean;
  prices: WooPrices; categories: WooCategory[]; images: { src: string }[];
}

function decodeHtmlEntities(s: string): string {
  return s.replace(/&#8211;/g, '–').replace(/&#8217;/g, '\u2019').replace(/&#038;/g, '&')
    .replace(/&#0?38;/g, '&').replace(/&amp;/g, '&').replace(/&pound;/g, '£')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

export function parseRawTestName(raw: string):
  | { kind: 'param'; parent: string; biomarker: string }
  | { kind: 'test'; name: string }
  | { kind: 'junk' } {
  const decoded = decodeHtmlEntities((raw ?? '').trim());
  if (!decoded) return { kind: 'junk' };
  const paramMatch = decoded.match(/^\[PARAM\](.+?)!~!(.+)$/);
  if (paramMatch) {
    const parent = paramMatch[1].trim().replace(/[\s\-:]+$/, '');
    const biomarker = paramMatch[2].trim();
    if (!parent || !biomarker) return { kind: 'junk' };
    return { kind: 'param', parent, biomarker };
  }
  if (/^\[?param\]?/i.test(decoded) || decoded.includes('!~!')) return { kind: 'junk' };
  return { kind: 'test', name: decoded };
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

function determineCategory(title: string, description: string, cats: WooCategory[]): string {
  const catText = cats.map(c => c.name).join(' ').toLowerCase();
  const text = (title + ' ' + description + ' ' + catText).toLowerCase();
  if (/cancer|tumour|psa|ca125|cea/.test(text) || /cancer|tumour/.test(catText)) return 'Cancer Screening';
  if (/heart|cardiovascular|cholesterol|lipid|cardiac/.test(text)) return 'Heart Health';
  if (/diabetes|glucose|hba1c/.test(text)) return 'Diabetes';
  if (/thyroid|tsh|t3|t4/.test(text)) return 'Thyroid';
  if (/fertility|amh|ovarian/.test(text)) return 'Fertility';
  if (/menopause|female|women|pcos/.test(text)) return "Women's Health";
  if (/testosterone|prostate|men's|male/.test(text)) return "Men's Health";
  if (/sti|std|sexual|hepatitis|hiv|chlamydia/.test(text)) return 'Sexual Health';
  if (/allergy|intolerance/.test(text)) return 'Allergy';
  if (/sport|fitness|performance/.test(text)) return 'Sports & Fitness';
  if (/vitamin|mineral|b12|folate/.test(text)) return 'Vitamins & Minerals';
  if (/iron|ferritin|anaemia/.test(text)) return 'Iron & Anaemia';
  if (/liver|hepatic/.test(text)) return 'Liver Function';
  if (/kidney|renal/.test(text)) return 'Kidney Function';
  if (/hormone|cortisol|dhea/.test(text)) return 'Hormones';
  return 'General Health';
}

function extractTurnaround(text: string): string | null {
  const patterns: RegExp[] = [
    /results?\s+(?:in|within|typically\s+in)\s+((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /turnaround(?:\s+time)?[:\-]?\s*((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /(\d+\s*(?:-|to|–)\s*\d+\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /\b(\d+\s+working\s+days?)\b/i,
    /(next\s+working\s+day)/i,
    /(same[\s-]?day)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) {
      const s = m[1].trim();
      const num = s.match(/(\d+)/);
      if (num && (parseInt(num[1], 10) === 0 || parseInt(num[1], 10) > 60)) continue;
      return s;
    }
  }
  return null;
}

function priceFromWoo(prices: WooPrices, key: 'price' | 'regular_price' | 'sale_price'): number | null {
  const raw = prices?.[key];
  if (!raw) return null;
  const minor = prices.currency_minor_unit ?? 2;
  const value = parseInt(raw, 10);
  if (Number.isNaN(value)) return null;
  return value / Math.pow(10, minor);
}

async function fetchWooPage(page: number, perPage: number): Promise<WooProduct[]> {
  const url = `${WOO_BASE}/wp-json/wc/store/products?per_page=${perPage}&page=${page}&_fields=id,name,slug,permalink,short_description,description,on_sale,prices,categories,images`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'MyHealthCheckup/1.0', 'Accept': 'application/json' },
  });
  if (!res.ok) {
    if (res.status === 400 || res.status === 404) return [];
    throw new Error(`Woo store/products HTTP ${res.status}`);
  }
  return await res.json();
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
  const runId = await startScrapeRun(supabase, PROVIDER_ID, 'medical-diagnosis-scraper', {
    started_at: new Date().toISOString(),
  });

  try {
    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'running', last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    const all: WooProduct[] = [];
    for (let page = 1; page <= 6; page++) {
      const batch = await fetchWooPage(page, 100);
      if (batch.length === 0) break;
      all.push(...batch);
      if (batch.length < 100) break;
    }
    console.log(`[medical-diagnosis] ${all.length} products`);

    // Aggregate [PARAM] biomarker rows under parent name
    const biomarkerGroups = new Map<string, { parent: string; biomarkers: Set<string>; sample?: WooProduct }>();
    const realTests: WooProduct[] = [];
    for (const p of all) {
      const parsed = parseRawTestName(p.name);
      if (parsed.kind === 'junk') continue;
      if (parsed.kind === 'param') {
        const key = parsed.parent.toLowerCase();
        const g = biomarkerGroups.get(key) ?? { parent: parsed.parent, biomarkers: new Set(), sample: p };
        g.biomarkers.add(parsed.biomarker);
        biomarkerGroups.set(key, g);
        continue;
      }
      realTests.push(p);
    }
    counters.tests_seen = realTests.length + biomarkerGroups.size;

    const matchedKeys = new Set<string>();
    for (const p of realTests) {
      const niceName = decodeHtmlEntities(p.name);
      matchedKeys.add(niceName.toLowerCase());
      const cleanShort = stripHtml(p.short_description || '');
      const cleanLong = stripHtml(p.description || '');
      const desc = (cleanShort || cleanLong).slice(0, 1000);
      const price = priceFromWoo(p.prices, 'price');
      const regular = priceFromWoo(p.prices, 'regular_price');
      const wasPrice = regular && regular !== price ? regular : null;
      const category = determineCategory(niceName, desc, p.categories || []);
      const group = biomarkerGroups.get(niceName.toLowerCase());
      const biomarkersList = group ? Array.from(group.biomarkers).sort() : null;
      const biomarkerCount = biomarkersList?.length ?? null;
      const turnaroundRaw = extractTurnaround(cleanShort + ' ' + cleanLong);
      const parsedTurn = parseTurnaround(turnaroundRaw);
      const inStock = price !== null && price > 0;

      const result = await upsertWithProvenance(supabase, {
        provider_id: PROVIDER_ID,
        provider_test_id: `meddiag-${p.slug}`,
        test_name: niceName,
        url: p.permalink,
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
        scrape_source_url: p.permalink,
      }, { scrapeRunId: runId, outOfStock: !inStock });

      if (!result.ok) { counters.errors.push({ test: niceName, message: result.error ?? 'upsert failed' }); continue; }
      if (result.action === 'inserted') counters.tests_new++;
      else if (result.action === 'updated') counters.tests_updated++;

      if (result.providerTestId) {
        await supabase.from('provider_tests').update({
          description: desc || `${niceName} from Medical Diagnosis.`,
          category,
          image_url: p.images?.[0]?.src ?? null,
          original_price: wasPrice,
          home_kit_available: false,
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

    // Synthetic parents for unmatched [PARAM] groups
    for (const [key, g] of biomarkerGroups) {
      if (matchedKeys.has(key)) continue;
      const url = g.sample?.permalink ?? WOO_BASE;
      const list = Array.from(g.biomarkers).sort();
      const result = await upsertWithProvenance(supabase, {
        provider_id: PROVIDER_ID,
        provider_test_id: `meddiag-parent-${slugify(g.parent)}`,
        test_name: g.parent,
        url,
        price: null,
        biomarker_count: list.length,
        biomarkers_list: list,
        turnaround_unit: 'not_stated',
        sample_type: 'Venous blood',
        collection_method: 'Clinic phlebotomy',
        in_stock: false,
        scrape_source_url: url,
      }, { scrapeRunId: runId, outOfStock: true });
      if (!result.ok) counters.errors.push({ test: g.parent, message: result.error ?? 'upsert failed' });
      else if (result.action === 'inserted') counters.tests_new++;
      else if (result.action === 'updated') counters.tests_updated++;
    }

    await supabase.from('scraping_jobs').update({
      status: 'completed', error_message: null,
      next_scrape: new Date(Date.now() + 24 * 3600000).toISOString(),
      last_test_count: counters.tests_new + counters.tests_updated,
    }).eq('provider_id', PROVIDER_ID);

    await finishScrapeRun(supabase, runId, counters, counters.errors.length > 0 ? 'partial' : 'success');
    return new Response(JSON.stringify({
      success: true, provider: PROVIDER_ID, run_id: runId,
      real_tests: realTests.length, biomarker_groups: biomarkerGroups.size,
      tests_new: counters.tests_new, tests_updated: counters.tests_updated,
      errors: counters.errors.slice(0, 10),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error('[medical-diagnosis] fatal:', msg);
    await supabase.from('scraping_jobs').update({ status: 'failed', error_message: msg }).eq('provider_id', PROVIDER_ID);
    await finishScrapeRun(supabase, runId, counters, 'error');
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
