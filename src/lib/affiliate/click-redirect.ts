import { providerForHost } from "./affiliate-config";
import {
  AFFILIATE_CLICK_ENDPOINT,
  type AffiliatePlacement,
} from "./affiliate-tracking";

/** Clicks allowed per visitor (hashed address) per 10-minute window. */
export const AFFILIATE_CLICKS_PER_WINDOW = 20;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isCatalogueTestId(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

/**
 * Accepts a catalogue URL only when it is https/http and its host belongs to
 * the provider that owns the test. Request-supplied URLs never reach here.
 */
export function verifiedProviderUrl(
  catalogueUrl: string | null | undefined,
  providerId: string,
): URL | null {
  if (!catalogueUrl) return null;
  try {
    const url = new URL(catalogueUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const owner = providerForHost(url.hostname);
    if (owner !== null && owner !== providerId) return null;
    return url;
  } catch {
    return null;
  }
}

/** Same-origin tracked link: the server resolves the destination itself. */
export function trackedClickHref(
  testId: string,
  placement: AffiliatePlacement,
  sourcePage: string,
): string {
  const q = new URLSearchParams({ test: testId, pl: placement, src: sourcePage });
  return `${AFFILIATE_CLICK_ENDPOINT}?${q.toString()}`;
}

/** Salted, day-rotating SHA-256 of the address. The raw IP is never stored. */
export async function hashVisitor(
  ip: string,
  secret: string,
  now: Date = new Date(),
): Promise<string> {
  const day = now.toISOString().slice(0, 10);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${day}|${ip}`),
  );
  return Array.from(new Uint8Array(sig), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
