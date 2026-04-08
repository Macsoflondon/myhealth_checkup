import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, ExternalLink } from 'lucide-react';
import PageBanner from "@/components/sections/PageBanner";
import { blogArticles, getCategories, filterByCategory } from '@/data/blogArticles';
import { ProviderLogo } from '@/components/providers/ProviderLogo';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryBadge } from '@/components/ui/category-badge';

const HealthBlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const categories = getCategories();
  
  // Filter articles based on selected category
  const filteredArticles = filterByCategory(activeCategory);
  const featuredArticles = filteredArticles.slice(0, 3);
  const recentArticles = filteredArticles.slice(3);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Estimate read time based on excerpt length
  const getReadTime = (excerpt: string) => {
    const words = excerpt.split(' ').length;
    const time = Math.max(5, Math.ceil(words / 30) + 5);
    return `${time} min read`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Health Resource Hub | myhealth checkup</title>
        <meta name="description" content="Expert insights, health tips, and the latest research on preventive healthcare and health testing for UK adults." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/health-resources" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "myhealth checkup Health Resource Hub",
          "description": "Expert insights, health tips, and the latest research on preventive healthcare.",
          "url": "https://myhealthcheckup.co.uk/health-resources",
          "publisher": {
            "@type": "Organization",
            "name": "MYHEALTHCHECKUP LTD",
            "url": "https://myhealthcheckup.co.uk"
          }
        })}</script>
      </Helmet>
      <Header />
      <main className="flex-grow">
        <PageBanner
          title="Health Resources"
          subtitle="Expert insights, health tips, and the latest research on preventive healthcare and health testing for UK adults aged 30-60."
        />

        {/* Categories Filter */}
        <section className="border-b bg-[#081129] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button 
                  key={category} 
                  variant={activeCategory === category ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setActiveCategory(category)}
                  className={
                    activeCategory === category 
                      ? "bg-[#e70d69] hover:bg-[#e70d69]/90 text-white text-xs font-medium"
                      : "border-white/30 text-white hover:bg-[#22c0d4] hover:text-white hover:border-[#22c0d4] text-xs font-medium"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-4 text-[#22c0d4] text-4xl">Featured Articles</h2>
              <p className="text-xl text-[#e70d69]">Our most popular health and wellness content</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredArticles.map((article, index) => (
                <FeaturedArticleCard 
                  key={index} 
                  article={article} 
                  formatDate={formatDate}
                  getReadTime={getReadTime}
                />
              ))}
            </div>
            {featuredArticles.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No articles found in this category.
              </p>
            )}
          </div>
        </section>

        {/* Recent Articles */}
        {recentArticles.length > 0 && (
          <section className="py-16 bg-[#081129]">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-bold mb-4 text-[#22c0d4] text-4xl">Recent Articles</h2>
                <p className="text-xl text-[#e70d69]">Stay up to date with the latest health insights</p>
              </div>
              <div className="max-w-4xl mx-auto space-y-6">
                {recentArticles.map((article, index) => (
                  <RecentArticleRow 
                    key={index} 
                    article={article}
                    formatDate={formatDate}
                    getReadTime={getReadTime}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-[#22c0d4] text-center font-semibold">Stay Informed</CardTitle>
                <p className="text-muted-foreground">
                  Get the latest health insights and testing updates delivered to your inbox weekly.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-grow px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                  <Button>Subscribe</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  No spam, unsubscribe anytime. Privacy policy applies.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Featured Article Card Component
interface ArticleCardProps {
  article: {
    title: string;
    excerpt: string;
    url: string;
    image: string;
    provider: string;
    category: string;
    date: string;
  };
  formatDate: (date: string) => string;
  getReadTime: (excerpt: string) => string;
}

const FeaturedArticleCard = ({ article, formatDate, getReadTime }: ArticleCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0" />
        )}
        {!imageError ? (
          <img
            src={article.image}
            alt={article.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#22c0d4]/20 to-[#e70d69]/20 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image unavailable</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <CategoryBadge category={article.category} />
        </div>
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
            <ProviderLogo provider={article.provider} className="h-4 w-auto" />
            <span className="text-xs font-medium text-[#081129]">{article.provider}</span>
          </div>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {getReadTime(article.excerpt)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {article.excerpt}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-[#22c0d4] hover:text-[#e70d69] transition-colors"
              asChild
            >
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Read More <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Recent Article Row Component
const RecentArticleRow = ({ article, formatDate, getReadTime }: ArticleCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group cursor-pointer hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-32 md:h-20 w-full h-32 bg-muted rounded-lg flex-shrink-0 overflow-hidden relative">
            {!imageLoaded && !imageError && (
              <Skeleton className="absolute inset-0" />
            )}
            {!imageError ? (
              <img
                src={article.image}
                alt={article.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#22c0d4]/20 to-[#e70d69]/20" />
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <CategoryBadge category={article.category} className="text-xs" />
              <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                <ProviderLogo provider={article.provider} className="h-3 w-auto" />
                <span className="text-xs text-gray-600">{article.provider}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors text-[#081129]">
              {article.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {getReadTime(article.excerpt)}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 text-[#22c0d4] hover:text-[#e70d69] transition-colors"
                asChild
              >
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Read More <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthBlogPage;
