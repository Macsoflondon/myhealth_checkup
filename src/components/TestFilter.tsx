
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { compareCategories, providers } from "@/data/compareData";

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
        <h2 className="font-semibold mb-3 text-lg">Select Category</h2>
        <div className="flex flex-wrap gap-2">
          {compareCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors",
                selectedCategory === category.id
                  ? "bg-health-600 text-white border-health-600"
                  : "bg-white border-gray-200 hover:border-health-600"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Filter */}
      <div>
        <h2 className="font-semibold mb-3 text-lg">Filter by Provider</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onProviderChange(["all"])}
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors flex items-center gap-2",
              isAllProvidersSelected
                ? "bg-health-600 text-white border-health-600"
                : "bg-white border-gray-200 hover:border-health-600"
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
                "px-4 py-2 rounded-lg border transition-colors flex items-center gap-2",
                selectedProviders.includes(provider.id.toLowerCase()) && !isAllProvidersSelected
                  ? "bg-health-600 text-white border-health-600"
                  : "bg-white border-gray-200 hover:border-health-600"
              )}
              disabled={isAllProvidersSelected}
            >
              {selectedProviders.includes(provider.id.toLowerCase()) && !isAllProvidersSelected && (
                <Check className="h-4 w-4" />
              )}
              {provider.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestFilter;
