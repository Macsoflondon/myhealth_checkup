import React, { useMemo } from "react";
import { Link } from "@/lib/router-compat";
import { blogArticles } from "@/data/blogArticles";
import { selectTopicArticles } from "@/lib/blog/topic-relevance";

interface CategoryGuidesProps {
  /** Heading shown above the cards, e.g. "At Home Test Kit Guides". */
  heading: string;
  /** Topic text used to match relevant provider articles. */
  topic: string;
  limit?: number;
}

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Topic-matched provider articles, shown between a category page's benefits
 * grid and its quiz banner. Aggregator pattern: links out to the provider.
 */
export const CategoryGuides: React.FC<CategoryGuidesProps> = ({
  heading,
  topic,
  limit = 3,
}) => {
  const articles = useMemo(
    () => selectTopicArticles(blogArticles, topic, limit),
    [topic, limit],
  );

  if (articles.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="category-guides-heading">
      <h2
        id="category-guides-heading"
        className="font-heading text-center text-2xl sm:text-3xl font-bold text-[#081129] mb-8"
      >
        {heading}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {articles.map((article) => (
          <article
            key={article.url}
            className="group flex flex-col bg-white rounded-2xl border border-[#081129]/15 overflow-hidden transition-all duration-200 hover:border-[#22c0d4] hover:shadow-lg hover:-translate-y-0.5"
          >
            {article.image ? (
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                decoding="async"
                className="h-40 w-full object-cover"
              />
            ) : null}
            <div className="flex flex-col flex-1 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#22c0d4]">
                  {article.category}
                </span>
                <span className="text-[11px] text-[#081129]/50">
                  {article.provider}
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-[#081129] leading-snug mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-[#081129]/75 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
              <div className="mt-4 pt-3 border-t border-[#081129]/10 flex items-center justify-between">
                <span className="text-xs text-[#081129]/50">
                  {formatDate(article.date)}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-sm font-semibold text-[#e70d69] hover:text-[#22c0d4] transition-colors"
                >
                  Read article →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center mt-6">
        <Link
          to="/blog"
          className="text-sm font-semibold text-[#081129] underline underline-offset-4 hover:text-[#22c0d4] transition-colors"
        >
          View all articles
        </Link>
      </div>
    </section>
  );
};

export default CategoryGuides;
