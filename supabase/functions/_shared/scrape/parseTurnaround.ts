/**
 * Parse a free-text turnaround string from a provider page into structured units.
 *
 * Provider-verified data ONLY: if the text is empty or unparseable we return
 * `unit: 'not_stated'` — never fabricate a value.
 *
 * Handles common UK diagnostic phrasings:
 *  - "next working day", "same day", "same-day"
 *  - "results in 3 hours", "24 hours", "24-48 hours"
 *  - "2-5 days", "2 to 5 working days", "up to 10 working days"
 *  - "within 2 days", "typically 3 days"
 */

export interface TurnaroundParseResult {
  raw: string | null;
  hours: number | null;
  days: number | null;
  unit: "hours" | "days" | "not_stated";
}

const HOUR_WORDS = /(hour|hr|hrs)\b/i;
const DAY_WORDS = /(day|business day|working day)/i;

function normaliseDashes(s: string): string {
  return s.replace(/[\u2010-\u2015\u2212]/g, "-");
}

function pickUpper(a: number, b: number | null): number {
  return b === null ? a : Math.max(a, b);
}

export function parseTurnaround(input: string | null | undefined): TurnaroundParseResult {
  const raw = (input ?? "").toString().trim();
  if (!raw) {
    return { raw: null, hours: null, days: null, unit: "not_stated" };
  }

  const text = normaliseDashes(raw.toLowerCase());

  // Same day / next day fast paths
  if (/\b(same[\s-]?day)\b/.test(text)) {
    return { raw, hours: 24, days: 1, unit: "hours" };
  }
  if (/\bnext\s+(working\s+)?day\b/.test(text)) {
    return { raw, hours: 24, days: 1, unit: "days" };
  }

  // Numeric range: "2-5 days", "24-48 hours", "2 to 5 working days"
  const rangeMatch = text.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*([a-z ]+)/i);
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1], 10);
    const hi = parseInt(rangeMatch[2], 10);
    const tail = rangeMatch[3];
    if (HOUR_WORDS.test(tail)) {
      return { raw, hours: hi, days: Math.max(1, Math.ceil(hi / 24)), unit: "hours" };
    }
    if (DAY_WORDS.test(tail)) {
      return { raw, hours: hi * 24, days: hi, unit: "days" };
    }
  }

  // Single number: "3 hours", "up to 10 working days", "within 2 days"
  const singleMatch = text.match(/(\d+)\s*([a-z ]+)/i);
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    const tail = singleMatch[2];
    if (HOUR_WORDS.test(tail)) {
      return { raw, hours: n, days: Math.max(1, Math.ceil(n / 24)), unit: "hours" };
    }
    if (DAY_WORDS.test(tail)) {
      return { raw, hours: n * 24, days: n, unit: "days" };
    }
    if (/(week|wk)/i.test(tail)) {
      return { raw, hours: n * 24 * 7, days: n * 7, unit: "days" };
    }
  }

  return { raw, hours: null, days: null, unit: "not_stated" };
}

// Silence unused-import linters when someone lifts pickUpper for future ranges.
void pickUpper;
