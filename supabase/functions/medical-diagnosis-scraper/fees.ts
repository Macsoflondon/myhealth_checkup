/**
 * Collection-fee helpers for the Medical Diagnosis scraper. Fees shown to
 * visitors come from provider_collection_fee_rules; the scraper stores a fee
 * only when the provider's own product copy states one, never a default.
 */

/** "Phlebotomy service fee: £21." → 21 */
export function extractPhlebotomyFee(text: string): number | null {
  const m = text.match(/phlebotomy[^.£]{0,40}£\s*(\d+(?:\.\d{1,2})?)/i);
  if (!m) return null;
  const value = Number(m[1]);
  return Number.isFinite(value) ? value : null;
}

export interface ScrapedFee {
  /** Fee stated in the provider's copy, or null when none is stated. */
  clinicFee: number | null;
  /** Price plus the stated fee, the bare price when none, null without a price. */
  totalExpectedCost: number | null;
}

export function resolveScrapedFee(
  copy: string,
  price: number | null,
): ScrapedFee {
  const clinicFee = extractPhlebotomyFee(copy);
  const totalExpectedCost =
    price === null ? null : clinicFee === null ? price : price + clinicFee;
  return { clinicFee, totalExpectedCost };
}
