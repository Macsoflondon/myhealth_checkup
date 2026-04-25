import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROVIDER_ID = 'clinilabs';
const SHOPIFY_BASE = 'https://www.clinilabs.co.uk'; // Note: .co.uk, not .com (.com is a US CRO)

interface ShopifyVariant {
  price: string;
  compare_at_price: string | null;
  available: boolean;
  sku: string;
}
interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  product_type: string;
  tags: string[];
  variants: ShopifyVariant[];
  images: { src: string }[];
}

function determineCategory(title: string, description: string, tags: string[]): string {
  const text = (title + ' ' + description + ' ' + tags.join(' ')).toLowerCase();
  if (text.match(/cancer|tumour|psa|ca125|cea/)) return 'Cancer Screening';
  if (text.match(/heart|cardiovascular|cholesterol|lipid|cardiac/)) return 'Heart Health';
  if (text.match(/diabetes|glucose|hba1c/)) return 'Diabetes';
  if (text.match(/thyroid|tsh|t3|t4/)) return 'Thyroid';
  if (text.match(/fertility|amh|ovarian/)) return 'Fertility';
  if (text.match(/menopause|female|women|pcos/)) return "Women's Health";
  if (text.match(/testosterone|prostate|men's|male/)) return "Men's Health";
  if (text.match(/sti|std|sexual|hepatitis|hiv/)) return 'Sexual Health';
  if (text.match(/sport|fitness|performance/)) return 'Sports & Fitness';
  if (text.match(/vitamin|mineral|b12|folate/)) return 'Vitamins & Minerals';
  if (text.match(/iron|ferritin|anaemia/)) return 'Iron & Anaemia';
  if (text.match(/liver|hepatic/)) return 'Liver Function';
  if (text.match(/kidney|renal/)) return 'Kidney Function';
  if (text.match(/hormone|cortisol|dhea/)) return 'Hormones';
  return 'General Health';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractBiomarkerCount(text: string): number | null {
  const m = text.match(/(\d{1,3})\s*(?:biomarkers?|tests?|markers?|analytes?)/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n > 0 && n < 500) return n;
  }
  return null;
}

async function fetchShopifyPage(page: number): Promise<ShopifyProduct[]> {
  const url = `${SHOPIFY_BASE}/products.json?limit=250&page=${page}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'MyHealthCheckup/1.0 (+https://www.myhealthcheckup.co.uk)',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Shopify products.json HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.products || [];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Starting Clinilabs scraper (Shopify products.json)...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID,
      status: 'running',
      last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    // Paginate Shopify products.json (returns up to 250 per page)
    const allProducts: ShopifyProduct[] = [];
    for (let page = 1; page <= 10; page++) {
      const batch = await fetchShopifyPage(page);
      if (batch.length === 0) break;
      allProducts.push(...batch);
      if (batch.length < 250) break;
    }

    console.log(`Fetched ${allProducts.length} Clinilabs products`);

    const rows = allProducts.map((p) => {
      const variant = p.variants?.[0];
      const price = variant ? parseFloat(variant.price) : null;
      const originalPrice = variant?.compare_at_price ? parseFloat(variant.compare_at_price) : null;
      const cleanDesc = stripHtml(p.body_html || '').slice(0, 1000);
      const category = determineCategory(p.title, cleanDesc, p.tags || []);
      const biomarkerCount = extractBiomarkerCount(cleanDesc);

      return {
        provider_id: PROVIDER_ID,
        provider_test_id: `clinilabs-${p.handle}`,
        test_name: p.title,
        category,
        price,
        original_price: originalPrice,
        description: cleanDesc || `${p.title} from Clinilabs.`,
        url: `${SHOPIFY_BASE}/products/${p.handle}`,
        image_url: p.images?.[0]?.src ?? null,
        is_active: variant?.available !== false,
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

    let upsertedCount = 0;
    const upsertErrors: string[] = [];

    // Dedupe by Shopify handle (slug) — guaranteed unique per product upstream.
    // provider_test_id already encodes the slug (`clinilabs-${handle}`), so this
    // also satisfies the (provider_id, provider_test_id) upsert conflict target.
    const seenSlugs = new Set<string>();
    const dedupedRows = rows.filter((r) => {
      const key = (r.provider_test_id || r.test_name).toLowerCase().trim();
      if (seenSlugs.has(key)) return false;
      seenSlugs.add(key);
      return true;
    });

    // Batch upsert in chunks of 50 to avoid payload limits
    for (let i = 0; i < dedupedRows.length; i += 50) {
      const chunk = dedupedRows.slice(i, i + 50);
      const { error } = await supabase
        .from('provider_tests')
        .upsert(chunk, { onConflict: 'provider_id,provider_test_id' });
      if (error) {
        upsertErrors.push(getErrorMessage(error));
      } else {
        upsertedCount += chunk.length;
      }
    }

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
      testsUpserted: upsertedCount,
      upsertErrors: upsertErrors.slice(0, 5),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    const errMsg = getErrorMessage(error);
    console.error('Clinilabs scraper error:', errMsg);
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
