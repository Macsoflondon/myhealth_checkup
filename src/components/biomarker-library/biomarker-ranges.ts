/**
 * Normalises `reference_ranges` jsonb from biomarker_library_public into a
 * typed shape. Anything unrecognised or empty is dropped so the card never
 * renders placeholder content.
 */

export const RANGE_KEYS = [
  "low",
  "borderline",
  "normal",
  "optimal",
  "elevated",
  "high",
  "veryHigh",
] as const;
export type RangeKey = (typeof RANGE_KEYS)[number];

export interface RangeBand {
  key: RangeKey;
  label: string;
  range: string;
  meaning: string | null;
}
export interface LabelledRange {
  title: string;
  range: string;
  meaning: string | null;
}
export interface AgeRangeRow {
  range: string;
  normal: string;
  borderline: string;
  high: string;
}
export interface SexRanges {
  bands: RangeBand[];
  phases: LabelledRange[];
  stages: LabelledRange[];
  ageRanges: AgeRangeRow[];
}
export type RangeSex = "both" | "male" | "female";
export type NormalisedRanges = Partial<Record<RangeSex, SexRanges>>;

const DEFAULT_LABELS: Record<RangeKey, string> = {
  low: "Low",
  borderline: "Borderline",
  normal: "Normal",
  optimal: "Optimal",
  elevated: "Elevated",
  high: "High",
  veryHigh: "Very high",
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string | null => {
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
};

function bandRange(r: Record<string, unknown>): string | null {
  const explicit = str(r.range);
  if (explicit) return explicit;
  const min = str(r.min);
  const max = str(r.max);
  if (min && max) return `${min}–${max}`;
  if (min) return `≥ ${min}`;
  if (max) return `≤ ${max}`;
  return null;
}

function labelled(list: unknown, titleKey: string): LabelledRange[] {
  if (!Array.isArray(list)) return [];
  return list.flatMap((item) => {
    if (!isRecord(item)) return [];
    const title = str(item[titleKey]);
    const range = str(item.range);
    if (!title || !range) return [];
    return [{ title, range, meaning: str(item.meaning) }];
  });
}

function normaliseSex(raw: unknown): SexRanges | null {
  if (!isRecord(raw)) return null;
  const bands = RANGE_KEYS.flatMap((key): RangeBand[] => {
    const r = raw[key];
    if (!isRecord(r)) return [];
    const range = bandRange(r);
    if (!range) return [];
    return [
      {
        key,
        label: str(r.label) ?? DEFAULT_LABELS[key],
        range,
        meaning: str(r.meaning),
      },
    ];
  });
  const ageRanges = Array.isArray(raw.ageRanges)
    ? raw.ageRanges.flatMap((row): AgeRangeRow[] => {
        if (!isRecord(row)) return [];
        const range = str(row.range);
        if (!range) return [];
        return [
          {
            range,
            normal: str(row.normal) ?? "",
            borderline: str(row.borderline) ?? "",
            high: str(row.high) ?? "",
          },
        ];
      })
    : [];
  const out: SexRanges = {
    bands,
    phases: labelled(raw.phases, "phase"),
    stages: labelled(raw.stages, "stage"),
    ageRanges,
  };
  const empty =
    !out.bands.length &&
    !out.phases.length &&
    !out.stages.length &&
    !out.ageRanges.length;
  return empty ? null : out;
}

export function normaliseReferenceRanges(raw: unknown): NormalisedRanges {
  if (!isRecord(raw)) return {};
  const out: NormalisedRanges = {};
  (["both", "male", "female"] as const).forEach((sex) => {
    const n = normaliseSex(raw[sex]);
    if (n) out[sex] = n;
  });
  return out;
}

export function hasAnyRange(r: NormalisedRanges): boolean {
  return Boolean(r.both || r.male || r.female);
}
