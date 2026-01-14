/**
 * Category-specific taglines for test cards
 */

export const categoryTaglines: Record<string, string> = {
  hormones: "Understand your hormonal balance",
  "hormone-tests": "Understand your hormonal balance",
  "women's health": "Get the answers you've been looking for",
  "womens-health": "Get the answers you've been looking for",
  "men's health": "Stay on top of your game",
  "mens-health": "Stay on top of your game",
  fertility: "Plan your journey with confidence",
  "general health": "Unlock a deeper understanding",
  "general-health": "Unlock a deeper understanding",
  thyroid: "Monitor your metabolic health",
  "cancer screening": "Early detection saves lives",
  "cancer-screening": "Early detection saves lives",
  nutrition: "Optimise your nutritional health",
  "heart health": "Keep your heart healthy",
  "heart-health": "Keep your heart healthy",
  diabetes: "Monitor your blood sugar levels",
  default: "Take control of your health",
};

export function getCategoryTagline(category: string): string {
  const normalised = category.toLowerCase().trim();
  return categoryTaglines[normalised] || categoryTaglines.default;
}

/**
 * Display-friendly category names
 */
export const categoryDisplayNames: Record<string, string> = {
  hormones: "Hormone Tests",
  "hormone-tests": "Hormone Tests",
  "women's health": "Women's Health",
  "womens-health": "Women's Health",
  "men's health": "Men's Health",
  "mens-health": "Men's Health",
  fertility: "Fertility Tests",
  "general health": "General Health",
  "general-health": "General Health",
  thyroid: "Thyroid Tests",
  "cancer screening": "Cancer Screening",
  "cancer-screening": "Cancer Screening",
  nutrition: "Nutrition Tests",
  "heart health": "Heart Health",
  "heart-health": "Heart Health",
  diabetes: "Diabetes Tests",
};

export function getCategoryDisplayName(category: string): string {
  const normalised = category.toLowerCase().trim();
  return categoryDisplayNames[normalised] || category.charAt(0).toUpperCase() + category.slice(1);
}
