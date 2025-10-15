import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ModernCompareTable } from "@/components/compare/ModernCompareTable";
import { CompareFilters } from "@/components/compare/CompareFilters";
import { OptimizedLiveCompareService } from "@/services/OptimizedLiveCompareService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { providers } from "@/data/compare/providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { CompareTestData } from "@/services/OptimizedLiveCompareService";
import { logger } from "@/lib/logger";
const CompareTests = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["all"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [tests, setTests] = useState<CompareTestData[]>([]);
  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    count: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on mount with error handling
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await OptimizedLiveCompareService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        logger.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Parse query parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    if (categoryParam && categories.some(cat => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search, categories]);

  // Fetch tests when filters change with debouncing
  const fetchTests = useCallback(async () => {
    setIsLoading(true);
    try {
      let results: CompareTestData[] = [];
      if (searchTerm.trim()) {
        results = await OptimizedLiveCompareService.searchTests(searchTerm, selectedProviders);
      } else {
        // Use category name for better matching
        const categoryName = selectedCategory === "all" ? "all" : categories.find(cat => cat.id === selectedCategory)?.name || selectedCategory;
        results = await OptimizedLiveCompareService.getTestsByCategory(categoryName, selectedProviders);
      }

      // Sort results
      if (sortOrder === 'desc') {
        results.sort((a, b) => b.price - a.price);
      } else {
        results.sort((a, b) => a.price - b.price);
      }
      setTests(results);
    } catch (error) {
      logger.error('Error fetching tests:', error);
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedProviders, selectedCategory, categories, sortOrder]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTests();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [fetchTests]);
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);
  const handleProviderChange = useCallback((providerId: string) => {
    if (providerId === "all") {
      setSelectedProviders(["all"]);
    } else {
      setSelectedProviders([providerId]);
    }
  }, []);
  const memoizedStats = useMemo(() => ({
    testCount: tests.length,
    providerCount: providers.length
  }), [tests.length]);
  return <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[hsl(var(--section-dark))]">
      <Helmet>
        <title>Compare Health Tests - myhealth checkup | Live Prices from UK Providers</title>
        <meta name="description" content="Compare health tests from Medichecks, Thriva, Randox, and more UK providers. Live pricing, real reviews, and instant comparison across 300+ tests." />
        <link rel="canonical" href="https://myhealthhub.co.uk/compare" />
      </Helmet>
      
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-6 sm:py-10 md:py-16 bg-[#081129]">
          <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <Badge variant="secondary" className="text-primary border-primary/20 bg-white text-xs sm:text-sm">
                Live Pricing
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
              Compare Health Tests
            </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-4 sm:mb-6 text-white px-2">
                Find the perfect health test from {memoizedStats.providerCount} trusted UK providers. 
                Real-time prices, expert reviews, and AI-powered recommendations.
              </p>
            
            {/* Quick Stats */}
            <div className="flex flex-col xs:flex-row flex-wrap justify-center gap-3 sm:gap-6 mt-4 sm:mt-8">
              <div className="flex items-center justify-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-white">{memoizedStats.testCount}+ Tests Available</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-white">Real-time Pricing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Results */}
        <section className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <CompareFilters categories={categories} selectedCategory={selectedCategory} selectedProviders={selectedProviders} searchTerm={searchTerm} sortOrder={sortOrder} onCategoryChange={handleCategoryChange} onProviderChange={handleProviderChange} onSearchChange={setSearchTerm} onSortChange={setSortOrder} testCount={tests.length} isLoading={isLoading} />

            {isLoading ? <div className="flex items-center justify-center py-8 sm:py-12 md:py-16">
                <div className="text-center px-4">
                  <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin text-health-primary mx-auto mb-3 sm:mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg">Finding the best tests for you...</p>
                </div>
              </div> : <ModernCompareTable tests={tests} selectedCategory={selectedCategory} />}
          </div>
        </section>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>;
};
export default CompareTests;