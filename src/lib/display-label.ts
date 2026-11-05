/**
 * Sentence-case display text for category names that double as catalogue
 * keys. The stored names (e.g. "General Wellness") are matched against
 * provider category data, so they stay unchanged in data; only the text
 * shown to visitors is converted.
 */
const DISPLAY_LABELS: Readonly<Record<string, string>> = {
  "Turnaround Time": "Turnaround time",
  "Heart Health": "Heart health",
  "Metabolic Health": "Metabolic health",
  "General Wellness": "General wellness",
  "Liver Health Tests": "Liver health tests",
  "Thyroid Tests": "Thyroid tests",
  "Female Hormone Tests": "Female hormone tests",
  "Menopause Tests": "Menopause tests",
  "Sports & Fitness": "Sports & fitness",
  "Sports Performance Tests": "Sports performance tests",
  "Fertility - Prenatal": "Fertility - prenatal",
  "Cancer Screening": "Cancer screening",
  "At Home Test Kits": "At-home test kits",
  "Weight Management": "Weight management",
  "Gut Health": "Gut health",
  "Mental Health": "Mental health",
  "All Articles": "All articles",
  "General Health": "General health",
  "Test Name": "Test name",
  "Vitamin D Blood Test": "Vitamin D blood test",
  "Vitamins & Minerals": "Vitamins & minerals",
  "Hormone Balance": "Hormone balance",
  "Sexual Health": "Sexual health",
  "Longevity Tests": "Longevity tests",
  "Cardiovascular Health": "Cardiovascular health",
  "Reproductive Hormones": "Reproductive hormones",
  "Advanced Diagnostics": "Advanced diagnostics",
  "Women's Health": "Women's health",
  "Men's Health": "Men's health",
};

export const displayLabel = (name: string): string => DISPLAY_LABELS[name] ?? name;
