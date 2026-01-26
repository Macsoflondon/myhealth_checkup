import type { BlogArticle } from "@/types/blog.types";

/**
 * Blog Articles Data
 * 
 * This file contains blog articles from provider partners.
 * Articles link to original content on provider websites.
 * Images are loaded from external URLs.
 * 
 * To update: Replace the blogArticles array with parsed CSV content.
 */

export const blogArticles: BlogArticle[] = [
  // Placeholder articles - replace with CSV data
  {
    title: "Understanding Your Vitamin D Levels: A Complete Guide",
    excerpt: "Learn about vitamin D deficiency symptoms, optimal levels, and how to improve your vitamin D status through testing and lifestyle changes.",
    url: "https://medichecks.com/blogs/health-hub/vitamin-d-guide",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800",
    provider: "Medichecks",
    category: "Nutrition",
    date: "2024-03-15"
  },
  {
    title: "Heart Health After 40: Key Tests You Should Consider",
    excerpt: "Discover essential cardiovascular screening tests for adults over 40, including cholesterol panels, cardiac risk assessments, and prevention strategies.",
    url: "https://thriva.co/hub/heart-health-tests",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800",
    provider: "Thriva",
    category: "Heart Health",
    date: "2024-03-12"
  },
  {
    title: "The Gut-Brain Connection: How Your Microbiome Affects Mental Health",
    excerpt: "Explore the fascinating link between gut health and mental wellbeing, plus actionable steps to improve both through targeted testing.",
    url: "https://www.randoxhealth.com/blog/gut-brain-connection",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800",
    provider: "Randox Health",
    category: "Gut Health",
    date: "2024-03-10"
  },
  {
    title: "Thyroid Function Tests: When and Why You Need Them",
    excerpt: "Understanding TSH, T3, T4 and thyroid antibodies for optimal thyroid health. Learn when testing is recommended.",
    url: "https://medichecks.com/blogs/health-hub/thyroid-function-tests",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800",
    provider: "Medichecks",
    category: "Thyroid",
    date: "2024-03-08"
  },
  {
    title: "Diabetes Prevention: Early Detection Through HbA1c Testing",
    excerpt: "How regular HbA1c monitoring can help prevent type 2 diabetes and keep your blood sugar levels in check.",
    url: "https://health.goodbodyclinic.com/blog/diabetes-prevention",
    image: "https://images.unsplash.com/photo-1593491034932-844ab981ed7c?w=800",
    provider: "Goodbody Clinic",
    category: "Diabetes",
    date: "2024-03-05"
  },
  {
    title: "Cancer Screening Guidelines for UK Adults",
    excerpt: "Age-appropriate cancer screening recommendations and what tests to consider for early detection and peace of mind.",
    url: "https://www.randoxhealth.com/blog/cancer-screening-guide",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800",
    provider: "Randox Health",
    category: "Cancer Screening",
    date: "2024-03-03"
  }
];

/**
 * Get featured articles (first 3)
 */
export const getFeaturedArticles = (): BlogArticle[] => {
  return blogArticles.slice(0, 3);
};

/**
 * Get recent articles (after featured)
 */
export const getRecentArticles = (): BlogArticle[] => {
  return blogArticles.slice(3);
};

/**
 * Get all unique categories from articles
 */
export const getCategories = (): string[] => {
  const categories = new Set(blogArticles.map(a => a.category));
  return ["All Articles", ...Array.from(categories).sort()];
};

/**
 * Filter articles by category
 */
export const filterByCategory = (category: string): BlogArticle[] => {
  if (category === "All Articles") return blogArticles;
  return blogArticles.filter(a => a.category === category);
};

/**
 * Get all unique providers from articles
 */
export const getProviders = (): string[] => {
  const providers = new Set(blogArticles.map(a => a.provider));
  return Array.from(providers).sort();
};
