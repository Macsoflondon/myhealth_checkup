import React from 'react';
import { Link } from 'react-router-dom';
import { blogArticles } from '@/data/blogArticles';
import type { BlogArticle } from '@/types/blog.types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const FeaturedCard: React.FC<{ article: BlogArticle }> = ({ article }) => (
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

const HealthResources: React.FC = () => {
  const articles = blogArticles.filter((a) => a.provider !== 'Thriva').slice(0, 3);

  return (
    <section className="py-16 bg-[#081129] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-turquoise/5 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-pink/5 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-[#e70d69] text-center">
            Health Resources Hub
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <FeaturedCard key={article.url} article={article} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/health-resources"
              className="inline-block rounded-full bg-white text-[#081129] hover:bg-[#f0f4fa] transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, padding: '12px 32px' }}
            >
              View all articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthResources;
