/**
 * Lola Health catalogue facts, checked against lolahealth.com on 04/10/2026.
 *
 * Single source of truth for:
 *  - the verified biomarker lists of panels whose page markup the generic
 *    scraper cannot parse reliably, and
 *  - the per-test turnaround Lola states on its product pages.
 *
 * Pure TypeScript (no Deno or browser APIs) so the Lola scraper, the
 * migration generator and the web app's unit tests all read the same data.
 * Marker names follow the platform's existing naming where a marker already
 * exists in the catalogue (e.g. "High-Sensitivity CRP", "Active (bioavailable)
 * Vitamin B12"). Counts are always derived from list length, never stored.
 */

const FBC_CORE = [
  "Basophils",
  "Eosinophils",
  "Haematocrit",
  "Haemoglobin",
  "Lymphocytes",
  "MCHC",
  "Mean Corpuscular Haemoglobin (MCH)",
  "Mean Cell Volume",
  "Mean Platelet Volume (MPV)",
  "Monocytes",
  "Neutrophils",
  "Platelets",
  "Red Blood Cell Count",
  "Red Cell Distribution",
  "White Blood Cells",
] as const;

const LIPIDS = [
  "Cholesterol",
  "HDL Cholesterol",
  "HDL Cholesterol %",
  "Cholesterol:HDL Ratio",
  "LDL Cholesterol",
  "Non-HDL Cholesterol",
  "Triglycerides",
] as const;

const THYROID = ["Free T3", "Free T4", "Thyroid-Stimulating Hormone"] as const;

export const LOLA_PANEL_BIOMARKERS: Readonly<Record<string, readonly string[]>> =
  {
    // Lola's page title says 56 but its marker list names 55. We show the 55
    // it names and do not invent a 56th.
    "Vital Check 56": [
      "Albumin",
      "Ferritin",
      "Globulin",
      "Calcium",
      "Adjusted Calcium",
      ...LIPIDS,
      "HbA1c",
      ...FBC_CORE,
      "C-Reactive Protein (CRP)",
      "Uric Acid",
      "Creatinine",
      "eGFR",
      "Urea",
      "Alanine Aminotransferase (ALT)",
      "Alkaline Phosphatase",
      "Total Bilirubin",
      "Total Protein",
      "Creatine Kinase (CK)",
      "Follicle-Stimulating Hormone",
      "Luteinising Hormone",
      "Prolactin",
      "Oestradiol",
      "Total Testosterone",
      "Free Androgen Index (FAI)",
      "Free Testosterone",
      "SHBG",
      "Cortisol",
      ...THYROID,
      "Active (bioavailable) Vitamin B12",
      "Magnesium",
      "Folate (Vitamin B9)",
      "Vitamin D (25-OH)",
      "Gamma GT",
    ],
    "Female Hormones Clarity 31": [
      "Albumin",
      "Ferritin",
      "Calcium",
      "Adjusted Calcium",
      ...LIPIDS,
      "HbA1c",
      "High-Sensitivity CRP",
      "Follicle-Stimulating Hormone",
      "Luteinising Hormone",
      "Prolactin",
      "Progesterone",
      "DHEA-Sulphate",
      "Oestradiol",
      "Total Testosterone",
      "Free Androgen Index (FAI)",
      "Free Testosterone",
      "SHBG",
      "Cortisol",
      ...THYROID,
      "Active (bioavailable) Vitamin B12",
      "Magnesium",
      "Folate (Vitamin B9)",
      "Vitamin D (25-OH)",
    ],
    "Female Active Boost 39": [
      "Ferritin",
      "Total Iron-Binding Capacity",
      "Transferrin",
      "Transferrin Saturation",
      "Calcium",
      "Adjusted Calcium",
      ...FBC_CORE,
      "C-Reactive Protein (CRP)",
      "Creatine Kinase (CK)",
      "Follicle-Stimulating Hormone",
      "Luteinising Hormone",
      "Prolactin",
      "Progesterone",
      "Oestradiol",
      "Total Testosterone",
      "Free Androgen Index (FAI)",
      "Free Testosterone",
      "SHBG",
      "Cortisol",
      ...THYROID,
      "Active (bioavailable) Vitamin B12",
      "Magnesium",
      "Vitamin D (25-OH)",
    ],
    "Male Hormones Clarity 14": [
      "Albumin",
      "Ferritin",
      "Follicle-Stimulating Hormone",
      "Luteinising Hormone",
      "Prolactin",
      "DHEA-Sulphate",
      "Total Testosterone",
      "Free Testosterone",
      "SHBG",
      "Cortisol",
      ...THYROID,
      "Magnesium",
    ],
    "Core Health 45": [
      "Albumin",
      "Ferritin",
      "Globulin",
      "Calcium",
      "Adjusted Calcium",
      ...LIPIDS,
      "HbA1c",
      ...FBC_CORE,
      "C-Reactive Protein (CRP)",
      "Uric Acid",
      "Creatinine",
      "eGFR",
      "Urea",
      "Alkaline Phosphatase",
      "Alanine Aminotransferase (ALT)",
      "Total Bilirubin",
      "Total Protein",
      "Oestradiol",
      "Total Testosterone",
      "Free Androgen Index (FAI)",
      "Free Testosterone",
      "Active (bioavailable) Vitamin B12",
      "Magnesium",
      "Vitamin D (25-OH)",
      "Gamma GT",
    ],
    // Lola's page lists 18 markers; the stored list was missing pH.
    Urinalysis: [
      "pH",
      "Glucose (Urine)",
      "Ketones (Urine)",
      "Blood (Haematuria)",
      "Urobilinogen",
      "Nitrite",
      "Specific Gravity",
      "Colour",
      "Appearance",
      "Epithelial Cells",
      "Casts",
      "Crystals",
      "Bacteria",
      "Chromium",
      "Copper",
      "Mercury",
      "White Blood Cells (Urine)",
      "Red Blood Cells (Urine)",
    ],
  };

export const LOLA_DEFAULT_TURNAROUND = "2 working days";

export interface LolaTurnaroundRule {
  /** "prefix": name starts with value; "exact": whole name. Case-insensitive. */
  match: "prefix" | "exact";
  value: string;
  text: string;
}

/** First match wins. Anything unmatched gets LOLA_DEFAULT_TURNAROUND. */
export const LOLA_TURNAROUND_RULES: readonly LolaTurnaroundRule[] = [
  { match: "prefix", value: "Urinalysis", text: "24-48 hours" },
  // Covers TruAge, TruHealth and TruAge + TruHealth.
  { match: "prefix", value: "TruAge", text: "3-4 weeks" },
  { match: "prefix", value: "TruHealth", text: "3-4 weeks" },
  { match: "prefix", value: "GutID", text: "3-4 weeks" },
  // Both sickle cell add-on pages state a longer processing time.
  { match: "exact", value: "Sickle Cell Anemia", text: "35 working days" },
  {
    match: "exact",
    value: "Sickle Cell Hemoglobin Electrophoresis",
    text: "5 working days",
  },
  // The site owner confirmed Peak Insights 70 results take 2 to 3 working
  // days (Lola's FAQ says 4). Core Health 45 uses the default.
  { match: "exact", value: "Peak Insights 70", text: "2-3 working days" },
];

const ruleMatches = (rule: LolaTurnaroundRule, name: string): boolean => {
  const n = name.trim().toLowerCase();
  const v = rule.value.toLowerCase();
  return rule.match === "exact" ? n === v : n.startsWith(v);
};

export function lolaTurnaround(testName: string): string {
  const rule = LOLA_TURNAROUND_RULES.find((r) => ruleMatches(r, testName));
  return rule ? rule.text : LOLA_DEFAULT_TURNAROUND;
}

export function lolaPanelBiomarkers(testName: string): string[] | null {
  const list = LOLA_PANEL_BIOMARKERS[testName.trim()];
  return list ? [...list] : null;
}

// ---------------------------------------------------------------------------
// Price model
// ---------------------------------------------------------------------------

export interface LolaVariant {
  title: string;
  price: number | string;
}

export interface LolaPriceModel {
  price: number;
  base_price: number;
  clinic_phlebotomy_cost: number;
  home_phlebotomy_cost: number;
  /**
   * Collection flags are only asserted when the variants prove them (more
   * than one priced variant). Single-variant products omit them so the
   * name-based defaults from lolaCollectionDefaults() stay in force.
   */
  clinic_visit_available?: boolean;
  home_phlebotomy_option?: boolean;
  home_kit_available?: boolean;
  /** Kit price + clinic fee: the venous route deriveCollectionVariants shows. */
  total_expected_cost: number;
}

const CLINIC_VARIANT = /venous draw at a clinic/i;
const HOME_VISIT_VARIANT = /phlebotomist for a home visit/i;
const SELF_KIT_VARIANT = /autodraw|finger\s*-?prick/i;

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Turn Lola's Shopify variants into the platform's price model: `price` is
 * the lowest variant (the kit price) and phlebotomy is stored separately as
 * the difference between each draw variant and that kit price. Returns null
 * when the variants carry no usable price. Single-variant products carry no
 * collection flags.
 */
export function lolaPriceModel(
  variants: readonly LolaVariant[],
): LolaPriceModel | null {
  const priced = variants
    .map((v) => ({ title: v.title, price: Number(v.price) }))
    .filter((v) => Number.isFinite(v.price) && v.price > 0);
  if (priced.length === 0) return null;
  const kit = Math.min(...priced.map((v) => v.price));
  if (priced.length === 1) {
    return {
      price: kit,
      base_price: kit,
      clinic_phlebotomy_cost: 0,
      home_phlebotomy_cost: 0,
      total_expected_cost: kit,
    };
  }
  const clinic = priced.find((v) => CLINIC_VARIANT.test(v.title));
  const home = priced.find((v) => HOME_VISIT_VARIANT.test(v.title));
  const clinicFee = clinic ? round2(clinic.price - kit) : 0;
  const homeFee = home ? round2(home.price - kit) : 0;
  return {
    price: kit,
    base_price: kit,
    clinic_phlebotomy_cost: clinicFee,
    home_phlebotomy_cost: homeFee,
    clinic_visit_available: !!clinic,
    home_phlebotomy_option: !!home,
    home_kit_available: priced.some((v) => SELF_KIT_VARIANT.test(v.title)),
    total_expected_cost: round2(kit + clinicFee),
  };
}

/** True when the model carries variant-derived collection flags. */
export function hasLolaVariantFlags(model: LolaPriceModel): boolean {
  return (
    model.clinic_visit_available !== undefined &&
    model.home_kit_available !== undefined &&
    model.home_phlebotomy_option !== undefined
  );
}

/**
 * Lola's posted DNA kits (TruAge / TruHealth / Biological Kit) are home kits;
 * everything else is a venous draw (home visit or clinic).
 */
export const LOLA_POSTED_KIT_PATTERN =
  /truage|truhealth|tru\s*diagnostic|biological\s*kit|dna/i;

export interface LolaCollectionFields {
  sample_type: string;
  collection_method: string;
  home_kit_available: boolean;
  clinic_visit_available: boolean;
  home_phlebotomy_option?: boolean;
}

/** Name-based collection defaults, used when the variants prove nothing. */
export function lolaCollectionDefaults(
  title: string,
  slug: string,
): LolaCollectionFields {
  return LOLA_POSTED_KIT_PATTERN.test(`${title} ${slug}`)
    ? {
        sample_type: "Finger-prick",
        collection_method: "Home kit",
        home_kit_available: true,
        clinic_visit_available: false,
      }
    : {
        sample_type: "Venous",
        collection_method: "Phlebotomy (nurse visit or clinic)",
        home_kit_available: false,
        clinic_visit_available: true,
      };
}

/**
 * The scraper's merge: name-based defaults, overridden by variant flags and
 * sample type only for multi-variant products.
 */
export function lolaCollectionFields(
  title: string,
  slug: string,
  model: LolaPriceModel | null,
): LolaCollectionFields {
  const defaults = lolaCollectionDefaults(title, slug);
  if (
    !model ||
    model.clinic_visit_available === undefined ||
    model.home_kit_available === undefined ||
    model.home_phlebotomy_option === undefined
  ) {
    return defaults;
  }
  return {
    ...defaults,
    clinic_visit_available: model.clinic_visit_available,
    home_kit_available: model.home_kit_available,
    home_phlebotomy_option: model.home_phlebotomy_option,
    sample_type: lolaSampleType(model) ?? defaults.sample_type,
  };
}

/** Sample type matching the variants; null when the variants prove nothing. */
export function lolaSampleType(model: LolaPriceModel): string | null {
  if (!hasLolaVariantFlags(model)) return null;
  const venous = model.clinic_visit_available || model.home_phlebotomy_option;
  if (model.home_kit_available && venous) return "Finger-prick or venous";
  if (venous) return "Venous";
  return null;
}

/**
 * Multi-variant products as read from https://lolahealth.com/products.json on
 * 04/10/2026, keyed by Shopify handle (= provider_test_id). The scraper reads
 * the live feed on every run; this snapshot only lets the migration correct
 * live rows without waiting for a scrape. The gift card is not a test.
 */
export const LOLA_VARIANT_SNAPSHOT: Readonly<
  Record<string, { testName: string; variants: readonly LolaVariant[] }>
> = {
  "peak-insights": { testName: "Peak Insights 70", variants: [
    { title: "Phlebotomist for a Home Visit", price: 235 },
    { title: "Book a venous draw at a clinic", price: 235 },
    { title: "Arrange your own Phlebotomist", price: 200 },
  ] },
  "vital-check": { testName: "Vital Check 56", variants: [
    { title: "Phlebotomist for a Home Visit", price: 190 },
    { title: "Book a venous draw at a clinic", price: 190 },
    { title: "Arrange your own Phlebotomist", price: 155 },
  ] },
  "core-health": { testName: "Core Health 45", variants: [
    { title: "Phlebotomist for a Home Visit", price: 160 },
    { title: "Book a venous draw at a clinic", price: 160 },
    { title: "Arrange your own Phlebotomist", price: 125 },
  ] },
  "female-hormones-clarity": { testName: "Female Hormones Clarity 31", variants: [
    { title: "Phlebotomist for a Home Visit", price: 155 },
    { title: "Book a venous draw at a clinic", price: 155 },
    { title: "Arrange your own Phlebotomist", price: 120 },
  ] },
  "female-active-boost": { testName: "Female Active Boost 39", variants: [
    { title: "Phlebotomist for a Home Visit", price: 180 },
    { title: "Book a venous draw at a clinic", price: 180 },
    { title: "Arrange your own Phlebotomist", price: 145 },
  ] },
  "male-active-boost": { testName: "Male Active Boost 36", variants: [
    { title: "Phlebotomist for a Home Visit", price: 175 },
    { title: "Book a venous draw at a clinic", price: 175 },
    { title: "Arrange your own Phlebotomist", price: 140 },
  ] },
  "male-hormones-clarity": { testName: "Male Hormones Clarity 14", variants: [
    { title: "Autodraw device (upper arm)", price: 110 },
    { title: "Phlebotomist for a Home Visit", price: 145 },
    { title: "Book a venous draw at a clinic", price: 145 },
  ] },
  "cardiovascular-health": { testName: "Cardiovascular Health", variants: [
    { title: "Autodraw device (upper arm)", price: 83 },
    { title: "Fingerprick", price: 83 },
    { title: "Phlebotomist for a Home Visit", price: 118 },
    { title: "Book a venous draw at a clinic", price: 118 },
  ] },
  "liver-kidney-function": { testName: "Liver & Kidney Function", variants: [
    { title: "Autodraw device (upper arm)", price: 81 },
    { title: "Fingerprick", price: 81 },
    { title: "Phlebotomist for a Home Visit", price: 116 },
    { title: "Book a venous draw at a clinic", price: 116 },
  ] },
  "thyroid-hormonal-function": { testName: "Thyroid & Hormonal Function", variants: [
    { title: "Autodraw device (upper arm)", price: 119 },
    { title: "Fingerprick", price: 119 },
    { title: "Phlebotomist for a Home Visit", price: 154 },
    { title: "Book a venous draw at a clinic", price: 154 },
  ] },
  "blood-health": { testName: "Blood Health 6", variants: [
    { title: "Autodraw device (upper arm)", price: 89 },
    { title: "Fingerprick", price: 89 },
    { title: "Phlebotomist for a Home Visit", price: 124 },
    { title: "Book a venous draw at a clinic", price: 124 },
  ] },
  "female-hormones-7": { testName: "Female Hormones 7", variants: [
    { title: "Autodraw device (upper arm)", price: 95 },
    { title: "Fingerprick", price: 95 },
    { title: "Phlebotomist for a Home Visit", price: 130 },
    { title: "Book a venous draw at a clinic", price: 130 },
  ] },
};

const sqlText = (s: string): string => `'${s.replace(/'/g, "''")}'`;
const sqlLikeEscape = (s: string): string => s.replace(/[\\%_]/g, "\\$&");

/**
 * SQL that applies this catalogue to provider_tests. Used to generate the
 * committed migration, and by a unit test that fails if the two drift apart.
 * Names are matched with ILIKE (never =) so curly apostrophes are safe.
 */
export function buildLolaCatalogueSql(): string {
  const lines: string[] = [
    "-- Generated from supabase/functions/_shared/scrape/lola-catalogue.ts.",
    "-- Do not hand-edit: change the catalogue and regenerate.",
    "",
    "-- 1. Turnaround: default first, then the specific rules in reverse order",
    "--    so the first matching rule wins, as in lolaTurnaround().",
    `update public.provider_tests set turnaround_days_text = ${sqlText(LOLA_DEFAULT_TURNAROUND)}, turnaround_not_stated = false where provider_id = 'lola-health';`,
  ];
  for (const rule of [...LOLA_TURNAROUND_RULES].reverse()) {
    const pattern =
      rule.match === "exact"
        ? sqlLikeEscape(rule.value)
        : `${sqlLikeEscape(rule.value)}%`;
    lines.push(
      `update public.provider_tests set turnaround_days_text = ${sqlText(rule.text)}, turnaround_not_stated = false where provider_id = 'lola-health' and btrim(test_name) ilike ${sqlText(pattern)};`,
    );
  }
  lines.push("", "-- 2. Verified panel biomarker lists.");
  for (const [name, list] of Object.entries(LOLA_PANEL_BIOMARKERS)) {
    lines.push(
      `update public.provider_tests set biomarkers_list = ${sqlText(JSON.stringify(list))}::jsonb, biomarkers_not_stated = false where provider_id = 'lola-health' and btrim(test_name) ilike ${sqlText(sqlLikeEscape(name))};`,
    );
  }
  lines.push(
    "",
    "-- 3. The stored count always equals the stored list for Lola rows.",
    "update public.provider_tests set biomarker_count = jsonb_array_length(biomarkers_list) where provider_id = 'lola-health' and jsonb_typeof(biomarkers_list) = 'array' and jsonb_array_length(biomarkers_list) > 0;",
    "",
  );
  lines.push(
    "-- 4. Price model: price = kit price, phlebotomy stored separately.",
    "--    Single-variant products keep their price with no fees, and keep their existing collection flags.",
    "update public.provider_tests set base_price = price, total_expected_cost = price, clinic_phlebotomy_cost = 0, home_phlebotomy_cost = 0 where provider_id = 'lola-health' and price is not null;",
  );
  for (const [handle, { variants }] of Object.entries(LOLA_VARIANT_SNAPSHOT)) {
    const m = lolaPriceModel(variants);
    if (!m) continue;
    const sample = lolaSampleType(m);
    const flags = hasLolaVariantFlags(m)
      ? `, clinic_visit_available = ${m.clinic_visit_available}, home_phlebotomy_option = ${m.home_phlebotomy_option}, home_kit_available = ${m.home_kit_available}`
      : "";
    lines.push(
      `update public.provider_tests set price = ${m.price}, base_price = ${m.base_price}, total_expected_cost = ${m.total_expected_cost}, clinic_phlebotomy_cost = ${m.clinic_phlebotomy_cost}, home_phlebotomy_cost = ${m.home_phlebotomy_cost}${flags}${sample ? `, sample_type = ${sqlText(sample)}` : ""} where provider_id = 'lola-health' and provider_test_id = ${sqlText(handle)};`,
    );
  }
  lines.push("");
  return lines.join("\n");
}
