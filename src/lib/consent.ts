/**
 * Consent helpers — read the live Cookiebot consent state.
 * Used by analytics, marketing, and affiliate-tracking helpers to gate
 * behaviour on the visitor's explicit GDPR consent (UK GDPR / DPA 2018).
 *
 * Cookiebot category mapping:
 *   necessary  → Cookiebot.consent.necessary   (always true once answered)
 *   functional → Cookiebot.consent.preferences
 *   analytics  → Cookiebot.consent.statistics
 *   marketing  → Cookiebot.consent.marketing
 *
 * Before the visitor answers the banner (or if Cookiebot has not loaded),
 * every optional category reports false — deny by default.
 */

export type ConsentCategory =
  "necessary" | "analytics" | "marketing" | "functional";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookiebotConsentState {
  necessary?: boolean;
  preferences?: boolean;
  statistics?: boolean;
  marketing?: boolean;
}

interface CookiebotGlobal {
  consent?: CookiebotConsentState;
}

declare global {
  interface Window {
    Cookiebot?: CookiebotGlobal;
  }
}

const DEFAULT_PREFS: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export function getConsent(): CookiePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  const consent = window.Cookiebot?.consent;
  if (!consent) return DEFAULT_PREFS;
  return {
    necessary: consent.necessary !== false,
    analytics: consent.statistics === true,
    marketing: consent.marketing === true,
    functional: consent.preferences === true,
  };
}

export function hasConsent(category: ConsentCategory): boolean {
  return getConsent()[category] === true;
}
