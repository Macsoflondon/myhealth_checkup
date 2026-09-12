/**
 * Parser for a Medichecks product page.
 *
 * The Shopify `/products.json` feed carries price, title and body copy but no
 * biomarker list, no preparation notes and no collection pricing — which is
 * why every Medichecks row sat with a biomarker count and no marker names.
 * Those live only in the rendered product page, so this module reads them from
 * the HTML.
 *
 * Everything captured here is the provider's own wording, stored verbatim.
 * No summarising, no rewriting, no LLM.
 */

import { normaliseBiomarkers } from "./normaliseBiomarkers.ts";

export interface MedichecksPageDetail {
  biomarkers: string[];
  /** Verbatim "What can I learn from this test?" copy. */
  whatIsTested: string | null;
  /** Verbatim "How to prepare for your test" copy. */
  preparationNotes: string | null;
  /** Verbatim "Test limitations" copy. */
  testLimitations: string | null;
  /** Surcharge for a venous draw at a partner clinic, in GBP. */
  clinicDrawFee: number | null;
  /** Surcharge for a nurse home visit, in GBP. */
  nurseVisitFee: number | null;
}

/** Marker names sit in the accordion row header directly before a <details>. */
const MARKER_ROW =
  /<p class="mb-0 text-base\/\[24px\][^"]*">\s*([\s\S]*?)\s*<\/p>\s*<details/g;

const FEE =
  /venous draw (at a clinic|at home with a nurse)[^+]{0,40}\+£([0-9]+(?:\.[0-9]{1,2})?)/gi;

const SECTION_LIMIT = 2600;

function decodeEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;|&#8217;/g, "\u2019")
    .replace(/&pound;/g, "£");
}

export function toPlainText(fragment: string): string {
  return decodeEntities(fragment.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Headings that mark the end of whichever section we are reading. */
const SECTION_BOUNDARIES = [
  "Test limitations",
  "How to prepare for your test",
  "What can I learn from this test",
  "What's in the test",
  "Reviews",
  "Frequently asked",
  "Related tests",
  "How it works",
];

function readSection(doc: string, heading: string): string | null {
  const marker = new RegExp(
    `<h3[^>]*>\\s*${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*</h3>`,
  );
  const found = marker.exec(doc);
  if (!found) return null;
  const start = found.index + found[0].length;
  let body = toPlainText(doc.slice(start, start + SECTION_LIMIT));

  for (const boundary of SECTION_BOUNDARIES) {
    const at = body.indexOf(boundary, 30);
    if (at > 0) body = body.slice(0, at);
  }
  body = body.trim().replace(/[.,;:\s]+$/, "");

  if (body.length <= 20) return null;
  return /[.!?]$/.test(body) ? body : `${body}.`;
}

export function parseMedichecksProductPage(doc: string): MedichecksPageDetail {
  const rawMarkers: string[] = [];
  MARKER_ROW.lastIndex = 0;
  for (let m = MARKER_ROW.exec(doc); m !== null; m = MARKER_ROW.exec(doc)) {
    const name = toPlainText(m[1] ?? "");
    if (name && name.length <= 80) rawMarkers.push(name);
  }

  let clinicDrawFee: number | null = null;
  let nurseVisitFee: number | null = null;
  const flat = toPlainText(doc);
  FEE.lastIndex = 0;
  for (let m = FEE.exec(flat); m !== null; m = FEE.exec(flat)) {
    const amount = Number.parseFloat(m[2] ?? "");
    if (!Number.isFinite(amount)) continue;
    if (/clinic/i.test(m[1] ?? "")) clinicDrawFee = amount;
    else nurseVisitFee = amount;
  }

  return {
    biomarkers: normaliseBiomarkers(rawMarkers),
    whatIsTested: readSection(doc, "What can I learn from this test\\?"),
    preparationNotes: readSection(doc, "How to prepare for your test"),
    testLimitations: readSection(doc, "Test limitations"),
    clinicDrawFee,
    nurseVisitFee,
  };
}
