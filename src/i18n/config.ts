import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getFallbackLabel } from './fallbackLabels';


// Import translation files
import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';
import esTranslations from '../locales/es.json';
import deTranslations from '../locales/de.json';
import itTranslations from '../locales/it.json';
import ptTranslations from '../locales/pt.json';
import nlTranslations from '../locales/nl.json';
import plTranslations from '../locales/pl.json';
import arTranslations from '../locales/ar.json';
import zhTranslations from '../locales/zh.json';
import jaTranslations from '../locales/ja.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  es: {
    translation: esTranslations,
  },
  de: {
    translation: deTranslations,
  },
  it: {
    translation: itTranslations,
  },
  pt: {
    translation: ptTranslations,
  },
  nl: {
    translation: nlTranslations,
  },
  pl: {
    translation: plTranslations,
  },
  ar: {
    translation: arTranslations,
  },
  zh: {
    translation: zhTranslations,
  },
  ja: {
    translation: jaTranslations,
  },
};

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'pl', 'ar', 'zh', 'ja'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isSupported = (code: string): code is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(code);

/**
 * Resolve a BCP-47 tag (en-GB, pt-BR, zh-Hant-TW, nb-NO) to a supported code.
 * All English variants collapse to 'en' (GB English is the base locale).
 */
export const resolveLanguageTag = (tag: string): SupportedLanguage | null => {
  const normalised = tag.toLowerCase().trim();
  if (!normalised) return null;
  if (normalised.startsWith('en')) return 'en';
  const base = normalised.split('-')[0];
  // Chinese script/region variants (zh-Hans, zh-Hant, zh-TW, zh-HK) all map to zh
  if (base === 'zh') return 'zh';
  return isSupported(base) ? base : null;
};

/**
 * Best match across the full ordered browser/OS preference list, not just the
 * first entry — a user with ["nb-NO", "de-DE", "en-GB"] gets German, not English.
 */
export const detectPreferredLanguage = (
  tags: readonly string[] = typeof navigator === 'undefined'
    ? []
    : navigator.languages?.length
      ? navigator.languages
      : [navigator.language],
): SupportedLanguage => {
  for (const tag of tags) {
    const match = resolveLanguageTag(tag);
    if (match) return match;
  }
  return 'en';
};

/** Custom detector: runs only when no stored choice exists (localStorage wins). */
const navigatorBestMatch = {
  name: 'navigatorBestMatch',
  lookup: () => (typeof navigator === 'undefined' ? undefined : detectPreferredLanguage()),
  cacheUserLanguage: () => {
    /* caching is handled by the localStorage detector */
  },
};

const detector = new LanguageDetector();
detector.addDetector(navigatorBestMatch);

/** Keep <html lang>/<html dir> in sync with the active language. */
export const syncDocumentLanguage = (code: string) => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = code === 'en' ? 'en-GB' : code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    // No hard-coded `lng` — the detector reads localStorage first so an explicit
    // user choice always beats auto-detection, then falls back to browser/OS.
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    debug: false,

    // When a key is missing from the locale JSON, look it up in the
    // centralised fallback dictionary before returning the raw key. This
    // stops English field labels from leaking through when a translation
    // file is out of date.
    parseMissingKeyHandler: (key: string) => {
      const lang = i18n.language || 'en';
      const fallback = getFallbackLabel(key, lang);
      return fallback ?? key;
    },


    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      // localStorage first (explicit choice), then best match across the whole
      // navigator preference list, then the server-rendered <html lang>.
      order: ['localStorage', 'navigatorBestMatch', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      convertDetectedLanguage: (lng: string) => resolveLanguageTag(lng) ?? 'en',
    },
  });

i18n.on('languageChanged', syncDocumentLanguage);
if (typeof document !== 'undefined') syncDocumentLanguage(i18n.language || 'en');

export default i18n;
