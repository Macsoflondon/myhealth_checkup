/**
 * Lightweight analytics wrapper.
 *
 * Forwards events to:
 *  - window.dataLayer  (GA4 / GTM, if present)
 *  - window.gtag       (GA4 direct, if present)
 *  - window.plausible  (Plausible, if present)
 *  - window.posthog    (PostHog, if present)
 *
 * Falls back to a console.debug log in dev so events are observable
 * before a provider is wired up. Never throws.
 */

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: AnalyticsProps }) => void;
    posthog?: { capture: (event: string, props?: AnalyticsProps) => void };
  }
}

const isBrowser = typeof window !== "undefined";

export function trackEvent(event: string, props: AnalyticsProps = {}): void {
  if (!isBrowser) return;

  const payload = { event, ...props, ts: Date.now() };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function") {
      window.gtag("event", event, props);
    }
    if (typeof window.plausible === "function") {
      window.plausible(event, { props });
    }
    if (window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(event, props);
    }

    if (import.meta.env.DEV) {
       
      console.debug("[analytics]", event, props);
    }
  } catch {
    /* swallow — analytics must never break the UI */
  }
}

/** Convenience helpers for the events the kit-tile measurement plan uses. */
export const analytics = {
  kitTileClick: (props: {
    tile_id: string;
    tile_label: string;
    destination: string;
    surface: "goodbody_bento" | "accredited_providers_bar" | string;
  }) => trackEvent("kit_tile_click", props),

  testPageView: (props: { path: string; test_slug?: string; category?: string }) =>
    trackEvent("test_page_view", props),
};
