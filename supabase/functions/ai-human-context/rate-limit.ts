/** Per-IP limits that keep anonymous use of the finder affordable. */
export const MINUTE_LIMIT = 8;
export const DAILY_LIMIT = 30;
export const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
export const DAILY_ENDPOINT = "ai-human-context-daily";

export interface DailyWindow {
  request_count: number;
  window_start: string;
}

export type DailyDecision =
  | { allowed: true; action: "start" }
  | { allowed: true; action: "increment"; nextCount: number }
  | { allowed: false };

/**
 * Decide whether an IP may make another request in its rolling 24-hour
 * window. A missing or expired window starts a fresh one.
 */
export function decideDailyCap(window: DailyWindow | null, now: number): DailyDecision {
  if (!window) return { allowed: true, action: "start" };
  const started = Date.parse(window.window_start);
  if (!Number.isFinite(started) || now - started >= DAILY_WINDOW_MS) {
    return { allowed: true, action: "start" };
  }
  const count = Number(window.request_count) || 0;
  if (count >= DAILY_LIMIT) return { allowed: false };
  return { allowed: true, action: "increment", nextCount: count + 1 };
}

/** Client IP from the edge headers, preferring Cloudflare's. */
export function clientIpFrom(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
