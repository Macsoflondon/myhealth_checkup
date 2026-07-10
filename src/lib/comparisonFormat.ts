/**
 * Canonical label maps + helpers for the standardised comparison rows.
 * Single source of truth — used by tables, filters and admin editors.
 */

export type SampleType =
  | 'finger_prick' | 'venous' | 'saliva' | 'urine' | 'stool' | 'buccal_swab' | 'multiple';

export type CollectionMethod =
  | 'home_kit' | 'clinic' | 'home_visit' | 'mobile_phleb'
  | 'third_party_phleb' | 'self_arranged' | 'multiple';

export type CollectionFeeType =
  | 'none' | 'fixed' | 'from' | 'varies' | 'self_arranged';

export type ClinicalReviewType =
  | 'included' | 'optional' | 'gp_included' | 'consultant_included'
  | 'clinician_included' | 'not_included' | 'not_available';

export const SAMPLE_TYPE_LABELS: Record<SampleType, string> = {
  finger_prick: 'Finger-prick blood sample',
  venous: 'Venous blood draw',
  saliva: 'Saliva sample',
  urine: 'Urine sample',
  stool: 'Stool sample',
  buccal_swab: 'Buccal swab',
  multiple: 'Multiple sample types',
};

export const COLLECTION_METHOD_LABELS: Record<CollectionMethod, string> = {
  home_kit: 'Home kit included',
  clinic: 'Clinic appointment included',
  home_visit: 'Home visit available',
  mobile_phleb: 'Mobile phlebotomy available',
  third_party_phleb: 'Third-party phlebotomy accepted',
  self_arranged: 'Self-arranged blood draw',
  multiple: 'Multiple options available',
};

export const REVIEW_LABELS: Record<ClinicalReviewType, string> = {
  included: 'Included',
  optional: 'Optional',
  gp_included: 'GP review included',
  consultant_included: 'Consultant review included',
  clinician_included: 'Clinician review included',
  not_included: 'Not included',
  not_available: 'Not available',
};

/** True for review types that come baked into the test price. */
export const REVIEW_INCLUDED_TYPES: ClinicalReviewType[] = [
  'included', 'gp_included', 'consultant_included', 'clinician_included',
];

export const formatPrice = (n: number | null | undefined): string =>
  n == null || Number.isNaN(n) ? '—' : `£${n.toFixed(2)}`;

/**
 * Format the "Additional Collection Fees" cell.
 * Returns "None" when no fee, "+£35" for fixed, "from £50" for from, etc.
 */
export function formatCollectionFee(
  type: CollectionFeeType | null | undefined,
  amount: number | null | undefined,
): { label: string; isFree: boolean } {
  if (!type || type === 'none') return { label: 'None', isFree: true };
  if (type === 'self_arranged') return { label: 'Patient arranges own phlebotomy', isFree: false };
  if (type === 'varies') return { label: 'Price varies by location', isFree: false };
  if (amount == null) return { label: '—', isFree: true };
  if (type === 'from') return { label: `from £${amount.toFixed(0)}`, isFree: false };
  return { label: `+£${amount.toFixed(0)}`, isFree: false };
}

/**
 * Format clinical review cell. "+£49" appended when optional with a known fee.
 */
export function formatClinicalReview(
  type: ClinicalReviewType | null | undefined,
  fee: number | null | undefined,
): { label: string; isIncluded: boolean; isAvailable: boolean } {
  if (!type) return { label: '—', isIncluded: false, isAvailable: false };
  const isIncluded = REVIEW_INCLUDED_TYPES.includes(type);
  const isAvailable = type !== 'not_available' && type !== 'not_included';
  let label = REVIEW_LABELS[type];
  if (type === 'optional' && fee != null) label = `Optional (+£${fee.toFixed(0)})`;
  return { label, isIncluded, isAvailable };
}

/**
 * Total Expected Cost = base price + mandatory collection fee
 * (Optional clinician review is *not* added — it's opt-in.)
 */
export function computeTotalExpectedCost(
  basePrice: number,
  collectionFeeType: CollectionFeeType | null | undefined,
  collectionFeeAmount: number | null | undefined,
  clinicalReviewType?: ClinicalReviewType | null,
  clinicalReviewFee?: number | null,
): number {
  let total = basePrice || 0;
  if (collectionFeeType === 'fixed' && collectionFeeAmount) total += collectionFeeAmount;
  // 'from' is a minimum — include it as the conservative estimate
  if (collectionFeeType === 'from' && collectionFeeAmount) total += collectionFeeAmount;
  // Review fees are only added when mandatory (i.e. not 'optional')
  if (
    clinicalReviewType &&
    clinicalReviewType !== 'optional' &&
    clinicalReviewType !== 'not_included' &&
    clinicalReviewType !== 'not_available' &&
    clinicalReviewFee
  ) {
    total += clinicalReviewFee;
  }
  return total;
}
