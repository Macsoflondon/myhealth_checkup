/**
 * Provider-page biomarker parsers and list-integrity helpers.
 *
 * Pure functions only (no Deno or network APIs) so the same code runs in the
 * edge functions and in the Vitest suite against saved HTML fixtures.
 *
 * Rules shared by every parser:
 *  - Read the whole provider element. Never cut the page with a fixed
 *    character window or cap a label's length: that is how labels such as
 *    "High-Densi" and "Creatine Kinas" reached the catalogue.
 *  - Never invent names. If a page publishes no itemised list, return an
 *    empty list and let the caller set `biomarkers_not_stated`.
 */

import { decodeEntities, htmlToText } from "./html.ts";
import { normaliseBiomarkers } from "./normaliseBiomarkers.ts";

export interface ParsedBiomarkers {
  biomarkers: string[];
  /** Number the provider states on the page, when it states one. */
  statedCount: number | null;
}

function textOf(fragment: string): string {
  return htmlToText(fragment).replace(/\s+/g, " ").trim();
}

/**
 * Clinilabs product page. Markers sit in grouped accordions:
 *   <details class="bio-cat"><summary>…<span class="bio-cat__count">10 markers</span></summary>
 *     <details class="bio-acc"><summary><span>MARKER</span>…</summary>…</details>
 */
export function parseClinilabsProductPage(html: string): ParsedBiomarkers {
  const raw: string[] = [];
  const accordion =
    /<details[^>]*class="[^"]*\bbio-acc\b[^"]*"[^>]*>\s*<summary[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/gi;
  for (const m of html.matchAll(accordion)) {
    const name = textOf(m[1] ?? "");
    if (name) raw.push(name);
  }

  let stated: number | null = null;
  const groupCount = /class="[^"]*\bbio-cat__count\b[^"]*"[^>]*>\s*(\d+)\s*markers?\s*</gi;
  for (const m of html.matchAll(groupCount)) {
    stated = (stated ?? 0) + Number.parseInt(m[1] ?? "0", 10);
  }

  return { biomarkers: normaliseBiomarkers(raw), statedCount: stated };
}

/** Legacy Clinilabs fallback: `<li>` items in Shopify `body_html`. */
export function parseClinilabsBodyHtml(bodyHtml: string): string[] {
  const items: string[] = [];
  for (const m of bodyHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const text = textOf(m[1] ?? "");
    if (!text) continue;
    if (/\b(add to|buy|log in|reviews?|delivery|privacy)\b/i.test(text))
      continue;
    items.push(text);
  }
  return normaliseBiomarkers(items);
}

/**
 * Medical Diagnosis product page. The list is the `<ul>` inside
 * `.qntm_product_exams_txt`, next to the "Tests Included:" heading.
 *
 * The previous parser took the first case-insensitive "tests included" in
 * the page and searched a 6,000-character window after it. On long pages
 * the first hit is page furniture, so the window either missed the list or
 * picked up the wrong one. This reads the element itself, whatever its size.
 */
export function parseMedicalDiagnosisTestsIncluded(html: string): string[] {
  const container =
    /class="[^"]*\bqntm_product_exams_txt\b[^"]*"[^>]*>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i.exec(
      html,
    );
  let listHtml = container?.[1] ?? null;
  if (listHtml === null) {
    const heading =
      /qntm_product_exams_heading[^>]*>\s*Tests Included:?\s*<\/[^>]+>[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/i.exec(
        html,
      );
    listHtml = heading?.[1] ?? null;
  }
  if (listHtml === null) return [];
  const raw = [...listHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) =>
    textOf(m[1] ?? ""),
  );
  return normaliseBiomarkers(raw);
}

export interface RandoxIncluded {
  /** Individual markers (`is_panel: false`). */
  biomarkers: string[];
  /** Panel names (`is_panel: true`) — never stored as biomarkers. */
  panels: string[];
}

/**
 * Randox product page. The server-rendered state carries
 * `"whats_included":[{"id":"14","description":"Albumin","is_panel":false},…]`.
 * Panel-only products (for example the Signature range) publish panel names
 * such as "Pancreatic Health", not an itemised marker list.
 */
export function parseRandoxWhatsIncluded(html: string): RandoxIncluded {
  const key = html.indexOf('"whats_included":[');
  if (key < 0) return { biomarkers: [], panels: [] };
  const start = html.indexOf("[", key);
  let depth = 0;
  let inString = false;
  let end = -1;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) return { biomarkers: [], panels: [] };

  let parsed: unknown;
  try {
    parsed = JSON.parse(html.slice(start, end + 1));
  } catch {
    return { biomarkers: [], panels: [] };
  }
  if (!Array.isArray(parsed)) return { biomarkers: [], panels: [] };

  const markers: string[] = [];
  const panels: string[] = [];
  for (const entry of parsed) {
    if (!entry || typeof entry !== "object") continue;
    const rec = entry as { description?: unknown; is_panel?: unknown };
    if (typeof rec.description !== "string") continue;
    const name = decodeEntities(rec.description).trim();
    if (!name) continue;
    if (rec.is_panel === true) panels.push(name);
    else markers.push(name);
  }
  return {
    biomarkers: normaliseBiomarkers(markers),
    panels: normaliseBiomarkers(panels),
  };
}

export interface CountDecision {
  count: number | null;
  /** Human-readable mismatch note for scrape run errors, or null. */
  mismatch: string | null;
}

/**
 * The stored count follows the parsed list. When the provider states a
 * different number, the list-derived count is stored and the provider's
 * figure is reported so the difference is visible in the run log.
 */
export function reconcileBiomarkerCount(
  list: readonly string[] | null | undefined,
  statedCount: number | null | undefined,
  label: string,
): CountDecision {
  const listed = Array.isArray(list) ? list.length : 0;
  const stated =
    typeof statedCount === "number" && Number.isFinite(statedCount)
      ? statedCount
      : null;
  if (listed === 0) return { count: stated, mismatch: null };
  if (stated !== null && stated !== listed) {
    return {
      count: listed,
      mismatch: `${label}: provider states ${stated} biomarkers, page lists ${listed}`,
    };
  }
  return { count: listed, mismatch: null };
}

/** Character budgets that external tools commonly clip joined text to. */
const CLIP_LENGTHS = new Set([255, 256, 300, 500, 512, 1000, 1024]);

/**
 * True when an incoming list shows the signature of being clipped upstream:
 * its comma-joined length lands exactly on a fixed budget, or it holds
 * fewer names than the count that arrived with it.
 */
export function looksTruncated(
  list: readonly string[],
  statedCount?: number | null,
): boolean {
  if (list.length === 0) return false;
  if (CLIP_LENGTHS.has(list.join(", ").length)) return true;
  return (
    typeof statedCount === "number" &&
    Number.isFinite(statedCount) &&
    statedCount > list.length
  );
}
