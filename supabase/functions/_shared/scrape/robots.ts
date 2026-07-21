/**
 * Minimal robots.txt allowance check + token-bucket rate limiter.
 *
 * We deliberately keep robots parsing minimal: we look for User-agent: *
 * blocks and Disallow lines. Provider-specific User-agents (e.g. "Googlebot")
 * are ignored — we identify as a generic bot.
 */

import { getErrorMessage } from "../errors.ts";

interface RobotsCacheEntry {
  fetchedAt: number;
  disallow: string[];
  allow: string[];
}

const ROBOTS_TTL_MS = 24 * 60 * 60 * 1000;
const robotsCache = new Map<string, RobotsCacheEntry>();

function parseRobots(txt: string): { disallow: string[]; allow: string[] } {
  const lines = txt.split(/\r?\n/);
  let inStarBlock = false;
  const disallow: string[] = [];
  const allow: string[] = [];
  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.+)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "user-agent") {
      inStarBlock = value === "*";
      continue;
    }
    if (!inStarBlock) continue;
    if (key === "disallow" && value) disallow.push(value);
    if (key === "allow" && value) allow.push(value);
  }
  return { disallow, allow };
}

export async function isAllowedByRobots(url: string): Promise<boolean> {
  try {
    const u = new URL(url);
    const origin = u.origin;
    const cached = robotsCache.get(origin);
    let entry = cached;
    if (!entry || Date.now() - entry.fetchedAt > ROBOTS_TTL_MS) {
      try {
        const res = await fetch(`${origin}/robots.txt`, { redirect: "follow" });
        if (res.ok) {
          const txt = await res.text();
          const parsed = parseRobots(txt);
          entry = { fetchedAt: Date.now(), ...parsed };
        } else {
          entry = { fetchedAt: Date.now(), disallow: [], allow: [] };
        }
        robotsCache.set(origin, entry);
      } catch (err) {
        console.warn(`[robots] fetch failed for ${origin}:`, getErrorMessage(err));
        entry = { fetchedAt: Date.now(), disallow: [], allow: [] };
        robotsCache.set(origin, entry);
      }
    }

    const path = u.pathname + (u.search || "");
    // Allow rules take precedence over Disallow (per Google/robots conventions).
    if (entry.allow.some((p) => path.startsWith(p))) return true;
    if (entry.disallow.some((p) => p === "/" || path.startsWith(p))) return false;
    return true;
  } catch {
    return true;
  }
}

// -------------------- Token-bucket rate limiter --------------------

interface Bucket {
  tokens: number;
  capacity: number;
  refillPerMs: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitConfig {
  requestsPerSecond: number;
  burst?: number;
}

/**
 * Wait until a token is available for `key` (typically a provider id or host).
 * Guarantees at most `requestsPerSecond` sustained, `burst` peak.
 */
export async function acquireRateToken(key: string, cfg: RateLimitConfig): Promise<void> {
  const capacity = Math.max(1, cfg.burst ?? Math.ceil(cfg.requestsPerSecond));
  const refillPerMs = cfg.requestsPerSecond / 1000;

  let b = buckets.get(key);
  if (!b) {
    b = { tokens: capacity, capacity, refillPerMs, updatedAt: Date.now() };
    buckets.set(key, b);
  } else {
    // Reset config if caller passed a different one.
    b.capacity = capacity;
    b.refillPerMs = refillPerMs;
  }

  // Loop until we can consume a token.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const now = Date.now();
    const elapsed = now - b.updatedAt;
    b.tokens = Math.min(b.capacity, b.tokens + elapsed * b.refillPerMs);
    b.updatedAt = now;
    if (b.tokens >= 1) {
      b.tokens -= 1;
      return;
    }
    const waitMs = Math.ceil((1 - b.tokens) / b.refillPerMs);
    await new Promise((r) => setTimeout(r, waitMs));
  }
}

// Sensible per-provider defaults. Providers not listed fall back to 1 req/s.
export const PROVIDER_RATE_LIMITS: Record<string, RateLimitConfig> = {
  "medichecks": { requestsPerSecond: 1, burst: 2 },
  "medical-diagnosis": { requestsPerSecond: 1, burst: 2 },
  "lola-health": { requestsPerSecond: 1.5, burst: 3 }, // Shopify tolerates a bit more
  "london-medical-laboratory": { requestsPerSecond: 1, burst: 2 },
  "london-health-company": { requestsPerSecond: 1, burst: 2 },
  "goodbody-clinic": { requestsPerSecond: 1, burst: 2 },
  "clinilabs": { requestsPerSecond: 1, burst: 2 },
  "randox": { requestsPerSecond: 1, burst: 2 },
  "thriva": { requestsPerSecond: 1, burst: 2 },
};

export function getProviderRateLimit(providerId: string): RateLimitConfig {
  return PROVIDER_RATE_LIMITS[providerId] ?? { requestsPerSecond: 1, burst: 1 };
}
