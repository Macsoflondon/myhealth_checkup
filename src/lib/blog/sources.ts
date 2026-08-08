/**
 * Registry of provider blog sources.
 *
 * Aggregator pattern only: we read public feeds/sitemaps and store the title,
 * the provider's own meta description, the hero image and a canonical link
 * back to the provider. No full-text article content is copied.
 */

export type BlogSourceType = "atom" | "rss" | "sitemap-og";

export interface BlogSource {
  providerId: string;
  providerName: string;
  type: BlogSourceType;
  /** Feed URLs (atom/rss) or a sitemap URL (sitemap-og). */
  urls: string[];
  /** sitemap-og only: only sitemap entries containing this path count as articles. */
  pathFilter?: string;
  /** sitemap-og only: cap on how many article pages are fetched per run. */
  maxPages?: number;
}

const MEDICHECKS_BLOG_HANDLES = [
  "autoimmune-disease",
  "biomarkers",
  "blood-testing",
  "fertility",
  "general-health",
  "hormone-health",
  "liver-health",
  "longevity",
  "male-hormone",
  "menopause",
  "mens-health",
  "mental-health",
  "news",
  "nutrition",
  "pcos",
  "sexual-health",
  "skin-health",
  "sports-performance",
  "testosterone",
  "thyroid",
  "vitamin-d",
  "weight-loss",
  "womens-health",
];

export const BLOG_SOURCES: BlogSource[] = [
  {
    providerId: "medichecks",
    providerName: "Medichecks",
    type: "atom",
    urls: MEDICHECKS_BLOG_HANDLES.map(
      (handle) => `https://www.medichecks.com/blogs/${handle}.atom`,
    ),
  },
  {
    providerId: "goodbody-clinic",
    providerName: "Goodbody Clinic",
    type: "atom",
    urls: ["https://goodbodyclinic.com/blogs/goodbody-health-hub.atom"],
  },
  {
    providerId: "lola-health",
    providerName: "Lola Health",
    type: "atom",
    urls: ["https://lolahealth.com/blogs/longevity.atom"],
  },
  {
    providerId: "london-health-company",
    providerName: "London Health Company",
    type: "atom",
    urls: ["https://londonhealthcompany.co.uk/blogs/news.atom"],
  },
  {
    providerId: "clinilabs",
    providerName: "Clinilabs",
    type: "atom",
    urls: ["https://www.clinilabs.co.uk/blogs/health-hub.atom"],
  },
  {
    providerId: "medical-diagnosis",
    providerName: "Medical Diagnosis",
    type: "rss",
    urls: ["https://www.medical-diagnosis.co.uk/feed"],
  },
  {
    providerId: "thriva",
    providerName: "Thriva",
    type: "sitemap-og",
    urls: ["https://thriva.co/sitemap.xml"],
    pathFilter: "/hub/",
    maxPages: 60,
  },
];

/**
 * Providers with no machine-readable blog source. Randox Health and London
 * Medical Laboratory render their listings client-side and publish neither a
 * feed nor article URLs in their sitemaps, so they are excluded rather than
 * surfaced as an empty filter.
 */
export const BLOG_SOURCES_UNAVAILABLE: { providerId: string; reason: string }[] = [
  {
    providerId: "randox",
    reason: "Blog index is client-rendered; no feed and no article URLs in sitemap",
  },
  {
    providerId: "london-medical-laboratory",
    reason: "No public blog index or sitemap",
  },
];

/** Keyword mapping onto the hub's existing category list. */
const CATEGORY_RULES: { category: string; pattern: RegExp }[] = [
  { category: "Cancer Screening", pattern: /cancer|tumour|tumor|\bpsa\b|prostate|bowel cancer|melanoma/i },
  { category: "Thyroid", pattern: /thyroid|\btsh\b|hypothyroid|hyperthyroid/i },
  { category: "Hormones", pattern: /hormone|testosterone|oestrogen|estrogen|menopause|pcos|fertility|cortisol|libido/i },
  { category: "Heart Health", pattern: /heart|cardiac|cardiovascular|cholesterol|blood pressure|lipid|triglyceride/i },
  { category: "Diabetes", pattern: /diabet|hba1c|insulin|blood sugar|glucose/i },
  { category: "Gut Health", pattern: /\bgut\b|liver|digest|microbiome|coeliac|\bibs\b|stomach/i },
  { category: "Vitamins", pattern: /vitamin|iron|ferritin|folate|b12|magnesium|zinc|deficien/i },
  { category: "Mental Health", pattern: /mental health|stress|anxiety|depress|sleep|burnout|mood/i },
];

export function categoriseArticle(text: string): string {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(text)) return rule.category;
  }
  return "Wellness";
}
