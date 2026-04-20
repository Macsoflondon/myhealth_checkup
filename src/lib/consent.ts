/**
 * Consent helpers — surface stored cookie preferences and broadcast changes
 * Used by analytics, marketing, and affiliate-tracking helpers to gate behaviour
 * on the user's explicit GDPR consent (UK GDPR / DPA 2018).
 */

export type ConsentCategory = "necessary" | "analytics" | "marketing" | "functional";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const STORAGE_KEY = "cookieConsent";
export const CONSENT_EVENT = "consent:change";

const DEFAULT_PREFS: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export function getConsent(): CookiePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function hasConsent(category: ConsentCategory): boolean {
  return getConsent()[category] === true;
}

export function broadcastConsent(prefs: CookiePreferences): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<CookiePreferences>(CONSENT_EVENT, { detail: prefs }));
}
