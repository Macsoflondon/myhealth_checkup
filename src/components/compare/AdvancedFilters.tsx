import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Filter, 
  X, 
  Clock, 
  PoundSterling, 
  Stethoscope,
  Syringe,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdvancedFilterOptions {
  biomarkers: string[];
  priceRange: [number, number];
  processingTime: string[];
  gpReview: boolean | null;
  bloodDraw: boolean | null;
}

interface AdvancedFiltersProps {
  filters: AdvancedFilterOptions;
  onFiltersChange: (filters: AdvancedFilterOptions) => void;
  onClearFilters: () => void;
}

const BIOMARKERS = [
  "Cholesterol (Total)",
  "HDL Cholesterol",
  "LDL Cholesterol",
  "Triglycerides",
  "HbA1c",
  "Glucose",
  "TSH",
  "Free T3",
  "Free T4",
  "Vitamin D",
  "Vitamin B12",
  "Folate",
  "Iron",
  "Ferritin",
  "Testosterone",
  "Oestradiol",
  "Cortisol",
  "PSA",
  "Full Blood Count",
  "Liver Function",
  "Kidney Function"
];

const PROCESSING_TIMES = [
  { value: "same-day", label: "Same Day" },
  { value: "24-48h", label: "24-48 hours" },
  { value: "3-5days", label: "3-5 days" },
  { value: "1week", label: "1 week" },
  { value: "2weeks", label: "2+ weeks" }
];

export const AdvancedFilters = ({
  filters,
  onFiltersChange,
  onClearFilters
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const activeFilterCount = 
    filters.biomarkers.length + 
    filters.processingTime.length + 
    (filters.gpReview !== null ? 1 : 0) + 
    (filters.bloodDraw !== null ? 1 : 0) +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500 ? 1 : 0);

  const handleBiomarkerToggle = (biomarker: string) => {
    const newBiomarkers = filters.biomarkers.includes(biomarker)
      ? filters.biomarkers.filter(b => b !== biomarker)
      : [...filters.biomarkers, biomarker];
    
    onFiltersChange({ ...filters, biomarkers: newBiomarkers });
  };

  const handleProcessingTimeToggle = (time: string) => {
    const newTimes = filters.processingTime.includes(time)
      ? filters.processingTime.filter(t => t !== time)
      : [...filters.processingTime, time];
    
    onFiltersChange({ ...filters, processingTime: newTimes });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleGPReviewToggle = () => {
    const newValue = filters.gpReview === null ? true : filters.gpReview ? false : null;
    onFiltersChange({ ...filters, gpReview: newValue });
  };

  const handleBloodDrawToggle = () => {
    const newValue = filters.bloodDraw === null ? true : filters.bloodDraw ? false : null;
    onFiltersChange({ ...filters, bloodDraw: newValue });
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 bg-background hover:bg-accent"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
            {activeFilterCount > 0 && (
              <Badge 
                variant="default" 
                className="ml-1 h-5 px-1.5 text-xs bg-health-primary"
              >
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[600px] p-0 bg-card border-border z-50" 
          align="start"
          sideOffset={8}
        >
          <div className="max-h-[600px] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-health-primary" />
                <h3 className="font-semibold text-foreground">Advanced Filters</h3>
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="h-8 text-xs gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="p-4 space-y-6">
              {/* Price Range Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <PoundSterling className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Price Range</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>£{filters.priceRange[0]}</span>
                    <span>£{filters.priceRange[1]}{filters.priceRange[1] >= 500 ? '+' : ''}</span>
                  </div>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={handlePriceRangeChange}
                    min={0}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Processing Time Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Processing Time</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PROCESSING_TIMES.map(time => (
                    <Button
                      key={time.value}
                      variant={filters.processingTime.includes(time.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleProcessingTimeToggle(time.value)}
                      className={cn(
                        "rounded-full text-xs h-8",
                        filters.processingTime.includes(time.value) && 
                        "bg-health-primary hover:bg-health-primary/90"
                      )}
                    >
                      {time.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Service Inclusions */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Service Inclusions</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="gp-review" className="cursor-pointer text-sm">
                        GP Review Included
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      {filters.gpReview !== null && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs h-5"
                        >
                          {filters.gpReview ? "Yes" : "No"}
                        </Badge>
                      )}
                      <Checkbox
                        id="gp-review"
                        checked={filters.gpReview === true}
                        onCheckedChange={handleGPReviewToggle}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Syringe className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="blood-draw" className="cursor-pointer text-sm">
                        Blood Draw Service Included
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      {filters.bloodDraw !== null && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs h-5"
                        >
                          {filters.bloodDraw ? "Yes" : "No"}
                        </Badge>
                      )}
                      <Checkbox
                        id="blood-draw"
                        checked={filters.bloodDraw === true}
                        onCheckedChange={handleBloodDrawToggle}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Biomarkers Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Biomarkers Tested
                  {filters.biomarkers.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.biomarkers.length} selected
                    </Badge>
                  )}
                </Label>
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-1 border border-border/50 rounded-md bg-background/50">
                  {BIOMARKERS.map(biomarker => (
                    <div
                      key={biomarker}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={`biomarker-${biomarker}`}
                        checked={filters.biomarkers.includes(biomarker)}
                        onCheckedChange={() => handleBiomarkerToggle(biomarker)}
                      />
                      <Label
                        htmlFor={`biomarker-${biomarker}`}
                        className="text-xs cursor-pointer flex-1"
                      >
                        {biomarker}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
              </span>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-health-primary hover:bg-health-primary/90"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
