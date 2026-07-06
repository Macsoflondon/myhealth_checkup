// Shared Firecrawl helpers for provider scrapers.
// Uses v2 endpoint with stealth proxy + long timeouts to bypass Cloudflare/anti-bot.

export interface FirecrawlScrapeOpts {
  formats?: (string | Record<string, unknown>)[];
  onlyMainContent?: boolean;
  waitFor?: number;
  timeout?: number;
  proxy?: 'basic' | 'stealth' | 'auto';
}

const V2 = 'https://api.firecrawl.dev/v2';

const RETRY_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 522, 524]);
const MAX_ATTEMPTS = 5;

function backoffDelay(attempt: number, retryAfterHeader?: string | null): number {
  if (retryAfterHeader) {
    const secs = Number(retryAfterHeader);
    if (!Number.isNaN(secs) && secs > 0) return Math.min(secs * 1000, 30_000);
  }
  // exp backoff: 1s, 2s, 4s, 8s, 16s + jitter (max ~20s)
  const base = Math.min(1000 * 2 ** (attempt - 1), 16_000);
  return base + Math.floor(Math.random() * 500);
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  label: string,
): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res;
      if (!RETRY_STATUS.has(res.status) || attempt === MAX_ATTEMPTS) return res;
      const delay = backoffDelay(attempt, res.headers.get('retry-after'));
      console.warn(`[firecrawl:${label}] ${res.status} — retry ${attempt}/${MAX_ATTEMPTS - 1} in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    } catch (e) {
      lastErr = e;
      if (attempt === MAX_ATTEMPTS) throw e;
      const delay = backoffDelay(attempt);
      console.warn(`[firecrawl:${label}] network err — retry ${attempt}/${MAX_ATTEMPTS - 1} in ${delay}ms: ${e instanceof Error ? e.message : String(e)}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr ?? new Error(`firecrawl:${label} exhausted retries`);
}

/**
 * Scrape a single URL with sensible defaults for hard targets (Cloudflare/JS-heavy).
 * Auto-retries with exponential backoff on 408/425/429/5xx (up to 5 attempts).
 */
export async function firecrawlScrape(
  url: string,
  apiKey: string,
  opts: FirecrawlScrapeOpts = {},
): Promise<{ success: boolean; data?: any; markdown?: string; html?: string; metadata?: any; error?: string }> {
  const body = {
    url,
    formats: opts.formats ?? ['markdown'],
    onlyMainContent: opts.onlyMainContent ?? true,
    waitFor: opts.waitFor ?? 5000,
    timeout: opts.timeout ?? 90000,
    proxy: opts.proxy ?? 'stealth',
  };

  const res = await fetchWithRetry(
    `${V2}/scrape`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    `scrape ${new URL(url).hostname}`,
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Firecrawl scrape ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  if (json?.data && !json.markdown) {
    return { success: json.success, data: json.data, ...json.data };
  }
  return json;
}

export async function firecrawlMap(
  url: string,
  apiKey: string,
  opts: { search?: string; limit?: number; includeSubdomains?: boolean } = {},
): Promise<string[]> {
  const res = await fetchWithRetry(
    `${V2}/map`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        search: opts.search,
        limit: opts.limit ?? 200,
        includeSubdomains: opts.includeSubdomains ?? false,
      }),
    },
    `map ${new URL(url).hostname}`,
  );
  if (!res.ok) throw new Error(`Firecrawl map ${res.status}`);
  const data = await res.json();
  const rawLinks = data.links ?? data.data?.links ?? [];
  return rawLinks
    .map((l: unknown) => (typeof l === 'string' ? l : (l as { url?: string })?.url))
    .filter((l: unknown): l is string => typeof l === 'string' && l.length > 0);
}

/** Worker-pool concurrency (batch mode) — N workers pull from a shared queue.
 *  Unlike chunked Promise.all, a slow item doesn't block the rest of its chunk. */
export async function runInChunks<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const worker = async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      try {
        results[idx] = await fn(items[idx], idx);
      } catch (e) {
        console.error(`[runInChunks] item ${idx} failed:`, e instanceof Error ? e.message : String(e));
        results[idx] = undefined as unknown as R;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}
