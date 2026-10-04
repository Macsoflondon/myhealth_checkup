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
  // Peak Insights 70 deliberately uses the default: Lola's product page says
  // 2 working days but its FAQ says 4. We follow the product page, as for
  // every other Lola test. Core Health 45 also uses the default.
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
  return lines.join("\n");
}
