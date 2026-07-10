import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Provider {
  id: string;
  name: string;
}

interface FiltersSidebarProps {
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;
  
  // Providers
  providers: Provider[];
  selectedProvider: string;
  onProviderChange: (value: string) => void;
  
  // Price range
  priceRange: { min: string; max: string };
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  
  // Categories
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  
  // Sample method (legacy single-select, kept)
  sampleMethod: string;
  onSampleMethodChange: (value: string) => void;
  
  // Fasting
  fastingRequired: string;
  onFastingChange: (value: string) => void;
  
  // GP Review
  gpReview: boolean;
  onGpReviewChange: (value: boolean) => void;

  // Standardised filter groups (optional — wire up incrementally per page)
  sampleTypes?: string[];
  onSampleTypesChange?: (next: string[]) => void;
  collectionMethods?: string[];
  onCollectionMethodsChange?: (next: string[]) => void;
  feeFilter?: 'all' | 'none' | 'additional';
  onFeeFilterChange?: (next: 'all' | 'none' | 'additional') => void;
  clinicalReview?: Array<'included' | 'optional' | 'not_included'>;
  onClinicalReviewChange?: (next: Array<'included' | 'optional' | 'not_included'>) => void;
  
  // Clear all
  onClearFilters: () => void;
  
  // Mobile visibility
  isVisible?: boolean;
  onClose?: () => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  searchQuery,
  onSearchChange,
  providers,
  selectedProvider,
  onProviderChange,
  priceRange,
  onPriceRangeChange,
  categories,
  selectedCategory,
  onCategoryChange,
  sampleMethod,
  onSampleMethodChange,
  fastingRequired,
  onFastingChange,
  gpReview,
  onGpReviewChange,
  sampleTypes,
  onSampleTypesChange,
  collectionMethods,
  onCollectionMethodsChange,
  feeFilter,
  onFeeFilterChange,
  clinicalReview,
  onClinicalReviewChange,
  onClearFilters,
  isVisible = true,
  onClose,
}) => {
  const toggle = <T extends string>(list: T[] | undefined, value: T): T[] =>
    list?.includes(value) ? list.filter(v => v !== value) : [...(list ?? []), value];

  return (
    <aside
      className={cn(
        "lg:w-80 flex-shrink-0",
        isVisible ? "block" : "hidden lg:block"
      )}
    >
      <div className="bg-card rounded-2xl p-6 border border-border sticky top-24 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearFilters}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Clear all
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-muted rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Search tests
            </Label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="e.g., Vitamin D, Thyroid"
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {/* Provider */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Provider
            </Label>
            <Select value={selectedProvider} onValueChange={onProviderChange}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All providers</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Price range (£)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceRange.min}
                onChange={(e) =>
                  onPriceRangeChange({ ...priceRange, min: e.target.value })
                }
                placeholder="Min"
                className="bg-background"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                value={priceRange.max}
                onChange={(e) =>
                  onPriceRangeChange({ ...priceRange, max: e.target.value })
                }
                placeholder="Max"
                className="bg-background"
              />
            </div>
          </div>

          {/* Category Tags */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Category
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    onCategoryChange(selectedCategory === category ? "" : category)
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Method */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Sample method
            </Label>
            <Select value={sampleMethod} onValueChange={onSampleMethodChange}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="finger-prick">Finger-prick</SelectItem>
                <SelectItem value="venous">In-clinic venous</SelectItem>
                <SelectItem value="home-phlebotomy">Home phlebotomy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fasting Required */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Fasting required
            </Label>
            <Select value={fastingRequired} onValueChange={onFastingChange}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="false">No fasting</SelectItem>
                <SelectItem value="true">Fasting required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GP Review */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={gpReview}
                onCheckedChange={(checked) => onGpReviewChange(!!checked)}
              />
              <span className="text-sm text-foreground">
                Clinical review included
              </span>
            </label>
          </div>

          {/* Standardised: Sample type */}
          {onSampleTypesChange && (
            <div>
              <Label className="block text-sm font-medium text-foreground mb-2">
                Sample type
              </Label>
              <div className="space-y-2">
                {([
                  ['finger_prick', 'Finger-prick'],
                  ['venous', 'Venous blood draw'],
                  ['saliva', 'Saliva'],
                  ['urine', 'Urine'],
                  ['stool', 'Stool'],
                  ['buccal_swab', 'Buccal swab'],
                ] as const).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={sampleTypes?.includes(value) ?? false}
                      onCheckedChange={() =>
                        onSampleTypesChange(toggle(sampleTypes, value))
                      }
                    />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Standardised: Collection method */}
          {onCollectionMethodsChange && (
            <div>
              <Label className="block text-sm font-medium text-foreground mb-2">
                Collection method
              </Label>
              <div className="space-y-2">
                {([
                  ['home_kit', 'Home kit included'],
                  ['clinic', 'Clinic appointment'],
                  ['home_visit', 'Home visit'],
                  ['mobile_phleb', 'Mobile phlebotomy'],
                  ['third_party_phleb', 'Third-party phlebotomy'],
                  ['self_arranged', 'Self-arranged'],
                ] as const).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={collectionMethods?.includes(value) ?? false}
                      onCheckedChange={() =>
                        onCollectionMethodsChange(toggle(collectionMethods, value))
                      }
                    />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Standardised: Additional collection fees */}
          {onFeeFilterChange && (
            <div>
              <Label className="block text-sm font-medium text-foreground mb-2">
                Additional collection fees
              </Label>
              <Select
                value={feeFilter ?? 'all'}
                onValueChange={(v) => onFeeFilterChange(v as 'all' | 'none' | 'additional')}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="none">No additional fees</SelectItem>
                  <SelectItem value="additional">Has additional fees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Standardised: Clinical review */}
          {onClinicalReviewChange && (
            <div>
              <Label className="block text-sm font-medium text-foreground mb-2">
                Clinical review
              </Label>
              <div className="space-y-2">
                {([
                  ['included', 'Included in price'],
                  ['optional', 'Optional add-on'],
                  ['not_included', 'Not included'],
                ] as const).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={clinicalReview?.includes(value) ?? false}
                      onCheckedChange={() =>
                        onClinicalReviewChange(toggle(clinicalReview, value))
                      }
                    />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
