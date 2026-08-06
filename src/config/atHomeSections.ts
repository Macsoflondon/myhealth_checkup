/**
 * Sections for the At Home Test Kits landing page.
 *
 * Each section is driven by `canonical_category` on `provider_tests` rather
 * than name-pattern matching, so the counts and the filtered listings always
 * agree with the taxonomy.
 */
export interface AtHomeSectionDef {
  /** URL slug used as `?subcategory=` on /at-home-tests. */
  slug: string;
  /** Card and hero label. */
  label: string;
  /** Short, plain-English description of what the section covers. */
  desc: string;
  /** Decorative glyph shown in the card medallion. */
  icon: string;
  /** Brand-aligned accent colour. */
  accent: string;
  /** canonical_category values that belong to this section. */
  categories: string[];
}

export const AT_HOME_SECTIONS: AtHomeSectionDef[] = [
  {
    slug: "womens",
    label: "Women's Health",
    desc: "Female hormone, menopause and PCOS finger-prick kits",
    icon: "◈",
    accent: "#e70d69",
    categories: ["womens-health"],
  },
  {
    slug: "mens",
    label: "Men's Health",
    desc: "Testosterone, prostate and male wellbeing kits",
    icon: "⬡",
    accent: "#22c0d4",
    categories: ["mens-health"],
  },
  {
    slug: "general",
    label: "General Health",
    desc: "Broad wellness panels covering everyday health markers",
    icon: "⊕",
    accent: "#22c0d4",
    categories: ["general-health"],
  },
  {
    slug: "vitamins",
    label: "Vitamins & Nutrition",
    desc: "Vitamin D, B12, folate, ferritin and iron status kits",
    icon: "◇",
    accent: "#f0a500",
    categories: ["vitamins"],
  },
  {
    slug: "thyroid",
    label: "Thyroid",
    desc: "TSH, free T3, free T4 and thyroid antibody kits",
    icon: "◎",
    accent: "#22c0d4",
    categories: ["thyroid"],
  },
  {
    slug: "heart",
    label: "Heart Health",
    desc: "Cholesterol, lipids and cardiovascular risk markers",
    icon: "♡",
    accent: "#e70d69",
    categories: ["heart"],
  },
  {
    slug: "hormones",
    label: "Hormones",
    desc: "Cortisol and wider hormone balance kits for both sexes",
    icon: "⋈",
    accent: "#e70d69",
    categories: ["hormones"],
  },
  {
    slug: "fertility",
    label: "Fertility",
    desc: "AMH, ovarian reserve and fertility hormone kits",
    icon: "◑",
    accent: "#22c0d4",
    categories: ["fertility"],
  },
  {
    slug: "cancer-screening",
    label: "Cancer Screening",
    desc: "PSA and other screening markers collected at home",
    icon: "⬟",
    accent: "#9b59b6",
    categories: ["cancer-screening"],
  },
  {
    slug: "sexual-health",
    label: "Sexual Health",
    desc: "Confidential home sampling for sexual health screening",
    icon: "◬",
    accent: "#9b59b6",
    categories: ["sexual-health"],
  },
  {
    slug: "gut",
    label: "Gut Health",
    desc: "Coeliac risk and gut microbiome home sampling kits",
    icon: "◐",
    accent: "#f0a500",
    categories: ["gut"],
  },
  {
    slug: "sports",
    label: "Sports & Fitness",
    desc: "Performance and recovery markers for active people",
    icon: "⟳",
    accent: "#22c0d4",
    categories: ["sports-performance"],
  },
];

export function findAtHomeSection(slug: string | null | undefined): AtHomeSectionDef | null {
  if (!slug) return null;
  return AT_HOME_SECTIONS.find((s) => s.slug === slug) ?? null;
}
