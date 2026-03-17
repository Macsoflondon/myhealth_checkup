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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {popularTests?.slice(0, 12).map((test) => {
              const { rating, reviewCount } = getTestRating(test.provider_id);
              const logoPath = providerLogos[test.provider_id];
              
              return (
                <div
                  key={test.id}
                  className="group bg-[#e70d69]/5 rounded-xl border-2 border-[#e70d69]/30 hover:border-[#e70d69] hover:shadow-lg hover:shadow-[#e70d69]/20 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Provider Logo */}
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between mb-3">
                      {logoPath ? (
                        <img
                          src={logoPath}
                          alt={test.provider_name}
                          className="h-7 w-auto object-contain max-w-[120px]"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                          {test.provider_name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 pt-0 flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[48px]">
                      {test.test_name
                        .replace(/\s*[-–|].*$/, '')
                        .replace(/\s+Blood Test$/i, '')
                        .replace(/\s+for Enhanced Health$/i, '')
                        .replace(/\s*\| Book Online today$/i, '')}
                    </h3>

                    {/* Star Rating */}
                    <div className="mb-3">
                      <StarRating rating={rating} reviewCount={reviewCount} />
                    </div>

                    {/* Test Details */}
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      {test.biomarker_count > 0 && (
                        <div className="flex items-center gap-2">
                          <TestTube2 className="w-4 h-4 text-primary" />
                          <span>{test.biomarker_count} biomarkers</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{test.turnaround_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-primary" />
                        <span>{test.sample_type}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-auto pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-foreground">
                          £{test.price.toFixed(2)}
                        </span>
                      </div>
                        {test.url ? (
                          <a
                            href={test.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-[#22c0d4] hover:bg-[#e70d69] text-white transition-colors duration-300"
                            >
                              View test
                            </Button>
                          </a>
                        ) : (
                          <Link to={`/test/${test.id}`} className="block w-full">
                            <Button
                              size="sm"
                              className="w-full bg-[#22c0d4] hover:bg-[#e70d69] text-white transition-colors duration-300"
                            >
                              View test
                            </Button>
                          </Link>
                        )}
                    </div>
                  </div>
                </div>
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
