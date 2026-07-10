/**
 * Category configuration, colors, and search terms
 * Single source of truth for all category definitions
 */

export const CATEGORY_COLORS: Record<string, string> = {
  'blood-tests': 'bg-red-500 text-white',
  'hormones': 'bg-brand-pink text-white',
  'thyroid': 'bg-emerald-500 text-white',
  'thyroid-tests': 'bg-emerald-500 text-white',
  'vitamins': 'bg-lime-500 text-white',
  'diabetes': 'bg-orange-500 text-white',
  'heart-health': 'bg-red-600 text-white',
  'liver': 'bg-yellow-500 text-white',
  'liver-health': 'bg-yellow-500 text-white',
  'kidney-health': 'bg-navy text-white',
  'womens-health': 'bg-brand-pink text-white',
  'mens-health': 'bg-blue-500 text-white',
  'longevity-tests': 'bg-teal-600 text-white',
  'fertility': 'bg-purple-500 text-white',
  'general-health': 'bg-teal-500 text-white',
  'allergy-testing': 'bg-indigo-500 text-white',
  'cancer-screening': 'bg-gray-700 text-white',
  'sexual-health': 'bg-rose-600 text-white',
  'gut-health': 'bg-amber-600 text-white',
  'gut': 'bg-amber-600 text-white',
  'genetic-testing': 'bg-violet-600 text-white',
  'womens-health-checks': 'bg-brand-pink text-white',
  'female-hormone-tests': 'bg-purple-600 text-white',
  'female-fertility-tests': 'bg-red-400 text-white',
  'sports-performance-tests': 'bg-blue-500 text-white',
  'mens-health-checks': 'bg-blue-500 text-white',
  'male-hormone-tests': 'bg-teal-600 text-white',
  'male-fertility-tests': 'bg-red-400 text-white',
  'prostate-tests': 'bg-indigo-600 text-white',
  'erectile-dysfunction-tests': 'bg-purple-500 text-white',
  'prenatal-paternity-tests': 'bg-violet-600 text-white',
  'gender-reveal-tests': 'bg-brand-pink text-white',
  'nipt-tests': 'bg-blue-600 text-white',
  'weight-loss-tests': 'bg-brand-pink text-white',
  'diabetes-tests': 'bg-orange-500 text-white',
  'cholesterol-tests': 'bg-red-600 text-white',
  'vitamins-tests': 'bg-lime-500 text-white',
  'advanced-vitamins-tests': 'bg-green-600 text-white',
  'coeliac-tests': 'bg-amber-500 text-white',
};

export const CATEGORY_SEARCH_TERMS: Record<string, string[]> = {
  'Blood Tests': ['blood', 'full blood count', 'fbc', 'biochemistry', 'blood panel'],
  'Hormone Tests': ['hormone', 'hormonal', 'testosterone', 'estrogen', 'progesterone', 'cortisol'],
  'Thyroid Tests': ['thyroid', 'tsh', 't3', 't4', 'thyroglobulin', 'thyroid antibodies'],
  'Vitamin & Mineral Tests': ['vitamin', 'mineral', 'b12', 'd3', 'folate', 'iron', 'zinc', 'magnesium', 'nutrient'],
  'Diabetes Testing': ['diabetes', 'diabetic', 'glucose', 'hba1c', 'insulin', 'blood sugar'],
  'Heart Health': ['heart', 'cardiac', 'cardiovascular', 'cholesterol', 'lipid', 'triglycerides', 'hdl', 'ldl'],
  'Liver Health': ['liver', 'hepatic', 'alt', 'ast', 'bilirubin', 'liver function'],
  'Kidney Health': ['kidney', 'renal', 'creatinine', 'urea', 'kidney function', 'egfr'],
  'Fertility Testing': ['fertility', 'reproductive', 'sperm', 'ovarian', 'amh', 'fsh', 'lh'],
  'General Health': ['general', 'comprehensive', 'health check', 'wellness', 'screening'],
  'Allergy Testing': ['allergy', 'allergic', 'intolerance', 'food sensitivity', 'ige'],
  'Cancer Screening': ['cancer', 'screening', 'tumour', 'psa', 'cea', 'ca125', 'oncology'],
};

/**
 * Maps URL slugs to the actual category values stored in the provider_tests table.
 * Multiple DB values may map to a single slug (e.g. "Hormones" and "Hormone Tests" → "hormones").
 */
export const SLUG_TO_DB_CATEGORIES: Record<string, string[]> = {
  'hormones': ['Hormones', 'Hormone Tests', 'Hormone', 'Reproductive Hormones'],
  'thyroid': ['Thyroid', 'Thyroid Tests'],
  'vitamins': ['Vitamins & Minerals', 'Vitamin & Mineral Tests', 'Vitamins'],
  'diabetes': ['Diabetes', 'Diabetes Testing'],
  'heart-health': ['Heart Health', 'Cardiovascular Health'],
  'liver': ['Liver Function', 'Liver Health'],
  'liver-health': ['Liver Function', 'Liver Health'],
  'kidney-health': ['Kidney Function', 'Kidney Health'],
  'cancer-screening': ['Cancer Screening'],
  'fertility': ['Fertility', 'Fertility Testing'],
  'general-health': ['General Health', 'Health Screening', 'Wellness'],
  'allergy-testing': ['Allergy', 'Allergy Testing', 'Allergy & Sensitivity'],
  'sports-performance-tests': ['Sports Performance', 'Sports & Fitness'],
  'mens-health': ["Men's Health", 'Mens Health'],
  'womens-health': ["Women's Health", 'Womens Health'],
  'sexual-health': ['Sexual Health'],
  'weight-loss-tests': ['Weight Management'],
  'longevity-tests': ['General Health', 'Health Screening', 'Wellness'],
  'blood-tests': ['Haematology', 'Blood Count'],
  'iron-tests': ['Iron Status', 'Iron & Anaemia'],
  'energy-tests': ['Fatigue', 'Fatigue & Energy'],
  'immunity-tests': ['Immunology'],
  'infection-tests': ['Sexual Health'],
  'gut-health': ['Gut Health', 'Digestive Health'],
  'gut': ['Gut Health', 'Digestive Health'],
  'genetic-testing': ['Genetic Testing', 'Genetics'],
  'inflammation': ['Inflammation'],
};

/**
 * Maps toolbar slugs to canonical_category values stored in provider_tests.
 */
export const SLUG_TO_CANONICAL_CATEGORIES: Record<string, string[]> = {
  'hormones': ['hormones'],
  'thyroid': ['thyroid'],
  'thyroid-tests': ['thyroid'],
  'vitamins': ['vitamins', 'vitamins-minerals'],
  'diabetes': ['diabetes'],
  'heart-health': ['heart-health', 'heart'],
  'cancer-screening': ['cancer-screening'],
  'fertility': ['fertility'],
  'general-health': ['general-health'],
  'allergy-testing': ['allergy-testing', 'allergy'],
  'sports-performance-tests': ['sports-performance-tests', 'sports-performance'],
  'mens-health': ['mens-health'],
  'womens-health': ['womens-health'],
  'sexual-health': ['sexual-health'],
  'gut-health': ['gut-health', 'gut'],
  'gut': ['gut', 'gut-health'],
  'genetic-testing': ['genetic-testing'],
  'longevity-tests': ['general-health'],
  'weight-loss-tests': ['general-health'],
  'liver': ['general-health'],
  'blood-tests': ['general-health'],
};

/**
 * Sub-category slugs that aren't a clean 1:1 with canonical_category.
 * Narrow results by test_name pattern, optionally scoped to one or more
 * canonical categories. Used by buildCategoryQuery to support nav items
 * like "Menopause Tests", "Female Hormone Tests" etc.
 */
export interface SlugNameFilter {
  canonicals?: string[];
  includeNames: string[];
  excludeNames?: string[];
}

export const SLUG_TO_NAME_FILTER: Record<string, SlugNameFilter> = {
  'menopause': {
    canonicals: ['womens-health', 'hormones'],
    includeNames: ['menopause', 'perimenopause', 'hrt'],
  },
  'menopause-tests': {
    canonicals: ['womens-health', 'hormones'],
    includeNames: ['menopause', 'perimenopause', 'hrt'],
  },
  'female-hormones': {
    canonicals: ['womens-health', 'hormones'],
    includeNames: ['female hormone', 'women', 'oestrogen', 'estrogen', 'progesterone', 'fsh', 'lh'],
    excludeNames: ['male hormone'],
  },
  'female-hormone-tests': {
    canonicals: ['womens-health', 'hormones'],
    includeNames: ['female hormone', 'women', 'oestrogen', 'estrogen', 'progesterone', 'fsh', 'lh'],
    excludeNames: ['male hormone'],
  },
  'female-fertility': {
    canonicals: ['fertility', 'womens-health'],
    includeNames: ['female fertility', 'amh', 'ovarian reserve', 'female hormone and fertility', 'fertility hormones', 'fertility profile'],
    excludeNames: ['male fertility', 'sperm'],
  },
  'female-fertility-tests': {
    canonicals: ['fertility', 'womens-health'],
    includeNames: ['female fertility', 'amh', 'ovarian reserve', 'female hormone and fertility', 'fertility hormones', 'fertility profile'],
    excludeNames: ['male fertility', 'sperm'],
  },
  'pcos': {
    canonicals: ['womens-health', 'hormones'],
    includeNames: ['pcos', 'polycystic'],
  },
  'male-hormones': {
    canonicals: ['mens-health', 'hormones'],
    includeNames: ['male hormone', 'testosterone'],
    excludeNames: ['female'],
  },
  'male-fertility': {
    canonicals: ['fertility', 'mens-health'],
    includeNames: ['male fertility', 'sperm'],
    excludeNames: ['female'],
  },
  'testosterone': {
    canonicals: ['hormones', 'mens-health'],
    includeNames: ['testosterone'],
  },
  'prostate': {
    canonicals: ['mens-health', 'cancer-screening'],
    includeNames: ['prostate', 'psa'],
  },
  'amh': {
    canonicals: ['fertility', 'womens-health'],
    includeNames: ['amh', 'anti-müllerian', 'anti-mullerian', 'ovarian reserve'],
  },
};

export function getNameFilterForSlug(slug: string): SlugNameFilter | undefined {
  return SLUG_TO_NAME_FILTER[slug.toLowerCase()];
}

export function getCanonicalCategoriesForSlug(slug: string): string[] | undefined {
  return SLUG_TO_CANONICAL_CATEGORIES[slug.toLowerCase()];
}

/**
 * Resolves a URL slug to the matching DB category values.
 * Returns undefined if no mapping exists (caller should fall back to ilike).
 */
export function getDbCategoriesForSlug(slug: string): string[] | undefined {
  return SLUG_TO_DB_CATEGORIES[slug.toLowerCase()];
}

export function getCategoryColor(categoryId: string): string {
  return CATEGORY_COLORS[categoryId] || 'bg-gray-400 text-white';
}

export function getCategorySearchTerms(category: string): string[] {
  return CATEGORY_SEARCH_TERMS[category] || [category.toLowerCase()];
}

// Compare categories with full details - merged from src/data/compare/categories.ts
export const compareCategories = [
  { id: "blood-tests", name: "Blood Tests", description: "Comprehensive blood analysis and health markers", searchTerms: ["blood", "full blood count", "fbc", "biochemistry", "blood panel"] },
  { id: "hormones", name: "Hormone Tests", description: "Thyroid, testosterone, and reproductive hormones", searchTerms: ["hormone", "hormonal", "testosterone", "estrogen", "progesterone", "cortisol"] },
  { id: "thyroid", name: "Thyroid Tests", description: "Thyroid function and antibody testing", searchTerms: ["thyroid", "tsh", "t3", "t4", "thyroglobulin", "thyroid antibodies"] },
  { id: "vitamins", name: "Vitamin & Mineral Tests", description: "Essential nutrients and deficiency screening", searchTerms: ["vitamin", "mineral", "b12", "d3", "folate", "iron", "zinc", "magnesium", "nutrient"] },
  { id: "liver", name: "Liver Health Tests", description: "Liver function and enzyme testing", searchTerms: ["liver", "hepatic", "alt", "ast", "liver function", "liver enzyme"] },
  { id: "diabetes", name: "Diabetes Testing", description: "Blood sugar and glucose monitoring", searchTerms: ["diabetes", "glucose", "hba1c", "blood sugar", "diabetic"] },
  { id: "cancer-screening", name: "Cancer Screening", description: "Early detection and preventive screening", searchTerms: ["cancer", "screening", "tumour", "psa", "cea", "ca125", "oncology"] },
  { id: "heart-health", name: "Heart Health", description: "Cardiovascular risk and cholesterol testing", searchTerms: ["heart", "cardiac", "cardiovascular", "cholesterol", "lipid", "triglycerides", "hdl", "ldl"] },
  { id: "mens-health", name: "Men's Health", description: "Comprehensive men's health screening and monitoring", searchTerms: ["mens", "male", "prostate", "testosterone", "mens health", "male health"] },
  { id: "womens-health", name: "Women's Health", description: "Comprehensive women's health screening and monitoring", searchTerms: ["womens", "female", "ovarian", "cervical", "womens health", "female health", "well woman"] },
  { id: "fertility", name: "Fertility - Prenatal", description: "Reproductive health and fertility assessments", searchTerms: ["fertility", "reproductive", "sperm", "ovarian", "amh", "fsh", "lh"] },
  { id: "general-health", name: "General Health", description: "Comprehensive health screening packages", searchTerms: ["general", "comprehensive", "health check", "wellness", "screening"] },
  { id: "allergy-testing", name: "Allergy Testing", description: "Food and environmental allergy screening", searchTerms: ["allergy", "allergic", "intolerance", "food sensitivity", "ige"] },
  { id: "sports-performance-tests", name: "Sports Performance Tests", description: "Athletic performance optimization and health monitoring", searchTerms: ["sports", "athletic", "performance", "fitness", "athlete testing"] },
  { id: "weight-loss-tests", name: "Weight Loss Tests", description: "Weight management and metabolic health screening", searchTerms: ["weight loss", "weight management", "metabolism", "metabolic health", "thyroid weight", "hormone weight"] },
  { id: "longevity-tests", name: "Longevity Tests", description: "Comprehensive health markers for longevity and preventive care", searchTerms: ["longevity", "preventive", "comprehensive health", "wellness screening", "life extension"] },
  { id: "sexual-health", name: "Sexual Health", description: "STI screening and sexual wellness testing", searchTerms: ["sexual", "sti", "std", "chlamydia", "gonorrhoea", "hiv", "syphilis", "herpes"] },
  { id: "gut-health", name: "Gut Health", description: "Digestive health, microbiome and food sensitivity testing", searchTerms: ["gut", "digestive", "microbiome", "stool", "ibs", "coeliac", "intestinal"] },
  { id: "genetic-testing", name: "Genetic Testing", description: "DNA-based health and predisposition screening", searchTerms: ["genetic", "dna", "genome", "hereditary", "predisposition"] },
];

// Category mapping helper function
export const getCategoryFromTestName = (testName: string): string => {
  const lowerTestName = testName.toLowerCase();
  for (const category of compareCategories) {
    if (category.searchTerms.some(term => lowerTestName.includes(term))) {
      return category.name;
    }
  }
  return "General Health";
};
