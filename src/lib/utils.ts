import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Standardised price label for any provider test surface (cards, lists, modals).
 *
 * Rule: prepend "from " when the displayed figure is a starting price — i.e. the
 * provider has collection add-ons (phlebotomy/GP) or a base_price distinct from
 * the headline price. Otherwise show the bare "£X".
 *
 * Pass any test-like object — only the fields below are inspected.
 */
export interface PriceableTest {
  price?: number | null;
  base_price?: number | null;
  collection_options?: unknown;
  phlebotomy_included?: boolean | null;
  phlebotomy_cost?: number | null;
  gp_consultation_included?: boolean | null;
  gp_consultation_cost?: number | null;
}

export function formatTestPrice(
  test: PriceableTest | null | undefined,
  opts: { showFrom?: boolean } = {},
): string {
  if (!test) return "";
  const headline = test.base_price && test.base_price > 0 ? test.base_price : test.price;
  if (headline == null) return "";

  const numeric = typeof headline === "string" ? parseFloat(headline) : headline;
  if (!Number.isFinite(numeric as number)) return "";

  const isStarting =
    opts.showFrom !== false &&
    (
      (test.base_price != null && test.price != null && Number(test.base_price) !== Number(test.price)) ||
      (Array.isArray(test.collection_options) && (test.collection_options as unknown[]).length > 0) ||
      (test.phlebotomy_included === false && (test.phlebotomy_cost ?? 0) > 0) ||
      (test.gp_consultation_included === false && (test.gp_consultation_cost ?? 0) > 0)
    );

  const formatted = Number.isInteger(numeric as number)
    ? `£${numeric}`
    : `£${(numeric as number).toFixed(2)}`;

  return isStarting ? `from ${formatted}` : formatted;
}
