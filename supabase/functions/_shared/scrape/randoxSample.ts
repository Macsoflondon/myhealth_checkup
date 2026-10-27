// Randox sample-type rules — myhealth checkup
// 2026-10-26: the old rule was "Venous, unless the words finger-prick appear
// anywhere on the page". Randox pages carry cross-sell cards for other
// products, so clinic tests (ECG, Full Cardiac Risk, FH Risk) picked up
// "Finger-prick or venous" from a neighbouring card, and every QuickDraw kit
// was marked finger-prick even though its own copy says no finger-prick is
// needed (Tasso+ upper-arm device). These rules read only the product's own
// section and the URL tells us home kit versus clinic visit.
//
// Pure functions, no Deno APIs, so they can be unit tested.

export const SAMPLE = {
  venous: "Venous",
  quickdraw: "Capillary blood (QuickDraw upper-arm device)",
  fingerPrick: "Finger-prick",
  saliva: "Saliva",
  stool: "Stool",
  nail: "Nail clipping",
  urineSwab: "Urine or swab",
  venousUrineSwab: "Venous blood and urine or swab",
} as const;

/** Text of the product's own section: everything before the cross-sell block. */
export function ownSection(pageText: string): string {
  const i = pageText.search(
    /Customers Also Bought|You may also like|Related (?:tests|products)|Other tests you may/i,
  );
  return i > 0 ? pageText.slice(0, i) : pageText;
}

/**
 * Returns the sample type for one Randox product, or null when a home kit
 * page states no collection method (never guess).
 */
export function deriveRandoxSample(
  url: string,
  pageText: string,
  productDescription: string | null,
  name: string | null,
  biomarkers: readonly string[],
): string | null {
  const own = `${ownSection(pageText)} ${productDescription ?? ""}`;
  const isHome = /\/product\/home\//i.test(url);
  const urineSwabHits = (own.match(/\burine\b|\bswab\b/gi) || []).length;
  const bloodBorne = /\b(?:hiv|syphilis|hepatitis)\b/i.test(
    [name ?? "", productDescription ?? "", ...biomarkers].join(" "),
  );

  if (isHome) {
    if (/\btasso\b|quick\s?draw/i.test(own)) return SAMPLE.quickdraw;
    if (/nail clipping/i.test(own)) return SAMPLE.nail;
    if (/\bstool\b/i.test(own)) return SAMPLE.stool;
    if (/\bsaliva\b|cheek swab/i.test(own)) return SAMPLE.saliva;
    if (urineSwabHits >= 2) return SAMPLE.urineSwab;
    if (/finger.?prick/i.test(own)) return SAMPLE.fingerPrick;
    return null;
  }

  // Clinic visit: a trained professional takes the sample at the clinic.
  if (urineSwabHits >= 2) {
    return bloodBorne ? SAMPLE.venousUrineSwab : SAMPLE.urineSwab;
  }
  return SAMPLE.venous;
}
