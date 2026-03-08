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
import CatalogSortBar, { sortTests, type CatalogSortOption } from "@/components/providers/CatalogSortBar";

const PROVIDER_ID = "london-medical-laboratory";
const PROVIDER_NAME = "London Medical Laboratory";

export const LondonMedicalLabTestsCatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [sortBy, setSortBy] = useState<CatalogSortOption>("name-asc");

  const { data: tests, isLoading } = useQuery({
    queryKey: ['provider-tests', PROVIDER_ID],
    queryFn: async () => {
      const { data, error } = await supabase.from('provider_tests').select('*').eq('provider_id', PROVIDER_ID).eq('is_active', true).order('test_name');
      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => {
    if (!tests) return [];
    return [...new Set(tests.map(t => t.category).filter(Boolean))].sort() as string[];
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    const filtered = selectedCategory === 'all' ? tests : tests.filter(t => t.category === selectedCategory);
    return sortTests(filtered, sortBy);
  }, [tests, selectedCategory, sortBy]);

  return (
    <MainLayout>
      <Helmet>
        <title>London Medical Laboratory Tests | Compare Health Tests UK</title>
        <meta name="description" content="Browse London Medical Laboratory's full range of blood tests and health screenings. Compare prices, biomarkers, and turnaround times." />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <ProviderCatalogHeader providerId={PROVIDER_ID} providerName={PROVIDER_NAME} tagline="UKAS-accredited laboratory services" testCount={tests?.length || 0} isLoading={isLoading} categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} features={PROVIDER_FEATURES[PROVIDER_ID]} />
        <section className="container mx-auto px-4 pb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (<Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>))}
            </div>
          ) : filteredTests.length > 0 ? (
            <>
              <CatalogSortBar sortBy={sortBy} onSortChange={setSortBy} resultCount={filteredTests.length} categoryLabel={selectedCategory} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTests.map((test) => (<ProviderTestCard key={test.id} test={test} providerName={PROVIDER_NAME} onClick={() => setSelectedTest(test)} />))}
              </div>
            </>
          ) : (
            <div className="text-center py-12"><TestTube2 className="h-12 w-12 mx-auto text-gray-400 mb-4" /><h3 className="text-lg font-semibold mb-2">No tests found</h3><p className="text-gray-500">{selectedCategory !== 'all' ? 'Try selecting a different category' : 'Tests from this provider will appear here soon'}</p></div>
          )}
        </section>
      </div>
      <ProviderTestDetailModal test={selectedTest} providerName={PROVIDER_NAME} open={!!selectedTest} onOpenChange={(open) => { if (!open) setSelectedTest(null); }} />
    </MainLayout>
  );
};

export default LondonMedicalLabTestsCatalogPage;
