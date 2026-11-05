import { capitaliseFirst } from "@/lib/display-label";
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
  vitamins: "Optimise your vitamin and mineral levels",
  "vitamin-mineral": "Optimise your vitamin and mineral levels",
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
  hormones: "Hormone tests",
  "hormone-tests": "Hormone tests",
  "women's health": "Women's health",
  "womens-health": "Women's health",
  "men's health": "Men's health",
  "mens-health": "Men's health",
  fertility: "Fertility tests",
  "general health": "General health",
  "general-health": "General health",
  thyroid: "Thyroid tests",
  "cancer screening": "Cancer screening",
  "cancer-screening": "Cancer screening",
  nutrition: "Nutrition tests",
  "heart health": "Heart health",
  "heart-health": "Heart health",
  diabetes: "Diabetes tests",
  "sports-performance": "Sports performance",
  "sports-performance-tests": "Sports performance tests",
  "fitness-health": "Sports-fitness health",
  "at-home-tests": "At home test kits",
  "longevity-tests": "Longevity tests",
  "iron-tests": "Iron tests",
  "energy-tests": "Energy tests",
  "nutrition-tests": "Nutrition tests",
  "allergy-testing": "Allergy testing",
  "sexual-health": "Sexual health",
  "gp-monitoring": "GP monitoring",
  "antibody-tests": "Antibody tests",
  "infection-tests": "Infection tests",
  "immunity-tests": "Immunity tests",
  "autoimmunity-tests": "Autoimmunity tests",
  "liver-health": "Liver health",
  "kidney-health": "Kidney health",
  "weight-loss-tests": "Weight loss tests",
  "popular-tests": "Popular tests",
  vitamins: "Vitamin and mineral tests",
  "vitamin-mineral": "Vitamin and mineral tests",
};

export function getCategoryDisplayName(category: string): string {
  const normalised = category.toLowerCase().trim();
  return (
    categoryDisplayNames[normalised] ||
    capitaliseFirst(category.split("-").join(" ").toLowerCase())
  );
}
