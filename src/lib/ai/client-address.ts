/**
 * Client address for rate limiting anonymous AI calls.
 *
 * The live site is served through Lovable hosting behind Cloudflare.
 * Cloudflare sets cf-connecting-ip on every request it proxies and overwrites
 * any value the caller sends, so it is the trusted source. This holds only
 * while the origin is reachable through Cloudflare alone.
 *
 * x-forwarded-for is untrusted: a caller can send any list, and proxies append
 * to it. The first entry is whatever the caller wrote. Only the last entry was
 * added by the proxy nearest to us, so it is used as a fallback, and the result
 * is marked untrusted so callers can refuse to rate-limit by it.
 *
 * x-real-ip and true-client-ip are not used: neither is guaranteed to be set
 * or overwritten by this platform, so a caller could forge them.
 */

export type ClientAddressSource = "cf-connecting-ip" | "x-forwarded-for-last";

export interface ClientAddress {
  address: string;
  source: ClientAddressSource;
  trusted: boolean;
}

const IPV4 =
  /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
// Hex groups and colons, with an optional dotted IPv4 tail (::ffff:1.2.3.4).
const IPV6_CHARS = /^[0-9a-f:.]+$/i;

function isIpv6(value: string): boolean {
  const colons = value.split(":").length - 1;
  return colons >= 2 && colons <= 7 && IPV6_CHARS.test(value);
}

/** Accepts a bare IPv4 or IPv6 address; rejects ports, names and junk. */
export function normaliseIp(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.length > 45) return null;
  if (IPV4.test(trimmed)) return trimmed;
  if (isIpv6(trimmed)) return trimmed.toLowerCase();
  return null;
}

export function resolveClientAddress(headers: Headers): ClientAddress | null {
  const cf = normaliseIp(headers.get("cf-connecting-ip"));
  if (cf) return { address: cf, source: "cf-connecting-ip", trusted: true };

  const hops = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((hop) => hop.trim())
    .filter(Boolean);
  const last = normaliseIp(hops[hops.length - 1]);
  if (last) {
    return { address: last, source: "x-forwarded-for-last", trusted: false };
  }
  return null;
}

/**
 * Address to rate-limit an anonymous model call by, or null to refuse the
 * call. Only a trusted platform header qualifies.
 */
export function trustedClientAddress(headers: Headers): string | null {
  const resolved = resolveClientAddress(headers);
  return resolved?.trusted ? resolved.address : null;
}
