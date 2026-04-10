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

interface ProviderCatalogConfig {
  providerId: string;
  providerName: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
}

const PROVIDER_CONFIGS: Record<string, ProviderCatalogConfig> = {
  "goodbody-clinic": {
    providerId: "goodbody-clinic",
    providerName: "GOODBODY",
    tagline: "Premium private blood testing with in-clinic phlebotomy",
    metaTitle: "Goodbody Clinic Blood Tests | Compare Health Tests UK",
    metaDescription: "Browse all Goodbody Clinic blood tests. Compare prices, biomarkers, and book your private health screening at clinic locations across the UK.",
  },
  "medichecks": {
    providerId: "medichecks",
    providerName: "Medichecks",
    tagline: "UK's leading home blood testing service",
    metaTitle: "Medichecks Blood Tests | Compare Health Tests UK",
    metaDescription: "Browse all Medichecks blood tests. Home test kits and clinic appointments available. Compare prices and book your private health screening.",
  },
  "thriva": {
    providerId: "thriva",
    providerName: "Thriva",
    tagline: "At-home blood testing with smart health tracking",
    metaTitle: "Thriva Blood Tests | Compare Health Tests UK",
    metaDescription: "Browse all Thriva at-home blood tests. Subscription-based health monitoring with app tracking. Compare prices and order your test kit.",
  },
  "randox": {
    providerId: "randox",
    providerName: "Randox Health",
    tagline: "Comprehensive health packages with advanced diagnostics",
    metaTitle: "Randox Health Tests | Compare Health Tests UK",
    metaDescription: "Browse all Randox Health blood tests. Premium clinic-based testing with comprehensive health packages. Compare prices and book your appointment.",
  },
  "lola-health": {
    providerId: "lola-health",
    providerName: "Lola Health",
    tagline: "Personalised health testing designed for women",
    metaTitle: "Lola Health Blood Tests | Compare Health Tests UK",
    metaDescription: "Browse all Lola Health blood tests. Women-focused health testing with home kits and expert support. Compare prices and order your test.",
  },
  "london-medical-laboratory": {
    providerId: "london-medical-laboratory",
    providerName: "London Medical Laboratory",
    tagline: "UKAS-accredited laboratory services",
    metaTitle: "London Medical Laboratory Tests | Compare Health Tests UK",
    metaDescription: "Browse London Medical Laboratory's full range of blood tests and health screenings. Compare prices, biomarkers, and turnaround times.",
  },
};

interface ProviderTestsCatalogPageProps {
  providerId: string;
}

const ProviderTestsCatalogPage = ({ providerId }: ProviderTestsCatalogPageProps) => {
  const config = PROVIDER_CONFIGS[providerId] ?? PROVIDER_CONFIGS["medichecks"]!;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [sortBy, setSortBy] = useState<CatalogSortOption>("name-asc");

  const { data: tests, isLoading } = useQuery({
    queryKey: ["provider-tests", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("*")
        .eq("provider_id", providerId)
        .eq("is_active", true)
        .order("test_name");
      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => {
    if (!tests) return [];
    return [...new Set(tests.map((t) => t.category).filter(Boolean))].sort() as string[];
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    const filtered = selectedCategory === "all" ? tests : tests.filter((t) => t.category === selectedCategory);
    return sortTests(filtered, sortBy);
  }, [tests, selectedCategory, sortBy]);

  

  return (
    <MainLayout>
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
      </Helmet>
      <div className="min-h-screen bg-[primary-on-container] bg-tertiary">
        <ProviderCatalogHeader
          providerId={config.providerId}
          providerName={config.providerName}
          tagline={config.tagline}
          testCount={tests?.length || 0}
          isLoading={isLoading}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          features={PROVIDER_FEATURES[config.providerId]}
        />
        <section className="container mx-auto px-4 pb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                  <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTests.length > 0 ? (
            <>
              <CatalogSortBar sortBy={sortBy} onSortChange={setSortBy} resultCount={filteredTests.length} categoryLabel={selectedCategory} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTests.map((test) => (
                  <ProviderTestCard key={test.id} test={test} providerName={config.providerName} onClick={() => setSelectedTest(test)} />
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
        providerName={config.providerName}
        open={!!selectedTest}
        onOpenChange={(open) => { if (!open) setSelectedTest(null); }}
      />
    </MainLayout>
  );
};

export default ProviderTestsCatalogPage;
