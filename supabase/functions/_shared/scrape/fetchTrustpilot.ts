/**
 * Fetch a Trustpilot business rating + review count.
 *
 * Trustpilot embeds a JSON-LD `AggregateRating` block on every business page.
 * We parse it directly (no scraping of visible DOM), and cache results for
 * 24 hours to be a good citizen.
 *
 * NEVER fabricate: returns nulls on failure.
 */

import { getErrorMessage } from "../errors.ts";

export interface TrustpilotResult {
  rating: number | null;
  reviewCount: number | null;
  fetchedAt: string;
  source: string;
}

interface CacheEntry {
  fetchedAt: number;
  data: TrustpilotResult;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

interface JsonLdRating {
  "@type"?: string | string[];
  aggregateRating?: {
    ratingValue?: number | string;
    reviewCount?: number | string;
  };
}

function extractRating(html: string): { rating: number | null; count: number | null } {
  const scripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of scripts) {
    try {
      const parsed = JSON.parse(m[1].trim()) as JsonLdRating | JsonLdRating[];
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        const ar = node?.aggregateRating;
        if (ar && (ar.ratingValue !== undefined || ar.reviewCount !== undefined)) {
          const rating = ar.ratingValue !== undefined ? Number(ar.ratingValue) : null;
          const count = ar.reviewCount !== undefined ? Number(ar.reviewCount) : null;
          return {
            rating: Number.isFinite(rating) ? rating : null,
            count: Number.isFinite(count) ? count : null,
          };
        }
      }
    } catch {
      // ignore malformed json-ld blocks
    }
  }
  return { rating: null, count: null };
}

/**
 * `domainOrSlug` accepts either "medichecks.com" (a bare domain that
 * matches a Trustpilot review URL) or a full "https://www.trustpilot.com/..."
 * URL if the caller already knows the exact page.
 */
export async function fetchTrustpilot(domainOrSlug: string): Promise<TrustpilotResult> {
  const key = domainOrSlug.toLowerCase().trim();
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) return cached.data;

  const url = key.startsWith("http")
    ? key
    : `https://www.trustpilot.com/review/${encodeURIComponent(key)}`;

  const fallback: TrustpilotResult = {
    rating: null,
    reviewCount: null,
    fetchedAt: new Date().toISOString(),
    source: url,
  };

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; myhealthcheckup-scraper/1.0; +https://myhealthcheckup.co.uk)",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      cache.set(key, { fetchedAt: now, data: fallback });
      return fallback;
    }
    const html = await res.text();
    const { rating, count } = extractRating(html);
    const result: TrustpilotResult = {
      rating,
      reviewCount: count,
      fetchedAt: new Date().toISOString(),
      source: url,
    };
    cache.set(key, { fetchedAt: now, data: result });
    return result;
  } catch (err) {
    console.warn(`[trustpilot] fetch failed for ${url}:`, getErrorMessage(err));
    cache.set(key, { fetchedAt: now, data: fallback });
    return fallback;
  }
}
