import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import QuizCTABanner from "@/components/sections/QuizCTABanner";
import { StandardPageHero } from "@/components/layout/StandardPageHero";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search } from "lucide-react";
import { providerArticlesQuery } from "@/lib/blog/article-query";
import { ArticleImage } from "@/components/tests/ArticleImage";
import type { BlogArticle } from "@/types/blog.types";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

interface FeaturedCardProps {
  article: BlogArticle;
  /** Provider images reused across many posts are swapped for varied artwork. */
  overusedImages: Set<string>;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  article,
  overusedImages,
}) => (
  <article className="group flex flex-col bg-white rounded-2xl border border-brand-navy overflow-hidden transition-all duration-200 hover:border-[#22c0d4] hover:shadow-lg hover:-translate-y-0.5">
    <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f4fa]">
      <ArticleImage
        article={article}
        unsuitable={overusedImages.has(article.image)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,17,41,0.5)] via-transparent to-transparent" />
      <span
        className="absolute left-3 bottom-3 inline-block rounded-full bg-[#22c0d4] text-white px-2.5 py-1 uppercase"
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 10,
          letterSpacing: "0.08em",
          fontWeight: 600,
        }}
      >
        {article.category}
      </span>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <div
        className="uppercase"
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: 11,
          color: "#94a3b8",
          letterSpacing: "0.08em",
        }}
      >
        {article.provider}
      </div>
      <h3
        className="mt-1 mb-2 line-clamp-2"
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: 16,
          color: "#081129",
          lineHeight: 1.35,
        }}
      >
        {article.title}
      </h3>
      <p
        className="line-clamp-3 mb-4 flex-1"
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: 13,
          color: "#64748b",
          lineHeight: 1.55,
        }}
      >
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f0f4fa]">
        <span
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          {formatDate(article.date)}
        </span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 13,
            color: "#22c0d4",
            fontWeight: 500,
          }}
        >
          Read article →
        </a>
      </div>
    </div>
  </article>
);

const PAGE_SIZE = 12;

const HealthBlogPage: React.FC = () => {
  const { data: articles = [] } = useQuery(providerArticlesQuery);
  const checkedAt = articles.reduce(
    (latest, article) =>
      article.checkedAt && article.checkedAt > latest
        ? article.checkedAt
        : latest,
    "",
  );

  const categories = useMemo(() => {
    const set = new Set<string>(["All Articles"]);
    articles.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [articles]);

  const allProviders = useMemo(
    () => Array.from(new Set(articles.map((a) => a.provider))).sort(),
    [articles],
  );

  /** Any hero image reused by more than three posts is generic, not editorial. */
  const overusedImages = useMemo(() => {
    const counts = new Map<string, number>();
    articles.forEach((a) => {
      if (a.image) counts.set(a.image, (counts.get(a.image) ?? 0) + 1);
    });
    return new Set(
      Array.from(counts.entries())
        .filter(([, count]) => count > 3)
        .map(([url]) => url),
    );
  }, [articles]);

  const [activeCategory, setActiveCategory] = useState<string>("All Articles");
  const [excludedProviders, setExcludedProviders] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const toggleProvider = (p: string) => {
    setExcludedProviders((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter((a) => {
      if (activeCategory !== "All Articles" && a.category !== activeCategory)
        return false;
      if (excludedProviders.includes(a.provider)) return false;
      if (q && !`${a.title} ${a.excerpt}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [articles, activeCategory, excludedProviders, search]);

  /**
   * Round-robin by provider so one prolific source cannot dominate the top of
   * the hub, while keeping the newest article first within each provider.
   */
  const ordered = useMemo(() => {
    const byProvider = new Map<string, BlogArticle[]>();
    filtered.forEach((a) => {
      const bucket = byProvider.get(a.provider) ?? [];
      bucket.push(a);
      byProvider.set(a.provider, bucket);
    });
    const buckets = Array.from(byProvider.values());
    const result: BlogArticle[] = [];
    let index = 0;
    while (result.length < filtered.length) {
      let placed = false;
      for (const bucket of buckets) {
        const item = bucket[index];
        if (item) {
          result.push(item);
          placed = true;
        }
      }
      if (!placed) break;
      index += 1;
    }
    return result;
  }, [filtered]);

  const featured = ordered.slice(0, 3);
  const rest = ordered.slice(3);
  const visibleRest = rest.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {/* Standardised navy hero */}
        <StandardPageHero
          title="Health Resource Hub"
          strapline="Articles from the diagnostics providers we work with, gathered in one centralised resource hub. Each headline links straight back to the original source, so you can read more about a provider or test directly from them."
          stats={[
            `${articles.length} articles`,
            `${allProviders.length} providers`,
            `${categories.length - 1} topics`,
            checkedAt
              ? `Last checked ${new Date(checkedAt).toLocaleDateString("en-GB")}`
              : "Last check unavailable",
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((c) => {
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setActiveCategory(c);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`rounded-full transition-colors ${
                    active
                      ? "bg-[#081129] text-white border border-[#081129]"
                      : "bg-white text-[#081129] border border-[#081129] hover:bg-[#f0f4fa]"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "6px 16px",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy"
              size={16}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search articles…"
              className="w-full rounded-full border border-[#081129] bg-white pl-10 pr-4 py-2.5 outline-hidden focus:ring-2 focus:ring-[#22c0d4] focus:border-transparent"
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 14,
                color: "#081129",
              }}
            />
          </div>

          {/* Provider filter */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 12,
                color: "#64748b",
              }}
            >
              Filter by source:
            </span>
            {allProviders.map((p) => {
              const checked = !excludedProviders.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProvider(p)}
                  className={`rounded-full border transition-colors ${
                    checked
                      ? "bg-[#081129] text-white border-[#081129]"
                      : "bg-white text-brand-navy border-brand-navy hover:border-[#081129]"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "4px 12px",
                  }}
                  aria-pressed={checked}
                >
                  {checked ? "✓ " : ""}
                  {p}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div
              className="text-center py-16"
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 14,
                color: "#64748b",
              }}
            >
              No articles found for this selection.
            </div>
          ) : (
            <>
              {/* Featured */}
              <h2
                className="mb-6"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#081129",
                }}
              >
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((a) => (
                  <FeaturedCard
                    key={a.url}
                    article={a}
                    overusedImages={overusedImages}
                  />
                ))}
              </div>

              {/* All */}
              {rest.length > 0 && (
                <>
                  <h2
                    className="mt-10 mb-6"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: 20,
                      color: "#081129",
                    }}
                  >
                    All Articles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleRest.map((a) => (
                      <FeaturedCard
                        key={a.url}
                        article={a}
                        overusedImages={overusedImages}
                      />
                    ))}
                  </div>
                  {visibleCount < rest.length && (
                    <div className="text-center mt-10">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                        className="rounded-full border border-[#081129] hover:bg-[#f0f4fa] transition-colors"
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#081129",
                          padding: "10px 32px",
                        }}
                      >
                        Load more articles
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
      <section className="bg-white py-12 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <QuizCTABanner />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HealthBlogPage;
