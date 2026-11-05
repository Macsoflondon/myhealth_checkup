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
  "Women's Health Checks": "Women's health checks",
  "View All Women's Tests": "View all women's tests",
  "Men's Health Checks": "Men's health checks",
  "View All Men's Tests": "View all men's tests",
  "Women's Home Tests": "Women's health at-home test kits",
  "Men's Home Tests": "Men's health at-home test kits",
  "Women's Health Home Kits": "Women's health at-home test kits",
  "Men's Health Home Kits": "Men's health at-home test kits",
  "Home Tests": "Home tests",
  "Autoimmune & Immunology": "Autoimmune & immunology",
  "Men's Health": "Men's health",
};

export const displayLabel = (name: string): string => DISPLAY_LABELS[name] ?? name;

const KEEP_CAPITALISED = new Set([
  "UK", "NHS", "Medichecks", "Randox", "Lola", "Clinilabs", "Goodbody", "London", "British", "English",
]);

/**
 * Sentence case for generated headings: keeps the first word, acronyms and
 * proper nouns, and lowercases other capitalised words.
 */
export const toSentenceCase = (text: string): string => {
  const words = text.trim().split(/\s+/);
  return words
    .map((w, i) => {
      if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1);
      if (KEEP_CAPITALISED.has(w.replace(/[^A-Za-z]/g, ""))) return w;
      return /^[A-Z][a-z'’]+[,:]?$/.test(w) ? w.charAt(0).toLowerCase() + w.slice(1) : w;
    })
    .join(" ");
};

/**
 * Removes a trailing "tests"/"Tests" (and "testing") so a label can be
 * joined to other words without doubling it.
 */
export const withoutTestsSuffix = (label: string): string =>
  label.replace(/\s+(tests?|testing|blood tests)$/i, "").trim();

const isAcronymOrProper = (word: string): boolean => {
  const bare = word.replace(/[^A-Za-z0-9]/g, "");
  if (bare.length >= 2 && bare === bare.toUpperCase() && /[A-Z]/.test(bare)) return true;
  if (/\d/.test(bare)) return true;
  return KEEP_CAPITALISED.has(bare);
};

/**
 * Display label for use in the middle of a sentence ("Compare heart health
 * tests"): lowercases the first letter unless the first word is an acronym
 * or proper noun ("PCOS", "UK", "NHS").
 */
export const labelMidSentence = (label: string): string => {
  const sentence = toSentenceCase(displayLabel(label));
  const [first = "", ...rest] = sentence.split(" ");
  if (isAcronymOrProper(first)) return sentence;
  return [first.charAt(0).toLowerCase() + first.slice(1), ...rest].join(" ");
};

/** Capitalises only the first character (for a label at the start of a heading). */
export const capitaliseFirst = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);
