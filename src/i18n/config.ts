import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Default to GB English (en = en-GB for this platform)
    supportedLngs: ['en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'pl', 'ar', 'zh', 'ja'],
    debug: false,

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      // Map en-GB and en-US to our 'en' which is GB English
      convertDetectedLanguage: (lng: string) => {
        if (lng.startsWith('en')) return 'en'; // All English variants use GB English
        return lng.split('-')[0]; // Use base language code
      },
    },
  });

export default i18n;