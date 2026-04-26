/**
 * Blog Article Types
 * Used for the dynamic blog system with external images and provider links
 */

export interface BlogArticle {
  /** Article headline */
  title: string;
  /** Short summary (50-100 words) */
  excerpt: string;
  /** Link to original article on provider's website */
  url: string;
  /** External image URL from provider */
  image: string;
  /** Provider name (e.g., "Medichecks", "Thriva") */
  provider: string;
  /** Topic category (e.g., "Nutrition", "Heart Health") */
  category: string;
  /** Publication date in YYYY-MM-DD format */
  date: string;
}

export type BlogCategory = 
  | "All Articles"
  | "Heart Health"
  | "Nutrition"
  | "Hormones"
  | "Gut Health"
  | "Cancer Screening"
  | "Diabetes"
  | "Mental Health"
  | "Women's Health"
  | "Men's Health"
  | "Thyroid"
  | "Vitamins"
  | "Wellness";
