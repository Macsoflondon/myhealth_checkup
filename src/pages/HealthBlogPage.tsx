import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Search } from 'lucide-react';
import { blogArticles, getCategories } from '@/data/blogArticles';
import type { BlogArticle } from '@/types/blog.types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80';

const ALL_PROVIDERS = ['Lola Health', 'Medichecks', 'Goodbody Clinic'] as const;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

interface FeaturedCardProps {
  article: BlogArticle;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ article }) => (
  <article className="group flex flex-col bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden transition-all duration-200 hover:border-[#22c0d4] hover:shadow-lg hover:-translate-y-0.5">
    <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f4fa]">
      <img
        src={article.image}
        alt={article.title}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
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
  const categories = useMemo(() => getCategories(), []);
  const [activeCategory, setActiveCategory] = useState<string>('All Articles');
  const [activeProviders, setActiveProviders] = useState<string[]>([...ALL_PROVIDERS]);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const toggleProvider = (p: string) => {
    setActiveProviders((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogArticles.filter((a) => {
      if (activeCategory !== 'All Articles' && a.category !== activeCategory) return false;
      if (!activeProviders.includes(a.provider)) return false;
      if (q && !`${a.title} ${a.excerpt}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activeCategory, activeProviders, search]);

  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3);
  const visibleRest = rest.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Health Resource Hub | myhealth checkup</title>
        <meta
          name="description"
          content="Expert insights, health tips and the latest research on preventive healthcare and private health testing for UK adults."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Health Resource Hub — preventive health guides for UK adults" />
        <meta property="og:description" content="Independent guides on private blood testing, biomarkers, cancer screening and longevity health for UK adults." />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/blog" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <header className="mb-8">
            <div
              className="uppercase"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, letterSpacing: '0.12em', color: '#22c0d4', fontWeight: 600 }}
            >
              Health Resources
            </div>
            <h1
              className="mt-2"
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: '#081129', lineHeight: 1.15 }}
            >
              <span className="block text-[28px] md:text-[40px]">Expert Health Insights</span>
            </h1>
            <p
              className="mt-3 max-w-2xl"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: '#64748b' }}
            >
              Evidence-led articles from the UK's most trusted diagnostics providers.
            </p>
          </header>

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
              className="w-full rounded-full border border-[#081129] bg-white pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#22c0d4] focus:border-transparent"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#081129' }}
            />
          </div>

          {/* Provider filter */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#64748b' }}>
              Filter by source:
            </span>
            {ALL_PROVIDERS.map((p) => {
              const checked = activeProviders.includes(p);
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
                  <FeaturedCard key={a.url} article={a} />
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
                      <FeaturedCard key={a.url} article={a} />
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
      <Footer />
    </div>
  );
};

export default HealthBlogPage;
