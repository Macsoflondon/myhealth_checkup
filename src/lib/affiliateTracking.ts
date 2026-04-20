/**
 * Affiliate / outbound click tracking.
 * Wraps `buildTrackedUrl` and emits a consent-aware analytics event so we can
 * audit affiliate referrals without firing trackers when the user has refused
 * marketing/analytics cookies (UK GDPR, ICO guidance).
 */

import { hasConsent } from '@/lib/consent';
import { logger } from '@/lib/logger';

export interface AffiliateClickEvent {
  providerId: string;
  providerName?: string;
  testName?: string;
  destinationUrl: string;
  surface?: string; // e.g. 'compare-table', 'provider-card', 'test-detail'
}

type GtagFn = (...args: unknown[]) => void;
type DataLayer = Array<Record<string, unknown>>;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: DataLayer;
  }
}

/**
 * Track an affiliate click. Safe to call regardless of consent state — no
 * network calls or persistent identifiers are sent unless the user has
 * accepted analytics cookies.
 */
export function trackAffiliateClick(event: AffiliateClickEvent): void {
  if (typeof window === 'undefined') return;

  const payload = {
    event: 'affiliate_click',
    provider_id: event.providerId,
    provider_name: event.providerName,
    test_name: event.testName,
    surface: event.surface ?? 'unknown',
    // Strip any query string from the destination for privacy in analytics.
    destination_host: safeHost(event.destinationUrl),
    timestamp: new Date().toISOString(),
  };

  // Always log locally for debugging — never PII, never the full URL.
  logger.info('[affiliate]', payload);

  if (!hasConsent('analytics')) return;

  // Push into the data layer for GTM-style consumers.
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  // Direct gtag fallback when GA4 is loaded.
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'affiliate_click', payload);
  }
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return 'invalid-url';
  }
}
