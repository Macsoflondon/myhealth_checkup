import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X, TestTube2 } from "lucide-react";
import CatalogSortBar, { sortTests, type CatalogSortOption } from "@/components/providers/CatalogSortBar";
import ProviderCatalogHeader, { PROVIDER_FEATURES } from "@/components/providers/ProviderCatalogHeader";
import ProviderTestCard from "@/components/providers/ProviderTestCard";
import ProviderTestDetailModal from "@/components/providers/ProviderTestDetailModal";

const PROVIDER_ID = "medichecks";
const PROVIDER_NAME = "Medichecks";

const MedichecksTestsCatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<CatalogSortOption>("name-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const { data: tests, isLoading } = useQuery({
    queryKey: ["medichecks-tests"],
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
    return [...new Set(tests.map((t) => t.category).filter(Boolean))].sort() as string[];
  }, [tests]);

  const priceBounds = useMemo(() => {
    if (!tests) return { min: 0, max: 500 };
    const prices = tests.map(t => t.price || 0);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    let filtered = tests;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((t) =>
        t.test_name.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search) ||
        t.category?.toLowerCase().includes(search)
      );
    }
    filtered = filtered.filter((t) => {
      const price = t.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    return sortTests(filtered, sortBy);
  }, [tests, selectedCategory, searchTerm, priceRange, sortBy]);

  const hasActiveFilters = searchTerm || selectedCategory !== "all" ||
    priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSortBy("name-asc");
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Medichecks Tests | myhealth checkup</title>
        <meta name="description" content="Browse all Medichecks blood tests. Home test kits and clinic appointments available. Compare prices and book your private health screening." />
      </Helmet>
      <div className="min-h-screen bg-[primary-on-container] bg-tertiary">
        <ProviderCatalogHeader
          providerId={PROVIDER_ID}
          providerName={PROVIDER_NAME}
          tagline="UK's leading home blood testing service"
          testCount={tests?.length || 0}
          isLoading={isLoading}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          features={PROVIDER_FEATURES[PROVIDER_ID]}
        />

        {/* Search & Filter Bar */}
        <section className="container mx-auto px-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input placeholder="Search tests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className={showFilters ? "bg-primary text-primary-foreground" : ""}>
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Price Range: £{priceRange[0]} - £{priceRange[1]}</label>
                <Slider value={priceRange} min={priceBounds.min} max={priceBounds.max} step={5} onValueChange={(v) => setPriceRange(v as [number, number])} className="py-2" />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="self-end">
                  <X className="h-4 w-4 mr-1" /> Reset Filters
                </Button>
              )}
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 pb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
              ))}
            </div>
          ) : filteredTests.length > 0 ? (
            <>
              <CatalogSortBar sortBy={sortBy} onSortChange={setSortBy} resultCount={filteredTests.length} categoryLabel={selectedCategory} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTests.map((test) => (
                  <ProviderTestCard key={test.id} test={test} providerName={PROVIDER_NAME} onClick={() => setSelectedTest(test)} />
                ))}
              </div>
            </>
          ) : (
             <div className="text-center py-12">
              <TestTube2 className="h-12 w-12 mx-auto text-white/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">No tests found</h3>
              <p className="text-white/70">{selectedCategory !== 'all' ? 'Try selecting a different category' : 'Tests from this provider will appear here soon'}</p>
            </div>
          )}
        </section>
      </div>
      <ProviderTestDetailModal test={selectedTest} providerName={PROVIDER_NAME} open={!!selectedTest} onOpenChange={(open) => { if (!open) setSelectedTest(null); }} />
    </MainLayout>
  );
};

export default MedichecksTestsCatalogPage;
