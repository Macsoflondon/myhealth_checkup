import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FlaskConical, TestTube, ChevronRight, ExternalLink, TestTube2 } from "lucide-react";
import ProviderCatalogHeader, { PROVIDER_FEATURES } from "@/components/providers/ProviderCatalogHeader";

const PROVIDER_ID = "randox";
const PROVIDER_NAME = "Randox Health";

const RandoxTestsCatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: tests, isLoading } = useQuery({
    queryKey: ["randox-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("*")
        .eq("provider_id", PROVIDER_ID)
        .eq("is_active", true)
        .order("test_name");

      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => {
    if (!tests) return [];
    const cats = [...new Set(tests.map((t) => t.category).filter(Boolean))];
    return cats.sort() as string[];
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    if (selectedCategory === "all") return tests;
    return tests.filter((t) => t.category === selectedCategory);
  }, [tests, selectedCategory]);

  const generateTestSlug = (testName: string) => {
    return testName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price on request';
    return `£${price.toFixed(2)}`;
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Randox Health Tests | Compare Health Tests UK</title>
        <meta
          name="description"
          content="Browse all Randox Health blood tests. Premium clinic-based testing with comprehensive health packages. Compare prices and book your appointment."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ProviderCatalogHeader
          providerId={PROVIDER_ID}
          providerName={PROVIDER_NAME}
          tagline="Comprehensive health packages with advanced diagnostics"
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
              {[...Array(9)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTests && filteredTests.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Showing {filteredTests.length} test{filteredTests.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                  <Card
                    key={test.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {test.test_name}
                        </CardTitle>
                        {test.category && (
                          <Badge variant="secondary" className="shrink-0">
                            {test.category}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {test.description}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <FlaskConical className="h-4 w-4 text-primary" />
                          <span>{test.biomarker_count || 0} biomarkers</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <TestTube className="h-4 w-4 text-primary" />
                          <span>{test.sample_type || "Blood sample"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(test.price)}
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/randox/${generateTestSlug(test.test_name)}`}>
                            <Button size="sm" className="group/btn">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                          </Link>
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
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

export default RandoxTestsCatalogPage;
