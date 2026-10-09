// Number check for the AI briefing. Every number a briefing point states must
// come from the facts that point cites, so the briefing can summarise the
// dashboard but never add a figure of its own.
//
// Two ways a number can pass:
// - It matches a numeric fact of the same kind: a £ figure against a gbp
//   fact, a % figure against a percent fact, a plain number against a count
//   or days fact. Rounding to 0, 1 or 2 places is allowed. An explicit sign
//   must match the fact's sign.
// - It sits in the same date, time or "N days" phrase as a number written in
//   a cited fact's label, period or text value ("4 Oct", "14:05", "28 days").
//   A bare 14 does not pass because "14:05" was cited.
// A point that cites a signed change must also describe its direction
// correctly ("fell" for a negative change).
//
// Pure: no imports beyond contract types, no Deno or browser APIs. The
// os-plugins edge function and the vitest suite both load it.
import type {
  OsBriefPoint,
  OsFact,
  OsFactUnit,
} from "../../_shared/os/contract.ts";

/** Most points a briefing may keep. */
export const MAX_BRIEF_POINTS = 5;

/**
 * A number in prose: an optional sign (plus, hyphen-minus or U+2212 minus), an
 * optional pound sign, digits with optional thousands commas, optional
 * decimals and an optional percent sign.
 *
 * The lookbehind stops a hyphen inside a word or date ("28-day",
 * "2026-10-04") reading as a minus sign, and stops digits glued to letters
 * ("GA4") or to a decimal point reading as separate numbers.
 */
const NUMBER_RE =
  /(?<![\p{L}\p{N}_.])([-−+]?)(£?)(\d{1,3}(?:,\d{3})+(?!\d)|\d+)(\.\d+)?(%?)/gu;

/**
 * Number words the model might use in place of digits. "one" is left out
 * because it is mostly a pronoun ("one provider", "one of").
 */
const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
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
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
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

const UNITS_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const TENS = "twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety";
const COMPOUND_WORD_RE = new RegExp(
  `\\b(${TENS})[-\\s](${Object.keys(UNITS_WORDS).join("|")})\\b`,
  "gi",
);
const NUMBER_WORD_RE = new RegExp(
  `\\b(${Object.keys(NUMBER_WORDS).join("|")})\\b`,
  "gi",
);
/** Amounts with no single value. A point that uses one is always dropped. */
const VAGUE_WORD_RE =
  /\b(dozens|scores|hundreds|thousands|millions|tens of thousands)\b/gi;

const EPSILON = 1e-9;

export type NumberMarker = "gbp" | "percent" | "plain";

export type ExtractedNumber = {
  raw: string;
  /** NaN for a vague amount such as "hundreds". */
  value: number;
  marker: NumberMarker;
  /** True when written with an explicit minus sign. */
  signed: boolean;
  /** Index of the first digit (or of the word) in the text. */
  at: number;
};

/** Every number stated in a piece of text, in order of appearance. */
export function extractNumbers(text: string): ExtractedNumber[] {
  const out: ExtractedNumber[] = [];
  for (const m of text.matchAll(NUMBER_RE)) {
    const [raw, sign, pound, whole, fraction = "", percent] = m;
    const value = Number(`${whole.replace(/,/g, "")}${fraction}`);
    if (!Number.isFinite(value)) continue;
    out.push({
      raw: raw.trim(),
      value: sign === "-" || sign === "−" ? -value : value,
      marker: pound ? "gbp" : percent ? "percent" : "plain",
      signed: sign !== "",
      at: (m.index ?? 0) + sign.length + pound.length,
    });
  }

  const taken: [number, number][] = [];
  const free = (start: number, end: number) =>
    taken.every(([s, e]) => end <= s || start >= e);
  const word = (raw: string, value: number, at: number) =>
    out.push({ raw, value, marker: "plain", signed: false, at });

  for (const m of text.matchAll(VAGUE_WORD_RE)) {
    const at = m.index ?? 0;
    taken.push([at, at + m[0].length]);
    word(m[0], Number.NaN, at);
  }
  for (const m of text.matchAll(COMPOUND_WORD_RE)) {
    const at = m.index ?? 0;
    if (!free(at, at + m[0].length)) continue;
    taken.push([at, at + m[0].length]);
    const tens = NUMBER_WORDS[m[1].toLowerCase()];
    word(m[0], tens + UNITS_WORDS[m[2].toLowerCase()], at);
  }
  for (const m of text.matchAll(NUMBER_WORD_RE)) {
    const at = m.index ?? 0;
    if (!free(at, at + m[0].length)) continue;
    word(m[0], NUMBER_WORDS[m[1].toLowerCase()], at);
  }
  return out.sort((a, b) => a.at - b.at);
}

// ---------------------------------------------------------------------------
// Phrases: numbers written inside text, keyed by what they mean
// ---------------------------------------------------------------------------

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const MONTH_RE = `(${MONTHS.join("|")})[a-z]*\\.?`;
const TIME_RE = /(?<![\p{N}:])(\d{1,2}):(\d{2})(?![\p{N}:])/gu;
const DAY_MONTH_RE = new RegExp(
  `(?<![\\p{N}])(\\d{1,2})(?:st|nd|rd|th)?\\s+${MONTH_RE}(?:\\s+(\\d{4}))?(?![\\p{L}])`,
  "giu",
);
const ISO_DATE_RE = /(?<![\p{N}])(\d{4})-(\d{2})-(\d{2})(?![\p{N}])/gu;
const UNIT_RE =
  /(?<![\p{L}\p{N}_.:])(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?[\s-]+(minute|hour|day|week|month|year)s?\b/giu;

type PhraseToken = { at: number; key: string };

/**
 * The phrase each written number belongs to, keyed by meaning:
 * "time:14:05", "date:4-oct", "year:2026", "n:28:day", or "n:28" for a bare
 * number. Keyed by the index of the number's first digit.
 */
function phraseTokens(text: string): Map<number, string> {
  const tokens: PhraseToken[] = [];
  for (const m of text.matchAll(TIME_RE)) {
    const at = m.index ?? 0;
    const key = `time:${Number(m[1])}:${m[2]}`;
    tokens.push({ at, key }, { at: at + m[1].length + 1, key });
  }
  for (const m of text.matchAll(DAY_MONTH_RE)) {
    const at = m.index ?? 0;
    const month = m[2].toLowerCase().slice(0, 3);
    tokens.push({ at, key: `date:${Number(m[1])}-${month}` });
    if (m[3]) {
      tokens.push({ at: at + m[0].lastIndexOf(m[3]), key: `year:${m[3]}` });
    }
  }
  for (const m of text.matchAll(ISO_DATE_RE)) {
    const at = m.index ?? 0;
    const month = MONTHS[Number(m[2]) - 1];
    if (!month) continue;
    tokens.push(
      { at, key: `year:${m[1]}` },
      { at: at + 5, key: `date:${Number(m[3])}-${month}` },
      { at: at + 8, key: `date:${Number(m[3])}-${month}` },
    );
  }
  for (const m of text.matchAll(UNIT_RE)) {
    const value = Number(m[1].replace(/,/g, ""));
    tokens.push({
      at: m.index ?? 0,
      key: `n:${value}:${m[2].toLowerCase()}`,
    });
  }

  const byAt = new Map<number, string>();
  for (const t of tokens) {
    if (!byAt.has(t.at)) byAt.set(t.at, t.key);
  }
  for (const n of extractNumbers(text)) {
    if (n.marker !== "plain" || !Number.isFinite(n.value)) continue;
    if (byAt.has(n.at)) continue;
    const bare =
      n.value >= 2000 && n.value <= 2099 && Number.isInteger(n.value)
        ? `year:${n.value}`
        : `n:${Math.abs(n.value)}`;
    byAt.set(n.at, bare);
  }
  return byAt;
}

/** Phrase keys written in the labels, periods and text values of facts. */
function factPhraseKeys(facts: readonly OsFact[]): Set<string> {
  const keys = new Set<string>();
  for (const fact of facts) {
    const texts = [fact.label, fact.period];
    if (typeof fact.value === "string") texts.push(fact.value);
    for (const t of texts) {
      if (typeof t !== "string") continue;
      for (const key of phraseTokens(t).values()) keys.add(key);
    }
  }
  return keys;
}

// ---------------------------------------------------------------------------
// Numeric values
// ---------------------------------------------------------------------------

function roundTo(n: number, digits: number): number[] {
  const f = 10 ** digits;
  // Math.round and toFixed disagree on some binary halves (1.005), so allow both.
  return [Math.round(n * f) / f, Number(n.toFixed(digits))];
}

function markerFor(unit: OsFactUnit): NumberMarker | null {
  if (unit === "gbp") return "gbp";
  if (unit === "percent") return "percent";
  if (unit === "count" || unit === "days") return "plain";
  return null;
}

type Allowed = { value: number; marker: NumberMarker };

/**
 * Values a point citing these facts may state as numbers: each numeric
 * value and its roundings to 0, 1 or 2 decimal places, with the marker its
 * unit calls for. Percent facts store the percentage itself (64.3, not
 * 0.643), so rounding to 0 places is what lets "64%" through.
 */
export function allowedNumbers(facts: readonly OsFact[]): Allowed[] {
  const out: Allowed[] = [];
  for (const fact of facts) {
    if (typeof fact.value !== "number" || !Number.isFinite(fact.value)) {
      continue;
    }
    const marker = markerFor(fact.unit);
    if (marker === null) continue;
    out.push({ value: fact.value, marker });
    for (const digits of [0, 1, 2]) {
      for (const r of roundTo(fact.value, digits))
        out.push({ value: r, marker });
    }
  }
  return out;
}

function matchesNumeric(n: ExtractedNumber, allowed: readonly Allowed[]) {
  return allowed.some(
    (a) =>
      a.marker === n.marker &&
      (n.signed
        ? Math.abs(a.value - n.value) < EPSILON
        : Math.abs(Math.abs(a.value) - Math.abs(n.value)) < EPSILON),
  );
}

// ---------------------------------------------------------------------------
// Direction of change
// ---------------------------------------------------------------------------

const UP_RE =
  /\b(rose|rise[sn]?|rising|up|increase[sd]?|increasing|grew|grow(?:s|n|ing)?|gain(?:ed|s)?|higher|more|climb(?:ed|s)?|jump(?:ed|s)?)\b/i;
const DOWN_RE =
  /\b(fell|fall(?:s|en|ing)?|down|decrease[sd]?|decreasing|drop(?:s|ped)?|declin(?:e|es|ed|ing)|lower|fewer|less|lost|shrank|slipped)\b/i;

function isChangeFact(f: OsFact): boolean {
  return (
    typeof f.value === "number" &&
    f.value !== 0 &&
    /(^|[._])(change|delta)/.test(f.id)
  );
}

/** False when the point says "rose" for a fall, or "fell" for a rise. */
function directionAgrees(text: string, cited: readonly OsFact[]): boolean {
  const changes = cited.filter(isChangeFact);
  if (changes.length === 0) return true;
  const signs = new Set(changes.map((f) => Math.sign(f.value as number)));
  if (signs.size > 1) return true;
  const up = UP_RE.test(text);
  const down = DOWN_RE.test(text);
  if (up === down) return true;
  return signs.has(1) ? up : down;
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

/**
 * Checks that every number in `text` is supported by `citedFacts` and that
 * any change it describes goes the right way. `offending` lists the numbers
 * as written that are not supported.
 */
export function checkPoint(
  text: string,
  citedFacts: readonly OsFact[],
): { ok: boolean; offending: string[] } {
  const allowed = allowedNumbers(citedFacts);
  const phraseKeys = factPhraseKeys(citedFacts);
  const pointPhrases = phraseTokens(text);
  const offending: string[] = [];
  for (const n of extractNumbers(text)) {
    if (!Number.isFinite(n.value)) {
      offending.push(n.raw);
      continue;
    }
    if (matchesNumeric(n, allowed)) continue;
    const key = n.marker === "plain" && !n.signed ? pointPhrases.get(n.at) : "";
    if (key && phraseKeys.has(key)) continue;
    offending.push(n.raw);
  }
  const ok = offending.length === 0 && directionAgrees(text, citedFacts);
  return { ok, offending };
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
