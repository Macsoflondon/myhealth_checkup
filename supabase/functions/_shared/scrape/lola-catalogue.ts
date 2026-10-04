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

interface TurnaroundRule {
  pattern: RegExp;
  text: string;
}

/** First match wins. Anything unmatched gets LOLA_DEFAULT_TURNAROUND. */
const LOLA_TURNAROUND_RULES: readonly TurnaroundRule[] = [
  { pattern: /^urinalysis\b/i, text: "24-48 hours" },
  { pattern: /^(truage|truhealth)\b/i, text: "3-4 weeks" },
  { pattern: /^gutid\b/i, text: "3-4 weeks" },
  // Both sickle cell add-on pages state a longer processing time.
  { pattern: /^sickle cell anemia$/i, text: "35 working days" },
  {
    pattern: /^sickle cell hemoglobin electrophoresis$/i,
    text: "5 working days",
  },
  // Peak Insights 70: the product page says 2 working days but Lola's FAQ
  // says 4. We follow the product page, as for every other Lola test.
];

export function lolaTurnaround(testName: string): string {
  const name = testName.trim();
  const rule = LOLA_TURNAROUND_RULES.find((r) => r.pattern.test(name));
  return rule ? rule.text : LOLA_DEFAULT_TURNAROUND;
}

export function lolaPanelBiomarkers(testName: string): string[] | null {
  const list = LOLA_PANEL_BIOMARKERS[testName.trim()];
  return list ? [...list] : null;
}
