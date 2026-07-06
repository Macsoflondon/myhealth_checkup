import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOLA_COLLECTION_PRODUCTS_URL = 'https://lolahealth.com/collections/blood-tests/products.json?limit=250';

function normalizeUrl(url: string | null | undefined, baseUrl: string) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return new URL(url, baseUrl).toString();
  return null;
}

function extractCollectionBasePrice(product: any): number | null {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const numericPrices = variants
    .map((variant: any) => Number(variant?.price))
    .filter((value: number) => Number.isFinite(value));

  if (numericPrices.length === 0) return null;
  return Math.min(...numericPrices);
}

async function fetchLolaCollectionProducts(): Promise<any[]> {
  const response = await fetch(LOLA_COLLECTION_PRODUCTS_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; LovableBot/1.0; +https://lovable.dev)',
      Accept: 'application/json,text/plain,*/*',
    },
  });

  if (!response.ok) throw new Error(`Lola collection fetch failed: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data?.products) ? data.products : [];
}

/**
 * Firecrawl HTML fallback: when Shopify's /products.json 503s, scrape the
 * collection page (rendered HTML) via Firecrawl and extract product handles.
 * Returns lightweight product stubs compatible with collectionByHandle
 * (handle + best-effort image_url; price left null so the markdown parser wins).
 */
async function fetchLolaCollectionViaFirecrawl(apiKey: string): Promise<any[]> {
  const result = await firecrawlScrape(
    'https://lolahealth.com/collections/blood-tests',
    apiKey,
    { formats: ['html', 'markdown'], onlyMainContent: false, waitFor: 2000, timeout: 60000, proxy: 'stealth' },
  );
  if (!result.success || !result.data) return [];

  const html: string = result.data.html || '';
  const markdown: string = result.data.markdown || '';
  const handles = new Set<string>();

  for (const m of html.matchAll(/\/products\/([a-z0-9-]+)(?:["'?#/]|$)/gi)) handles.add(m[1]);
  for (const m of markdown.matchAll(/\/products\/([a-z0-9-]+)/gi)) handles.add(m[1]);

  const stubs: any[] = [];
  for (const handle of handles) {
    if (handle.includes('subscription')) continue;
    // Best-effort image extraction: nearest <img src=""> after the handle in HTML
    const imgRe = new RegExp(`/products/${handle}[^"']*["'][^>]*>[\\s\\S]{0,400}?<img[^>]+src=["']([^"']+)`, 'i');
    const imgMatch = html.match(imgRe);
    stubs.push({
      handle,
      variants: [],
      image: imgMatch ? { src: imgMatch[1] } : null,
      images: imgMatch ? [{ src: imgMatch[1] }] : [],
    });
  }
  console.log(`[fallback] Firecrawl collection scrape recovered ${stubs.length} product handles`);
  return stubs;
}

function determineCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  if (text.match(/liver|albumin|alt|ast|alp|bilirubin|ggt/)) return 'Liver Function';
  if (text.match(/heart|cardiovascular|cholesterol|apolipoprotein|lipid/)) return 'Heart Health';
  if (text.match(/fertility|amh|antimullerian|ovarian/)) return 'Fertility';
  if (text.match(/thyroid|tsh|t3|t4|thyroxine/)) return 'Thyroid';
  if (text.match(/vitamin|mineral|b12|d3|folate|iron|ferritin/)) return 'Vitamins & Minerals';
  if (text.match(/diabetes|glucose|hba1c|insulin/)) return 'Diabetes';
  if (text.match(/women|female|menopause|oestrogen|progesterone/)) return "Women's Health";
  if (text.match(/men|male|testosterone|prostate|psa/)) return "Men's Health";
  if (text.match(/kidney|renal|creatinine|egfr|urea/)) return 'Kidney Function';
  if (text.match(/inflammation|crp|esr/)) return 'Inflammation';
  if (text.match(/hormone/)) return 'Hormones';
  if (text.match(/blood count|cbc|fbc|haemoglobin|wbc|rbc/)) return 'Blood Count';
  if (text.match(/sports|fitness|performance|athlete/)) return 'Sports & Fitness';
  return 'General Health';
}

import { firecrawlScrape, firecrawlMap, runInChunks } from '../_shared/firecrawl-helpers.ts';

async function mapLola(apiKey: string): Promise<string[]> {
  const links = await firecrawlMap('https://lolahealth.com/collections/blood-tests', apiKey, {
    search: 'blood test', limit: 200,
  });
  return links.filter((l) => l.includes('/products/') && !l.includes('?') && !l.includes('subscription'));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const _serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${_serviceKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Starting Lola Health Firecrawl scraper...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'lola-health', status: 'running', last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    // Discover product URLs
    let productUrls: string[] = [];
    try {
      productUrls = await mapLola(firecrawlApiKey);
      console.log(`Map discovered ${productUrls.length} URLs`);
    } catch (e) {
      console.error('Map failed:', (e instanceof Error ? e.message : String(e)));
    }

    // Fallback: scrape collection page for links
    if (productUrls.length === 0) {
      try {
        const collResult = await firecrawlScrape('https://lolahealth.com/collections/blood-tests', firecrawlApiKey, {
          formats: ['markdown'], onlyMainContent: true, waitFor: 1500, timeout: 60000, proxy: 'stealth',
        });
        if (collResult.success && collResult.data?.markdown) {
          const urlMatches = collResult.data.markdown.matchAll(/\(https:\/\/lolahealth\.com\/products\/([^)]+)\)/g);
          for (const m of urlMatches) {
            productUrls.push(`https://lolahealth.com/products/${m[1]}`);
          }
        }
      } catch (e) {
        console.error('Collection scrape failed:', (e instanceof Error ? e.message : String(e)));
      }
    }

    const collectionProducts = await fetchLolaCollectionProducts();
    const collectionByHandle = new Map(collectionProducts.map((product: any) => [product.handle, product]));

    const collectionUrls = collectionProducts
      .map((product: any) => `https://lolahealth.com/products/${product.handle}`)
      .filter((url: string) => url.includes('/products/'));

    productUrls = [...new Set([...collectionUrls, ...productUrls])];
    console.log(`Total URLs: ${productUrls.length}`);

    const products: any[] = [];
    const biomarkerTerms = ['vitamin', 'b12', 'folate', 'iron', 'ferritin', 'calcium', 'magnesium',
      'testosterone', 'oestradiol', 'progesterone', 'fsh', 'lh', 'cortisol', 'dhea',
      'tsh', 't3', 't4', 'cholesterol', 'hdl', 'ldl', 'triglyceride', 'alt', 'ast',
      'bilirubin', 'albumin', 'creatinine', 'urea', 'egfr', 'glucose', 'hba1c', 'crp',
      'haemoglobin', 'platelet', 'psa', 'thyroid', 'shbg', 'prolactin'];

    // Batch mode, concurrency 4
    await runInChunks(productUrls, 8, async (url) => {
      const slug = url.split('/products/').pop() || '';
      console.log(`Scraping: ${slug}`);
      const result = await firecrawlScrape(url, firecrawlApiKey, {
        formats: ['markdown'], onlyMainContent: true, waitFor: 1500, timeout: 60000, proxy: 'stealth',
      });
      if (!result.success || !result.data) return;

      const markdown = result.data.markdown || '';
      const metadata = result.data.metadata || {};

      let title = metadata.title?.replace(/\s*[–|]\s*Lola\s*Health.*$/i, '').trim() || '';
      if (!title) {
        const h1 = markdown.match(/^#\s+(.+)$/m);
        title = h1 ? h1[1].trim() : '';
      }
      if (!title) return;

      const collectionProduct = collectionByHandle.get(slug);
      const collectionBasePrice = extractCollectionBasePrice(collectionProduct);
      const collectionHeadlinePrice = Number.isFinite(Number(collectionProduct?.variants?.[0]?.price))
        ? Number(collectionProduct.variants[0].price)
        : null;

      const priceMatch = markdown.match(/£([\d,]+\.\d{2})/);
      const markdownPrice = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;
      const price = collectionHeadlinePrice ?? collectionBasePrice ?? markdownPrice;

      const origMatch = markdown.match(/~~£([\d,]+\.\d{2})~~/);
      const originalPrice = origMatch ? parseFloat(origMatch[1].replace(',', '')) : null;

      const discountMatch = markdown.match(/(\d+)%\s*(?:OFF|off|discount)/i);
      const discount = discountMatch ? parseInt(discountMatch[1]) : null;

      const bioCountMatch = markdown.match(/(\d+)\s*(?:Biomarkers?\s*Tested|biomarkers?)/i);
      const biomarkerCount = bioCountMatch ? parseInt(bioCountMatch[1]) : null;

      const biomarkers: string[] = [];
      const lines = markdown.split('\n');
      for (const line of lines) {
        const clean = line.replace(/^[\s*•-]+/, '').trim();
        if (clean.length > 2 && clean.length < 80 && biomarkerTerms.some(t => clean.toLowerCase().includes(t))) {
          biomarkers.push(clean);
        }
      }

      const isAddon = markdown.toLowerCase().includes('add-on') || markdown.toLowerCase().includes('can only be added');

      products.push({
        test_name: title,
        provider_id: 'lola-health',
        provider_test_id: slug,
        category: determineCategory(title, metadata.description || ''),
        price,
        base_price: collectionBasePrice,
        original_price: originalPrice,
        discount_percentage: discount,
        description: metadata.description || `${title} blood test from Lola Health.`,
        url,
        image_url:
          normalizeUrl(collectionProduct?.image?.src, url) ||
          normalizeUrl(collectionProduct?.featured_image, url) ||
          normalizeUrl(collectionProduct?.images?.[0]?.src ?? collectionProduct?.images?.[0], url),
        is_active: true,
        is_addon: isAddon,
        biomarkers_list: biomarkers.length > 0 ? biomarkers : null,
        biomarker_count: biomarkerCount || biomarkers.length || null,
        sample_type: 'Finger-prick',
        home_kit_available: true,
        clinic_visit_available: false,
        scraped_at: new Date().toISOString(),
        url_verified: true,
        url_verified_at: new Date().toISOString(),
      });
      console.log(`✓ ${title} - £${price ?? 'N/A'}${isAddon ? ' (Add-on)' : ''}`);
    });

    if (products.length > 0) {
      const { error } = await supabase.from('provider_tests').upsert(products, {
        onConflict: 'provider_id,provider_test_id', ignoreDuplicates: false,
      });
      if (error) throw error;
    }

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'lola-health', status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 12 * 3600000).toISOString(),
      error_message: null,
    }, { onConflict: 'provider_id' });

    return new Response(JSON.stringify({
      success: true, message: `Scraped ${products.length} Lola Health tests via Firecrawl`,
      testsUpdated: products.length,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Lola Health scraper error:', error);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await supabase.from('scraping_jobs').upsert({
      provider_id: 'lola-health', status: 'failed',
      error_message: (error instanceof Error ? error.message : String(error)), last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });
    return new Response(JSON.stringify({ success: false, error: (error instanceof Error ? error.message : String(error)) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
