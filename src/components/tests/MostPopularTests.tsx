import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, Users, Loader2 } from 'lucide-react';
import PageHeading from '@/components/ui/page-heading';
import { SectionHeading } from '@/components/ui/section-heading';
import { usePopularTestsFromDatabase, PopularTest } from '@/hooks/usePopularTestsFromDatabase';
import { UnifiedTestCard } from '@/components/cards/UnifiedTestCard';
import { getProviderRating } from '@/constants/providerRatings';
import { getBranding } from '@/data/providerBranding';

const MostPopularTests = () => {
  const navigate = useNavigate();
  const { data: popularTests, isLoading, error } = usePopularTestsFromDatabase(12);

  // No mapping needed — we render UnifiedTestCard directly from popularTests

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#081129] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <PageHeading 
              title="Most Popular" 
              accent="Tests" 
              className="[&_span]:text-white mb-6"
            />
            <p className="text-xl text-white max-w-2xl mx-auto mb-8">
              Check out our best-selling tests from all providers, trusted by thousands of people across the UK for comprehensive health screening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-health-heading" onClick={() => navigate('/compare')}>
                Browse All Tests
              </Button>
              <Button size="lg" className="bg-[#22C0D4] text-white hover:bg-[#E70D69]" onClick={() => navigate('/find-clinic')}>
                Find a Clinic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 my-[10px] py-[10px] bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeading 
              title="Why Choose" 
              gradientText="Popular Tests?" 
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Proven Track Record</h3>
                <p className="text-muted-foreground">
                  Tests chosen by thousands of satisfied customers for reliable health insights
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Our most popular tests cover the widest range of essential health markers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Community Trust</h3>
                <p className="text-muted-foreground">
                  Join thousands who trust these tests for their health monitoring needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tests Section - Unified with Footer */}
      <section className="bg-[#081129] py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">

          <div className="flex justify-end mb-4 sm:mb-6">
            <select className="px-3 sm:px-4 md:px-14 py-2 border border-gray-500 rounded-md text-xs sm:text-sm bg-[#e70d69] text-white hover:border-gray-400">
              <option>Biomarkers, high to low</option>
              <option>Price, high to low</option>
              <option>Price, low to high</option>
              <option>Most popular</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#22c0d4]" />
              <span className="ml-3 text-white">Loading popular tests...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-white mb-4">Unable to load tests. Please try again.</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="text-white border-white">
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 justify-items-center">
              {(popularTests || []).map((test) => {
                const providerData = getProviderRating(test.provider_id);
                const branding = getBranding(test.provider_id);
                const cleanName = test.test_name
                  .replace(/\s*[-–|].*$/, '')
                  .replace(/\s+Blood Test$/i, '')
                  .replace(/\s+for Enhanced Health$/i, '')
                  .replace(/\s*\| Book Online today$/i, '');

                return (
                  <UnifiedTestCard
                    key={test.id}
                    category={test.category || "Health"}
                    categoryColor={branding?.primary || "#e70d69"}
                    name={cleanName}
                    description={test.description || `Comprehensive health screening covering essential markers. ${test.sample_type || 'Blood sample'} collection.`}
                    biomarkers={test.biomarker_count || 0}
                    results={test.turnaround_time || "2–5 working days"}
                    collection={test.sample_type || "Blood sample"}
                    rating={providerData.rating}
                    reviews={providerData.reviews}
                    price={test.price}
                    provider={test.provider_name}
                    url={test.url || undefined}
                    ctaLabel={test.url ? "View test" : "Compare"}
                    markers={test.markers}
                  />
                );
              })}
            </div>
          )}

          <div className="text-center mt-6 sm:mt-8 mb-12 sm:mb-16">
            <Button onClick={() => navigate('/compare')} className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-medium rounded-full w-full sm:w-auto">
              View all tests
            </Button>
          </div>

        </div>
      </section>
    </>
  );
};

export default MostPopularTests;
