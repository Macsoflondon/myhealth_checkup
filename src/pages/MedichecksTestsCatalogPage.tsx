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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  FlaskConical, 
  TestTube, 
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  ExternalLink,
  TestTube2
} from "lucide-react";
import ProviderCatalogHeader, { PROVIDER_FEATURES } from "@/components/providers/ProviderCatalogHeader";
import { formatBiomarkerCount } from "@/utils/formatBiomarkers";

const PROVIDER_ID = "medichecks";
const PROVIDER_NAME = "Medichecks";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "biomarkers-desc";

const MedichecksTestsCatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

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
    const cats = [...new Set(tests.map((t) => t.category).filter(Boolean))];
    return cats.sort() as string[];
  }, [tests]);

  // Get price bounds for slider
  const priceBounds = useMemo(() => {
    if (!tests) return { min: 0, max: 500 };
    const prices = tests.map(t => t.price || 0);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    
    let filtered = tests;
    
    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }
    
    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((t) => 
        t.test_name.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search) ||
        t.category?.toLowerCase().includes(search)
      );
    }
    
    // Price range filter
    filtered = filtered.filter((t) => {
      const price = t.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.test_name.localeCompare(b.test_name);
        case "name-desc":
          return b.test_name.localeCompare(a.test_name);
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "biomarkers-desc":
          return (b.biomarker_count || 0) - (a.biomarker_count || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [tests, selectedCategory, searchTerm, priceRange, sortBy]);

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || 
    priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSortBy("name-asc");
  };

  const generateTestSlug = (testName: string) => {
    return testName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const formatPrice = (price: number | null, url: string | null) => {
    if (!price) {
      return { text: 'View on provider site', isLink: true, url };
    }
    return { text: `£${price.toFixed(2)}`, isLink: false, url: null };
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Medichecks Blood Tests | Compare Health Tests UK</title>
        <meta
          name="description"
          content="Browse all Medichecks blood tests. Home test kits and clinic appointments available. Compare prices and book your private health screening."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
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

        {/* Advanced Search/Filter Bar */}
        <section className="container mx-auto px-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  <SelectItem value="biomarkers-desc">Most Biomarkers</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary text-primary-foreground" : ""}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Price Range: £{priceRange[0]} - £{priceRange[1]}</label>
                <Slider
                  value={priceRange}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={5}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                  className="py-2"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="self-end">
                  <X className="h-4 w-4 mr-1" />
                  Reset Filters
                </Button>
              )}
            </div>
          )}
        </section>

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
                          <span>{formatBiomarkerCount(test.biomarker_count)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <TestTube className="h-4 w-4 text-primary" />
                          <span>{test.sample_type || "Blood sample"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        {(() => {
                          const priceInfo = formatPrice(test.price, test.url);
                          if (priceInfo.isLink && priceInfo.url) {
                            return (
                              <a 
                                href={priceInfo.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-lg font-semibold text-primary hover:underline flex items-center gap-1"
                              >
                                {priceInfo.text}
                              </a>
                            );
                          }
                          return (
                            <div className="text-2xl font-bold text-primary">
                              {priceInfo.text}
                            </div>
                          );
                        })()}
                        <div className="flex gap-2">
                          <Link to={`/medichecks/${generateTestSlug(test.test_name)}`}>
                            <Button size="sm">
                              View Details
                            </Button>
                          </Link>
                          {test.url && test.price && (
                            <Button asChild variant="outline" size="sm">
                              <a 
                                href={test.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                Book
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

export default MedichecksTestsCatalogPage;
