import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import QuizCTABanner from "@/components/sections/QuizCTABanner";
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Search } from 'lucide-react';
import { blogArticles } from '@/data/blogArticles';
import { getAggregatedBlogArticles } from '@/lib/blog/blog.functions';
import type { BlogArticle } from '@/types/blog.types';

/**
 * Category-keyed fallbacks so articles without a provider hero image do not all
 * collapse onto one photograph.
 */
const CATEGORY_IMAGES: Record<string, readonly string[]> = {
  'Heart Health': [
    'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80',
  ],
  Hormones: [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
  ],
  Nutrition: [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  ],
  Vitamins: [
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1200&q=80',
  ],
  'Cancer Screening': [
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1200&q=80',
  ],
  Thyroid: [
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  ],
  'Gut Health': [
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80',
  ],
  Diabetes: [
    'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=1200&q=80',
  ],
  'Mental Health': [
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  ],
  Wellness: [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
  ],
};

const DEFAULT_IMAGES = CATEGORY_IMAGES['Wellness'] ?? [];

/** Stable per-article pick so the same card keeps the same fallback. */
const fallbackImage = (article: Pick<BlogArticle, 'category' | 'title' | 'url'>): string => {
  const pool = CATEGORY_IMAGES[article.category] ?? DEFAULT_IMAGES;
  const key = `${article.url}${article.title}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length] ?? DEFAULT_IMAGES[0] ?? '';
};



const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

interface FeaturedCardProps {
  article: BlogArticle;
  /** Provider images reused across many posts are swapped for varied artwork. */
  overusedImages: Set<string>;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ article, overusedImages }) => (
  <article className="group flex flex-col bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden transition-all duration-200 hover:border-[#22c0d4] hover:shadow-lg hover:-translate-y-0.5">
    <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f4fa]">
      <img
        src={
          article.image && !overusedImages.has(article.image)
            ? article.image
            : fallbackImage(article)
        }
        alt={article.title}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = fallbackImage(article);
        }}

        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,17,41,0.5)] via-transparent to-transparent" />
      <span
        className="absolute left-3 bottom-3 inline-block rounded-full bg-[#22c0d4] text-white px-2.5 py-1 uppercase"
        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.08em', fontWeight: 600 }}
      >
        {article.category}
      </span>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <div
        className="uppercase"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#94a3b8', letterSpacing: '0.08em' }}
      >
        {article.provider}
      </div>
      <h3
        className="mt-1 mb-2 line-clamp-2"
        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 16, color: '#081129', lineHeight: 1.35 }}
      >
        {article.title}
      </h3>
      <p
        className="line-clamp-3 mb-4 flex-1"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.55 }}
      >
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f0f4fa]">
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#94a3b8' }}>
          {formatDate(article.date)}
        </span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#22c0d4', fontWeight: 500 }}
        >
          Read article →
        </a>
      </div>
    </div>
  </article>
);

const PAGE_SIZE = 12;

const HealthBlogPage: React.FC = () => {
  const { data: liveArticles } = useQuery({
    queryKey: ['provider-blog-posts'],
    queryFn: () => getAggregatedBlogArticles(),
    staleTime: 30 * 60 * 1000,
  });

  const articles: BlogArticle[] = useMemo(
    () => (liveArticles && liveArticles.length > 0 ? liveArticles : blogArticles),
    [liveArticles],
  );

  const categories = useMemo(() => {
    const set = new Set<string>(['All Articles']);
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


  const [activeCategory, setActiveCategory] = useState<string>('All Articles');
  const [excludedProviders, setExcludedProviders] = useState<string[]>([]);
  const [search, setSearch] = useState('');
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
      if (activeCategory !== 'All Articles' && a.category !== activeCategory) return false;
      if (excludedProviders.includes(a.provider)) return false;
      if (q && !`${a.title} ${a.excerpt}`.toLowerCase().includes(q)) return false;
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
      <Helmet>
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'myhealth checkup Health Resource Hub',
          description: 'Expert insights, health tips, and the latest research on preventive healthcare.',
          url: 'https://myhealthcheckup.co.uk/blog',
          publisher: {
            '@type': 'Organization',
            name: 'MYHEALTHCHECKUP LTD',
            url: 'https://myhealthcheckup.co.uk',
          },
        })}</script>
      </Helmet>
      <Header />
      <main className="flex-grow">
        {/* Standardised navy hero */}
        <section
          aria-label="Health Resource Hub"
          className="px-4 sm:px-8 md:px-10 pt-10 sm:pt-12 md:pt-14 pb-11 sm:pb-14"
          style={{ background: '#081129', position: 'relative', overflow: 'hidden' }}
        >
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(6,11,24,0.08) 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,200,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span aria-hidden="true" className="flex-shrink-0 h-px w-8 sm:w-12" style={{ background: '#e70d69' }} />
              <h1
                className="font-bold text-center m-0 text-white text-xl sm:text-2xl md:text-[33px]"
                style={{ fontFamily: "Montserrat, 'Helvetica Neue', sans-serif", letterSpacing: '0.04em', lineHeight: 1.15, paddingBlock: '0.05em' }}
              >
                Health Resource Hub
              </h1>
              <span aria-hidden="true" className="flex-shrink-0 h-px w-8 sm:w-12" style={{ background: '#e70d69' }} />
            </div>

            <p className="text-center mx-auto mt-4 text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 680, lineHeight: 1.6 }}>
              Articles from the diagnostics providers we work with, gathered in one centralised resource hub. Each headline links straight back to the original source, so you can read more about a provider or test directly from them.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[`${articles.length} articles`, `${allProviders.length} providers`, `${categories.length - 1} topics`, 'Updated daily'].map((stat) => (
                <span key={stat} className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>
                  <span aria-hidden="true" style={{ color: '#22c0d4' }}>✓</span>
                  {stat}
                </span>
              ))}
            </div>

            <div role="presentation" aria-hidden="true" className="mt-6 sm:mt-7" style={{ height: 3, background: 'linear-gradient(90deg, #22c0d4, #e70d69, #22c0d4)', borderRadius: 2 }} />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((c) => {
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setActiveCategory(c); setVisibleCount(PAGE_SIZE); }}
                  className={`rounded-full transition-colors ${
                    active
                      ? 'bg-[#081129] text-white border border-[#081129]'
                      : 'bg-white text-[#081129] border border-[#081129] hover:bg-[#f0f4fa]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, padding: '6px 16px' }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              placeholder="Search articles…"
              className="w-full rounded-full border border-[#081129] bg-white pl-10 pr-4 py-2.5 outline-hidden focus:ring-2 focus:ring-[#22c0d4] focus:border-transparent"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#081129' }}
            />
          </div>

          {/* Provider filter */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#64748b' }}>
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
                      ? 'bg-[#081129] text-white border-[#081129]'
                      : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#081129]'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, padding: '4px 12px' }}
                  aria-pressed={checked}
                >
                  {checked ? '✓ ' : ''}{p}
                </button>
              );
            })}
          </div>



          {filtered.length === 0 ? (
            <div
              className="text-center py-16"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#64748b' }}
            >
              No articles found for this selection.
            </div>
          ) : (
            <>
              {/* Featured */}
              <h2
                className="mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 20, color: '#081129' }}
              >
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((a) => (
                  <FeaturedCard key={a.url} article={a} overusedImages={overusedImages} />
                ))}
              </div>

              {/* All */}
              {rest.length > 0 && (
                <>
                  <h2
                    className="mt-10 mb-6"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 20, color: '#081129' }}
                  >
                    All Articles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleRest.map((a) => (
                      <FeaturedCard key={a.url} article={a} overusedImages={overusedImages} />
                    ))}
                  </div>
                  {visibleCount < rest.length && (
                    <div className="text-center mt-10">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                        className="rounded-full border border-[#081129] hover:bg-[#f0f4fa] transition-colors"
                        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, color: '#081129', padding: '10px 32px' }}
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
