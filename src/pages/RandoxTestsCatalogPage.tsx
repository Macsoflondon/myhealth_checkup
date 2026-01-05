import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/layouts/MainLayout";
import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FlaskConical, 
  Clock, 
  TestTube, 
  ChevronRight,
  Building2,
  Microscope,
  Shield
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const RandoxTestsCatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: tests, isLoading } = useQuery({
    queryKey: ["randox-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("*")
        .eq("provider_id", "randox")
        .eq("is_active", true)
        .order("test_name");

      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => {
    if (!tests) return [];
    const cats = [...new Set(tests.map((t) => t.category).filter(Boolean))];
    return cats.sort();
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
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center p-2">
                <img
                  src="/lovable-uploads/provider-randox.png"
                  alt="Randox Health"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <PageHeading title="Randox Health" />
                <p className="text-muted-foreground mt-1">
                  Comprehensive health packages with advanced diagnostics
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Premium clinic locations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Microscope className="h-4 w-4 text-primary" />
                <span>Advanced diagnostics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>ISO 15189 Accredited</span>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Tests ({tests?.length || 0})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category as string)}
                >
                  {category} ({tests?.filter((t) => t.category === category).length})
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
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
            ) : (
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
                          <Badge variant="secondary" className="shrink-0">
                            {test.category}
                          </Badge>
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
                            £{test.price}
                          </div>
                          <Link to={`/randox/${generateTestSlug(test.test_name)}`}>
                            <Button size="sm" className="group/btn">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <SectionHeading title="About" gradientText="Randox Health" className="mb-4" />
              <p className="text-muted-foreground mb-6">
                Randox Health offers comprehensive health packages at their premium 
                clinic locations. As a global diagnostics company, they provide 
                advanced testing with detailed health reports and GP consultations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  ISO 15189
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Same Day Results
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Microscope className="h-4 w-4 mr-2" />
                  150+ Biomarkers
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default RandoxTestsCatalogPage;
