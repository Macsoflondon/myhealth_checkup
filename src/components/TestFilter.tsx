import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { compareCategories, providers } from "@/data/compare";

interface TestFilterProps {
  selectedCategory: string;
  selectedProviders: string[];
  onCategoryChange: (category: string) => void;
  onProviderChange: (providers: string[]) => void;
}

const TestFilter = ({
  selectedCategory,
  selectedProviders,
  onCategoryChange,
  onProviderChange,
}: TestFilterProps) => {
  const handleProviderToggle = (provider: string) => {
    if (provider === "all") {
      // If "all" is selected, only select "all"
      onProviderChange(["all"]);
    } else {
      // If specific provider is selected, remove "all" from the selection
      let newProviders = selectedProviders.includes(provider)
        ? selectedProviders.filter(p => p !== provider)
        : [...selectedProviders.filter(p => p !== "all"), provider];
      
      // If no providers are selected, select "all"
      if (newProviders.length === 0) {
        newProviders = ["all"];
      }
      
      onProviderChange(newProviders);
    }
  };

  const isAllProvidersSelected = selectedProviders.includes("all");

  return (
    <div className="flex flex-col space-y-6">
      {/* Category Filter */}
      <div>
        <h2 className="font-semibold mb-4 text-lg">Select Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {compareCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-4 py-3 rounded-lg border transition-colors text-sm font-medium min-h-[48px] touch-manipulation",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary hover:bg-accent"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Filter */}
      <div>
        <h2 className="font-semibold mb-4 text-lg">Filter by Provider</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <button
            onClick={() => onProviderChange(["all"])}
            className={cn(
              "px-4 py-3 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm font-medium min-h-[48px] touch-manipulation",
              isAllProvidersSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:border-primary hover:bg-accent"
            )}
          >
            {isAllProvidersSelected && <Check className="h-4 w-4" />}
            All Providers
          </button>
          
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderToggle(provider.id.toLowerCase())}
              className={cn(
                "px-4 py-3 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm font-medium min-h-[48px] touch-manipulation",
                selectedProviders.includes(provider.id.toLowerCase()) && !isAllProvidersSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary hover:bg-accent"
              )}
              disabled={isAllProvidersSelected}
            >
              {selectedProviders.includes(provider.id.toLowerCase()) && !isAllProvidersSelected && (
                <Check className="h-4 w-4" />
              )}
              <span className="truncate">{provider.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestFilter;
