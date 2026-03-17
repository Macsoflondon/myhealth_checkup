import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePopularTestsFromDatabase } from "@/hooks/usePopularTestsFromDatabase";
import { Skeleton } from "@/components/ui/skeleton";
import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import { getProviderRating } from "@/constants/providerRatings";
import { getBranding } from "@/data/providerBranding";

const MostPopularTestsSection = () => {
  const { data: popularTests, isLoading, error } = usePopularTestsFromDatabase(12);

  if (error) {
    console.error('Error loading popular tests:', error);
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            MOST POPULAR
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4 leading-tight">
            <span className="text-[#081129]">Most Popular Tests from Our </span>
            <span className="text-[#081129]">
              Providers
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compare the best-selling health tests from trusted UK providers
          </p>
        </div>

        {/* Test Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-5">
                <Skeleton className="h-8 w-24 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 justify-items-center">
            {popularTests?.slice(0, 12).map((test) => {
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
                />
              );
            })}
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-[#22c0d4] hover:bg-[#e70d69] text-white transition-colors duration-300"
          >
            <Link to="/popular-tests">
              View all popular tests
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MostPopularTestsSection;
