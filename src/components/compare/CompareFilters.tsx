import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { providers } from "@/data/compare/providers";

interface CompareFiltersProps {
  categories: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  selectedCategory: string;
  selectedProviders: string[];
  searchTerm: string;
  sortOrder: 'asc' | 'desc';
  onCategoryChange: (category: string) => void;
  onProviderChange: (providerId: string) => void;
  onSearchChange: (term: string) => void;
  onSortChange: (order: 'asc' | 'desc') => void;
  testCount: number;
  isLoading: boolean;
}

export const CompareFilters = ({
  categories,
  selectedCategory,
  selectedProviders,
  searchTerm,
  sortOrder,
  onCategoryChange,
  onProviderChange,
  onSearchChange,
  onSortChange,
  testCount,
  isLoading
}: CompareFiltersProps) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Category Selection */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-health-primary" />
            <h3 className="font-semibold text-foreground">Test Categories</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange("all")}
              className={cn(
                "rounded-full transition-all",
                selectedCategory === "all" && "bg-health-primary hover:bg-health-primary/90 text-white"
              )}
            >
              All Tests
              <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                {testCount}
              </Badge>
            </Button>
            
            {categories.slice(0, 8).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "rounded-full transition-all",
                  selectedCategory === category.id && "bg-health-primary hover:bg-health-primary/90 text-white"
                )}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for tests, conditions, or biomarkers..."
                className="pl-10 bg-background/50 border-border/50 focus:border-health-primary"
              />
            </div>
            
            {/* Provider Filter */}
            <div>
              <Select value={selectedProviders[0]} onValueChange={onProviderChange}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Providers" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort Order */}
            <div>
              <Select value={sortOrder} onValueChange={(value) => onSortChange(value as 'asc' | 'desc')}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="asc">Price: Low to High</SelectItem>
                  <SelectItem value="desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{isLoading ? "Loading..." : `${testCount} results found`}</span>
              {selectedProviders[0] !== "all" && (
                <>
                  <span>•</span>
                  <span>Filtered by {providers.find(p => p.id === selectedProviders[0])?.name}</span>
                </>
              )}
              {selectedCategory !== "all" && (
                <>
                  <span>•</span>
                  <span>Category: {categories.find(c => c.id === selectedCategory)?.name}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};