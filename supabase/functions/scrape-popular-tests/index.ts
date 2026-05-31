import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Providers' OWN curated "popular / best-selling" pages.
 * The order tests appear on these pages IS the provider's ranking.
 * Providers without a curated popular page are intentionally excluded —
 * we will NEVER invent rankings.
 */
interface ProviderConfig {
  id: string;
  name: string;
  popularTestsUrl: string;
}

const PROVIDERS: ProviderConfig[] = [
  { id: 'medichecks',                name: 'Medichecks',                  popularTestsUrl: 'https://www.medichecks.com/collections/best-sellers' },
  { id: 'goodbody-clinic',           name: 'Goodbody Clinic',             popularTestsUrl: 'https://goodbodyclinic.com/collections/all?sort_by=best-selling' },
  { id: 'lola-health',               name: 'Lola Health',                 popularTestsUrl: 'https://lolahealth.com/collections/blood-tests?sort_by=best-selling' },
  { id: 'london-medical-laboratory', name: 'London Medical Laboratory',   popularTestsUrl: 'https://www.londonmedicallaboratory.com/product-category/all' },
];

const MAX_PER_PROVIDER = 8;

interface ScrapedTest {
  name: string;
  price?: number;
  base_price?: number;
  product_url?: string;
  image_url?: string;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function stripHtml(value?: string | null) {
  if (!value) return null;
  const cleaned = decodeHtml(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  return cleaned || null;
}

function normalizeUrl(url: string | null | undefined, baseUrl: string) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return new URL(url, baseUrl).toString();
  return null;
}

function parseLmlListingHtml(html: string, baseUrl: string): ScrapedTest[] {
  const cards = Array.from(html.matchAll(/<div class="product-card d-flex flex-fill flex-column position-relative">([\s\S]*?)<\/div>\s*<a href="([^"]+)" class="btn btn-cyan[\s\S]*?<\/a>/gi));

  return cards
    .map((match) => {
      const cardHtml = match[1] ?? '';
      const productUrl = normalizeUrl(match[2], baseUrl) ?? undefined;
      const name = stripHtml(cardHtml.match(/<div class="product-card-link-title">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? null) ?? '';
      const priceText = stripHtml(cardHtml.match(/<div class="product-card-link-price">([\s\S]*?)<div class="product-link-place">/i)?.[1] ?? null);
      const price = priceText ? Number.parseFloat(priceText.replace(/[^\d.]/g, '')) : undefined;
      const imageUrl = normalizeUrl(cardHtml.match(/<img[^>]+class="[^"]*product-card-image[^"]*"[^>]+src="([^"]+)"/i)?.[1] ?? null, baseUrl) ?? undefined;

      return {
        name,
        price: Number.isFinite(price) ? price : undefined,
        product_url: productUrl,
        image_url: imageUrl,
      } satisfies ScrapedTest;
    })
    .filter((item) => item.name.length > 3)
    .slice(0, MAX_PER_PROVIDER);
}

async function scrapeLolaBestSellers(): Promise<ScrapedTest[]> {
  const response = await fetch('https://lolahealth.com/collections/blood-tests/products.json?limit=250&sort_by=best-selling', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; LovableBot/1.0; +https://lovable.dev)',
      Accept: 'application/json,text/plain,*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`Lola best-sellers fetch failed: ${response.status}`);
  }

  const data = await response.json();
  const products = Array.isArray(data?.products) ? data.products : [];

  return products.slice(0, MAX_PER_PROVIDER).map((product: any) => {
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    const variantPrices = variants
      .map((variant: any) => Number(variant?.price))
      .filter((value: number) => Number.isFinite(value));
    const headlinePrice = Number.isFinite(Number(variants?.[0]?.price)) ? Number(variants[0].price) : undefined;
    const basePrice = variantPrices.length > 0 ? Math.min(...variantPrices) : undefined;

    return {
      name: String(product?.title ?? '').trim(),
      price: headlinePrice,
      base_price: basePrice,
      product_url: normalizeUrl(product?.url ?? `/products/${product?.handle ?? ''}`, 'https://lolahealth.com/collections/blood-tests') ?? undefined,
      image_url:
        normalizeUrl(product?.image?.src, 'https://lolahealth.com') ??
        normalizeUrl(product?.featured_image, 'https://lolahealth.com') ??
        normalizeUrl(product?.images?.[0]?.src ?? product?.images?.[0], 'https://lolahealth.com') ??
        undefined,
    } satisfies ScrapedTest;
  }).filter((item) => item.name.length > 3);
}

// ---------- fuzzy match ----------
const normalize = (s: string) =>
  s.toLowerCase()
    .replace(/^(the|a|an)\s+/i, '')
    .replace(/\s+(test|panel|profile|check|screen|blood test)\s*$/i, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const lev = (a: string, b: string): number => {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
};

const sim = (a: string, b: string) => {
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - lev(a, b) / max;
};

const termOverlap = (a: string, b: string) => {
  const ta = new Set(normalize(a).split(' ').filter(t => t.length > 2));
  const tb = new Set(normalize(b).split(' ').filter(t => t.length > 2));
  if (!ta.size || !tb.size) return 0;
  let matched = 0;
  for (const t of ta) if (tb.has(t)) matched++;
  const union = new Set([...ta, ...tb]).size;
  return matched / union;
};

const matchScore = (scraped: string, db: string): number => {
  const ns = normalize(scraped), nd = normalize(db);
  if (ns === nd) return 1;
  const lev = sim(ns, nd);
  const overlap = termOverlap(scraped, db);
  const contains = (nd.includes(ns) || ns.includes(nd)) ? 0.2 : 0;
  return Math.min(lev * 0.5 + overlap * 0.4 + contains, 1);
};

const findBestMatch = (
  scraped: string,
  dbTests: { id: string; test_name: string }[],
  threshold = 0.45,
) => {
  let best: { id: string; test_name: string; score: number } | null = null;
  for (const t of dbTests) {
    const score = matchScore(scraped, t.test_name);
    if (score >= threshold && (!best || score > best.score)) {
      best = { id: t.id, test_name: t.test_name, score };
    }
  }
  return best;
};

// ---------- firecrawl ----------
const isImageUrl = (u?: string) => !!u && /^https?:\/\//i.test(u) && /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(u);

async function firecrawl(url: string, body: Record<string, unknown>, apiKey: string) {
  const res = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, ...body }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error('Firecrawl error', url, json);
    return null;
  }
  // v2 returns { success, data: { ... } }
  return json.data ?? json;
}

async function scrapeListing(provider: ProviderConfig, apiKey: string): Promise<ScrapedTest[]> {
  console.log(`[${provider.id}] scraping listing ${provider.popularTestsUrl}`);

  if (provider.id === 'lola-health') {
    try {
      const products = await scrapeLolaBestSellers();
      if (products.length > 0) {
        console.log(`[${provider.id}] extracted ${products.length} listings via Shopify products feed`);
        return products;
      }
    } catch (error) {
      console.error(`[${provider.id}] Shopify products feed failed:`, error);
    }
  }

  if (provider.id === 'london-medical-laboratory') {
    try {
      const response = await fetch(provider.popularTestsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LovableBot/1.0; +https://lovable.dev)',
          Accept: 'text/html,application/xhtml+xml',
        },
      });
      if (response.ok) {
        const html = await response.text();
        const parsed = parseLmlListingHtml(html, provider.popularTestsUrl);
        if (parsed.length > 0) {
          console.log(`[${provider.id}] extracted ${parsed.length} listings via HTML fallback`);
          return parsed;
        }
      }
    } catch (error) {
      console.error(`[${provider.id}] HTML listing fallback failed:`, error);
    }
  }

  const data = await firecrawl(provider.popularTestsUrl, {
    formats: [{
      type: 'json',
      schema: {
        type: 'object',
        properties: {
          tests: {
            type: 'array',
            description: 'Products in the order they appear on the page (top = most popular).',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Exact product/test name as displayed' },
                price: { type: 'number', description: 'Price in GBP, numeric only' },
                product_url: { type: 'string', description: 'Absolute URL to the product detail page' },
                image_url: { type: 'string', description: 'Absolute URL to the product image (test kit / product photo)' },
              },
              required: ['name'],
            },
          },
        },
      },
    }],
    onlyMainContent: true,
    waitFor: 4000,
  }, apiKey);

  const tests: ScrapedTest[] = (data?.json?.tests ?? []) as ScrapedTest[];
  console.log(`[${provider.id}] extracted ${tests.length} listings`);
  return tests
    .filter(t => t.name && t.name.length > 3)
    .slice(0, MAX_PER_PROVIDER);
}

async function scrapeProductImage(url: string, apiKey: string): Promise<string | null> {
  const data = await firecrawl(url, {
    formats: [{
      type: 'json',
      schema: {
        type: 'object',
        properties: {
          image_url: { type: 'string', description: 'Primary product image (og:image or main gallery image), absolute URL' },
        },
        required: ['image_url'],
      },
    }],
    onlyMainContent: false,
    waitFor: 2500,
  }, apiKey);
  const img = data?.json?.image_url;
  return isImageUrl(img) ? img : null;
}

/** Pull the "What can I expect from <test>?" body copy off an LML product page. */
async function scrapeLmlDescription(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LovableBot/1.0; +https://lovable.dev)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/<h2[^>]*>\s*What can I expect[^<]*<\/h2>([\s\S]*?)<h2/i);
    if (!m) return null;
    let txt = m[1].replace(/<[^>]+>/g, ' ');
    txt = txt
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&lsquo;|&rsquo;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    if (!txt) return null;
    if (txt.length > 380) {
      const cut = txt.slice(0, 380);
      const dot = cut.lastIndexOf('.');
      txt = dot > 200 ? cut.slice(0, dot + 1) : cut + '…';
    }
    return txt;
  } catch (err) {
    console.error('scrapeLmlDescription failed', url, err);
    return null;
  }
}

// ---------- main ----------
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  // Allow either service-role bearer OR an authenticated admin user.
  const auth = req.headers.get('Authorization') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  let authorized = auth === `Bearer ${serviceKey}`;
  if (!authorized && auth.startsWith('Bearer ')) {
    try {
      const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
        global: { headers: { Authorization: auth } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (user) {
        const admin = createClient(supabaseUrl, serviceKey);
        const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin');
        authorized = !!roles && roles.length > 0;
      }
    } catch (_) { /* fallthrough */ }
  }
  if (!authorized) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY missing' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);

    // Reset popularity ONLY for the providers we're about to refresh.
    // Leaves other providers alone.
    const providerIds = PROVIDERS.map(p => p.id);
    await supabase
      .from('provider_tests')
      .update({ is_popular: false, popularity_rank: null })
      .in('provider_id', providerIds);

    const { data: allDb } = await supabase
      .from('provider_tests')
      .select('id, test_name, provider_id, image_url, provider_test_id')
      .in('provider_id', providerIds)
      .eq('is_active', true);

    const dbByProvider = new Map<string, { id: string; test_name: string; image_url: string | null; provider_test_id: string | null }[]>();
    for (const t of (allDb ?? [])) {
      const arr = dbByProvider.get(t.provider_id) ?? [];
      arr.push(t);
      dbByProvider.set(t.provider_id, arr);
    }

    const report: Array<Record<string, unknown>> = [];

    for (const provider of PROVIDERS) {
      const scraped = await scrapeListing(provider, apiKey);
      const dbTests = dbByProvider.get(provider.id) ?? [];
      let rank = 1;

      for (const item of scraped) {
        const match = findBestMatch(item.name, dbTests, 0.45);
        if (!match) {
          report.push({ provider: provider.id, scraped: item.name, matched: null, reason: 'no DB match' });
          continue;
        }

        // Resolve image: prefer the image_url already returned by listing extraction,
        // otherwise visit the product page and grab og:image.
        let image: string | null = isImageUrl(item.image_url) ? item.image_url! : null;
        if (!image && item.product_url) {
          image = await scrapeProductImage(item.product_url, apiKey);
        }

        const matchedProviderTestId = dbTests.find((test) => test.id === match.id)?.provider_test_id ?? null;

        const update: Record<string, unknown> = {
          is_popular: true,
          popularity_rank: rank,
        };
        if (provider.id === 'lola-health') {
          if (typeof item.price === 'number' && Number.isFinite(item.price) && item.price > 0) update.price = item.price;
          if (typeof item.base_price === 'number' && Number.isFinite(item.base_price) && item.base_price > 0) update.base_price = item.base_price;
          if (item.product_url) update.url = item.product_url;
        }
        // Only overwrite image_url if we have a real one — never null out existing real images.
        if (image) update.image_url = image;

        const { error } = await supabase
          .from('provider_tests')
          .update(update)
          .eq('id', match.id);

        if (error) {
          console.error(`[${provider.id}] update failed for ${match.id}:`, error);
          report.push({ provider: provider.id, scraped: item.name, matched: match.test_name, error: error.message });
          continue;
        }

        report.push({
          provider: provider.id,
          rank,
          scraped: item.name,
          matched: match.test_name,
          provider_test_id: matchedProviderTestId,
          score: +match.score.toFixed(2),
          image: image ?? '(kept existing)',
        });
        rank++;
      }
    }

    return new Response(JSON.stringify({ success: true, providers: PROVIDERS.length, report }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('scrape-popular-tests fatal:', err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
