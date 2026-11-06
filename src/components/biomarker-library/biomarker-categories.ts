/**
 * The one place that maps the raw `category` labels in
 * `biomarker_library_public` (43 overlapping labels as of November 2026) to
 * the consumer categories the biomarker library shows.
 *
 * Filtering still runs against the raw labels: `rawFilterFor` returns every
 * raw label (plus slug overrides) behind a consumer category so the query can
 * use `.in("category", …)`. Add new raw labels here, not in components.
 */

export interface ConsumerCategory {
  label: string;
  icon: string;
  rawLabels: readonly string[];
}

/** Main library categories, in display order. */
export const CONSUMER_CATEGORIES: readonly ConsumerCategory[] = [
  { label: "Thyroid", icon: "🦋", rawLabels: ["Thyroid"] },
  {
    label: "Blood count",
    icon: "🩸",
    rawLabels: ["Full Blood Count", "Haematology"],
  },
  { label: "Iron", icon: "🧲", rawLabels: ["Iron Status"] },
  {
    label: "Vitamins and minerals",
    icon: "💊",
    rawLabels: [
      "Vitamins",
      "Minerals",
      "Vitamins & Minerals",
      "Iron & Nutrients",
    ],
  },
  {
    label: "Diabetes and metabolism",
    icon: "🍬",
    rawLabels: ["Diabetes", "Diabetes & Metabolic", "Metabolic"],
  },
  {
    label: "Cholesterol and lipids",
    icon: "🫀",
    rawLabels: ["Lipid Profile", "Cholesterol & Heart"],
  },
  {
    label: "Heart",
    icon: "❤️",
    rawLabels: ["Cardiac", "Cardiac Markers", "Cardiovascular"],
  },
  {
    label: "Liver",
    icon: "🫁",
    rawLabels: ["Liver Function", "Liver & Metabolic"],
  },
  { label: "Kidney", icon: "🩺", rawLabels: ["Kidney Function"] },
  { label: "Electrolytes", icon: "⚗️", rawLabels: ["Electrolytes"] },
  { label: "Hormones", icon: "⚡", rawLabels: ["Hormones"] },
  {
    label: "Fertility and reproductive health",
    icon: "🌱",
    rawLabels: ["Fertility", "Reproductive Health"],
  },
  { label: "Inflammation", icon: "🔥", rawLabels: ["Inflammation"] },
  {
    label: "Immunity and autoimmunity",
    icon: "🛡️",
    rawLabels: ["Immunology", "Autoimmune & Immunology"],
  },
  {
    label: "Digestive health",
    icon: "🥗",
    rawLabels: ["Digestive", "Digestive Health", "Gut Health"],
  },
  { label: "Bone health", icon: "🦴", rawLabels: ["Bone Health"] },
  {
    label: "Cancer markers",
    icon: "🎗️",
    rawLabels: ["Cancer Markers", "Cancer Screening"],
  },
  {
    label: "Brain and mental health",
    icon: "🧠",
    rawLabels: ["Neurology & Mental Health"],
  },
  {
    label: "Lungs and breathing",
    icon: "🌬️",
    rawLabels: ["Pulmonary & Respiratory"],
  },
  {
    label: "Medicine levels",
    icon: "💉",
    rawLabels: ["Therapeutic Drug Monitoring"],
  },
  {
    label: "Toxins and heavy metals",
    icon: "☣️",
    rawLabels: ["Toxicology & Heavy Metals"],
  },
  {
    label: "Genetics",
    icon: "🧬",
    rawLabels: ["Genetics & Pharmacogenomics", "Inborn Errors of Metabolism"],
  },
  {
    label: "Other markers",
    icon: "🔬",
    rawLabels: ["Enzymes", "Specialist", "Other"],
  },
];

/**
 * Allergen extracts and infection tests. They stay out of the main list and
 * appear in their own "Allergens and infection markers" section.
 */
export const SEPARATE_SECTION_CATEGORIES: readonly ConsumerCategory[] = [
  { label: "Allergens", icon: "🌾", rawLabels: ["Allergy & Immunology"] },
  {
    label: "Infection markers",
    icon: "🦠",
    rawLabels: ["Infectious Disease"],
  },
];

export const SEPARATE_SECTION_RAW_LABELS: readonly string[] =
  SEPARATE_SECTION_CATEGORIES.flatMap((c) => c.rawLabels);

/**
 * Core markers filed under the wrong raw label in biomarker_hub (Ferritin
 * under Haematology, Iron under Vitamins, Ferritin stores under Bone Health).
 * Keyed by the view's slug. Migration 20261104150000 corrects the data; this
 * keeps the page right until it is applied.
 */
export const SLUG_CATEGORY_OVERRIDES: Readonly<Record<string, string>> = {
  ferritin: "Iron",
  "iron-stores-ferritin": "Iron",
  iron: "Iron",
  "serum-iron": "Iron",
  transferrin: "Iron",
  "transferrin-saturation": "Iron",
  "tibc-total-iron-binding-capacity": "Iron",
};

const ALL_CATEGORIES = [...CONSUMER_CATEGORIES, ...SEPARATE_SECTION_CATEGORIES];

const RAW_TO_CONSUMER = new Map<string, string>(
  ALL_CATEGORIES.flatMap((c) =>
    c.rawLabels.map((raw) => [raw.toLowerCase(), c.label] as const),
  ),
);
const BY_LABEL = new Map<string, ConsumerCategory>(
  ALL_CATEGORIES.map((c) => [c.label.toLowerCase(), c]),
);
const ORDER = new Map<string, number>(
  ALL_CATEGORIES.map((c, i) => [c.label, i]),
);

export const FALLBACK_CATEGORY = "Other markers";

/**
 * Consumer category for one library row. An unknown raw label passes through
 * unchanged, so a new label still shows as its own group instead of vanishing.
 */
export function consumerCategoryFor(
  rawCategory: string | null | undefined,
  slug?: string | null,
): string {
  const override = slug ? SLUG_CATEGORY_OVERRIDES[slug] : undefined;
  if (override) return override;
  const raw = rawCategory?.trim();
  if (!raw) return FALLBACK_CATEGORY;
  return RAW_TO_CONSUMER.get(raw.toLowerCase()) ?? raw;
}

export function isSeparateSectionCategory(consumerLabel: string): boolean {
  return SEPARATE_SECTION_CATEGORIES.some((c) => c.label === consumerLabel);
}

/**
 * Resolve a ?category= value to a consumer label. Accepts a consumer label or
 * any raw label (old links used raw labels such as "Cardiac Markers").
 */
export function resolveConsumerCategory(value: string | null | undefined) {
  const v = value?.trim().toLowerCase();
  if (!v) return null;
  return BY_LABEL.get(v)?.label ?? RAW_TO_CONSUMER.get(v) ?? value!.trim();
}

export interface RawCategoryFilter {
  /** Raw labels to match with `.in("category", …)`. */
  rawLabels: string[];
  /** Slugs moved into this category from another raw label. */
  includeSlugs: string[];
  /** Slugs whose raw label maps here but which are moved elsewhere. */
  excludeSlugs: string[];
}

export function rawFilterFor(consumerLabel: string): RawCategoryFilter {
  const known = BY_LABEL.get(consumerLabel.toLowerCase());
  const rawLabels = known ? [...known.rawLabels] : [consumerLabel];
  const label = known?.label ?? consumerLabel;
  const includeSlugs = Object.entries(SLUG_CATEGORY_OVERRIDES)
    .filter(([, target]) => target === label)
    .map(([slug]) => slug);
  const excludeSlugs = Object.entries(SLUG_CATEGORY_OVERRIDES)
    .filter(([, target]) => target !== label)
    .map(([slug]) => slug);
  return { rawLabels, includeSlugs, excludeSlugs };
}

export function categoryIcon(consumerLabel: string): string {
  return BY_LABEL.get(consumerLabel.toLowerCase())?.icon ?? "🧬";
}

/** Sort key: known categories in display order, unknown ones after, A to Z. */
export function compareConsumerCategories(a: string, b: string): number {
  const ia = ORDER.get(a) ?? Number.MAX_SAFE_INTEGER;
  const ib = ORDER.get(b) ?? Number.MAX_SAFE_INTEGER;
  return ia !== ib ? ia - ib : a.localeCompare(b);
}
