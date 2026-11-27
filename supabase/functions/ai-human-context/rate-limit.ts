import { clientIp } from "../_shared/client-ip.ts";

/** Per-IP limits that keep anonymous use of the finder affordable. */
export const MINUTE_LIMIT = 8;
export const DAILY_LIMIT = 30;
export const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
export const DAILY_ENDPOINT = "ai-human-context-daily";

/** One shared rolling window caps paid model calls across every visitor. */
export const AI_DAILY_GLOBAL_LIMIT = 1000;
export const GLOBAL_DAILY_ENDPOINT = "ai-human-context-paid-global-daily";
export const GLOBAL_DAILY_CLIENT_KEY = "all-visitors";

export interface DailyWindow {
  request_count: number;
  window_start: string;
}

export type DailyDecision =
  | { allowed: true; action: "start" }
  | { allowed: true; action: "increment"; nextCount: number }
  | { allowed: false };

export type GlobalDailyDecision =
  | { allowed: true; action: "start"; justReached: false }
  | {
      allowed: true;
      action: "increment";
      nextCount: number;
      justReached: boolean;
    }
  | { allowed: false; justReached: false };

/** Decide whether an IP may make another request in its rolling 24-hour window. */
export function decideDailyCap(
  window: DailyWindow | null,
  now: number,
): DailyDecision {
  if (!window) return { allowed: true, action: "start" };
  const started = Date.parse(window.window_start);
  if (!Number.isFinite(started) || now - started >= DAILY_WINDOW_MS) {
    return { allowed: true, action: "start" };
  }
  const count = Number(window.request_count) || 0;
  if (count >= DAILY_LIMIT) return { allowed: false };
  return { allowed: true, action: "increment", nextCount: count + 1 };
}

/** Decide whether one more paid AI call fits in the shared rolling window. */
export function decideGlobalDailyCap(
  window: DailyWindow | null,
  now: number,
): GlobalDailyDecision {
  if (!window) return { allowed: true, action: "start", justReached: false };
  const started = Date.parse(window.window_start);
  if (!Number.isFinite(started) || now - started >= DAILY_WINDOW_MS) {
    return { allowed: true, action: "start", justReached: false };
  }
  const count = Number(window.request_count) || 0;
  if (count >= AI_DAILY_GLOBAL_LIMIT)
    return { allowed: false, justReached: false };
  const nextCount = count + 1;
  return {
    allowed: true,
    action: "increment",
    nextCount,
    justReached: nextCount === AI_DAILY_GLOBAL_LIMIT,
  };
}

/** Paid AI is optional; every visitor receives deterministic scoring without it. */
export function recommendationMode(
  hasOpenAiKey: boolean,
  globalCapAllowed: boolean,
): "paid-ai" | "keyword-scoring" {
  return hasOpenAiKey && globalCapAllowed ? "paid-ai" : "keyword-scoring";
}

/** Client IP from validated edge headers, never caller-controlled forwarding lists. */
export function clientIpFrom(headers: Headers): string {
  return clientIp(headers) ?? "unknown";
}
