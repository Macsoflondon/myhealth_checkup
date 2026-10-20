/**
 * Reject page debris that markdown scrapes (Firecrawl) leave in biomarker
 * lists: headings, markdown links, URLs, site furniture and marketing
 * sentences. Only real marker names survive. Pure and dependency-free so
 * Deno scrapers and Vitest can both use it.
 *
 * Light markup is removed before judging an entry, so "1\. Testosterone**"
 * becomes "Testosterone". Headings are rejected outright, never unwrapped.
 */

const MAX_WORDS = 6;
const MAX_LENGTH = 60;

/** Strip list numbering, markdown emphasis and backslash escapes. */
export function stripEntryMarkup(raw: string): string {
  return raw
    .replace(/\\([.\-|*_#[\]()])/g, "$1")
    .replace(/^\s*\d+[.)]\s+/, "")
    .replace(/\*\*|__/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when an entry is page debris rather than a marker name. */
export function isBiomarkerDebris(raw: string): boolean {
  const original = raw.trim();
  if (!original) return true;
  // Markdown headings: "# ...", "### ...".
  if (/^#/.test(original)) return true;
  // Markdown links, bare URLs and domains.
  if (/\[[^\]]*\]\([^)]*\)|\]\(/.test(original)) return true;
  if (/https?:\/\/|www\./i.test(original)) return true;
  if (/\b[a-z0-9-]+\.(?:co\.uk|com|org|net|uk|io)\b/i.test(original)) {
    return true;
  }

  const entry = stripEntryMarkup(original);
  if (!entry) return true;
  // Company footer and address lines ("London Health Company (LHC) Ltd").
  if (/\b(?:ltd|limited|plc|llp|united kingdom)\b/i.test(entry)) return true;
  // Product titles ("Cortisol Blood Test Kit", "Iron Blood Test (5 Parameters)").
  if (/\b(?:blood test|test kit)\b/i.test(entry)) return true;
  if (/\(\d+\s+(?:biomarkers?|parameters?|markers?|tests?)\b/i.test(entry)) {
    return true;
  }
  // Table/title separators only appear in page titles.
  if (entry.includes("|")) return true;
  // Sentences: questions, exclamations, lead-ins and full stops.
  if (/[?!:]$/.test(entry)) return true;
  if (/\.(\s|$)/.test(entry)) return true;
  if (entry.length > MAX_LENGTH) return true;
  const words = entry
    .replace(/\([^)]*\)/g, " ")
    .trim()
    .split(/\s+/);
  if (words.length > MAX_WORDS) return true;
  return false;
}

/** Clean markup and drop debris, preserving order and first-seen casing. */
export function sanitiseBiomarkerEntries(input: readonly unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of input) {
    if (typeof item !== "string") continue;
    if (isBiomarkerDebris(item)) continue;
    const clean = stripEntryMarkup(item);
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out;
}
