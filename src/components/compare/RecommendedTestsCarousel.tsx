import React from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { PremiumTestCard } from "./PremiumTestCard";
import type { CompareTestData } from "@/services/CompareService";
import { getCategoryDisplayName } from "@/utils/categoryTaglines";

interface RecommendedTestsCarouselProps {
  tests: CompareTestData[];
  category?: string;
  onSelectTest?: (test: CompareTestData) => void;
  selectedTestIds?: string[];
  isLoading?: boolean;
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
            Recommended {displayName} Tests
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
          {tests.map((test) => (
            <CarouselItem
              key={test.id}
              className="pl-4 basis-auto"
            >
              <PremiumTestCard
                test={test}
                onSelect={onSelectTest}
                isSelected={selectedTestIds.includes(test.id)}
              />
            </CarouselItem>
          ))}
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
