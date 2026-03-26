import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePopularTestsFromDatabase, PopularTest } from '@/hooks/usePopularTestsFromDatabase';
import { UnifiedTestCard } from '@/components/cards/UnifiedTestCard';
import { getProviderRating } from '@/constants/providerRatings';
import { getBranding } from '@/data/providerBranding';

const MostPopularTests = () => {
  const navigate = useNavigate();
  const { data: popularTests, isLoading, error } = usePopularTestsFromDatabase(12);

  return (
    <>
      {/* Header Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 uppercase tracking-wide">
              Most Popular
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[hsl(var(--navy))] mb-4">
              Most Popular Tests from Our Providers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Compare the best-selling health tests from trusted UK providers
            </p>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section className="bg-background py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">

          <div className="flex justify-end mb-4 sm:mb-6">
            <select className="px-3 sm:px-4 md:px-14 py-2 border border-border rounded-md text-xs sm:text-sm bg-background text-foreground hover:border-muted-foreground">
              <option>Biomarkers, high to low</option>
              <option>Price, high to low</option>
              <option>Price, low to high</option>
              <option>Most popular</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-foreground">Loading popular tests...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-foreground mb-4">Unable to load tests. Please try again.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
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
            <Button onClick={() => navigate('/compare')} className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-turquoise))] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-medium rounded-full w-full sm:w-auto">
              View all tests
            </Button>
          </div>

        </div>
      </section>
    </>
  );
};

export default MostPopularTests;
