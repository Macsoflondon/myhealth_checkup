/**
 * Normalise a raw biomarker list scraped from a provider page.
 *
 * Rules:
 *  - Preserve provider spelling (British English, no aggressive rewrites).
 *  - Trim whitespace, collapse internal runs of whitespace.
 *  - Drop empty entries and obvious non-biomarker noise (headings, bullets).
 *  - Case-insensitive de-duplication, but keep the first-seen casing.
 *  - Preserve order (providers list biomarkers in clinically meaningful groups).
 */

const NOISE_PATTERNS: RegExp[] = [
  /^biomarkers?\s*(included|tested|measured)?[:\-]?$/i,
  /^what('?s| is) (tested|measured|included)/i,
  /^includes?[:\-]?$/i,
  // Count placeholders: "1 Biomarker", "35 Biomarkers", "10 markers",
  // "35 biomarkers included", "Biomarkers: 35", "12 tests".
  /^\d+\s*(?:bio)?\s*markers?(?:\s+(?:included|tested|measured|analysed))?$/i,
  /^(?:bio)?markers?\s*[:\-]?\s*\d+$/i,
  /^\d+\s*tests?(?:\s+included)?$/i,
  /^see (all|more)/i,
  /^and more$/i,
];

/** Non-breaking, narrow and zero-width spaces seen in provider markup. */
const ODD_SPACES = /[\u00a0\u2007\u202f\u2009\u200a\u200b\u2060\ufeff]/g;

function collapseWhitespace(s: string): string {
  return s
    .replace(/&(?:nbsp|#160|#xa0);/gi, " ")
    .replace(ODD_SPACES, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isNoise(s: string): boolean {
  if (!s) return true;
  if (s.length < 2) return true;
  if (s.length > 120) return true;
  return NOISE_PATTERNS.some((re) => re.test(s));
}

/** True when `s` is page furniture or a count placeholder, not a marker name. */
export function isBiomarkerNoise(s: string): boolean {
  return isNoise(collapseWhitespace(s));
}

export function normaliseBiomarkers(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of input) {
    if (raw === null || raw === undefined) continue;
    const s = collapseWhitespace(String(raw)).replace(/^[•·\-\*\u2022]\s*/, "");
    if (isNoise(s)) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}
