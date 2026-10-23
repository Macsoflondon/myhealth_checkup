import {
  computeTotalExpectedCost,
  formatCollectionFee,
  formatFeeAmount,
  formatPrice,
  type ClinicalReviewType,
  type CollectionFeeType,
} from "@/lib/comparisonFormat";

export interface HeaderPriceInput {
  price: number;
  collectionFeeType?: CollectionFeeType | null;
  collectionFeeAmount?: number | null;
  clinicalReviewType?: ClinicalReviewType | null;
  clinicalReviewFee?: number | null;
}

/**
 * Headline price for a comparison column: the total expected cost, computed
 * exactly as the Total Expected Cost row does, plus a breakdown line built
 * from the same fee formatters when the total differs from the test price.
 */
export function headerPriceParts(t: HeaderPriceInput): {
  total: number;
  breakdown: string | null;
} {
  const base = t.price || 0;
  // t.price is always a real number here, so computeTotalExpectedCost never
  // actually returns null — the `?? base` is just type narrowing.
  const total =
    computeTotalExpectedCost(
      t.price,
      t.collectionFeeType,
      t.collectionFeeAmount,
      t.clinicalReviewType,
      t.clinicalReviewFee,
    ) ?? base;
  if (Math.abs(total - base) < 0.005) return { total, breakdown: null };

  const parts = [`Test ${formatPrice(base)}`];
  const type = t.collectionFeeType;
  if ((type === "fixed" || type === "from") && t.collectionFeeAmount) {
    const fee = formatCollectionFee(type, t.collectionFeeAmount).label;
    parts.push(`blood draw ${fee.replace(/^\+/, "")}`);
  }
  const reviewAdded =
    t.clinicalReviewType &&
    t.clinicalReviewType !== "optional" &&
    t.clinicalReviewType !== "not_included" &&
    t.clinicalReviewType !== "not_available" &&
    t.clinicalReviewFee;
  if (reviewAdded && t.clinicalReviewFee) {
    parts.push(`clinical review ${formatFeeAmount(t.clinicalReviewFee)}`);
  }
  return { total, breakdown: parts.join(" + ") };
}
