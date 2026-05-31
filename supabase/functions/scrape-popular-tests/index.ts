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
  { id: 'medichecks',      name: 'Medichecks',      popularTestsUrl: 'https://www.medichecks.com/collections/best-sellers' },
  { id: 'goodbody-clinic', name: 'Goodbody Clinic', popularTestsUrl: 'https://goodbodyclinic.com/collections/all?sort_by=best-selling' },
  { id: 'lola-health',     name: 'Lola Health',     popularTestsUrl: 'https://www.lolahealth.com/popular-blood-tests' },
];

const MAX_PER_PROVIDER = 8;

interface ScrapedTest {
  name: string;
  price?: number;
  product_url?: string;
  image_url?: string;
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

// ---------- main ----------
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${serviceKey}`) {
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
      .select('id, test_name, provider_id, image_url')
      .in('provider_id', providerIds)
      .eq('is_active', true);

    const dbByProvider = new Map<string, { id: string; test_name: string; image_url: string | null }[]>();
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

        const update: Record<string, unknown> = {
          is_popular: true,
          popularity_rank: rank,
        };
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
