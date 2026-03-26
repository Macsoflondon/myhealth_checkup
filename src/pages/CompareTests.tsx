import React, { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { FiltersSidebar } from "@/components/compare/FiltersSidebar";
import { TestListCard } from "@/components/compare/TestListCard";
import { ComparisonBar } from "@/components/compare/ComparisonBar";
import { ComparisonPanel } from "@/components/compare/ComparisonPanel";
import { RecommendedTestsCarousel } from "@/components/compare/RecommendedTestsCarousel";
import { GroupedTestsTable } from "@/components/compare/GroupedTestsTable";
import { TestViewToggle, type TestViewMode } from "@/components/compare/TestViewToggle";
import type { CompareTestData } from "@/services/CompareService";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Filter, TrendingUp } from "lucide-react";
import { providers } from "@/constants/providers";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useCompareTestsData, type CompareFilters, defaultFilters } from "@/hooks/queries/useCompareTestsData";
import { useRecommendedTests } from "@/hooks/queries/useRecommendedTests";
import { getCategoryDisplayName } from "@/utils/categoryTaglines";

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
  // Filter states
  const [filters, setFilters] = useState<CompareFilters>(defaultFilters);
  
  // Mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // View mode state
  const [viewMode, setViewMode] = useState<TestViewMode>("list");

  // Comparison states - no limit on number of tests
  const [selectedTests, setSelectedTests] = useState<CompareTestData[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Use the centralised data hook
  const { tests, isLoading, urlCategory } = useCompareTestsData(filters);
  
  // Fetch recommended tests for the current category
  const effectiveCategory = filters.selectedCategory || urlCategory || "general-health";
  const { data: recommendedTests = [], isLoading: isLoadingRecommended } = useRecommendedTests(
    effectiveCategory,
    8
  );

  // Set initial category from URL
  React.useEffect(() => {
    if (urlCategory && !filters.selectedCategory) {
      setFilters(prev => ({ ...prev, selectedCategory: urlCategory }));
    }
  }, [urlCategory]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filter update helpers
  const updateFilter = useCallback(<K extends keyof CompareFilters>(
    key: K,
    value: CompareFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Format providers for the sidebar
  const formattedProviders = useMemo(() => 
    providers.map(p => ({ id: p.id, name: p.name })),
  []);

  const memoizedStats = useMemo(() => ({
    testCount: tests.length,
    providerCount: providers.length,
  }), [tests.length]);

  // Pagination logic
  const paginatedTests = useMemo(() => {
    return tests.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [tests, currentPage]);

  const hasMoreTests = paginatedTests.length < tests.length;
  const totalPages = Math.ceil(tests.length / ITEMS_PER_PAGE);

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 300);
  }, []);

  // Comparison handlers - unlimited test selection
  const handleToggleSelect = useCallback((test: CompareTestData) => {
    setSelectedTests(prev => {
      const isAlreadySelected = prev.some(t => t.id === test.id);
      
      if (isAlreadySelected) {
        return prev.filter(t => t.id !== test.id);
      }
      
      return [...prev, test];
    });
  }, []);

  const handleRemoveTest = useCallback((testId: string) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedTests([]);
  }, []);

  const handleOpenComparison = useCallback(() => {
    if (selectedTests.length >= 2) {
      setIsComparisonOpen(true);
    }
  }, [selectedTests.length]);

  const isTestSelected = useCallback((testId: string) => {
    return selectedTests.some(t => t.id === testId);
  }, [selectedTests]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet>
          <title>Compare Blood Tests | myhealth checkup</title>
          <meta
            name="description"
            content="Compare private blood tests from Medichecks, Thriva, Randox, and more UK providers. Transparent pricing and inclusions from trusted UK providers."
          />
          <link rel="canonical" href="https://myhealthcheckup.co.uk/compare" />
        </Helmet>

        <MainLayout>
          <div className="max-w-7xl mx-auto px-6 py-8 bg-white rounded-lg">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-montserrat mb-6">
              {effectiveCategory && effectiveCategory !== "all" 
                ? `Compare ${getCategoryDisplayName(effectiveCategory)}`
                : "Compare Private Blood Tests"}
            </h1>
            <PageBreadcrumb 
              segments={[
                { label: "Home", href: "/" },
                { label: "Compare Tests", href: "/compare" },
                ...(effectiveCategory && effectiveCategory !== "all" 
                  ? [{ label: getCategoryDisplayName(effectiveCategory) }] 
                  : [])
              ]}
              backLabel="Back to Home"
            />
            
            {/* Recommended Tests Carousel */}
            <RecommendedTestsCarousel
              tests={recommendedTests}
              category={effectiveCategory}
              onSelectTest={handleToggleSelect}
              selectedTestIds={selectedTests.map(t => t.id)}
              isLoading={isLoadingRecommended}
            />
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <FiltersSidebar
                searchQuery={filters.searchQuery}
                onSearchChange={(v) => updateFilter('searchQuery', v)}
                providers={formattedProviders}
                selectedProvider={filters.selectedProvider}
                onProviderChange={(v) => updateFilter('selectedProvider', v)}
                priceRange={filters.priceRange}
                onPriceRangeChange={(v) => updateFilter('priceRange', v)}
                categories={CATEGORY_LIST}
                selectedCategory={filters.selectedCategory}
                onCategoryChange={(v) => updateFilter('selectedCategory', v)}
                sampleMethod={filters.sampleMethod}
                onSampleMethodChange={(v) => updateFilter('sampleMethod', v)}
                fastingRequired={filters.fastingRequired}
                onFastingChange={(v) => updateFilter('fastingRequired', v)}
                gpReview={filters.gpReview}
                onGpReviewChange={(v) => updateFilter('gpReview', v)}
                onClearFilters={clearFilters}
                isVisible={showFilters}
                onClose={() => setShowFilters(false)}
              />

              {/* Results */}
              <main className="flex-1 min-w-0">
                {/* Sort, View Toggle, and Filter Toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4 flex-wrap">
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

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* View Toggle */}
                    <TestViewToggle value={viewMode} onChange={setViewMode} />
                    
                    {/* Sort - only show in list view */}
                    {viewMode === "list" && (
                      <Select 
                        value={filters.sortBy} 
                        onValueChange={(v) => updateFilter('sortBy', v)}
                      >
                        <SelectTrigger className="w-[160px] bg-background">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price-asc">Price (low to high)</SelectItem>
                          <SelectItem value="price-desc">Price (high to low)</SelectItem>
                          <SelectItem value="turnaround">Fastest results</SelectItem>
                          <SelectItem value="popular">Most popular</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Test Display - based on view mode */}
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
                ) : viewMode === "grouped" ? (
                  /* Grouped View - Tests clustered by type with expandable providers */
                  <GroupedTestsTable
                    tests={tests.map(t => ({
                      id: t.id,
                      testName: t.name,
                      provider: t.provider,
                      price: t.price,
                      originalPrice: undefined,
                      turnaroundDays: t.turnaroundDays,
                      biomarkerCount: t.biomarkerCount,
                      sampleType: t.features?.collection,
                      homeKitAvailable: t.features?.collection?.toLowerCase().includes("home") || false,
                      clinicVisitAvailable: t.features?.collection?.toLowerCase().includes("clinic") || false,
                      gpReviewIncluded: false,
                      url: t.url,
                      description: t.description,
                      category: t.category,
                    }))}
                    title="Tests by Type"
                  />
                ) : (
                  /* List View - Original card layout */
                  <div className="space-y-4">
                    {paginatedTests.map((test) => (
                      <TestListCard 
                        key={test.id} 
                        test={test}
                        isSelected={isTestSelected(test.id)}
                        onToggleSelect={handleToggleSelect}
                      />
                    ))}
                    
                    {/* Pagination Controls */}
                    {tests.length > ITEMS_PER_PAGE && (
                      <div className="flex flex-col items-center gap-4 pt-8 pb-4">
                        <p className="text-sm text-muted-foreground">
                          Showing {paginatedTests.length} of {tests.length} tests
                        </p>
                        
                        {hasMoreTests ? (
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="min-w-[200px]"
                          >
                            {isLoadingMore ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Loading...
                              </>
                            ) : (
                              <>Load more tests</>
                            )}
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground font-medium">
                            You've reached the end
                          </p>
                        )}
                        
                        {/* Page indicator */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Page {currentPage} of {totalPages}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </MainLayout>

        {/* Comparison Bar - fixed at bottom when tests selected */}
        <ComparisonBar
          selectedTests={selectedTests}
          onRemoveTest={handleRemoveTest}
          onCompare={handleOpenComparison}
          onClearAll={handleClearAll}
        />

        {/* Comparison Panel Modal */}
        <ComparisonPanel
          tests={selectedTests}
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          onRemoveTest={handleRemoveTest}
        />
      </div>
    </ErrorBoundary>
  );
};

export default CompareTests;
