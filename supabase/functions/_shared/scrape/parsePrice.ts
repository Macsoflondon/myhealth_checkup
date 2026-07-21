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

/**
 * Extract GBP-anchored numbers. Only picks numbers that are directly preceded
 * by a £ (with optional whitespace/nbsp) OR immediately followed by "GBP".
 * This prevents free-standing numbers like ratings ("4.8"), biomarker counts
 * ("24 biomarkers"), phone-number fragments, or years being misread as price.
 */
function extractGbpNumbers(text: string): number[] {
  const cleaned = text.replace(/\u00a0/g, " ");
  const results: number[] = [];
  // £ followed by number
  const poundRe = /£\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/g;
  let m: RegExpExecArray | null;
  while ((m = poundRe.exec(cleaned)) !== null) {
    const n = parseFloat(m[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0) results.push(n);
  }
  // number followed by GBP
  const gbpRe = /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)\s*gbp\b/gi;
  while ((m = gbpRe.exec(cleaned)) !== null) {
    const n = parseFloat(m[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0) results.push(n);
  }
  return results;
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
  const nums = extractGbpNumbers(text);

  // No £/GBP anchor found — never fabricate a price from arbitrary digits on the page.
  if (nums.length === 0) {
    return { price: null, wasPrice: null, currency: null, from };
  }

  if (nums.length === 1) {
    return { price: nums[0], wasPrice: null, currency: "GBP", from };
  }

  // Multiple £-anchored numbers: if "was/rrp/were" wording present, the LOWER
  // is the current price and the HIGHER is the previous. Otherwise take the
  // first £-anchored occurrence (which on product pages is the primary price).
  if (hasWas) {
    const sorted = [...nums].sort((a, b) => a - b);
    return { price: sorted[0], wasPrice: sorted[sorted.length - 1], currency: "GBP", from };
  }

  return { price: nums[0], wasPrice: null, currency: "GBP", from };
}
