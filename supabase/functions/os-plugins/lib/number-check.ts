// Number check for the AI briefing. Every number a briefing point states must
// come from the facts that point cites, so the briefing can summarise the
// dashboard but never add a figure of its own.
//
// Pure: no imports beyond contract types, no Deno or browser APIs. The
// os-plugins edge function and the vitest suite both load it.
import type { OsBriefPoint, OsFact } from "../../_shared/os/contract.ts";

/** Most points a briefing may keep. */
export const MAX_BRIEF_POINTS = 5;

/**
 * A number in prose: an optional sign (hyphen-minus or U+2212 minus), an
 * optional pound sign, digits with optional thousands commas, optional
 * decimals and an optional percent sign.
 *
 * The lookbehind stops a hyphen inside a word or date ("28-day",
 * "2026-10-04") reading as a minus sign, and stops digits glued to letters
 * ("GA4") or to a decimal point reading as separate numbers.
 */
const NUMBER_RE =
  /(?<![\p{L}\p{N}_.])([-−]?)(£?)(\d{1,3}(?:,\d{3})+(?!\d)|\d+)(\.\d+)?(%?)/gu;

/**
 * Number words the model might use in place of digits. "one" is left out
 * because it is mostly a pronoun ("one provider", "one of").
 */
const NUMBER_WORDS: Record<string, number> = {
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  dozen: 12,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
  million: 1_000_000,
};

const NUMBER_WORD_RE = new RegExp(
  `\\b(${Object.keys(NUMBER_WORDS).join("|")})\\b`,
  "gi",
);

const EPSILON = 1e-9;

export type ExtractedNumber = { raw: string; value: number };

/** Every number stated in a piece of text, in order. */
export function extractNumbers(text: string): ExtractedNumber[] {
  const out: ExtractedNumber[] = [];
  for (const m of text.matchAll(NUMBER_RE)) {
    const [raw, sign, , whole, fraction = ""] = m;
    const value = Number(`${whole.replace(/,/g, "")}${fraction}`);
    if (!Number.isFinite(value)) continue;
    out.push({ raw: raw.trim(), value: sign ? -value : value });
  }
  for (const m of text.matchAll(NUMBER_WORD_RE)) {
    const word = m[1].toLowerCase();
    out.push({ raw: m[0], value: NUMBER_WORDS[word] });
  }
  return out;
}

function roundTo(n: number, digits: number): number[] {
  const f = 10 ** digits;
  // Math.round and toFixed disagree on some binary halves (1.005), so allow both.
  return [Math.round(n * f) / f, Number(n.toFixed(digits))];
}

/**
 * Numbers a point citing these facts may state: each numeric value, its
 * absolute value and its roundings to 0, 1 or 2 decimal places, plus any
 * number written inside a fact's string value, label or period ("last 28
 * days" allows 28, "4 Oct 2026" allows 4 and 2026).
 *
 * Percent facts store the percentage itself (64.3, not 0.643), so rounding
 * to 0 places is what lets "64%" through.
 */
export function allowedNumbers(facts: readonly OsFact[]): number[] {
  const allowed = new Set<number>();
  const add = (n: number) => {
    if (!Number.isFinite(n)) return;
    allowed.add(n);
    allowed.add(Math.abs(n));
  };
  for (const fact of facts) {
    if (typeof fact.value === "number" && Number.isFinite(fact.value)) {
      add(fact.value);
      for (const digits of [0, 1, 2]) {
        for (const r of roundTo(fact.value, digits)) add(r);
      }
    }
    const texts = [fact.label, fact.period];
    if (typeof fact.value === "string") texts.push(fact.value);
    for (const t of texts) {
      if (typeof t !== "string") continue;
      for (const n of extractNumbers(t)) add(n.value);
    }
  }
  return [...allowed];
}

/**
 * Checks that every number in `text` is derivable from `citedFacts`.
 * `offending` lists the numbers as written that are not.
 */
export function checkPoint(
  text: string,
  citedFacts: readonly OsFact[],
): { ok: boolean; offending: string[] } {
  const allowed = allowedNumbers(citedFacts);
  const offending: string[] = [];
  for (const n of extractNumbers(text)) {
    if (!allowed.some((a) => Math.abs(a - n.value) < EPSILON)) {
      offending.push(n.raw);
    }
  }
  return { ok: offending.length === 0, offending };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Validates the model's JSON reply against the facts it was given.
 *
 * A point is dropped when it cites no fact, cites an id that is not in
 * `facts`, or states a number its cited facts do not support. The first
 * MAX_BRIEF_POINTS surviving points are kept. The headline must pass the same
 * check against every fact the surviving points cite, or it becomes null.
 */
export function validateBrief(
  raw: unknown,
  facts: readonly OsFact[],
): { headline: string | null; points: OsBriefPoint[]; dropped: number } {
  if (!isRecord(raw) || !Array.isArray(raw.points)) {
    return { headline: null, points: [], dropped: 0 };
  }

  const byId = new Map<string, OsFact>();
  for (const f of facts) {
    if (!byId.has(f.id)) byId.set(f.id, f);
  }

  const points: OsBriefPoint[] = [];
  let dropped = 0;

  for (const item of raw.points) {
    if (points.length >= MAX_BRIEF_POINTS) break;
    if (!isRecord(item) || typeof item.text !== "string") {
      dropped += 1;
      continue;
    }
    const text = item.text.trim();
    const rawIds: unknown[] = Array.isArray(item.fact_ids) ? item.fact_ids : [];
    const citesKnownFacts =
      rawIds.length > 0 &&
      rawIds.every((id) => typeof id === "string" && byId.has(id));
    if (text === "" || !citesKnownFacts) {
      dropped += 1;
      continue;
    }
    const ids = [...new Set(rawIds as string[])];
    const cited = ids.map((id) => byId.get(id) as OsFact);
    if (!checkPoint(text, cited).ok) {
      dropped += 1;
      continue;
    }
    points.push({ text, fact_ids: ids });
  }

  let headline: string | null = null;
  if (points.length > 0 && typeof raw.headline === "string") {
    const candidate = raw.headline.trim();
    const citedIds = new Set(points.flatMap((p) => p.fact_ids));
    const cited = [...citedIds].map((id) => byId.get(id) as OsFact);
    if (candidate !== "" && checkPoint(candidate, cited).ok) {
      headline = candidate;
    }
  }

  return { headline, points, dropped };
}
