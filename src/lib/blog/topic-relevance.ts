import type { BlogArticle } from "@/types/blog.types";

/**
 * Selects provider articles relevant to a category page's topic.
 * Presentation-only helper: no network calls, no data mutation.
 */

interface TopicRule {
  /** Matched against the page topic/title text. */
  match: RegExp;
  /** Keywords scored against article title + excerpt. */
  keywords: RegExp;
  /** Hub categories that count as a softer match. */
  categories: string[];
}

const TOPIC_RULES: TopicRule[] = [
  {
    match: /at[\s-]?home|finger[\s-]?prick|home test/i,
    keywords:
      /at[\s-]?home|home test|finger[\s-]?prick|blood spot|sample collection|postal|self[\s-]?test|blood sample|how to take/i,
    categories: ["Wellness"],
  },
  {
    match: /cancer|screening/i,
    keywords: /cancer|tumour|tumor|\bpsa\b|prostate|bowel|melanoma|early detection|\bca[\s-]?125\b/i,
    categories: ["Cancer Screening"],
  },
  {
    match: /women|female|menopause/i,
    keywords: /women|female|oestrogen|estrogen|menopause|perimenopause|pcos|period|\bhrt\b|cervical|breast/i,
    categories: ["Women's Health", "Hormones"],
  },
  {
    match: /\bmen\b|men's|male|testosterone/i,
    keywords: /\bmen\b|men's|male|testosterone|prostate|libido|erectile|muscle/i,
    categories: ["Men's Health", "Hormones"],
  },
  {
    match: /fertility|paternity|conception/i,
    keywords: /fertility|conceiv|sperm|ovulation|\bamh\b|pregnan|paternity|\bdna\b|ivf/i,
    categories: ["Hormones", "Women's Health"],
  },
  {
    match: /sport|fitness|performance|active/i,
    keywords: /sport|fitness|training|performance|muscle|exercise|recovery|endurance|protein|energy/i,
    categories: ["Wellness"],
  },
  {
    match: /thyroid/i,
    keywords: /thyroid|\btsh\b|hypothyroid|hyperthyroid/i,
    categories: ["Thyroid"],
  },
  {
    match: /heart|cardio|cholesterol/i,
    keywords: /heart|cardiac|cardiovascular|cholesterol|blood pressure|lipid|triglyceride/i,
    categories: ["Heart Health"],
  },
  {
    match: /diabet|blood sugar/i,
    keywords: /diabet|hba1c|insulin|blood sugar|glucose/i,
    categories: ["Diabetes"],
  },
  {
    match: /gut|liver|digest/i,
    keywords: /\bgut\b|liver|digest|microbiome|coeliac|\bibs\b|stomach/i,
    categories: ["Gut Health"],
  },
  {
    match: /vitamin|nutrition|deficien/i,
    keywords: /vitamin|iron|ferritin|folate|b12|magnesium|zinc|deficien|nutrition/i,
    categories: ["Vitamins"],
  },
  {
    match: /hormone/i,
    keywords: /hormone|testosterone|oestrogen|estrogen|cortisol|menopause|pcos/i,
    categories: ["Hormones"],
  },
  {
    match: /wellness|general health|popular/i,
    keywords: /wellness|general health|health check|blood test|biomarker|longevity|prevent/i,
    categories: ["Wellness"],
  },
];

const findRule = (topic: string): TopicRule | undefined =>
  TOPIC_RULES.find((rule) => rule.match.test(topic));

const scoreArticle = (article: BlogArticle, rule: TopicRule): number => {
  const text = `${article.title} ${article.excerpt}`;
  let score = 0;
  if (rule.keywords.test(text)) score += 10;
  if (rule.categories.includes(article.category)) score += 4;
  return score;
};

/**
 * Returns up to `limit` articles relevant to `topic`, preferring a spread of
 * providers and falling back to the newest articles so slots always fill.
 */
export const selectTopicArticles = (
  articles: readonly BlogArticle[],
  topic: string,
  limit = 3,
): BlogArticle[] => {
  const byNewest = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));
  const rule = findRule(topic ?? "");

  const ranked = rule
    ? byNewest
        .map((article) => ({ article, score: scoreArticle(article, rule) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.article)
    : [];

  const picked: BlogArticle[] = [];
  const usedProviders = new Set<string>();
  const usedUrls = new Set<string>();

  const take = (pool: readonly BlogArticle[], uniqueProvider: boolean) => {
    for (const article of pool) {
      if (picked.length >= limit) return;
      if (usedUrls.has(article.url)) continue;
      if (uniqueProvider && usedProviders.has(article.provider)) continue;
      picked.push(article);
      usedUrls.add(article.url);
      usedProviders.add(article.provider);
    }
  };

  take(ranked, true);
  take(ranked, false);
  take(byNewest, true);
  take(byNewest, false);

  return picked;
};

/** "At Home Test Kits" -> "At Home Test Kit Guides". */
export const guidesHeadingFor = (topic: string): string => {
  const cleaned = (topic || "Health")
    .replace(/^why choose\s+/i, "")
    .replace(/[?.!]+$/, "")
    .replace(/\s+testing$/i, "")
    .replace(/\s+tests?$/i, "")
    .trim();
  return `${cleaned || "Health"} Guides`;
};
