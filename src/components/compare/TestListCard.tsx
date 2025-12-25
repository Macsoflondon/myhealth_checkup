import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Shield, Star, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { CompareTestData } from "@/services/CompareService";
import { buildProviderBookingUrl, externalLinkProps } from "@/utils/urlTracking";

interface TestListCardProps {
  test: CompareTestData;
  isSelected?: boolean;
  onToggleSelect?: (test: CompareTestData) => void;
  showCompareCheckbox?: boolean;
}

// Helper to generate test detail URL
const getTestDetailUrl = (provider: string, testId: string): string => {
  const providerSlug = provider.toLowerCase().replace(/\s+/g, '-');
  return `/${providerSlug}/${testId}`;
};

export const TestListCard: React.FC<TestListCardProps> = ({ 
  test, 
  isSelected = false,
  onToggleSelect,
  showCompareCheckbox = true,
}) => {
  const isOutOfStock = test.available === false;
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSelect?.(test);
  };
  
  return (
    <Link
      to={getTestDetailUrl(test.provider, test.id)}
      className={cn(
        "block bg-card rounded-2xl p-6 border border-border relative",
        "hover:border-primary hover:shadow-lg transition-all duration-200",
        isOutOfStock && "opacity-60",
        isSelected && "ring-2 ring-primary border-primary"
      )}
    >
      {/* Compare Checkbox */}
      {showCompareCheckbox && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={handleCompareClick}
            className={cn(
              "h-8 gap-1.5 text-xs font-medium transition-all",
              isSelected 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "hover:border-primary hover:text-primary"
            )}
          >
            {isSelected ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Compare
              </>
            )}
          </Button>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pr-24 md:pr-28">
        {/* Test Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-10 w-10 rounded-lg bg-background p-1">
              <AvatarImage
                src={test.providerLogo}
                alt={test.provider}
                className="object-contain"
              />
              <AvatarFallback className="rounded-lg text-xs">
                {test.provider.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {test.name}
              </h3>
              <p className="text-sm text-muted-foreground">{test.provider}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {test.description || "Comprehensive health screening test"}
          </p>

          {/* Test Details */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {test.biomarkerCount && (
              <span className="flex items-center">
                <CheckCircle size={16} className="mr-1 text-primary" />
                {test.biomarkerCount} biomarkers
              </span>
            )}
            <span className="flex items-center">
              <Clock size={16} className="mr-1 text-primary" />
              {test.features?.turnaround || "2-3 days"}
            </span>
            <span className="flex items-center capitalize">
              {test.features?.collection || "Home kit"}
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {test.accreditations?.includes("UKAS") && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                <Shield size={12} className="mr-1" />
                UKAS
              </Badge>
            )}
            {test.accreditations?.includes("CQC") && (
              <Badge
                variant="outline"
                className="bg-secondary/10 text-secondary border-secondary/20"
              >
                <Shield size={12} className="mr-1" />
                CQC
              </Badge>
            )}
            {test.popularityScore && test.popularityScore >= 70 && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                <Star size={12} className="mr-1 fill-current" />
                Popular
              </Badge>
            )}
            {test.turnaroundDays && test.turnaroundDays <= 2 && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Fast Results
              </Badge>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="md:text-right flex-shrink-0">
          <div className="text-3xl font-bold text-primary mb-1">
            £{test.price.toFixed(2)}
          </div>
          {test.url ? (
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={buildProviderBookingUrl(
                  test.url,
                  test.provider.toLowerCase().replace(/\s+/g, "-"),
                  test.name
                )}
                {...externalLinkProps}
              >
                View details
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              View details
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};
