import React from "react";
import { Star, Clock, Beaker, Syringe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CompareTestData } from "@/services/CompareService";
import { getCategoryTagline } from "@/utils/categoryTaglines";
import { buildProviderBookingUrl, externalLinkProps } from "@/utils/urlTracking";
import { getProviderRating } from "@/constants/providerRatings";

interface PremiumTestCardProps {
  test: CompareTestData;
  tagline?: string;
  onSelect?: (test: CompareTestData) => void;
  isSelected?: boolean;
}

export const PremiumTestCard: React.FC<PremiumTestCardProps> = ({
  test,
  tagline,
  onSelect,
  isSelected = false,
}) => {
  const displayTagline = tagline || getCategoryTagline(test.category || "default");
  
  const providerRatingData = getProviderRating(test.provider || '');
  const rating = providerRatingData.rating;
  const reviewCount = providerRatingData.reviews;

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(test);
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-card rounded-2xl overflow-hidden border border-border",
        "hover:shadow-xl transition-all duration-300 h-full min-w-[280px] max-w-[320px]",
        isSelected && "ring-2 ring-primary border-primary"
      )}
    >
      {/* Navy Banner with Tagline */}
      <div className="bg-[#081129] px-5 py-4">
        <p className="text-white/90 text-sm font-medium leading-snug">
          {displayTagline}
        </p>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Test Name */}
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
          {test.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow-0">
          {test.description || "Comprehensive health screening for better insights into your wellbeing."}
        </p>

        {/* Results Timeline */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Results in {test.features?.turnaround || "2-3 working days"}</span>
        </div>

        {/* Biomarkers */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Beaker className="h-4 w-4 text-primary" />
          <span>{test.biomarkerCount || "10+"} biomarkers</span>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= Math.floor(rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-primary mb-3">
          £{test.price.toFixed(2)}
        </div>

        {/* Collection Method */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <Syringe className="h-4 w-4" />
          <span className="capitalize">{test.features?.collection || "Home kit"}</span>
        </div>

        {/* Select Button */}
        <div className="mt-auto">
          <Button
            onClick={handleSelect}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "w-full h-11 font-semibold rounded-xl transition-all",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "border-2 border-[#22c0d4] text-[#22c0d4] hover:bg-[#22c0d4] hover:text-white"
            )}
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Selected
              </>
            ) : (
              "Select test"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
