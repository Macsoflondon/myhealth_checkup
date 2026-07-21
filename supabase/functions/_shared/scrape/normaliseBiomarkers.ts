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
  /^\d+\s+biomarkers?$/i,
  /^see (all|more)/i,
  /^and more$/i,
];

function collapseWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function isNoise(s: string): boolean {
  if (!s) return true;
  if (s.length < 2) return true;
  if (s.length > 120) return true;
  return NOISE_PATTERNS.some((re) => re.test(s));
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
