/**
 * Shared sample-type interpretation.
 *
 * Accepts either a raw provider_tests.sample_type (e.g. "Capillary blood
 * (QuickDraw upper-arm device)") or a unified_provider_tests token (e.g.
 * "capillary") and returns a display label plus routing hints. The bare word
 * "blood" never implies a clinic or venous draw on its own, and capillary
 * (QuickDraw) is a home blood route.
 */
export type SampleToken =
  | "venous"
  | "finger_prick"
  | "capillary"
  | "nail"
  | "saliva"
  | "stool"
  | "urine"
  | "urine_or_swab"
  | "buccal_swab"
  | "multiple";

export interface SampleTypeInfo {
  token: SampleToken | null;
  label: string | null;
  isBlood: boolean;
  isHomeCollectable: boolean;
}

const BLOOD: ReadonlySet<SampleToken> = new Set([
  "venous",
  "finger_prick",
  "capillary",
  "multiple",
]);
const HOME: ReadonlySet<SampleToken> = new Set([
  "finger_prick",
  "capillary",
  "nail",
  "saliva",
  "stool",
  "urine",
  "urine_or_swab",
  "buccal_swab",
]);

const TOKENS: ReadonlySet<string> = new Set([
  "venous",
  "finger_prick",
  "capillary",
  "nail",
  "saliva",
  "stool",
  "urine",
  "urine_or_swab",
  "buccal_swab",
  "multiple",
]);

function tokenFor(raw: string): SampleToken | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;
  if (TOKENS.has(s)) return s as SampleToken;
  const hasVenous = /venous|blood draw|phlebotom/.test(s);
  const hasUrineSwab = /urine|swab/.test(s);
  if (hasVenous && hasUrineSwab) return "multiple";
  if (/capillary|quick\s?draw|tasso|upper.arm/.test(s)) return "capillary";
  if (/finger/.test(s)) return hasVenous ? "multiple" : "finger_prick";
  if (hasVenous) return "venous";
  if (/nail/.test(s)) return "nail";
  if (/stool|faec|fec/.test(s)) return "stool";
  if (/cheek|buccal/.test(s)) return "buccal_swab";
  if (/saliva/.test(s)) return "saliva";
  if (/urine/.test(s) && /swab/.test(s)) return "urine_or_swab";
  if (/urine/.test(s)) return "urine";
  if (/swab/.test(s)) return "urine_or_swab";
  return null;
}

const LABELS: Record<SampleToken, string> = {
  venous: "Venous blood draw",
  finger_prick: "Finger-prick",
  capillary: "QuickDraw upper-arm device (no finger-prick)",
  saliva: "Saliva",
  stool: "Stool sample",
  nail: "Nail clipping",
  urine: "Urine",
  urine_or_swab: "Urine or swab",
  buccal_swab: "Cheek swab",
  multiple: "Multiple sample types",
};

/** Short form for the home-kit route label, e.g. "At-home kit (saliva)". */
const KIT_LABELS: Partial<Record<SampleToken, string>> = {
  finger_prick: "finger-prick",
  capillary: "QuickDraw upper-arm device",
  saliva: "saliva",
  stool: "stool sample",
  nail: "nail clipping",
  urine: "urine",
  urine_or_swab: "urine or swab",
  buccal_swab: "cheek swab",
};

export function describeSampleType(
  raw: string | null | undefined,
): SampleTypeInfo {
  const text = (raw ?? "").trim();
  const token = tokenFor(text);
  if (!token) {
    return {
      token: null,
      label: text || null,
      isBlood: false,
      isHomeCollectable: false,
    };
  }
  let label = LABELS[token];
  if (token === "multiple" && /blood/i.test(text) && /urine|swab/i.test(text)) {
    label = "Blood and urine or swab";
  }
  return {
    token,
    label,
    isBlood: BLOOD.has(token),
    isHomeCollectable: HOME.has(token),
  };
}

/** Short kit descriptor, or null when the sample type is unknown or not a home sample. */
export function homeKitSampleLabel(
  raw: string | null | undefined,
): string | null {
  const { token } = describeSampleType(raw);
  return token ? (KIT_LABELS[token] ?? null) : null;
}

/** True when the text names a home-collectable sample (used only when flags are absent). */
export function mentionsHomeSample(text: string | null | undefined): boolean {
  const s = (text ?? "").toLowerCase();
  if (/home|kit/.test(s)) return true;
  return describeSampleType(s).isHomeCollectable;
}

/** User/model-facing label for a raw value or view token; null stays null. */
export function sampleTypeLabel(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  return describeSampleType(raw).label;
}
