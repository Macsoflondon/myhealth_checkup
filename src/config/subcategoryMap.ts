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
  /**
   * Hard exclusions tested against the test name only. Used to keep gendered
   * panels apart (e.g. "Advanced Female Fertility Check" must never surface
   * under Male Fertility).
   */
  excludeAny?: RegExp[];
  /** Extra canonical categories to include in the DB query. */
  siblingCategories?: string[];
};

/** Terms that make a test unambiguously female-specific. */
const FEMALE_TERMS: RegExp[] = [
  /\bfemale\b/i,
  /\bwomen\b|\bwoman\b|\bwomen's\b/i,
  /menopaus|perimenopaus/i,
  /ovarian|ovulat/i,
  /oestrogen|estrogen|oestradiol|estradiol/i,
  /progesterone/i,
  /\bpcos\b|polycystic/i,
  /\bamh\b|anti[- ]?m(ü|u)llerian/i,
];

/** Terms that make a test unambiguously male-specific. */
const MALE_TERMS: RegExp[] = [
  /\bmale\b/i,
  /\bmen\b|\bman\b|\bmen's\b/i,
  /sperm|semen/i,
  /prostate|\bpsa\b/i,
];

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
      excludeAny: MALE_TERMS,
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
      excludeAny: FEMALE_TERMS,
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
      siblingCategories: ["general-health", "heart", "heart-health"],
    },
    {
      slug: "cholesterol",
      label: "Cholesterol Tests",
      matchAny: [/cholesterol/i, /lipid/i, /\bldl\b/i, /\bhdl\b/i],
      siblingCategories: ["general-health", "heart"],
    },
    {
      slug: "diabetes",
      label: "Diabetes Tests",
      matchAny: [/diabet/i, /hba1c/i, /glucose/i, /insulin/i],
      siblingCategories: ["general-health", "diabetes"],
    },
    {
      slug: "iron-anaemia",
      label: "Iron & Anaemia Tests",
      matchAny: [/iron/i, /ferritin/i, /anaem|anemia/i, /haemoglobin|hemoglobin/i],
      siblingCategories: ["general-health"],
    },
    {
      slug: "liver",
      label: "Liver Health Tests",
      matchAny: [/liver/i, /\balt\b/i, /\bast\b/i, /bilirubin/i, /\bggt\b/i],
      siblingCategories: ["general-health", "liver"],
    },
    {
      slug: "kidney",
      label: "Kidney Tests",
      matchAny: [/kidney/i, /renal/i, /creatinine/i, /\begfr\b/i, /\burea\b/i],
      siblingCategories: ["general-health", "kidney-health"],
    },
    {
      slug: "vitamins",
      label: "Vitamin & Nutrition Tests",
      matchAny: [/vitamin/i, /nutrition/i, /\bb12\b/i, /folate/i, /\bd3\b/i],
      siblingCategories: ["general-health", "vitamins"],
    },
    {
      slug: "allergy",
      label: "Allergy Tests",
      matchAny: [/allerg/i, /\bige\b/i, /intoleran/i],
      siblingCategories: ["general-health", "allergy-testing"],
    },
    {
      slug: "thyroid",
      label: "Thyroid Tests",
      matchAny: [/thyroid/i, /\btsh\b/i, /\bt3\b/i, /\bt4\b/i],
      siblingCategories: ["general-health", "thyroid"],
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
      matchAny: FEMALE_TERMS,
      excludeAny: MALE_TERMS,
    },
    {
      slug: "male-fertility",
      label: "Male Fertility Tests",
      matchAny: MALE_TERMS,
      excludeAny: FEMALE_TERMS,
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
  // Keep in sync with AT_HOME_SECTIONS in src/config/atHomeSections.ts — the
  // /at-home-tests listing filters on canonical_category, these entries only
  // provide labels for navigation and breadcrumbs.
  "at-home": [
    { slug: "womens", label: "Women's Health Home Kits", matchAny: [/\bwomen\b|\bwomen's\b|\bfemale\b|menopaus|pcos|ovarian|\bamh\b/i], excludeAny: MALE_TERMS, siblingCategories: ["womens-health"] },
    { slug: "mens", label: "Men's Health Home Kits", matchAny: [/\bmen\b|\bmen's\b|\bmale\b|prostate|\bpsa\b|testosterone/i], excludeAny: FEMALE_TERMS, siblingCategories: ["mens-health"] },
    { slug: "general", label: "General Health Home Kits", matchAny: [/general|wellness|essential|full body|complete/i], siblingCategories: ["general-health"] },
    { slug: "vitamins", label: "Vitamins & Nutrition Home Kits", matchAny: [/vitamin|ferritin|iron|folate|b12/i], siblingCategories: ["vitamins"] },
    { slug: "thyroid", label: "Thyroid Home Kits", matchAny: [/thyroid|\btsh\b|\bt3\b|\bt4\b/i], siblingCategories: ["thyroid"] },
    { slug: "heart", label: "Heart Health Home Kits", matchAny: [/heart|cholesterol|lipid|cardio/i], siblingCategories: ["heart"] },
    { slug: "hormones", label: "Hormone Home Kits", matchAny: [/hormone|cortisol/i], siblingCategories: ["hormones"] },
    { slug: "fertility", label: "Fertility Home Kits", matchAny: [/fertility|\bamh\b|ovarian reserve/i], siblingCategories: ["fertility"] },
    { slug: "cancer-screening", label: "Cancer Screening Home Kits", matchAny: [/cancer|\bpsa\b|prostate/i], siblingCategories: ["cancer-screening"] },
    { slug: "sexual-health", label: "Sexual Health Home Kits", matchAny: [/sexual|\bsti\b|\bstd\b/i], siblingCategories: ["sexual-health"] },
    { slug: "gut", label: "Gut Health Home Kits", matchAny: [/gut|microbiome|coeliac|celiac/i], siblingCategories: ["gut"] },
    { slug: "sports", label: "Sports & Fitness Home Kits", matchAny: [/sport|fitness|performance/i], siblingCategories: ["sports-performance"] },
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

/**
 * Find any subcategory by slug across all parents. Useful for route-agnostic
 * consumers (e.g. the global breadcrumb) that only know the URL, not the
 * canonical_category the page maps to.
 */
export function findSubcategoryBySlug(slug: string | null | undefined): SubcategoryDef | null {
  if (!slug) return null;
  for (const list of Object.values(SUBCATEGORY_MAP)) {
    const hit = list.find((s) => s.slug === slug);
    if (hit) return hit;
  }
  return null;
}

/** Test a CategoryTestItem-shaped object against a subcategory. */
export function testMatchesSubcategory(
  sub: SubcategoryDef,
  fields: { title?: string | null; biomarkers?: string[] | null; tag?: string | null; desc?: string | null }
): boolean {
  const title = fields.title ?? "";
  // Exclusions are name-only: a description mentioning the other sex must not
  // hide an otherwise valid panel.
  if (sub.excludeAny?.some((rx) => rx.test(title))) return false;
  const haystack = [
    title,
    fields.tag ?? "",
    fields.desc ?? "",
    ...(fields.biomarkers ?? []),
  ].join(" \u0001 ");
  return sub.matchAny.some((rx) => rx.test(haystack));
}
