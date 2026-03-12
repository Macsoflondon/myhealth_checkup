import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Filter, ArrowUpDown, RotateCcw, Bookmark, ChevronDown, Plus, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedComparison } from '@/hooks/useEnhancedComparison';
import { EnhancedComparisonTable } from '@/components/compare/EnhancedComparisonTable';
import { SaveComparisonDialog } from '@/components/compare/SaveComparisonDialog';
import { SavedComparisonsList } from '@/components/compare/SavedComparisonsList';
import { ProviderLogo } from '@/components/ProviderLogo';
import { compareCategories, getDbCategoriesForSlug } from '@/constants/categories';
import { useSavedProviders } from '@/hooks/useSavedProviders';
import { cn } from '@/lib/utils';
import type { EnhancedTestData, SortOption, SavedComparison } from '@/types/comparison';
import PageHeading from '@/components/ui/page-heading';

const PROVIDERS = [
  { id: 'medichecks', name: 'Medichecks' },
  { id: 'thriva', name: 'Thriva' },
  { id: 'goodbody', name: 'Goodbody Clinic' },
  { id: 'randox', name: 'Randox Health' },
  { id: 'lola-health', name: 'Lola Health' },
  { id: 'london-medical-laboratory', name: 'London Medical Lab' },
];

export default function EnhancedComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tests, setTests] = useState<EnhancedTestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filters
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [includesGp, setIncludesGp] = useState<boolean | null>(null);
  const [includesPhlebotomy, setIncludesPhlebotomy] = useState<boolean | null>(null);

  const {
    selectedTests,
    comparisonResult,
    savedComparisons,
    isLoading: comparisonLoading,
    addToComparison,
    removeFromComparison,
    clearComparison,
    saveComparison,
    loadSavedComparisons,
    deleteSavedComparison,
    transformToEnhanced
  } = useEnhancedComparison();

  const { isProviderSaved, toggleSaveProvider } = useSavedProviders();

  // Fetch tests
  const fetchTests = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('provider_tests')
        .select('*')
        .eq('is_active', true);

      if (category && category !== 'all') {
        const dbCategories = getDbCategoriesForSlug(category);
        if (dbCategories && dbCategories.length > 0) {
          query = query.in('category', dbCategories);
        } else {
          // Fallback: convert slug to space-separated words for ilike
          const searchable = category.replace(/-/g, ' ').replace(/tests?$/i, '').trim();
          query = query.ilike('category', `%${searchable}%`);
        }
      }

      if (selectedProviders.length > 0) {
        query = query.in('provider_id', selectedProviders);
      }

      if (searchTerm) {
        query = query.ilike('test_name', `%${searchTerm}%`);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      let transformed = (data || []).map(transformToEnhanced);

      // Apply price filter
      transformed = transformed.filter(t => 
        t.basePrice >= priceRange[0] && t.basePrice <= priceRange[1]
      );

      // Apply GP filter
      if (includesGp !== null) {
        transformed = transformed.filter(t => t.gpConsultationIncluded === includesGp);
      }

      // Apply phlebotomy filter
      if (includesPhlebotomy !== null) {
        transformed = transformed.filter(t => t.phlebotomyIncluded === includesPhlebotomy);
      }

      // Sort
      transformed.sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.basePrice - b.basePrice;
          case 'price-desc':
            return b.basePrice - a.basePrice;
          case 'turnaround-asc':
            return a.turnaroundDays - b.turnaroundDays;
          case 'turnaround-desc':
            return b.turnaroundDays - a.turnaroundDays;
          case 'biomarkers-desc':
            return b.biomarkerCount - a.biomarkerCount;
          case 'total-cost-asc':
            return a.totalEstimatedCost - b.totalEstimatedCost;
          default:
            return 0;
        }
      });

      setTests(transformed);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests');
    } finally {
      setIsLoading(false);
    }
  }, [category, selectedProviders, searchTerm, sortBy, priceRange, includesGp, includesPhlebotomy, transformToEnhanced]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  useEffect(() => {
    loadSavedComparisons();
  }, [loadSavedComparisons]);

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSearchParams(prev => {
      if (newCategory === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', newCategory);
      }
      return prev;
    });
  };

  // Toggle provider
  const toggleProvider = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(p => p !== providerId)
        : [...prev, providerId]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setCategory('all');
    setSelectedProviders([]);
    setSearchTerm('');
    setSortBy('price-asc');
    setPriceRange([0, 500]);
    setIncludesGp(null);
    setIncludesPhlebotomy(null);
    setSearchParams({});
  };

  // Handle book test
  const handleBookTest = (test: EnhancedTestData) => {
    if (test.url) {
      window.open(test.url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Booking link not available');
    }
  };

  // Load saved comparison
  const handleLoadComparison = async (comparison: SavedComparison) => {
    clearComparison();
    
    try {
      const { data, error } = await supabase
        .from('provider_tests')
        .select('*')
        .in('id', comparison.testIds);

      if (error) throw error;

      const transformed = (data || []).map(transformToEnhanced);
      transformed.forEach(test => addToComparison(test));
      
      setActiveTab('compare');
      toast.success('Comparison loaded');
    } catch (error) {
      console.error('Error loading comparison:', error);
      toast.error('Failed to load comparison');
    }
  };

  const isTestSelected = (testId: string) => 
    selectedTests.some(t => t.id === testId);

  return (
    <>
      <Helmet>
        <title>Compare Blood Tests & Cancer Screening | myhealth checkup</title>
        <meta name="description" content="Compare blood tests and cancer screening from 7 trusted UK providers. View prices, biomarkers, turnaround times, and additional costs side-by-side." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/compare" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="myhealth checkup" />
        <meta property="og:title" content="Compare Blood Tests & Cancer Screening | myhealth checkup" />
        <meta property="og:description" content="Compare blood tests and cancer screening from 7 trusted UK providers. View prices, biomarkers, turnaround times, and additional costs side-by-side." />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/compare" />
        <meta property="og:image" content="https://myhealthcheckup.co.uk/og-image.png" />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myhealthcheckup" />
        <meta name="twitter:title" content="Compare Blood Tests & Cancer Screening | myhealth checkup" />
        <meta name="twitter:description" content="Compare blood tests from 7 trusted UK providers. Real-time prices, biomarkers, and turnaround times." />
        <meta name="twitter:image" content="https://myhealthcheckup.co.uk/og-image.png" />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Compare Blood Tests & Cancer Screening",
            "description": "Compare blood tests and cancer screening from 7 trusted UK providers. View prices, biomarkers, turnaround times, and additional costs side-by-side.",
            "url": "https://myhealthcheckup.co.uk/compare",
            "isPartOf": {
              "@type": "WebSite",
              "name": "myhealth checkup",
              "url": "https://myhealthcheckup.co.uk"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "UK Health Test Comparison",
              "description": "Compare private blood tests from UKAS-accredited providers",
              "numberOfItems": tests.length
            }
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <PageHeading 
              title="Compare Blood Tests &" 
              accent="Cancer Screening" 
            />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Compare tests from 7 trusted UK providers. View prices, biomarkers, turnaround times, 
              and additional costs for GP consultations and phlebotomy side-by-side.
            </p>
          </div>

          {/* Selected Tests Bar */}
          {selectedTests.length > 0 && (
            <Card className="mb-6 border-[#e70d69]/30 bg-[#e70d69]/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Comparing {selectedTests.length} tests:</span>
                    <div className="flex gap-2 flex-wrap">
                      {selectedTests.map(test => (
                        <Badge 
                          key={test.id} 
                          variant="secondary"
                          className="gap-1 cursor-pointer hover:bg-destructive/20"
                          onClick={() => removeFromComparison(test.id)}
                        >
                          {test.testName.substring(0, 20)}...
                          <span className="ml-1">×</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearComparison}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                    <SaveComparisonDialog 
                      onSave={saveComparison}
                      testCount={selectedTests.length}
                    />
                    <Button 
                      size="sm"
                      className="bg-[#e70d69] hover:bg-[#e70d69]/90"
                      onClick={() => setActiveTab('compare')}
                    >
                      View Comparison
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="browse">Browse Tests</TabsTrigger>
              <TabsTrigger value="compare" disabled={selectedTests.length < 2}>
                Compare ({selectedTests.length})
              </TabsTrigger>
              <TabsTrigger value="saved">
                Saved
              </TabsTrigger>
            </TabsList>

            {/* Browse Tab */}
            <TabsContent value="browse" className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Filters Sidebar - Desktop */}
                <div className="hidden lg:block w-64 shrink-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Category */}
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={handleCategoryChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {compareCategories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Providers */}
                      <div className="space-y-2">
                        <Label>Providers</Label>
                        <div className="space-y-2">
                          {PROVIDERS.map(provider => (
                            <div key={provider.id} className="flex items-center gap-2">
                              <Checkbox
                                id={provider.id}
                                checked={selectedProviders.includes(provider.id)}
                                onCheckedChange={() => toggleProvider(provider.id)}
                              />
                              <label htmlFor={provider.id} className="text-sm cursor-pointer flex-1">
                                {provider.name}
                              </label>
                              <button
                                onClick={() => toggleSaveProvider(provider.id, provider.name)}
                                className={cn(
                                  "p-1 rounded hover:bg-muted transition-colors",
                                  isProviderSaved(provider.id) && "text-[#e70d69]"
                                )}
                                title={isProviderSaved(provider.id) ? "Remove from saved" : "Save provider"}
                              >
                                <Heart className={cn("h-3.5 w-3.5", isProviderSaved(provider.id) && "fill-current")} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* GP Consultation */}
                      <div className="space-y-2">
                        <Label>GP Consultation</Label>
                        <Select 
                          value={includesGp === null ? 'any' : includesGp ? 'included' : 'extra'}
                          onValueChange={v => setIncludesGp(v === 'any' ? null : v === 'included')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="included">Included</SelectItem>
                            <SelectItem value="extra">Extra Cost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Phlebotomy */}
                      <div className="space-y-2">
                        <Label>Phlebotomy</Label>
                        <Select 
                          value={includesPhlebotomy === null ? 'any' : includesPhlebotomy ? 'included' : 'extra'}
                          onValueChange={v => setIncludesPhlebotomy(v === 'any' ? null : v === 'included')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="included">Included</SelectItem>
                            <SelectItem value="extra">Extra Cost / Self-collect</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={resetFilters}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Filters
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Mobile Filters */}
                <div className="lg:hidden">
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {(selectedProviders.length > 0 || category !== 'all') && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedProviders.length + (category !== 'all' ? 1 : 0)}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Refine your test search
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        {/* Same filter content as desktop */}
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select value={category} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {compareCategories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center justify-between w-full">
                            <Label>Providers</Label>
                            <ChevronDown className="w-4 h-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 space-y-2">
                            {PROVIDERS.map(provider => (
                              <div key={provider.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`mobile-${provider.id}`}
                                  checked={selectedProviders.includes(provider.id)}
                                  onCheckedChange={() => toggleProvider(provider.id)}
                                />
                                <label htmlFor={`mobile-${provider.id}`} className="text-sm cursor-pointer">
                                  {provider.name}
                                </label>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>

                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            resetFilters();
                            setFiltersOpen(false);
                          }}
                        >
                          Reset Filters
                        </Button>
                        <Button 
                          className="w-full bg-[#e70d69] hover:bg-[#e70d69]/90"
                          onClick={() => setFiltersOpen(false)}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  {/* Search and Sort */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Input
                      placeholder="Search tests..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                      <SelectTrigger className="w-full sm:w-48">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="total-cost-asc">Total Cost: Low to High</SelectItem>
                        <SelectItem value="turnaround-asc">Fastest Results</SelectItem>
                        <SelectItem value="biomarkers-desc">Most Biomarkers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Results Count */}
                  <p className="text-sm text-muted-foreground mb-4">
                    Showing {tests.length} tests
                    {category !== 'all' && ` in ${category}`}
                    {selectedProviders.length > 0 && ` from ${selectedProviders.length} provider(s)`}
                  </p>

                  {/* Test Grid */}
                  {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                            <div className="h-4 bg-muted rounded w-full mb-2" />
                            <div className="h-4 bg-muted rounded w-2/3" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : tests.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No tests found matching your criteria.</p>
                        <Button variant="link" onClick={resetFilters}>
                          Reset filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {tests.map(test => (
                        <Card 
                          key={test.id} 
                          className={`transition-all hover:shadow-md ${
                            isTestSelected(test.id) ? 'ring-2 ring-[#e70d69]' : ''
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <ProviderLogo 
                                  provider={test.providerId} 
                                  className="h-6 w-auto"
                                />
                              </div>
                              <Badge variant="outline">{test.category}</Badge>
                            </div>
                            
                            <h3 className="font-heading font-semibold mb-2 line-clamp-2">
                              {test.testName}
                            </h3>
                            
                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                              <div className="flex justify-between">
                                <span>Base Price:</span>
                                <span className="font-medium text-foreground">£{test.basePrice.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Est. Cost:</span>
                                <span className="font-semibold text-[#e70d69]">£{test.totalEstimatedCost.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Turnaround:</span>
                                <span>{test.turnaroundDays} days</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Biomarkers:</span>
                                <span>{test.biomarkerCount}</span>
                              </div>
                            </div>

                            <div className="flex gap-2 flex-wrap mb-4">
                              {test.gpConsultationIncluded && (
                                <Badge variant="secondary" className="text-xs">GP Included</Badge>
                              )}
                              {test.phlebotomyIncluded && (
                                <Badge variant="secondary" className="text-xs">Phlebotomy Included</Badge>
                              )}
                              {test.homeKitAvailable && (
                                <Badge variant="outline" className="text-xs">Home Kit</Badge>
                              )}
                            </div>

                            <Button
                              variant={isTestSelected(test.id) ? "secondary" : "outline"}
                              className="w-full"
                              onClick={() => {
                                if (isTestSelected(test.id)) {
                                  removeFromComparison(test.id);
                                } else {
                                  addToComparison(test);
                                }
                              }}
                            >
                              {isTestSelected(test.id) ? (
                                'Remove from Comparison'
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add to Compare
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare">
              {comparisonResult ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl font-semibold">
                      Side-by-Side Comparison
                    </h2>
                    <SaveComparisonDialog 
                      onSave={saveComparison}
                      testCount={selectedTests.length}
                    />
                  </div>
                  <EnhancedComparisonTable
                    result={comparisonResult}
                    onRemoveTest={removeFromComparison}
                    onBookTest={handleBookTest}
                  />
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      Select at least 2 tests to compare them side-by-side.
                    </p>
                    <Button onClick={() => setActiveTab('browse')}>
                      Browse Tests
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Saved Tab */}
            <TabsContent value="saved">
              <div className="max-w-2xl mx-auto">
                <h2 className="font-heading text-2xl font-semibold mb-6">
                  Saved Comparisons
                </h2>
                <SavedComparisonsList
                  comparisons={savedComparisons}
                  onLoad={handleLoadComparison}
                  onDelete={deleteSavedComparison}
                  isLoading={comparisonLoading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
}
