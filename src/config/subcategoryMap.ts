/**
 * Sub-category mapping for toolbar dropdowns.
 *
 * Each parent canonical category exposes a list of sub-category slugs.
 * A slug is matched against a test using `matchAny` regexes over the
 * test_name (and biomarkers where relevant). Optional `siblingCategories`
 * pull in rows stored under a different canonical_category (e.g. Women's
 * Health → Thyroid, which lives under canonical_category='thyroid').
 */
export type SubcategoryDef = {
  slug: string;
  label: string;
  matchAny: RegExp[];
  /** Extra canonical categories to include in the DB query. */
  siblingCategories?: string[];
};

export const SUBCATEGORY_MAP: Record<string, SubcategoryDef[]> = {
  "womens-health": [
    {
      slug: "hormones",
      label: "Female Hormone Tests",
      matchAny: [/hormone/i, /oestrogen|estrogen/i, /progesterone/i, /\bfsh\b/i, /\blh\b/i, /prolactin/i],
      siblingCategories: ["hormones"],
    },
    {
      slug: "fertility",
      label: "Female Fertility Tests",
      matchAny: [/fertility/i, /\bamh\b/i, /ovarian reserve/i],
      siblingCategories: ["fertility", "female-fertility"],
    },
    {
      slug: "menopause",
      label: "Menopause Tests",
      matchAny: [/menopaus/i, /perimenopaus/i],
    },
    {
      slug: "pcos",
      label: "PCOS Tests",
      matchAny: [/pcos/i, /polycystic/i],
    },
    {
      slug: "thyroid",
      label: "Thyroid Tests",
      matchAny: [/thyroid/i, /\btsh\b/i, /\bt3\b/i, /\bt4\b/i],
      siblingCategories: ["thyroid"],
    },
  ],
  "mens-health": [
    {
      slug: "hormones",
      label: "Male Hormone Tests",
      matchAny: [/hormone/i, /testosterone/i, /dhea/i, /shbg/i],
      siblingCategories: ["hormones"],
    },
    {
      slug: "fertility",
      label: "Male Fertility Tests",
      matchAny: [/fertility/i, /sperm/i, /semen/i],
      siblingCategories: ["fertility", "male-fertility"],
    },
    {
      slug: "testosterone",
      label: "Testosterone Tests",
      matchAny: [/testosterone/i, /free t\b/i, /dihydrotestosterone|dht/i],
    },
    {
      slug: "prostate",
      label: "Prostate Tests",
      matchAny: [/prostate/i, /\bpsa\b/i],
    },
  ],
  wellness: [
    {
      slug: "heart-health",
      label: "Heart Health Tests",
      matchAny: [/heart/i, /cardio/i, /cholesterol/i, /lipid/i],
      siblingCategories: ["heart-health"],
    },
    {
      slug: "cholesterol",
      label: "Cholesterol Tests",
      matchAny: [/cholesterol/i, /lipid/i, /\bldl\b/i, /\bhdl\b/i],
    },
    {
      slug: "diabetes",
      label: "Diabetes Tests",
      matchAny: [/diabet/i, /hba1c/i, /glucose/i, /insulin/i],
      siblingCategories: ["diabetes"],
    },
    {
      slug: "iron-anaemia",
      label: "Iron & Anaemia Tests",
      matchAny: [/iron/i, /ferritin/i, /anaem|anemia/i, /haemoglobin|hemoglobin/i],
    },
    {
      slug: "liver",
      label: "Liver Health Tests",
      matchAny: [/liver/i, /\balt\b/i, /\bast\b/i, /bilirubin/i, /\bggt\b/i],
      siblingCategories: ["liver"],
    },
    {
      slug: "kidney",
      label: "Kidney Tests",
      matchAny: [/kidney/i, /renal/i, /creatinine/i, /\begfr\b/i, /\burea\b/i],
      siblingCategories: ["kidney-health"],
    },
    {
      slug: "vitamins",
      label: "Vitamin & Nutrition Tests",
      matchAny: [/vitamin/i, /nutrition/i, /\bb12\b/i, /folate/i, /\bd3\b/i],
      siblingCategories: ["vitamins"],
    },
    {
      slug: "allergy",
      label: "Allergy Tests",
      matchAny: [/allerg/i, /\bige\b/i, /intoleran/i],
      siblingCategories: ["allergy-testing"],
    },
    {
      slug: "thyroid",
      label: "Thyroid Tests",
      matchAny: [/thyroid/i, /\btsh\b/i, /\bt3\b/i, /\bt4\b/i],
      siblingCategories: ["thyroid"],
    },
  ],
  "sports-performance": [
    {
      slug: "hormones",
      label: "Sports Hormone Tests",
      matchAny: [/hormone/i, /cortisol/i, /testosterone/i, /dhea/i],
      siblingCategories: ["hormones"],
    },
    {
      slug: "testosterone",
      label: "Testosterone Tests",
      matchAny: [/testosterone/i, /\bfree t\b/i],
    },
    {
      slug: "energy",
      label: "Energy & Fatigue Tests",
      matchAny: [/energy/i, /fatigue/i, /\bb12\b/i, /iron/i, /ferritin/i, /vitamin d/i],
      siblingCategories: ["general-health"],
    },
  ],
  fertility: [
    {
      slug: "female-fertility",
      label: "Female Fertility Tests",
      matchAny: [/female|women/i, /\bamh\b/i, /ovarian/i, /oestrogen|estrogen/i, /progesterone/i],
    },
    {
      slug: "male-fertility",
      label: "Male Fertility Tests",
      matchAny: [/male|men/i, /sperm/i, /semen/i, /testosterone/i],
    },
    {
      slug: "amh",
      label: "AMH Fertility Test",
      matchAny: [/\bamh\b/i, /anti[- ]?müllerian|anti[- ]?mullerian/i],
    },
    {
      slug: "prenatal",
      label: "Prenatal / NIPT Tests",
      matchAny: [/prenatal/i, /\bnipt\b/i, /non[- ]?invasive prenatal/i],
    },
    {
      slug: "pregnancy",
      label: "Pregnancy Tests",
      matchAny: [/pregnan/i, /\bhcg\b/i],
    },
  ],
  "at-home": [
    {
      slug: "womens",
      label: "Women's Home Tests",
      matchAny: [/women|female|menopaus|pcos|ovarian|amh|oestrogen|estrogen|progesterone/i],
    },
    {
      slug: "mens",
      label: "Men's Home Tests",
      matchAny: [/\bmen\b|male|prostate|\bpsa\b|testosterone/i],
    },
    {
      slug: "general",
      label: "General Health Home Tests",
      matchAny: [/general|wellness|essential|advanced well|full body|complete/i],
    },
    {
      slug: "allergy",
      label: "Allergy Home Tests",
      matchAny: [/allerg|intoleran|\bige\b/i],
    },
  ],
  "cancer-screening": [
    { slug: "bowel", label: "Bowel Cancer Screening", matchAny: [/bowel|colorectal|\bfit\b|colon/i] },
    { slug: "prostate", label: "Prostate Cancer PSA", matchAny: [/prostate|\bpsa\b/i] },
    { slug: "cervical", label: "Cervical Cancer HPV", matchAny: [/cervical|\bhpv\b/i] },
    { slug: "lung", label: "Lung Cancer Screening", matchAny: [/lung/i] },
  ],
};

export function findSubcategory(canonicalCategory: string, slug: string | null | undefined): SubcategoryDef | null {
  if (!slug) return null;
  const list = SUBCATEGORY_MAP[canonicalCategory];
  if (!list) return null;
  return list.find((s) => s.slug === slug) ?? null;
}

/** Test a CategoryTestItem-shaped object against a subcategory. */
export function testMatchesSubcategory(
  sub: SubcategoryDef,
  fields: { title?: string | null; biomarkers?: string[] | null; tag?: string | null; desc?: string | null }
): boolean {
  const haystack = [
    fields.title ?? "",
    fields.tag ?? "",
    fields.desc ?? "",
    ...(fields.biomarkers ?? []),
  ].join(" \u0001 ");
  return sub.matchAny.some((rx) => rx.test(haystack));
}
