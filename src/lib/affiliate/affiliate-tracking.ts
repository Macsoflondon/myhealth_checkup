import {
  AFFILIATE_PROVIDERS,
  providerForHost,
  type AffiliateProviderConfig,
} from "./affiliate-config";

/**
 * Affiliate click tracking for outbound provider links.
 * - A fresh random click_id per click; nothing is written to cookies or
 *   any browser storage.
 * - The click_id is appended as the provider's sub-ID parameter when one is
 *   configured; otherwise the URL is left as it is.
 * - Logging is fire-and-forget and can never stop the link from opening.
 */

export const AFFILIATE_PLACEMENTS = [
  "card",
  "detail",
  "comparison",
  "quiz",
  "provider_page",
] as const;
export type AffiliatePlacement = (typeof AFFILIATE_PLACEMENTS)[number];

export const AFFILIATE_CLICK_ENDPOINT = "/api/public/affiliate-click";

export type AffiliateClickPayload = {
  click_id: string;
  provider_id: string;
  test_id: string | null;
  source_page: string;
  placement: AffiliatePlacement;
  destination_host: string;
};

export function isAffiliatePlacement(v: unknown): v is AffiliatePlacement {
  return (
    typeof v === "string" &&
    (AFFILIATE_PLACEMENTS as readonly string[]).includes(v)
  );
}

/** Route only: strips query string and fragment, caps the length. */
export function sanitiseSourcePage(pathname: string): string {
  const path = pathname.split(/[?#]/)[0] || "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.slice(0, 300);
}

/** Best guess when the link carries no explicit placement. */
export function inferPlacement(pathname: string): AffiliatePlacement {
  const p = pathname.toLowerCase();
  if (/^\/(quiz|assisted-test-finder|test-finder\/recommendations|recommendations)/.test(p))
    return "quiz";
  if (/^\/(compare|test-finder\/compare|comparison)/.test(p))
    return "comparison";
  if (/^\/provider\/[^/]+\/tests\/[^/]+/.test(p)) return "detail";
  if (/^\/providers?\/[^/]+\/?$/.test(p)) return "provider_page";
  return "card";
}

/** Appends click_id under the provider's sub-ID parameter, if configured. */
export function appendClickId(
  href: string,
  providerId: string,
  clickId: string,
  providers: Readonly<Record<string, AffiliateProviderConfig>> = AFFILIATE_PROVIDERS,
): string {
  const param = providers[providerId]?.subIdParam;
  if (!param) return href;
  try {
    const url = new URL(href);
    url.searchParams.set(param, clickId);
    return url.toString();
  } catch {
    return href;
  }
}

export function newClickId(): string {
  return crypto.randomUUID();
}

/** Sends the click without blocking navigation. Never throws. */
export function sendAffiliateClick(payload: AffiliateClickPayload): void {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(AFFILIATE_CLICK_ENDPOINT, blob)) return;
    }
    void fetch(AFFILIATE_CLICK_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => undefined);
  } catch {
    // Logging must never affect the click.
  }
}

/**
 * Handles one click on an anchor. Rewrites its href in place (the browser
 * then opens it exactly as before) and logs the click.
 * Returns the payload sent, or null when the link is not a provider link.
 */
export function handleAffiliateAnchorClick(
  anchor: HTMLAnchorElement,
  pathname: string,
  send: (p: AffiliateClickPayload) => void = sendAffiliateClick,
): AffiliateClickPayload | null {
  try {
    // Keep the untouched URL so repeat clicks don't stack parameters.
    const original = anchor.dataset.affiliateHref ?? anchor.href;
    let url: URL;
    try {
      url = new URL(original);
    } catch {
      return null;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const providerId =
      anchor.closest<HTMLElement>("[data-affiliate-provider]")?.dataset
        .affiliateProvider ?? providerForHost(url.hostname);
    if (!providerId) return null;

    anchor.dataset.affiliateHref = original;
    const clickId = newClickId();
    anchor.href = appendClickId(original, providerId, clickId);

    const declared = anchor.closest<HTMLElement>("[data-affiliate-placement]")
      ?.dataset.affiliatePlacement;
    const payload: AffiliateClickPayload = {
      click_id: clickId,
      provider_id: providerId,
      test_id:
        anchor.closest<HTMLElement>("[data-affiliate-test-id]")?.dataset
          .affiliateTestId ?? null,
      source_page: sanitiseSourcePage(pathname),
      placement: isAffiliatePlacement(declared)
        ? declared
        : inferPlacement(pathname),
      destination_host: url.hostname.toLowerCase(),
    };
    send(payload);
    return payload;
  } catch {
    return null;
  }
}

/** Installs one delegated listener covering every outbound provider link. */
export function installAffiliateClickTracking(doc: Document = document): () => void {
  const listener = (event: MouseEvent): void => {
    // Left click and middle click open the link; ignore right click.
    if (event.button !== 0 && event.button !== 1) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    handleAffiliateAnchorClick(anchor, doc.location.pathname);
  };
  doc.addEventListener("click", listener, true);
  doc.addEventListener("auxclick", listener, true);
  return () => {
    doc.removeEventListener("click", listener, true);
    doc.removeEventListener("auxclick", listener, true);
  };
}
