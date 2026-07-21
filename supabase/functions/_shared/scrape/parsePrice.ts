/**
 * Parse a GBP price string as it appears on a provider page.
 * Never fabricates: returns `price: null` if no number found.
 *
 * Handles: "£129", "£1,299.00", "From £49", "was £199 now £149",
 * "Sale £49 £99", trailing "GBP", non-breaking spaces.
 */

export interface PriceParseResult {
  price: number | null;
  wasPrice: number | null;
  currency: "GBP" | null;
  from: boolean;
}

function extractNumbers(text: string): number[] {
  const cleaned = text
    .replace(/\u00a0/g, " ")
    .replace(/[£$€]/g, " ")
    .replace(/gbp|usd|eur/gi, " ");
  const matches = cleaned.match(/\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?/g);
  if (!matches) return [];
  return matches
    .map((m) => parseFloat(m.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function parsePrice(input: string | number | null | undefined): PriceParseResult {
  if (input === null || input === undefined) {
    return { price: null, wasPrice: null, currency: null, from: false };
  }
  if (typeof input === "number") {
    return Number.isFinite(input) && input > 0
      ? { price: input, wasPrice: null, currency: "GBP", from: false }
      : { price: null, wasPrice: null, currency: null, from: false };
  }

  const text = input.toString().trim();
  if (!text) return { price: null, wasPrice: null, currency: null, from: false };

  const from = /\bfrom\b/i.test(text);
  const hasWas = /\bwas\b|\bwere\b|\brrp\b/i.test(text);
  const nums = extractNumbers(text);

  if (nums.length === 0) {
    return { price: null, wasPrice: null, currency: null, from };
  }

  // Common patterns:
  //   "£49"                 -> price=49
  //   "was £199 now £149"   -> was=199 price=149
  //   "Sale £49 £99"        -> price=min, was=max (heuristic only when hasWas or 2+ numbers)
  if (nums.length === 1) {
    return { price: nums[0], wasPrice: null, currency: "GBP", from };
  }

  // Multiple numbers — assume the SMALLER is the current sale price,
  // LARGER is the "was" price. Only applied when we have textual evidence
  // (hasWas) or when the numbers differ meaningfully; otherwise take first.
  if (hasWas) {
    const sorted = [...nums].sort((a, b) => a - b);
    return { price: sorted[0], wasPrice: sorted[sorted.length - 1], currency: "GBP", from };
  }

  return { price: nums[0], wasPrice: null, currency: "GBP", from };
}
