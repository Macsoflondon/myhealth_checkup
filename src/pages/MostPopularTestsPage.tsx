import React, { useMemo } from 'react';
import { Loader2, Star, TrendingUp, Shield } from 'lucide-react';
import { CategoryPageLayout, CategoryTestItem } from '@/components/category/CategoryPageLayout';
import { usePopularTestsFromDatabase } from '@/hooks/usePopularTestsFromDatabase';
import { getBranding } from '@/data/providerBranding';
import { getProviderRating } from '@/constants/providerRatings';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const cleanName = (name: string) =>
  name
    .replace(/\s*[-–|].*$/, '')
    .replace(/\s+Blood Test$/i, '')
    .replace(/\s+for Enhanced Health$/i, '')
    .replace(/\s*\| Book Online today$/i, '');

const parseTurnaroundDays = (turnaround: string): number => {
  const match = turnaround.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
};

const MostPopularTestsPage = () => {
  const { data: popularTests, isLoading, error } = usePopularTestsFromDatabase(24);

  const tests: CategoryTestItem[] = useMemo(() => {
    if (!popularTests) return [];
    return popularTests.map((t, idx) => {
      const branding = getBranding(t.provider_id);
      const providerRating = getProviderRating(t.provider_id);
      const tag = t.category || 'General Health';
      return {
        id: t.id,
        popular: idx < 3,
        badge: tag,
        badgeColor: branding?.primary || '#e70d69',
        provider: t.provider_name,
        priceNum: t.price,
        price: `£${t.price}`,
        turnaround: t.turnaround_time || '2–5 days',
        turnaroundDays: parseTurnaroundDays(t.turnaround_time || '5'),
        biomarkerCount: t.biomarker_count || 0,
        rating: providerRating.rating,
        reviews: providerRating.reviews,
        title: cleanName(t.test_name),
        desc:
          t.description ||
          `Comprehensive health screening covering essential markers. ${t.sample_type || 'Blood sample'} collection.`,
        biomarkers: t.markers || [],
        tag,
        collection: t.sample_type || 'Blood sample',
        url: t.url || undefined,
      } satisfies CategoryTestItem;
    });
  }, [popularTests]);

  const filters = useMemo(() => {
    const unique = Array.from(new Set(tests.map((t) => t.tag))).filter(Boolean);
    return ['All', ...unique];
  }, [tests]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-[#08122b]">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="ml-3 text-white">Loading popular tests...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || tests.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-[#08122b] text-white">
          <p>Unable to load popular tests. Please try again later.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <CategoryPageLayout
      seoTitle="Most Popular Tests | myhealth checkup"
      seoDescription="Discover our most popular health tests, trusted by thousands of customers. Compare the best-selling blood tests from UK providers."
      seoKeywords="popular health tests, blood tests, health screening, comprehensive health check"
      canonicalUrl="https://myhealthcheckup.co.uk/popular-tests"
      pillLabel="Most Popular"
      headline="Most Popular Tests"
      subtitle="Compare the best-selling health tests from trusted UK providers, chosen by thousands of customers."
      searchPlaceholder="Search popular tests..."
      trustStats={[
        { value: '50,000+', label: 'Customers Served' },
        { value: '4.8★', label: 'Average Rating' },
        { value: '6+', label: 'Trusted Providers' },
      ]}
      filters={filters}
      tests={tests}
      benefitsTitle="Why Choose Our Most Popular Tests?"
      benefits={[
        { icon: Star, title: 'Trusted by Thousands', description: 'Our highest-rated tests chosen by customers across the UK' },
        { icon: TrendingUp, title: 'Comprehensive Insights', description: 'Thorough biomarker panels for a complete health picture' },
        { icon: Shield, title: 'Accredited Labs', description: 'All tests processed by UKAS-accredited laboratories' },
      ]}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Popular Tests' }]}
    />
  );
};

export default MostPopularTestsPage;
