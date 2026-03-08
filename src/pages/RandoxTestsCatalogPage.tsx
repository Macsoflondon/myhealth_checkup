import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TestTube2 } from "lucide-react";
import ProviderCatalogHeader, { PROVIDER_FEATURES } from "@/components/providers/ProviderCatalogHeader";
import ProviderTestCard from "@/components/providers/ProviderTestCard";
import ProviderTestDetailModal from "@/components/providers/ProviderTestDetailModal";

const PROVIDER_ID = "randox";
const PROVIDER_NAME = "Randox Health";

const RandoxTestsCatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTest, setSelectedTest] = useState<any>(null);

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

  return (
    <MainLayout>
      <Helmet>
        <title>Randox Health Tests | Compare Health Tests UK</title>
        <meta
          name="description"
          content="Browse all Randox Health blood tests. Premium clinic-based testing with comprehensive health packages. Compare prices and book your appointment."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
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

        <section className="container mx-auto px-4 pb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
                  <CardContent><Skeleton className="h-20 w-full" /><Skeleton className="h-10 w-full mt-4" /></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTests && filteredTests.length > 0 ? (
            <>
              <p className="text-gray-500 mb-6">
                Showing {filteredTests.length} test{filteredTests.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTests.map((test) => (
                  <ProviderTestCard
                    key={test.id}
                    test={test}
                    providerName={PROVIDER_NAME}
                    onClick={() => setSelectedTest(test)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <TestTube2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tests found</h3>
              <p className="text-gray-500">
                {selectedCategory !== 'all' ? 'Try selecting a different category' : 'Tests from this provider will appear here soon'}
              </p>
            </div>
          )}
        </section>
      </div>

      <ProviderTestDetailModal
        test={selectedTest}
        providerName={PROVIDER_NAME}
        open={!!selectedTest}
        onOpenChange={(open) => { if (!open) setSelectedTest(null); }}
      />
    </MainLayout>
  );
};

export default RandoxTestsCatalogPage;
