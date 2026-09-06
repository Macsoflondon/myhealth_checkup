/**
 * Collection route variants.
 *
 * A single `provider_tests` row often covers several ways of giving a sample:
 * an at-home finger-prick kit, a venous draw at a clinic, or a nurse visiting
 * the patient at home. Each route has a different real cost. Rather than
 * duplicating catalogue rows, we expand one row into up to three presentation
 * variants so each listing can show the honest total for its own route.
 */

export type CollectionRoute =
  | "home_kit"
  | "clinic"
  | "home_visit"
  | "venous"
  | "standard";

export interface CollectionVariantSource {
  id: string;
  price?: number | null;
  base_price?: number | null;
  sample_type?: string | null;
  collection_method?: string | null;
  home_kit_available?: boolean | null;
  clinic_visit_available?: boolean | null;
  clinic_phlebotomy_cost?: number | null;
  home_phlebotomy_cost?: number | null;
}

/** A second priced route shown beneath the headline total on the same listing. */
export interface CollectionVariantSecondary {
  route: CollectionRoute;
  label: string;
  fee: number;
  total: number;
}

export interface CollectionVariant {
  /** Stable id for this listing: `<test id>::<route>`. */
  variantId: string;
  route: CollectionRoute;
  /** Short label for the card, e.g. "At-home finger-prick kit". */
  label: string;
  /** Longer sentence for the detail modal. */
  detail: string;
  /** Provider's headline test price. */
  basePrice: number;
  /** Additional collection fee for this route (0 when none). */
  fee: number;
  /** basePrice + fee. */
  total: number;
  /** Second route priced on the same card (nurse home visit alongside clinic). */
  secondary?: CollectionVariantSecondary;
}

const ROUTE_LABELS: Record<CollectionRoute, string> = {
  home_kit: "At-home finger-prick kit",
  clinic: "Clinic blood draw",
  home_visit: "Nurse home visit",
  venous: "Clinic blood draw or nurse home visit",
  standard: "Standard collection",
};

const ROUTE_DETAILS: Record<CollectionRoute, string> = {
  home_kit: "Finger-prick sample you collect yourself at home",
  clinic: "Venous blood draw taken at a partner clinic",
  home_visit: "Venous blood draw taken by a nurse at your home",
  venous:
    "Venous blood draw taken at a partner clinic, or by a nurse at your home",
  standard: "Collection method as published by the provider",
};


const num = (v: number | null | undefined): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

const mentionsFingerPrick = (sampleType?: string | null): boolean =>
  /finger/i.test(sampleType ?? "");

const mentionsVenous = (sampleType?: string | null): boolean =>
  /venous|blood draw|phlebotom/i.test(sampleType ?? "");

/** True when the row's home kit is (or may be) a self-collected finger-prick kit. */
export function hasHomeKitRoute(source: CollectionVariantSource): boolean {
  if (!source.home_kit_available) return false;
  if (mentionsFingerPrick(source.sample_type)) return true;
  // No sample type recorded — the home kit is still a self-collection route.
  return !source.sample_type || !mentionsVenous(source.sample_type);
}

function makeVariant(
  source: CollectionVariantSource,
  route: CollectionRoute,
  basePrice: number,
  fee: number,
): CollectionVariant {
  return {
    variantId: `${source.id}::${route}`,
    route,
    label: ROUTE_LABELS[route],
    detail: ROUTE_DETAILS[route],
    basePrice,
    fee,
    total: Math.round((basePrice + fee) * 100) / 100,
  };
}

/**
 * Expand a test row into its collection route variants.
 * Always returns at least one variant so listings never lose a test.
 */
export function deriveCollectionVariants(
  source: CollectionVariantSource,
): CollectionVariant[] {
  const basePrice = num(source.price) ?? num(source.base_price) ?? 0;
  const variants: CollectionVariant[] = [];

  if (hasHomeKitRoute(source)) {
    variants.push(makeVariant(source, "home_kit", basePrice, 0));
  }

  const clinicFee = num(source.clinic_phlebotomy_cost);
  const hasClinic =
    !!source.clinic_visit_available || (clinicFee != null && clinicFee > 0);

  const homeVisitFee = num(source.home_phlebotomy_cost);
  const hasHomeVisit =
    homeVisitFee != null &&
    homeVisitFee > 0 &&
    (!!source.clinic_visit_available || mentionsVenous(source.sample_type));

  if (hasClinic && hasHomeVisit) {
    // Both professional-draw routes live on one listing, clinic priced first.
    const venous = makeVariant(source, "venous", basePrice, clinicFee ?? 0);
    venous.secondary = {
      route: "home_visit",
      label: ROUTE_LABELS.home_visit,
      fee: homeVisitFee,
      total: Math.round((basePrice + homeVisitFee) * 100) / 100,
    };
    variants.push(venous);
  } else if (hasClinic) {
    variants.push(makeVariant(source, "clinic", basePrice, clinicFee ?? 0));
  } else if (hasHomeVisit) {
    variants.push(makeVariant(source, "home_visit", basePrice, homeVisitFee));
  }

  if (variants.length === 0) {
    variants.push(makeVariant(source, "standard", basePrice, 0));
  }

  return variants;
}


/** Pick a single route from a row, when a surface only shows one card per test. */
export function pickVariant(
  source: CollectionVariantSource,
  route: CollectionRoute,
): CollectionVariant | null {
  return deriveCollectionVariants(source).find((v) => v.route === route) ?? null;
}

/** "£69.00 kit + £40.00 clinic draw" style breakdown, or null when there is no fee. */
export function variantFeeNote(variant: CollectionVariant): string | null {
  if (variant.fee <= 0) return null;
  const label =
    variant.route === "clinic" || variant.route === "venous"
      ? "clinic blood draw"
      : variant.route === "home_visit"
        ? "nurse home visit"
        : "collection";

  return `£${variant.basePrice.toFixed(2)} test + £${variant.fee.toFixed(2)} ${label}`;
}
