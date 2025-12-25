import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FiltersSidebar } from "@/components/compare/FiltersSidebar";
import { TestListCard } from "@/components/compare/TestListCard";
import { CompareService } from "@/services/CompareService";
import type { CompareTestData } from "@/services/CompareService";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Filter, TrendingUp, Clock, Sparkles } from "lucide-react";
import { providers } from "@/constants/providers";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { logger } from "@/lib/logger";

const CATEGORY_LIST = [
  "general health",
  "thyroid",
  "hormones",
  "women's health",
  "men's health",
  "nutrition",
  "fertility",
  "heart health",
  "diabetes",
  "cancer screening",
];

const CompareTests = () => {
  const location = useLocation();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sampleMethod, setSampleMethod] = useState("all");
  const [fastingRequired, setFastingRequired] = useState("any");
  const [gpReview, setGpReview] = useState(false);
  const [sortBy, setSortBy] = useState("price-asc");
  
  // Mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // Data states
  const [tests, setTests] = useState<CompareTestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await CompareService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        logger.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Parse query parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Fetch and filter tests
  const fetchTests = useCallback(async () => {
    setIsLoading(true);
    try {
      let results: CompareTestData[] = [];
      
      const providerFilter = selectedProvider === "all" ? ["all"] : [selectedProvider];
      
      if (searchQuery.trim()) {
        results = await CompareService.searchTests(searchQuery, providerFilter);
      } else {
        const categoryName = selectedCategory || "all";
        results = await CompareService.getTestsByCategory(categoryName, providerFilter);
      }

      // Apply local filters
      results = applyFilters(results);
      
      // Sort results
      results = sortTests(results, sortBy);
      
      setTests(results);
    } catch (error) {
      logger.error("Error fetching tests:", error);
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedProvider, selectedCategory, sortBy, priceRange, sampleMethod, fastingRequired, gpReview]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTests();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchTests]);

  // Apply local filters
  const applyFilters = useCallback((testList: CompareTestData[]): CompareTestData[] => {
    let filtered = [...testList];
    
    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(test => test.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(test => test.price <= parseFloat(priceRange.max));
    }
    
    // Sample method filter
    if (sampleMethod && sampleMethod !== "all") {
      filtered = filtered.filter(test => {
        const collection = (test.features?.collection || "").toLowerCase();
        switch (sampleMethod) {
          case "finger-prick":
            return collection.includes("finger") || collection.includes("prick");
          case "venous":
            return collection.includes("clinic") || collection.includes("venous");
          case "home-phlebotomy":
            return collection.includes("home") && collection.includes("nurse");
          default:
            return true;
        }
      });
    }
    
    // Fasting filter
    if (fastingRequired && fastingRequired !== "any") {
      // This would need fasting data in the test object
      // For now, we'll skip this filter as the data structure may not have it
    }
    
    // GP Review filter
    if (gpReview) {
      filtered = filtered.filter(test => {
        // Providers that typically include GP review
        return ["Medichecks", "Thriva", "Randox"].includes(test.provider);
      });
    }
    
    return filtered;
  }, [priceRange, sampleMethod, fastingRequired, gpReview]);

  // Sort tests
  const sortTests = useCallback((testList: CompareTestData[], sortOption: string): CompareTestData[] => {
    const sorted = [...testList];
    
    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "turnaround":
        return sorted.sort((a, b) => (a.turnaroundDays || 999) - (b.turnaroundDays || 999));
      case "popular":
        return sorted.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
      default:
        return sorted.sort((a, b) => a.price - b.price);
    }
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedProvider("all");
    setPriceRange({ min: "", max: "" });
    setSelectedCategory("");
    setSampleMethod("all");
    setFastingRequired("any");
    setGpReview(false);
    setSortBy("price-asc");
  }, []);

  // Format providers for the sidebar
  const formattedProviders = useMemo(() => 
    providers.map(p => ({ id: p.id, name: p.name })),
  []);

  const memoizedStats = useMemo(() => ({
    testCount: tests.length,
    providerCount: providers.length,
  }), [tests.length]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet>
          <title>Compare Private Blood Tests - myhealth checkup | Live Prices from UK Providers</title>
          <meta
            name="description"
            content="Compare private blood tests from Medichecks, Thriva, Randox, and more UK providers. Transparent pricing and inclusions from trusted UK providers."
          />
          <link rel="canonical" href="https://myhealthcheckup.co.uk/compare" />
        </Helmet>

        <Header />

        <main className="flex-grow">
          {/* Page Header */}
          <section className="py-12 px-6 bg-gradient-to-b from-primary/5 to-background dark:from-[hsl(var(--section-dark))] dark:to-background">
            <div className="max-w-7xl mx-auto">
              <p className="text-primary font-medium text-sm mb-2 tracking-wide">
                Your Health. Your Choice. One Trusted Platform.
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Compare private blood tests
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Transparent pricing and inclusions from trusted UK providers
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-4 py-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{memoizedStats.testCount}+ Tests</span>
                </div>
                <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-4 py-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Live Prices</span>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/10 rounded-full px-4 py-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-foreground">UKAS Accredited</span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <FiltersSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                providers={formattedProviders}
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                categories={CATEGORY_LIST}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sampleMethod={sampleMethod}
                onSampleMethodChange={setSampleMethod}
                fastingRequired={fastingRequired}
                onFastingChange={setFastingRequired}
                gpReview={gpReview}
                onGpReviewChange={setGpReview}
                onClearFilters={clearFilters}
                isVisible={showFilters}
                onClose={() => setShowFilters(false)}
              />

              {/* Results */}
              <main className="flex-1 min-w-0">
                {/* Sort and Filter Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      <Filter size={18} className="mr-2" />
                      Filters
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      {tests.length} {tests.length === 1 ? "test" : "tests"} found
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      Sort by:
                    </span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price-asc">Price (low to high)</SelectItem>
                        <SelectItem value="price-desc">Price (high to low)</SelectItem>
                        <SelectItem value="turnaround">Fastest results</SelectItem>
                        <SelectItem value="popular">Most popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Test Cards */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Finding the best tests for you...</p>
                    </div>
                  </div>
                ) : tests.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No tests found</h3>
                      <p className="text-muted-foreground mb-6">
                        No tests found matching your filters. Try adjusting your search.
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tests.map((test) => (
                      <TestListCard key={test.id} test={test} />
                    ))}
                  </div>
                )}
              </main>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default CompareTests;
