/**
 * Category configuration and search terms
 */

export const CATEGORY_COLORS: Record<string, string> = {
  'blood-tests': 'bg-red-500 text-white',
  'hormones': 'bg-pink-500 text-white',
  'thyroid': 'bg-emerald-500 text-white',
  'thyroid-tests': 'bg-emerald-500 text-white',
  'vitamins': 'bg-lime-500 text-white',
  'diabetes': 'bg-orange-500 text-white',
  'heart-health': 'bg-red-600 text-white',
  'liver-health': 'bg-yellow-500 text-white',
  'kidney-health': 'bg-[#081129] text-white',
  'fertility': 'bg-purple-500 text-white',
  'general-health': 'bg-teal-500 text-white',
  'allergy-testing': 'bg-indigo-500 text-white',
  'cancer-screening': 'bg-gray-700 text-white',
  'womens-health-checks': 'bg-pink-500 text-white',
  'female-hormone-tests': 'bg-purple-600 text-white',
  'female-fertility-tests': 'bg-red-400 text-white',
  'sports-performance-tests': 'bg-blue-500 text-white',
  'mens-health-checks': 'bg-blue-500 text-white',
  'male-hormone-tests': 'bg-teal-600 text-white',
  'male-fertility-tests': 'bg-red-400 text-white',
  'prostate-tests': 'bg-indigo-600 text-white',
  'erectile-dysfunction-tests': 'bg-purple-500 text-white',
  'prenatal-paternity-tests': 'bg-violet-600 text-white',
  'gender-reveal-tests': 'bg-pink-400 text-white',
  'nipt-tests': 'bg-blue-600 text-white',
  'weight-loss-tests': 'bg-pink-500 text-white',
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

export function getCategoryColor(categoryId: string): string {
  return CATEGORY_COLORS[categoryId] || 'bg-gray-400 text-white';
}

export function getCategorySearchTerms(category: string): string[] {
  return CATEGORY_SEARCH_TERMS[category] || [category.toLowerCase()];
}
