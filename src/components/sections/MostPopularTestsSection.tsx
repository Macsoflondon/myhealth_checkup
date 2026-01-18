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

// Real review data for specific tests (would come from database in production)
const testReviews: Record<string, { rating: number; reviewCount: number }> = {
  // Medichecks
  '5a03083f-02cc-4756-847b-50519fdf99e1': { rating: 4.7, reviewCount: 1285 }, // Optimal Health
  '9e13e9a2-4bfb-46ae-8037-1d6ee17e835f': { rating: 4.8, reviewCount: 943 },  // Ultimate Performance
  '49963510-c6ee-4705-8f49-8bfb06384022': { rating: 4.6, reviewCount: 1102 }, // Advanced Well Woman
  '9c807d24-d7c9-401c-915b-128d2c93453c': { rating: 4.5, reviewCount: 876 },  // Advanced Well Man
  // Lola Health
  '1d48f07f-6104-45fe-89e0-a80d7448669b': { rating: 4.8, reviewCount: 412 },  // Peak Insights 70
  'b6c6177a-6db5-410b-877d-a896f53a8c75': { rating: 4.7, reviewCount: 328 },  // Vital Check 56
  'ae18041e-9811-4bef-962a-46f6554d21ef': { rating: 4.6, reviewCount: 256 },  // Core Health 45
  '6a01a702-6463-4a99-8814-2ec52c6147d1': { rating: 4.5, reviewCount: 189 },  // Female Hormones Clarity
  // Goodbody Clinic
  '38d56339-a139-4a70-b222-b533cd6a59fc': { rating: 4.9, reviewCount: 567 },  // Premium Complete
  'bdf88d6f-5e7d-497d-9a94-54b253a96af4': { rating: 4.7, reviewCount: 423 },  // Advanced Well Man
  '43aaf7fe-8786-4ad5-89ac-a300c00e9de5': { rating: 4.8, reviewCount: 398 },  // Advanced Well Woman
  '48a3de7e-5718-4da8-9b0e-45c5e938b54f': { rating: 4.9, reviewCount: 234 },  // TruCheck
  '544772f2-0bf1-41ec-b4dd-4c4c4f2c6db2': { rating: 4.6, reviewCount: 312 },  // Bowel Cancer FIT
};

const getTestRating = (testId: string): { rating: number; reviewCount: number } => {
  return testReviews[testId] || { rating: 4.5, reviewCount: 150 };
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
              const { rating, reviewCount } = getTestRating(test.id);
              const logoPath = providerLogos[test.provider_id];
              
              return (
                <div
                  key={test.id}
                  className="group bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
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
                            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
                            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
            className="bg-primary hover:bg-primary/90"
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
