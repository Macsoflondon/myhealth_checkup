/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';
import { firecrawlScrape, firecrawlMap, runInChunks } from '../_shared/firecrawl-helpers.ts';

// Derive a stable provider_test_id from the Medichecks product URL slug.
// Example: https://www.medichecks.com/products/testosterone-blood-test -> "testosterone-blood-test"
function slugFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('products');
    const slug = idx >= 0 && parts[idx + 1] ? parts[idx + 1] : parts[parts.length - 1];
    return (slug || url).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 120);
  } catch {
    return url.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 120);
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedProduct {
  test_name: string;
  price: number | null;
  original_price: number | null;
  url: string;
  category: string;
  description: string | null;
  biomarker_count: number | null;
  sample_type: string | null;
  image_url: string | null;
}

// Collection pages to discover all products (Shopify-style)
const collectionUrls = [
  'https://www.medichecks.com/collections/all',
  'https://www.medichecks.com/collections/blood-tests',
  'https://www.medichecks.com/collections/hormones',
  'https://www.medichecks.com/collections/thyroid',
  'https://www.medichecks.com/collections/vitamins',
  'https://www.medichecks.com/collections/health-checks',
  'https://www.medichecks.com/collections/mens-health',
  'https://www.medichecks.com/collections/womens-health',
  'https://www.medichecks.com/collections/sports-fitness',
  'https://www.medichecks.com/collections/fertility',
];

// Verified product URLs from Medichecks Shopify store
const knownProductUrls = [
  'https://www.medichecks.com/products/testosterone-blood-test',
  'https://www.medichecks.com/products/male-hormone-check-blood-test',
  'https://www.medichecks.com/products/ultimate-performance-blood-test',
  'https://www.medichecks.com/products/advanced-thyroid-function-blood-test',
  'https://www.medichecks.com/products/well-woman-advanced-blood-test',
  'https://www.medichecks.com/products/well-man-advanced-blood-test',
  'https://www.medichecks.com/products/trt-check-plus-testosterone-replacement-therapy-blood-test',
  'https://www.medichecks.com/products/thyroid-function-blood-test',
  'https://www.medichecks.com/products/vitamin-d-25-oh-blood-test',
  'https://www.medichecks.com/products/female-hormone-check-blood-test',
  'https://www.medichecks.com/products/health-and-lifestyle-check-blood-test',
  'https://www.medichecks.com/products/thyroid-function-antibodies-blood-test',
  'https://www.medichecks.com/products/sports-hormone-check-blood-test',
  'https://www.medichecks.com/products/liver-check-blood-test',
  'https://www.medichecks.com/products/optimal-health-blood-test',
  'https://www.medichecks.com/products/psa-prostate-specific-antigen-blood-test',
  'https://www.medichecks.com/products/iron-deficiency-check-blood-test',
  'https://www.medichecks.com/products/essential-blood-test',
  'https://www.medichecks.com/products/essential-blood-ultravit',
  'https://www.medichecks.com/products/diabetes-hba1c-blood-test',
  'https://www.medichecks.com/products/cholesterol-blood-test',
  'https://www.medichecks.com/products/menopause-blood-test',
  'https://www.medichecks.com/products/full-blood-count-blood-test',
  'https://www.medichecks.com/products/vitamin-b12-active-blood-test',
  'https://www.medichecks.com/products/vitamin-b12-folate-blood-test',
  'https://www.medichecks.com/products/kidney-function-blood-test',
  'https://www.medichecks.com/products/fatigue-check-blood-test',
  'https://www.medichecks.com/products/cortisol-blood-test',
  'https://www.medichecks.com/products/oestradiol-blood-test',
  'https://www.medichecks.com/products/progesterone-blood-test',
  'https://www.medichecks.com/products/dhea-sulphate-blood-test',
  'https://www.medichecks.com/products/fsh-blood-test',
  'https://www.medichecks.com/products/lh-blood-test',
  'https://www.medichecks.com/products/prolactin-blood-test',
  'https://www.medichecks.com/products/shbg-blood-test',
  'https://www.medichecks.com/products/free-testosterone-blood-test',
  'https://www.medichecks.com/products/amh-blood-test',
  'https://www.medichecks.com/products/coeliac-disease-blood-test',
  'https://www.medichecks.com/products/crp-high-sensitivity-blood-test',
  'https://www.medichecks.com/products/homocysteine-blood-test',
  'https://www.medichecks.com/products/ferritin-blood-test',
  'https://www.medichecks.com/products/folate-blood-test',
  'https://www.medichecks.com/products/magnesium-blood-test',
  'https://www.medichecks.com/products/zinc-blood-test',
  'https://www.medichecks.com/products/selenium-blood-test',
  'https://www.medichecks.com/products/uric-acid-blood-test',
  'https://www.medichecks.com/products/igf-1-blood-test',
  'https://www.medichecks.com/products/testosterone-and-shbg-blood-test',
  'https://www.medichecks.com/products/sports-performance-blood-test',
  'https://www.medichecks.com/products/perimenopause-blood-test',
  'https://www.medichecks.com/products/polycystic-ovary-syndrome-pcos-blood-test',
];

function determineCategory(title: string, description: string, url: string): string {
  const text = `${title} ${description} ${url}`.toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
    'Thyroid': ['thyroid', 'tsh', 't3', 't4'],
    'Hormones': ['hormone', 'testosterone', 'oestrogen', 'estrogen', 'progesterone', 'dhea', 'cortisol'],
    'Vitamins & Minerals': ['vitamin', 'mineral', 'iron', 'ferritin', 'b12', 'folate', 'magnesium', 'zinc'],
    'Heart Health': ['heart', 'cholesterol', 'cardiovascular', 'cardiac', 'lipid'],
    'Diabetes': ['diabetes', 'hba1c', 'glucose', 'insulin', 'blood sugar'],
    'Liver Health': ['liver', 'hepatic', 'alt', 'ast', 'bilirubin'],
    'Kidney Health': ['kidney', 'renal', 'creatinine', 'egfr', 'urea'],
    'Mens Health': ['men', 'male', 'prostate', 'psa', 'well man'],
    'Womens Health': ['women', 'female', 'menopause', 'well woman', 'pcos'],
    'Fertility': ['fertility', 'ovarian', 'amh', 'sperm', 'conception'],
    'Sports & Fitness': ['sport', 'fitness', 'athlete', 'performance', 'muscle'],
    'General Health': ['general', 'comprehensive', 'full body', 'health check', 'mot', 'baseline', 'essential', 'optimal'],
    'Fatigue': ['fatigue', 'tiredness', 'energy', 'exhaustion'],
    'Inflammation': ['inflammation', 'crp', 'esr', 'autoimmune'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'General Health';
}

async function scrapeWithFirecrawl(url: string, apiKey: string): Promise<any> {
  return firecrawlScrape(url, apiKey, {
    formats: ['markdown', 'html'],
    onlyMainContent: false,
    waitFor: 1500,
    timeout: 60000,
    proxy: 'stealth',
  });
}

async function mapWebsiteUrls(baseUrl: string, apiKey: string): Promise<string[]> {
  const links = await firecrawlMap(baseUrl, apiKey, { search: 'blood test', limit: 200 });
  return links.filter((link) => link.includes('/products/') && !link.includes('?'));
}

function extractPrice(html: string, markdown: string): { current: number | null; original: number | null } {
  let current: number | null = null;
  let original: number | null = null;
  
  // Combine HTML and markdown for searching
  const text = `${html} ${markdown}`;
  
  // Pattern 1: Simple £ price (most common on Medichecks)
  const simplePriceMatch = text.match(/£(\d+(?:\.\d{1,2})?)/);
  if (simplePriceMatch) {
    const price = parseFloat(simplePriceMatch[1]);
    if (price > 0 && price < 2000) {
      current = price;
    }
  }
  
  // Pattern 2: JSON-LD structured data
  if (current === null) {
    const jsonLdMatches = html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1]);
        if (data.offers?.price) {
          current = parseFloat(data.offers.price);
          break;
        }
        if (data['@graph']) {
          for (const item of data['@graph']) {
            if (item.offers?.price) {
              current = parseFloat(item.offers.price);
              break;
            }
          }
        }
      } catch { /* ignore malformed entry */ }
    }
  }
  
  // Pattern 3: Look for price after product title context
  if (current === null) {
    const priceContextMatch = text.match(/(?:price|cost|from)[:\s]*£(\d+(?:\.\d{1,2})?)/i);
    if (priceContextMatch) {
      current = parseFloat(priceContextMatch[1]);
    }
  }
  
  // Look for original/was price
  const originalPatterns = [
    /<del[^>]*>[\s\S]*?£(\d+(?:\.\d{1,2})?)/i,
    /was\s*£(\d+(?:\.\d{1,2})?)/i,
    /"compareAtPrice"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i,
  ];
  
  for (const pattern of originalPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (price > 0 && price < 2000) {
        original = price;
        break;
      }
    }
  }
  
  return { current, original };
}

function extractBiomarkerCount(markdown: string, html: string): number | null {
  const patterns = [
    /(\d+)\s*biomarkers?/i,
    /tests?\s+(\d+)\s+biomarkers?/i,
    /includes?\s+(\d+)\s+biomarkers?/i,
    /measures?\s+(\d+)\s+biomarkers?/i,
  ];
  
  const text = `${markdown} ${html}`;
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
}

function extractImageUrl(html: string, metadataOgImage?: string | null): string | null {
  if (metadataOgImage && typeof metadataOgImage === 'string' && metadataOgImage.length > 0) {
    let url = metadataOgImage;
    if (url.startsWith('//')) url = 'https:' + url;
    else if (url.startsWith('/')) url = 'https://www.medichecks.com' + url;
    return url;
  }
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:image"/i,
    /src="(https:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let url = match[1];
      if (url.startsWith('//')) url = 'https:' + url;
      else if (url.startsWith('/')) url = 'https://www.medichecks.com' + url;
      return url;
    }
  }
  return null;
}


/**
 * Batched, background execution.
 *
 * The whole Medichecks catalogue (~200 product pages via Firecrawl) cannot be
 * scraped inside one synchronous request — the platform closes the connection
 * at ~150 s and the caller sees HTTP 504 mid-scrape. Instead:
 *   - the first call discovers product URLs, stores them on a `scrape_runs`
 *     row, answers 202 immediately, and processes batch 0 in the background;
 *   - each batch self-invokes the next one until the list is exhausted.
 * No request ever blocks on the full catalogue, so a 504 is impossible.
 */

const BATCH_SIZE = 20;
const MAX_PRODUCT_URLS = 220;

declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;
const waitUntil = (p: Promise<unknown>): void => {
  try {
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
      EdgeRuntime.waitUntil(p);
      return;
    }
  } catch { /* noop */ }
  p.catch((err) => console.error('[medichecks-firecrawl] bg error:', getErrorMessage(err)));
};

type Supa = ReturnType<typeof createClient>;

interface RunMeta {
  urls: string[];
  scraped: number;
  upserted: number;
  withPrices: number;
  errors: string[];
}

const readMeta = (raw: unknown): RunMeta => {
  const m = (raw ?? {}) as Partial<RunMeta>;
  return {
    urls: Array.isArray(m.urls) ? m.urls : [],
    scraped: Number(m.scraped ?? 0),
    upserted: Number(m.upserted ?? 0),
    withPrices: Number(m.withPrices ?? 0),
    errors: Array.isArray(m.errors) ? m.errors : [],
  };
};

async function setJob(
  supabase: Supa,
  status: string,
  errorMessage: string | null,
): Promise<void> {
  const row = {
    status,
    error_message: errorMessage,
    last_scraped: new Date().toISOString(),
    next_scrape: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  };
  // Canonical id first — the dashboards key off `medichecks`.
  await supabase.from('scraping_jobs').upsert({ provider_id: 'medichecks', ...row }, { onConflict: 'provider_id' });
  await supabase.from('scraping_jobs').upsert({ provider_id: 'medichecks-firecrawl', ...row }, { onConflict: 'provider_id' });
}

async function discoverUrls(firecrawlApiKey: string): Promise<string[]> {
  let productUrls: string[] = [...knownProductUrls];
  for (const collectionUrl of collectionUrls.slice(0, 5)) {
    try {
      const urls = await mapWebsiteUrls(collectionUrl, firecrawlApiKey);
      const validUrls = urls.filter((url: string) => url.includes('/products/'));
      productUrls = [...productUrls, ...validUrls];
      console.log(`Found ${validUrls.length} products from ${collectionUrl}`);
    } catch (error) {
      console.error(`Failed to map ${collectionUrl}:`, getErrorMessage(error));
    }
  }
  return [...new Set(productUrls)]
    .filter((url) => url.includes('/products/'))
    .slice(0, MAX_PRODUCT_URLS);
}

async function scrapeBatch(
  supabase: Supa,
  firecrawlApiKey: string,
  runId: string,
  offset: number,
): Promise<void> {
  const { data: runRow, error: runErr } = await supabase
    .from('scrape_runs')
    .select('metadata')
    .eq('id', runId)
    .maybeSingle();
  if (runErr || !runRow) {
    console.error(`[medichecks-firecrawl] run ${runId} not found`);
    return;
  }

  const meta = readMeta((runRow as { metadata: unknown }).metadata);
  const slice = meta.urls.slice(offset, offset + BATCH_SIZE);
  if (slice.length === 0) {
    await finishRun(supabase, runId, meta);
    return;
  }

  const scrapedProducts: ScrapedProduct[] = [];

  await runInChunks(slice, 6, async (url) => {
    try {
      const result = await scrapeWithFirecrawl(url, firecrawlApiKey);
      if (!result.success || !result.data) return;

      const { markdown, html, metadata } = result.data;

      let title = metadata?.title || '';
      if (!title && markdown) {
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        if (titleMatch) title = titleMatch[1];
      }
      title = title.replace(/\s*\|\s*Medichecks.*$/i, '').trim();
      if (!title || /^\d{3}\s/.test(title)) return; // skip empty and error pages

      const description = metadata?.description || null;
      const { current: price, original: originalPrice } = extractPrice(html || '', markdown || '');

      scrapedProducts.push({
        test_name: title,
        price,
        original_price: originalPrice,
        url,
        category: determineCategory(title, description || '', url),
        description,
        biomarker_count: extractBiomarkerCount(markdown || '', html || ''),
        sample_type: 'Finger-prick or Venous',
        image_url: extractImageUrl(html || '', metadata?.ogImage),
      });
    } catch (error) {
      meta.errors.push(`${url}: ${getErrorMessage(error)}`);
    }
  });

  for (const product of scrapedProducts) {
    const providerTestId = slugFromUrl(product.url);

    const dataToUpsert: Record<string, unknown> = {
      provider_id: 'medichecks',
      provider_test_id: providerTestId,
      test_name: product.test_name,
      url: product.url,
      category: product.category,
      description: product.description,
      biomarker_count: product.biomarker_count,
      image_url: product.image_url,
      sample_type: product.sample_type,
      is_active: true,
      scraped_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      url_verified: true,
      url_verified_at: new Date().toISOString(),
    };

    if (product.price !== null) {
      dataToUpsert.price = product.price;
      dataToUpsert.original_price = product.original_price;
      meta.withPrices++;
    }

    const { error } = await supabase
      .from('provider_tests')
      .upsert(dataToUpsert, { onConflict: 'provider_id,provider_test_id' });

    if (error) {
      meta.errors.push(`${providerTestId}: ${getErrorMessage(error)}`);
    } else {
      meta.upserted++;
    }
  }

  meta.scraped += scrapedProducts.length;
  meta.errors = meta.errors.slice(-40);

  const nextOffset = offset + slice.length;
  await supabase.from('scrape_runs').update({
    tests_seen: meta.scraped,
    tests_updated: meta.upserted,
    metadata: { ...meta, offset: nextOffset, total: meta.urls.length },
  }).eq('id', runId);

  console.log(
    `[medichecks-firecrawl] batch ${offset}-${nextOffset}/${meta.urls.length}: ` +
      `${scrapedProducts.length} scraped, ${meta.upserted} upserted so far`,
  );

  if (nextOffset >= meta.urls.length) {
    await finishRun(supabase, runId, meta);
    return;
  }

  // Hand the next batch to a fresh invocation so no single request runs long.
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const res = await fetch(`${supabaseUrl}/functions/v1/medichecks-firecrawl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${serviceKey}` },
    body: JSON.stringify({ runId, offset: nextOffset }),
  });
  if (!res.ok) {
    const text = await res.text();
    const message = `Batch chaining failed at offset ${nextOffset}: HTTP ${res.status} ${text.slice(0, 200)}`;
    console.error(`[medichecks-firecrawl] ${message}`);
    meta.errors.push(message);
    await finishRun(supabase, runId, meta, 'partial');
  }
}

async function finishRun(
  supabase: Supa,
  runId: string,
  meta: RunMeta,
  status: 'success' | 'partial' = 'success',
): Promise<void> {
  const finalStatus = meta.errors.length > 0 && status === 'success' ? 'partial' : status;
  await supabase.from('scrape_runs').update({
    status: finalStatus,
    finished_at: new Date().toISOString(),
    tests_seen: meta.scraped,
    tests_updated: meta.upserted,
    errors: meta.errors.slice(0, 20).map((message) => ({ message })),
    metadata: { ...meta, completed: true, total: meta.urls.length },
  }).eq('id', runId);

  await setJob(
    supabase,
    finalStatus === 'partial' ? 'completed' : 'completed',
    meta.errors.length > 0 ? `Completed with ${meta.errors.length} error(s)` : null,
  );

  console.log(
    `[medichecks-firecrawl] run ${runId} ${finalStatus}: ` +
      `${meta.upserted} tests upserted, ${meta.withPrices} with prices`,
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${serviceKey}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!firecrawlApiKey) return json({ error: 'FIRECRAWL_API_KEY not configured' }, 500);

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
  const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};

  try {
    // Continuation call: process one batch in the background, answer instantly.
    if (typeof body?.runId === 'string' && body.runId.length > 0) {
      const runId: string = body.runId;
      const offset = Number.isFinite(Number(body.offset)) ? Number(body.offset) : 0;
      waitUntil(scrapeBatch(supabase, firecrawlApiKey, runId, offset));
      return json({ success: true, runId, offset, queued: true }, 202);
    }

    // Fresh run: discover URLs, then kick off batch 0 in the background.
    console.log('[medichecks-firecrawl] starting new run');
    await setJob(supabase, 'running', null);

    const urls = await discoverUrls(firecrawlApiKey);
    console.log(`[medichecks-firecrawl] ${urls.length} product URLs discovered`);

    const { data: runRow, error: runError } = await supabase
      .from('scrape_runs')
      .insert({
        provider_id: 'medichecks',
        scraper_function: 'medichecks-firecrawl',
        status: 'running',
        metadata: { urls, scraped: 0, upserted: 0, withPrices: 0, errors: [], offset: 0, total: urls.length },
      })
      .select('id')
      .single();

    if (runError || !runRow) {
      await setJob(supabase, 'failed', `Could not open scrape run: ${runError?.message ?? 'unknown'}`);
      return json({ error: `Could not open scrape run: ${runError?.message ?? 'unknown'}` }, 500);
    }

    const runId = (runRow as { id: string }).id;
    waitUntil(scrapeBatch(supabase, firecrawlApiKey, runId, 0));

    return json({
      success: true,
      provider: 'medichecks',
      method: 'firecrawl',
      runId,
      totalUrls: urls.length,
      batchSize: BATCH_SIZE,
      message: `Scraping ${urls.length} Medichecks products in background batches of ${BATCH_SIZE}.`,
    }, 202);
  } catch (error) {
    const errMsg = getErrorMessage(error);
    console.error('[medichecks-firecrawl] fatal:', errMsg);
    await setJob(supabase, 'failed', errMsg);
    return json({ success: false, error: errMsg }, 500);
  }
});

