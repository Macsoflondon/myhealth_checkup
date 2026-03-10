import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Activity, Heart, Target, Microscope, AlertCircle, Plus, Minus, ExternalLink, BookOpen } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CancerScreeningDisclaimer } from '@/components/compliance/CancerScreeningDisclaimer';
import { CancerBiomarkerGroup } from '@/components/compare/CancerBiomarkerGroup';
import { EnhancedComparisonTable } from '@/components/compare/EnhancedComparisonTable';
import { SaveComparisonDialog } from '@/components/compare/SaveComparisonDialog';
import { useEnhancedComparison } from '@/hooks/useEnhancedComparison';
import { CANCER_TYPES, CANCER_SEARCH_TERMS, getCancerTypeById } from '@/data/compare/cancerBiomarkers';
import { supabase } from '@/integrations/supabase/client';
import { getProviderLogo as getProviderLogoFn, PROVIDER_DETAILS } from '@/constants/providers';
import { EnhancedTestData } from '@/types/comparison';
import HeroSection from "@/components/sections/HeroSection";

const CANCER_TYPE_ICONS: Record<string, React.ElementType> = {
  all: Shield,
  prostate: Activity,
  ovarian: Heart,
  bowel: Target,
  breast: Heart,
  liver: AlertCircle,
  multi: Microscope,
};

export default function CancerComparisonPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cancerTests, setCancerTests] = useState<EnhancedTestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCancerType, setActiveCancerType] = useState(searchParams.get('type') || 'all');
  
  const {
    selectedTests,
    addToComparison,
    removeFromComparison,
    clearComparison,
    comparisonResult,
    saveComparison,
    transformToEnhanced,
  } = useEnhancedComparison();

  // Fetch cancer-related tests
  useEffect(() => {
    async function fetchCancerTests() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('provider_tests')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        // Filter for cancer-related tests
        const cancerRelatedTests = (data || []).filter(test => {
          const searchText = `${test.test_name} ${test.description || ''} ${test.category || ''}`.toLowerCase();
          return CANCER_SEARCH_TERMS.some(term => searchText.includes(term.toLowerCase()));
        });

        // Transform to enhanced format
        const enhanced = cancerRelatedTests.map(test => transformToEnhanced(test));
        setCancerTests(enhanced);
      } catch (err) {
        console.error('Error fetching cancer tests:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCancerTests();
  }, [transformToEnhanced]);

  // Filter tests by cancer type
  const filteredTests = useMemo(() => {
    if (activeCancerType === 'all') return cancerTests;
    
    const cancerType = getCancerTypeById(activeCancerType);
    if (!cancerType) return cancerTests;

    return cancerTests.filter(test => {
      const searchText = `${test.testName} ${test.description}`.toLowerCase();
      return cancerType.searchTerms.some(term => searchText.includes(term.toLowerCase()));
    });
  }, [cancerTests, activeCancerType]);

  const handleCancerTypeChange = (type: string) => {
    setActiveCancerType(type);
    setSearchParams({ type });
  };

  const isTestSelected = (testId: string) => selectedTests.some(t => t.id === testId);

  const handleBookTest = (test: EnhancedTestData) => {
    if (test.url) {
      window.open(test.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getProviderLogo = (providerId: string) => {
    return getProviderLogoFn(providerId);
  };

  return (
    <>
      <Helmet>
        <title>Compare Cancer Screening Tests | myhealth checkup</title>
        <meta 
          name="description" 
          content="Compare cancer screening blood tests from trusted UK providers. Compare PSA, CA-125, CEA and other tumour markers across Medichecks, Thriva, and more." 
        />
      </Helmet>

      <UKASBanner />
      <Header />

      {/* Disclaimer Banner */}
      <CancerScreeningDisclaimer variant="banner" />

      <main className="min-h-screen bg-background">
        <HeroSection
          title="Compare Cancer Screening Tests"
          subtitle="Compare cancer screening blood tests from trusted UK providers. Find the right test for prostate, ovarian, bowel, and other cancer markers."
        >
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Badge variant="outline" className="text-white border-white/30">
              <Shield className="h-4 w-4 mr-1" />
              UKAS Accredited Labs
            </Badge>
            <Badge variant="outline" className="text-white border-white/30">
              7 Trusted Providers
            </Badge>
            <Link to="/cancer-biomarkers-reference" className="inline-flex items-center text-sm text-primary hover:underline">
              <BookOpen className="h-4 w-4 mr-1" />
              Biomarkers Reference Guide
            </Link>
          </div>
        </HeroSection>

        {/* Cancer Type Tabs */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="overflow-x-auto">
              <div className="flex gap-2 py-4 min-w-max">
                {CANCER_TYPES.map(type => {
                  const Icon = CANCER_TYPE_ICONS[type.id] || Shield;
                  const isActive = activeCancerType === type.id;
                  return (
                    <Button
                      key={type.id}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCancerTypeChange(type.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {type.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Full Disclaimer */}
          <div className="mb-8">
            <CancerScreeningDisclaimer variant="full" />
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="browse">Browse Tests</TabsTrigger>
              <TabsTrigger value="compare" disabled={selectedTests.length < 2}>
                Compare ({selectedTests.length})
              </TabsTrigger>
              <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
            </TabsList>

            {/* Browse Tests Tab */}
            <TabsContent value="browse" className="space-y-6">
              {/* Selected Tests Bar */}
              {selectedTests.length > 0 && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">Selected for comparison:</span>
                        {selectedTests.map(test => (
                          <Badge key={test.id} variant="secondary" className="flex items-center gap-1">
                            {test.provider}
                            <button
                              onClick={() => removeFromComparison(test.id)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={clearComparison}>
                          Clear
                        </Button>
                        {selectedTests.length >= 2 && (
                          <Button size="sm">
                            Compare {selectedTests.length} Tests
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Test Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-8 w-24 mb-4" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTests.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Microscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tests found</h3>
                    <p className="text-muted-foreground">
                      No cancer screening tests match the current filter. Try selecting a different category.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTests.map(test => {
                    const selected = isTestSelected(test.id);
                    return (
                      <Card 
                        key={test.id} 
                        className={`transition-all ${selected ? 'ring-2 ring-primary' : ''}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <img 
                              src={getProviderLogo(test.providerId)} 
                              alt={test.provider}
                              className="h-6 object-contain"
                            />
                            <Badge variant="secondary">
                              £{test.basePrice.toFixed(2)}
                            </Badge>
                          </div>
                          <CardTitle className="text-base line-clamp-2">
                            {test.testName}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {test.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4 text-xs">
                            <Badge variant="outline">
                              {test.biomarkerCount} biomarkers
                            </Badge>
                            <Badge variant="outline">
                              {test.turnaroundDays} day{test.turnaroundDays !== 1 ? 's' : ''}
                            </Badge>
                            {test.gpConsultationIncluded && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                GP included
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={selected ? 'destructive' : 'outline'}
                              size="sm"
                              className="flex-1"
                              onClick={() => selected ? removeFromComparison(test.id) : addToComparison(test)}
                              disabled={!selected && selectedTests.length >= 4}
                            >
                              {selected ? (
                                <>
                                  <Minus className="h-4 w-4 mr-1" />
                                  Remove
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Compare
                                </>
                              )}
                            </Button>
                            {test.url && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleBookTest(test)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare" className="space-y-6">
              {comparisonResult && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Side-by-Side Comparison</h2>
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

                  <CancerBiomarkerGroup 
                    selectedTests={selectedTests}
                    cancerTypeFilter={activeCancerType}
                  />
                </>
              )}
            </TabsContent>

            {/* Biomarkers Tab */}
            <TabsContent value="biomarkers" className="space-y-6">
              <CancerBiomarkerGroup 
                selectedTests={selectedTests}
                cancerTypeFilter={activeCancerType}
              />
              
              {selectedTests.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Select tests from the "Browse Tests" tab to see detailed biomarker coverage comparison.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
}
