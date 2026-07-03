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

  it.each(NON_ENGLISH_LANGUAGES)(
    'never returns a raw English critical label for %s',
    (lang) => {
      for (const key of CRITICAL_LABEL_KEYS) {
        const translated = getFallbackLabel(key, lang);
        expect(translated, `missing ${key} for ${lang}`).toBeTruthy();
        // Coverage rule: the localised label must NOT be identical to the
        // English key — otherwise the "translated" UI is just English.
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
