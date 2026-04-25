import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';
import { upsertProviderTests } from '../_shared/provider-upsert.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROVIDER_ID = 'medical-diagnosis';
// WooCommerce site (correct domain has hyphen). The .net mirror serves the same DB.
const WOO_BASE = 'https://www.medical-diagnosis.co.uk';

interface WooPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_minor_unit: number;
}
interface WooCategory { name: string; slug: string }
interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: WooPrices;
  categories: WooCategory[];
  images: { src: string }[];
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&amp;/g, '&')
    .replace(/&pound;/g, '£')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"');
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function determineCategory(title: string, description: string, cats: WooCategory[]): string {
  const catText = cats.map(c => c.name).join(' ').toLowerCase();
  const text = (title + ' ' + description + ' ' + catText).toLowerCase();
  if (catText.match(/cancer|tumour/) || text.match(/cancer|tumour|psa|ca125|cea/)) return 'Cancer Screening';
  if (text.match(/heart|cardiovascular|cholesterol|lipid|cardiac/)) return 'Heart Health';
  if (text.match(/diabetes|glucose|hba1c/)) return 'Diabetes';
  if (text.match(/thyroid|tsh|t3|t4/)) return 'Thyroid';
  if (text.match(/fertility|amh|ovarian/)) return 'Fertility';
  if (text.match(/menopause|female|women|pcos/)) return "Women's Health";
  if (text.match(/testosterone|prostate|men's|male/)) return "Men's Health";
  if (text.match(/sti|std|sexual|hepatitis|hiv|chlamydia/)) return 'Sexual Health';
  if (text.match(/allergy|intolerance/)) return 'Allergy';
  if (text.match(/sport|fitness|performance/)) return 'Sports & Fitness';
  if (text.match(/vitamin|mineral|b12|folate/)) return 'Vitamins & Minerals';
  if (text.match(/iron|ferritin|anaemia/)) return 'Iron & Anaemia';
  if (text.match(/liver|hepatic/)) return 'Liver Function';
  if (text.match(/kidney|renal/)) return 'Kidney Function';
  if (text.match(/hormone|cortisol|dhea/)) return 'Hormones';
  return 'General Health';
}

function extractBiomarkerCount(text: string): number | null {
  const m = text.match(/(\d{1,3})\s*(?:biomarkers?|tests?|markers?|analytes?)/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n > 0 && n < 500) return n;
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
    headers: {
      'User-Agent': 'MyHealthCheckup/1.0 (+https://www.myhealthcheckup.co.uk)',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    if (res.status === 400 || res.status === 404) return []; // past last page
    throw new Error(`Woo store/products HTTP ${res.status}`);
  }
  return await res.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Starting Medical Diagnosis scraper (Woo Store API)...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID,
      status: 'running',
      last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    const perPage = 100;
    const all: WooProduct[] = [];
    // Cap at 6 pages = 600 products to keep within edge-function CPU budget; site reports ~1737
    for (let page = 1; page <= 6; page++) {
      const batch = await fetchWooPage(page, perPage);
      if (batch.length === 0) break;
      all.push(...batch);
      if (batch.length < perPage) break;
    }

    console.log(`Fetched ${all.length} Medical Diagnosis products`);

    const rows = all.map((p) => {
      const cleanShort = stripHtml(p.short_description || '');
      const cleanLong = stripHtml(p.description || '');
      const desc = (cleanShort || cleanLong).slice(0, 1000);
      const price = priceFromWoo(p.prices, 'price');
      const regular = priceFromWoo(p.prices, 'regular_price');
      const category = determineCategory(p.name, desc, p.categories || []);
      const biomarkerCount = extractBiomarkerCount(cleanShort + ' ' + cleanLong);

      return {
        provider_id: PROVIDER_ID,
        provider_test_id: `meddiag-${p.slug}`,
        test_name: decodeHtmlEntities(p.name),
        category,
        price,
        original_price: regular && regular !== price ? regular : null,
        description: desc || `${decodeHtmlEntities(p.name)} from Medical Diagnosis.`,
        url: p.permalink,
        image_url: p.images?.[0]?.src ?? null,
        is_active: true,
        biomarker_count: biomarkerCount,
        sample_type: 'Venous blood',
        clinic_visit_available: true,
        home_kit_available: false,
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        url_verified: true,
        url_verified_at: new Date().toISOString(),
      };
    });

    const { upsertedCount, errors: upsertErrors, finalRowCount } =
      await upsertProviderTests(supabase as any, PROVIDER_ID, rows, 'meddiag-');

    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID,
      status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 24 * 3600000).toISOString(),
      last_test_count: upsertedCount,
      error_message: upsertErrors.length ? upsertErrors.slice(0, 3).join('; ') : null,
    }, { onConflict: 'provider_id' });

    return new Response(JSON.stringify({
      success: true,
      provider: PROVIDER_ID,
      testsScraped: rows.length,
      testsAfterDedupe: finalRowCount,
      testsUpserted: upsertedCount,
      upsertErrors: upsertErrors.slice(0, 5),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    const errMsg = getErrorMessage(error);
    console.error('Medical Diagnosis scraper error:', errMsg);
    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID,
      status: 'failed',
      error_message: errMsg,
      last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });
    return new Response(JSON.stringify({ success: false, error: errMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
