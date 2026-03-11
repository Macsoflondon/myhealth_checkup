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
  "sports-performance": "Optimise your athletic potential",
  "sports-performance-tests": "Optimise your athletic potential",
  "fitness-health": "Fuel your fitness with data",
  "at-home-tests": "Test from the comfort of home",
  "longevity-tests": "Invest in your long-term health",
  "iron-tests": "Check your iron levels",
  "energy-tests": "Understand what's draining your energy",
  "nutrition-tests": "Optimise your nutritional health",
  "allergy-testing": "Identify your triggers",
  "sexual-health": "Stay informed and protected",
  "gp-monitoring": "Track your health with professional guidance",
  "antibody-tests": "Check your immune response",
  "infection-tests": "Detect infections early",
  "immunity-tests": "Assess your immune strength",
  "autoimmunity-tests": "Understand your autoimmune markers",
  "liver-health": "Monitor your liver function",
  "kidney-health": "Keep your kidneys healthy",
  "weight-loss-tests": "Support your weight management goals",
  "popular-tests": "Our most requested health tests",
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
  "sports-performance": "Sports Performance",
  "sports-performance-tests": "Sports Performance Tests",
  "fitness-health": "Fitness Health",
  "at-home-tests": "At-Home Tests",
  "longevity-tests": "Longevity Tests",
  "iron-tests": "Iron Tests",
  "energy-tests": "Energy Tests",
  "nutrition-tests": "Nutrition Tests",
  "allergy-testing": "Allergy Testing",
  "sexual-health": "Sexual Health",
  "gp-monitoring": "GP Monitoring",
  "antibody-tests": "Antibody Tests",
  "infection-tests": "Infection Tests",
  "immunity-tests": "Immunity Tests",
  "autoimmunity-tests": "Autoimmunity Tests",
  "liver-health": "Liver Health",
  "kidney-health": "Kidney Health",
  "weight-loss-tests": "Weight Loss Tests",
  "popular-tests": "Popular Tests",
};

export function getCategoryDisplayName(category: string): string {
  const normalised = category.toLowerCase().trim();
  return (
    categoryDisplayNames[normalised] ||
    category
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}
