import React from "react";
import { Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import type { CompareTestData } from "@/services/CompareService";
import { getCategoryDisplayName } from "@/utils/categoryTaglines";
import { getProviderRating } from "@/constants/providerRatings";
import { getCategoryPinColor } from "@/data/categoryColors";
import { getBranding } from "@/data/providerBranding";

interface RecommendedTestsCarouselProps {
  tests: CompareTestData[];
  category?: string;
  onSelectTest?: (test: CompareTestData) => void;
  selectedTestIds?: string[];
  isLoading?: boolean;
}

/** Map a DB category string to the categoryColors ID format */
function resolveCategoryColor(category: string): string {
  const pinColor = getCategoryPinColor(
    category.toLowerCase().replace(/['\s]+/g, "-").replace(/&/g, "")
  );
  if (pinColor !== "#6b7280") return pinColor;

  // Fallback: use provider branding primary colour
  const brand = getBranding(category);
  return brand?.primary || "#e70d69";
}

export const RecommendedTestsCarousel: React.FC<RecommendedTestsCarouselProps> = ({
  tests,
  category,
  onSelectTest,
  selectedTestIds = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-xl font-bold text-foreground">
            Loading recommended tests...
          </h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[280px] h-[420px] bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!tests.length) {
    return null;
  }

  const displayName = category
    ? getCategoryDisplayName(category)
    : "Recommended";

  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Recommended {displayName}{displayName.toLowerCase().endsWith('tests') ? '' : ' Tests'}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground hidden sm:block">
          Top-rated tests in this category
        </p>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {tests.map((test) => {
            const providerRating = getProviderRating(test.provider);
            const catColor = resolveCategoryColor(test.category || category || "general-health");
            const brandColor = getBranding(test.provider)?.primary;
            const accentColor = brandColor || catColor;

            return (
              <CarouselItem key={test.id} className="pl-4 basis-auto">
                <UnifiedTestCard
                  category={test.category || category || "Health"}
                  categoryColor={accentColor}
                  name={test.name}
                  description={
                    test.description ||
                    "Comprehensive health screening for better insights into your wellbeing."
                  }
                  biomarkers={test.biomarkerCount || 0}
                  results={test.features?.turnaround || "2-5 working days"}
                  collection={test.features?.collection || "Home kit"}
                  rating={providerRating.rating}
                  reviews={providerRating.reviews}
                  price={test.price}
                  provider={test.provider}
                  url={test.url}
                  ctaLabel={
                    selectedTestIds.includes(test.id) ? "Selected" : "Compare"
                  }
                  onCtaClick={
                    onSelectTest ? () => onSelectTest(test) : undefined
                  }
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation buttons - visible on larger screens */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-0 -translate-x-1/2 bg-background border-border shadow-lg" />
          <CarouselNext className="right-0 translate-x-1/2 bg-background border-border shadow-lg" />
        </div>
      </Carousel>

      {/* Mobile scroll hint */}
      <p className="text-xs text-muted-foreground text-center mt-4 md:hidden">
        Swipe to see more →
      </p>
    </div>
  );
};
