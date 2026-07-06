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

/**
 * Scrape a single URL with sensible defaults for hard targets (Cloudflare/JS-heavy).
 * Retries once on 408/5xx.
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

  const attempt = async (): Promise<Response> =>
    fetch(`${V2}/scrape`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  let res = await attempt();
  if (!res.ok && (res.status === 408 || res.status >= 500)) {
    await new Promise((r) => setTimeout(r, 1500));
    res = await attempt();
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Firecrawl scrape ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  // v2 returns { success, data: { markdown, html, metadata } } — normalize so callers can use both shapes
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
  const res = await fetch(`${V2}/map`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      search: opts.search,
      limit: opts.limit ?? 200,
      includeSubdomains: opts.includeSubdomains ?? false,
    }),
  });
  if (!res.ok) throw new Error(`Firecrawl map ${res.status}`);
  const data = await res.json();
  // v2 returns { success, links: [{ url, title? }] } — normalize to string[]
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
