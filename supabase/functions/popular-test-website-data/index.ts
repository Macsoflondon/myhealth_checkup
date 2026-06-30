import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
import { z } from 'https://esm.sh/zod@3.23.8';

const RATE_LIMIT_MAX = 20; // max calls per IP per window
const RATE_LIMIT_WINDOW_MIN = 5;


const ItemSchema = z.object({
  id: z.string().uuid(),
  provider_id: z.enum(['lola-health', 'london-medical-laboratory']),
  url: z.string().url(),
  test_name: z.string().min(1).max(255),
});

const BodySchema = z.object({
  items: z.array(ItemSchema).min(1).max(12),
});

// SSRF guard: only allow scraping the two providers this function is built for.
const ALLOWED_HOSTS: Record<z.infer<typeof ItemSchema>['provider_id'], string[]> = {
  'lola-health': ['lolahealth.com'],
  'london-medical-laboratory': ['londonmedicallaboratory.com'],
};

function assertAllowedUrl(item: z.infer<typeof ItemSchema>) {
  const parsed = new URL(item.url);
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('URL protocol not allowed');
  }
  const allowed = ALLOWED_HOSTS[item.provider_id] ?? [];
  const host = parsed.hostname.toLowerCase();
  if (!allowed.some((h) => host === h || host.endsWith('.' + h))) {
    throw new Error(`URL host ${host} not allowed for provider ${item.provider_id}`);
  }
}

const ABSOLUTE_URL = /^https?:\/\//i;

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
  const cleaned = decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  return cleaned || null;
}

function normalizeUrl(url: string | null | undefined, baseUrl: string) {
  if (!url) return null;
  if (ABSOLUTE_URL.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return new URL(url, baseUrl).toString();
  return null;
}

function extractMeta(html: string, key: string) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return null;
}

function extractTitle(html: string) {
  const title = extractMeta(html, 'og:title');
  if (title) return title.replace(/\s*[|–-]\s*Lola Health.*$/i, '').replace(/\s*[|–-]\s*London Medical Laboratory.*$/i, '').trim();

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match?.[1]) return stripHtml(h1Match[1]);

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return stripHtml(titleMatch?.[1] ?? null);
}

function extractDescription(html: string) {
  return (
    extractMeta(html, 'og:description') ||
    extractMeta(html, 'description') ||
    stripHtml(html.match(/<div[^>]*class=["'][^"']*woocommerce-product-details__short-description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? null)
  );
}

function extractImageUrl(html: string, url: string) {
  const direct =
    extractMeta(html, 'og:image') ||
    html.match(/<img[^>]+id=["']main-image["'][^>]+src=["']([^"']+)["']/i)?.[1] ||
    html.match(/<img[^>]+class=["'][^"']*(?:wp-post-image|product__media-item|woocommerce-product-gallery__image|large-product-image|product-card-image)[^"']*["'][^>]+src=["']([^"']+)["']/i)?.[1] ||
    html.match(/data-large_image=["']([^"']+)["']/i)?.[1] ||
    null;

  return normalizeUrl(direct, url);
}

async function scrapeProductPage(item: z.infer<typeof ItemSchema>) {
  assertAllowedUrl(item);

  const response = await fetch(item.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; LovableBot/1.0; +https://lovable.dev)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${item.provider_id} page (${response.status})`);
  }

  const html = await response.text();
  const lolaJson = item.provider_id === 'lola-health'
    ? await fetch(`${item.url}.js`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LovableBot/1.0; +https://lovable.dev)',
          Accept: 'application/json,text/plain,*/*',
        },
      }).then(async (res) => (res.ok ? res.json() : null)).catch(() => null)
    : null;

  const lolaImageUrl = item.provider_id === 'lola-health'
    ? normalizeUrl(
        lolaJson?.featured_image ||
          lolaJson?.media?.find?.((media: { media_type?: string; src?: string }) => media?.media_type === 'image' && media?.src)?.src ||
          lolaJson?.images?.[0],
        item.url,
      )
    : null;

  const lolaPrice = item.provider_id === 'lola-health' && typeof lolaJson?.price === 'number'
    ? Number((lolaJson.price / 100).toFixed(2))
    : null;

  return {
    id: item.id,
    provider_id: item.provider_id,
    title: extractTitle(html) || item.test_name,
    description: extractDescription(html),
    image_url: lolaImageUrl || extractImageUrl(html, item.url),
    price: lolaPrice,
    url: item.url,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Per-IP rate limit (sliding window via api_rate_limits)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (supabaseUrl && serviceKey) {
      const sb = createClient(supabaseUrl, serviceKey);
      const windowStart = new Date(
        Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000,
      ).toISOString();
      const { count: recentCount } = await sb
        .from('api_rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('client_key', ip)
        .eq('endpoint', 'popular-test-website-data')
        .gte('window_start', windowStart);
      if ((recentCount ?? 0) >= RATE_LIMIT_MAX) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      await sb.from('api_rate_limits').insert({
        client_key: ip,
        endpoint: 'popular-test-website-data',
        window_start: new Date().toISOString(),
        request_count: 1,
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
    const sb = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey) : null;

    // Read cache
    const ids = parsed.data.items.map((i) => i.id);
    const cached = sb
      ? (await sb
          .from('popular_test_enrichment_cache')
          .select('test_id, title, description, image_url, price, fetched_at')
          .in('test_id', ids)).data ?? []
      : [];
    const cacheMap = new Map(cached.map((row) => [row.test_id, row]));
    const cutoff = Date.now() - CACHE_TTL_MS;

    const results = await Promise.all(
      parsed.data.items.map(async (item) => {
        const hit = cacheMap.get(item.id);
        if (hit && hit.fetched_at && new Date(hit.fetched_at).getTime() > cutoff) {
          return {
            id: item.id,
            provider_id: item.provider_id,
            title: hit.title ?? item.test_name,
            description: hit.description ?? null,
            image_url: hit.image_url ?? null,
            price: hit.price ?? null,
            url: item.url,
          };
        }
        try {
          const fresh = await scrapeProductPage(item);
          if (sb) {
            await sb.from('popular_test_enrichment_cache').upsert({
              test_id: item.id,
              provider_id: item.provider_id,
              url: item.url,
              title: fresh.title,
              description: fresh.description,
              image_url: fresh.image_url,
              price: fresh.price,
              fetched_at: new Date().toISOString(),
            });
          }
          return fresh;
        } catch (error) {
          console.error('popular-test-website-data scrape failed', item.url, error);
          // Fall back to stale cache if available
          if (hit) {
            return {
              id: item.id,
              provider_id: item.provider_id,
              title: hit.title ?? item.test_name,
              description: hit.description ?? null,
              image_url: hit.image_url ?? null,
              price: hit.price ?? null,
              url: item.url,
            };
          }
          return {
            id: item.id,
            provider_id: item.provider_id,
            title: item.test_name,
            description: null,
            image_url: null,
            price: null,
            url: item.url,
          };
        }
      })
    );

    return new Response(JSON.stringify({ items: results }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('popular-test-website-data fatal', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});