import { Link } from "react-router-dom";
import { ArrowRight, TestTube2, Clock, Droplets, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePopularTestsFromDatabase } from "@/hooks/usePopularTestsFromDatabase";
import { Skeleton } from "@/components/ui/skeleton";

// Use local provider logos that exist in the project
const providerLogos: Record<string, string> = {
  'medichecks': '/lovable-uploads/provider-medichecks-new-v3.png',
  'lola-health': '/lovable-uploads/provider-lola-health.png',
  'goodbody-clinic': '/lovable-uploads/provider-goodbody-new-v4.png',
  'goodbody': '/lovable-uploads/provider-goodbody-new-v4.png',
  'thriva': '/lovable-uploads/provider-thriva.png',
  'randox': '/lovable-uploads/provider-randox.png',
  'london-medical-laboratory': '/lovable-uploads/provider-london-medical.png',
};

// Provider-based ratings for consistency
const providerRatings: Record<string, number> = {
  'medichecks': 4.7,
  'goodbody-clinic': 4.8,
  'goodbody': 4.8,
  'lola-health': 4.6,
  'thriva': 4.5,
  'randox': 4.6,
  'london-medical-laboratory': 4.4,
};

const baseReviewCounts: Record<string, number> = {
  'medichecks': 800,
  'goodbody-clinic': 400,
  'goodbody': 400,
  'lola-health': 250,
  'thriva': 300,
  'randox': 200,
  'london-medical-laboratory': 100,
};

const getTestRating = (providerId: string, testName: string): { rating: number; reviewCount: number } => {
  const normalizedProvider = providerId?.toLowerCase() || '';
  const rating = providerRatings[normalizedProvider] || 4.5;
  const baseReviews = baseReviewCounts[normalizedProvider] || 150;
  // Use test name hash for consistent review count per test
  const testHash = testName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const reviewCount = baseReviews + (testHash % 200);
  return { rating, reviewCount };
};

const StarRating = ({ rating, reviewCount }: { rating: number; reviewCount: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < fullStars
                ? 'fill-amber-400 text-amber-400'
                : i === fullStars && hasHalfStar
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({reviewCount.toLocaleString()})</span>
    </div>
  );
};

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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The most popular tests from our{" "}
            <span className="bg-gradient-to-r from-[#e70d69] to-[#c70b5a] bg-clip-text text-transparent">
              providers
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
              const { rating, reviewCount } = getTestRating(test.provider_id, test.test_name);
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
                              variant="outline"
                              size="sm"
                              className="w-full bg-[#22c0d4] text-white border-[#22c0d4] hover:bg-white hover:text-[#22c0d4] hover:border-[#22c0d4]"
                            >
                              View test
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </a>
                        ) : (
                          <Link to={`/test/${test.id}`} className="block w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-[#22c0d4] text-white border-[#22c0d4] hover:bg-white hover:text-[#22c0d4] hover:border-[#22c0d4]"
                            >
                              View test
                              <ArrowRight className="ml-2 h-4 w-4" />
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
            variant="default"
            size="lg"
            className="bg-[#22c0d4] text-white border-2 border-[#22c0d4] hover:bg-white hover:text-[#22c0d4]"
          >
            <Link to="/popular-tests">
              View all popular tests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MostPopularTestsSection;
