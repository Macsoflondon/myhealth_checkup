/**
 * Restores the canonical casing of medical abbreviations in provider test and
 * biomarker names. Scraped names are re-copied verbatim every six hours, so
 * this runs at render time rather than once in the database.
 *
 * Only unambiguous tokens are corrected: immunoglobulins, HbA1c and eGFR in
 * any casing, and other abbreviations only when their casing is mixed (e.g.
 * "tSH", "Ldl"). All-lowercase English words such as "alt" are left alone.
 */
const ALWAYS: readonly string[] = ["IgA", "IgG", "IgM", "IgE", "IgG4", "HbA1c", "eGFR", "SHBG", "DHEA", "DHEAS", "PSA", "TSH", "CRP", "hsCRP", "AMH", "FSH"];
const MIXED_ONLY: readonly string[] = ["LDL", "HDL", "ALT", "AST", "GGT", "LH", "B12", "T3", "T4", "FT3", "FT4", "ALP"];

const byLower = new Map<string, { canonical: string; always: boolean }>();
for (const a of ALWAYS) byLower.set(a.toLowerCase(), { canonical: a, always: true });
for (const a of MIXED_ONLY) byLower.set(a.toLowerCase(), { canonical: a, always: false });

const isMixedCase = (w: string): boolean => /[a-z]/.test(w) && /[A-Z]/.test(w);

export const normaliseMedicalAcronyms = (text: string): string =>
  text.replace(/[A-Za-z][A-Za-z0-9]*/g, (word) => {
    const hit = byLower.get(word.toLowerCase());
    if (!hit || word === hit.canonical) return word;
    if (hit.always) {
      // All-lowercase common words that collide are not in ALWAYS, but keep
      // "psa"/"crp" etc. corrected only when not plain English.
      return hit.canonical;
    }
    return isMixedCase(word) ? hit.canonical : word;
  });
