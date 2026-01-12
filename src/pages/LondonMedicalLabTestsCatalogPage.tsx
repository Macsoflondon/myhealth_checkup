import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TestTube2, ChevronRight, ExternalLink } from "lucide-react";
import ProviderCatalogHeader, { PROVIDER_FEATURES } from "@/components/providers/ProviderCatalogHeader";
import { formatBiomarkerCount } from "@/utils/formatBiomarkers";

const PROVIDER_ID = "london-medical-laboratory";
const PROVIDER_NAME = "London Medical Laboratory";

export const LondonMedicalLabTestsCatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: tests, isLoading } = useQuery({
    queryKey: ['provider-tests', PROVIDER_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_tests')
        .select('*')
        .eq('provider_id', PROVIDER_ID)
        .eq('is_active', true)
        .order('test_name');

      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => {
    if (!tests) return [];
    const cats = [...new Set(tests.map(t => t.category).filter(Boolean))];
    return cats.sort() as string[];
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    if (selectedCategory === 'all') return tests;
    return tests.filter(test => test.category === selectedCategory);
  }, [tests, selectedCategory]);

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price on request';
    return `£${price.toFixed(2)}`;
  };

  return (
    <MainLayout>
      <Helmet>
        <title>London Medical Laboratory Tests | Compare Health Tests UK</title>
        <meta 
          name="description" 
          content="Browse London Medical Laboratory's full range of blood tests and health screenings. Compare prices, biomarkers, and turnaround times."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ProviderCatalogHeader
          providerId={PROVIDER_ID}
          providerName={PROVIDER_NAME}
          tagline="UKAS-accredited laboratory services"
          testCount={tests?.length || 0}
          isLoading={isLoading}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          features={PROVIDER_FEATURES[PROVIDER_ID]}
        />

        {/* Tests Grid */}
        <section className="container mx-auto px-4 pb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTests && filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <Card 
                  key={test.id} 
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {test.test_name}
                      </CardTitle>
                      {test.category && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {test.category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {test.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {test.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TestTube2 className="h-4 w-4" />
                        <span>{formatBiomarkerCount(test.biomarker_count)}</span>
                      </div>
                      <span className="font-bold text-lg text-primary">
                        {formatPrice(test.price)}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to={`/provider/${PROVIDER_ID}/tests/${test.id}`}>
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                      {test.url && (
                        <Button asChild variant="outline" size="sm">
                          <a 
                            href={test.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TestTube2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tests found</h3>
              <p className="text-muted-foreground">
                {selectedCategory !== 'all' 
                  ? 'Try selecting a different category'
                  : 'Tests from this provider will appear here soon'}
              </p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default LondonMedicalLabTestsCatalogPage;
