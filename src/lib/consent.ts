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

export const COOKIEBOT_CBID = "8a435b14-6f4f-4015-93f4-f2ffe5d6f9ff";
export const COOKIEBOT_SCRIPT_ID = "Cookiebot";
export const COOKIEBOT_SRC = "https://consent.cookiebot.com/uc.js";

/**
 * Load the Cookiebot banner script. Call once, after React has hydrated.
 *
 * It must not run from the server-rendered <head>:
 *  - uc.js inserts its dialog as the first child of <body>. If that happens
 *    before hydration, React finds the dialog where it expects #app-root,
 *    throws hydration error #418 and re-renders the whole page on the client.
 *  - Auto-blocking mode needs the script synchronous in <head>, where it held
 *    up first paint by about 1.6s on mobile.
 *
 * Manual blocking mode loses nothing: the app loads no third-party tags, and
 * every optional tracker checks hasConsent() above, which denies by default
 * until uc.js has loaded and the visitor has answered the banner.
 */
export function loadCookiebot(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(COOKIEBOT_SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = COOKIEBOT_SCRIPT_ID;
  script.src = COOKIEBOT_SRC;
  script.async = true;
  script.setAttribute("data-cbid", COOKIEBOT_CBID);
  script.setAttribute("data-blockingmode", "manual");
  document.head.appendChild(script);
}
