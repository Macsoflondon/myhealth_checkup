/**
 * medichecks-firecrawl — Medichecks catalogue sync.
 *
 * History / why this shape:
 * The previous implementation crawled ~120 product pages one-by-one through
 * Firecrawl inside a single synchronous request. That routinely ran past the
 * platform's 150 s request limit, so the caller saw HTTP 504 while the scrape
 * was still half-finished — which, combined with a hard purge beforehand,
 * destroyed most of the catalogue on 2026-09-05.
 *
 * Medichecks is a Shopify storefront, so the whole catalogue is available from
 * `/products.json` in a handful of paginated requests. That removes both the
 * per-page crawl and the timeout. The work still runs as a background task
 * behind an immediate 202 so no request can ever be cut off mid-write.
 *
 * Descriptions stay provider-verbatim: `description_scraped` holds the raw
 * Shopify `body_html`, `description` holds the same text with tags stripped.
 * No LLM is involved at any point.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FEED_BASE = 'https://www.medichecks.com/products.json';
const MAX_FEED_PAGES = 8;
const PAGE_SIZE = 250;
const UPSERT_CHUNK = 25;

type Supa = ReturnType<typeof createClient>;

interface ShopifyImage { src?: string }
interface ShopifyVariant { price?: string; compare_at_price?: string | null; available?: boolean }
interface ShopifyProduct {
  title?: string;
  handle?: string;
  body_html?: string | null;
  product_type?: string | null;
  tags?: string[] | string;
  images?: ShopifyImage[];
  variants?: ShopifyVariant[];
}

interface CatalogueRow {
  provider_test_id: string;
  test_name: string;
  url: string;
  price: number | null;
  original_price: number | null;
  description: string | null;
  description_scraped: string | null;
  biomarker_count: number | null;
  image_url: string | null;
  category: string;
}

declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;
const waitUntil = (p: Promise<unknown>): void => {
  try {
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
      EdgeRuntime.waitUntil(p);
      return;
    }
  } catch { /* noop */ }
  p.catch((err) => console.error('[medichecks] bg error:', getErrorMessage(err)));
};

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
    if (keywords.some((keyword) => text.includes(keyword))) return category;
  }
  return 'General Health';
}

function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|div)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractBiomarkerCount(text: string): number | null {
  const patterns = [
    /(\d+)\s*biomarkers?/i,
    /includes?\s+(\d+)\s+biomarkers?/i,
    /measures?\s+(\d+)\s+biomarkers?/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return parseInt(match[1], 10);
  }
  return null;
}

/** Non-test storefront entries that must never appear as catalogue rows. */
function isNotATest(title: string, handle: string): boolean {
  const t = title.toLowerCase().trim();
  if (t.length < 3) return true;
  const banned = [
    'clinic visit', 'gift card', 'nurse visit', 'phlebotomy', 'blood draw',
    'consultation', 'shipping', 'sample kit', 'donation', '404',
  ];
  return banned.some((b) => t.startsWith(b) || t.includes(b)) || handle.startsWith('clinic-visit');
}

async function fetchCatalogue(): Promise<CatalogueRow[]> {
  const rows: CatalogueRow[] = [];
  const seenHandles = new Set<string>();
  const seenNames = new Set<string>();

  for (let page = 1; page <= MAX_FEED_PAGES; page++) {
    const res = await fetch(`${FEED_BASE}?limit=${PAGE_SIZE}&page=${page}`, {
      headers: { 'User-Agent': 'MyHealthCheckupBot/1.0 (+https://myhealthcheckup.co.uk)' },
    });
    if (!res.ok) {
      throw new Error(`Medichecks products feed failed [${res.status}]: ${(await res.text()).slice(0, 300)}`);
    }
    const payload = await res.json() as { products?: ShopifyProduct[] };
    const products = Array.isArray(payload.products) ? payload.products : [];
    if (products.length === 0) break;

    for (const product of products) {
      const title = (product.title ?? '').trim();
      const handle = (product.handle ?? '').trim();
      if (!title || !handle) continue;
      if (isNotATest(title, handle)) continue;
      if (seenHandles.has(handle)) continue;
      const nameKey = title.toLowerCase();
      if (seenNames.has(nameKey)) continue;
      seenHandles.add(handle);
      seenNames.add(nameKey);

      const bodyHtml = product.body_html ?? '';
      const plain = bodyHtml ? stripHtml(bodyHtml) : '';
      const variant = product.variants?.[0];
      const price = variant?.price ? Number.parseFloat(variant.price) : NaN;
      const compareAt = variant?.compare_at_price ? Number.parseFloat(variant.compare_at_price) : NaN;
      const url = `https://www.medichecks.com/products/${handle}`;

      rows.push({
        provider_test_id: handle.slice(0, 120),
        test_name: title,
        url,
        price: Number.isFinite(price) && price > 0 ? price : null,
        original_price: Number.isFinite(compareAt) && compareAt > 0 ? compareAt : null,
        description: plain ? plain.slice(0, 4000) : null,
        description_scraped: bodyHtml || null,
        biomarker_count: extractBiomarkerCount(plain),
        image_url: product.images?.[0]?.src ?? null,
        category: determineCategory(title, plain, url),
      });
    }

    if (products.length < PAGE_SIZE) break;
  }

  return rows;
}

async function setJob(supabase: Supa, status: string, errorMessage: string | null): Promise<void> {
  const row = {
    status,
    error_message: errorMessage,
    last_scraped: new Date().toISOString(),
    next_scrape: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  };
  // Canonical id first — dashboards key off `medichecks`; the legacy alias is
  // kept in step so the two rows never disagree again.
  await supabase.from('scraping_jobs').upsert({ provider_id: 'medichecks', ...row }, { onConflict: 'provider_id' });
  await supabase.from('scraping_jobs').upsert({ provider_id: 'medichecks-firecrawl', ...row }, { onConflict: 'provider_id' });
}

async function syncCatalogue(supabase: Supa, runId: string): Promise<void> {
  const errors: string[] = [];
  let upserted = 0;
  let withPrices = 0;

  try {
    const rows = await fetchCatalogue();
    console.log(`[medichecks] feed returned ${rows.length} test products`);

    for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
      const chunk = rows.slice(i, i + UPSERT_CHUNK);
      const now = new Date().toISOString();

      const payload = chunk.map((row) => {
        if (row.price !== null) withPrices++;
        return {
          provider_id: 'medichecks',
          provider_test_id: row.provider_test_id,
          test_name: row.test_name,
          url: row.url,
          category: row.category,
          description: row.description,
          description_scraped: row.description_scraped,
          description_source: 'scraped_verbatim',
          price: row.price,
          original_price: row.original_price,
          biomarker_count: row.biomarker_count,
          image_url: row.image_url,
          sample_type: 'Finger-prick or Venous',
          is_active: true,
          scraped_at: now,
          updated_at: now,
          url_verified: true,
          url_verified_at: now,
        };
      });

      const { error } = await supabase
        .from('provider_tests')
        .upsert(payload, { onConflict: 'provider_id,provider_test_id' });

      if (error) {
        errors.push(`chunk ${i}: ${getErrorMessage(error)}`);
        console.error(`[medichecks] chunk ${i} failed:`, getErrorMessage(error));
      } else {
        upserted += payload.length;
      }

      await supabase.from('scrape_runs').update({
        tests_seen: rows.length,
        tests_updated: upserted,
        metadata: { source: 'shopify-products-feed', total: rows.length, upserted },
      }).eq('id', runId);
    }

    const status = errors.length > 0 ? 'partial' : 'success';
    await supabase.from('scrape_runs').update({
      status,
      finished_at: new Date().toISOString(),
      tests_seen: rows.length,
      tests_updated: upserted,
      errors: errors.slice(0, 20).map((message) => ({ message })),
      metadata: { source: 'shopify-products-feed', total: rows.length, upserted, withPrices },
    }).eq('id', runId);

    await setJob(supabase, 'completed', errors.length > 0 ? `Completed with ${errors.length} error(s)` : null);
    console.log(`[medichecks] run ${runId} ${status}: ${upserted}/${rows.length} upserted, ${withPrices} with prices`);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('[medichecks] run failed:', message);
    await supabase.from('scrape_runs').update({
      status: 'error',
      finished_at: new Date().toISOString(),
      tests_updated: upserted,
      errors: [{ message }],
    }).eq('id', runId);
    await setJob(supabase, 'failed', message.slice(0, 1000));
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${serviceKey}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);

  try {
    await setJob(supabase, 'running', null);

    const { data: runRow, error: runError } = await supabase
      .from('scrape_runs')
      .insert({
        provider_id: 'medichecks',
        scraper_function: 'medichecks-firecrawl',
        status: 'running',
        metadata: { source: 'shopify-products-feed' },
      })
      .select('id')
      .single();

    if (runError || !runRow) {
      const message = `Could not open scrape run: ${runError?.message ?? 'unknown'}`;
      await setJob(supabase, 'failed', message);
      return json({ error: message }, 500);
    }

    const runId = (runRow as { id: string }).id;
    // Respond immediately; the sync continues in the background so no caller
    // can ever time out mid-write.
    waitUntil(syncCatalogue(supabase, runId));

    return json({
      success: true,
      provider: 'medichecks',
      method: 'shopify-products-feed',
      runId,
      message: 'Medichecks catalogue sync running in the background.',
    }, 202);
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('[medichecks] fatal:', message);
    await setJob(supabase, 'failed', message);
    return json({ success: false, error: message }, 500);
  }
});
