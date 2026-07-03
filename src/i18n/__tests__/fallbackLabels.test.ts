import { describe, it, expect } from 'vitest';
import {
  CRITICAL_LABEL_KEYS,
  FALLBACK_LABELS,
  NON_ENGLISH_LANGUAGES,
  findMissingCriticalKeys,
  getFallbackLabel,
} from '../fallbackLabels';

describe('fallbackLabels', () => {
  it.each(NON_ENGLISH_LANGUAGES)(
    'has every critical label translated for %s',
    (lang) => {
      const missing = findMissingCriticalKeys(lang);
      expect(missing, `missing keys for ${lang}: ${missing.join(', ')}`).toEqual([]);
    },
  );

  // Subset of keys whose localised label MUST differ from English —
  // cognates like "Biomarkers" / "Provider" are allowed to match across
  // some Germanic languages so they're excluded from this stricter check.
  const MUST_DIFFER_FROM_ENGLISH = [
    'Compare', 'Book', 'Enquire', 'Added', 'View details', 'Book now',
    'Add to compare', 'Learn more', 'Read more', 'Loading',
  ] as const;

  it.each(NON_ENGLISH_LANGUAGES)(
    'never returns a raw English CTA for %s',
    (lang) => {
      for (const key of MUST_DIFFER_FROM_ENGLISH) {
        const translated = getFallbackLabel(key, lang);
        expect(translated, `missing ${key} for ${lang}`).toBeTruthy();
        expect(translated, `${lang} -> ${key} is still English`).not.toBe(key as string);
      }
    },
  );



  it('returns null for English or unknown languages', () => {
    expect(getFallbackLabel('Compare', 'en')).toBeNull();
    expect(getFallbackLabel('Compare', 'en-GB')).toBeNull();
    expect(getFallbackLabel('Compare', 'xx')).toBeNull();
  });

  it('trims whitespace before lookup', () => {
    expect(getFallbackLabel('  Compare  ', 'es')).toBe('Comparar');
  });

  it('exposes a dictionary for every declared non-English language', () => {
    for (const lang of NON_ENGLISH_LANGUAGES) {
      expect(FALLBACK_LABELS[lang]).toBeDefined();
      expect(Object.keys(FALLBACK_LABELS[lang]).length).toBeGreaterThan(0);
    }
  });
});
