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
  Clock, 
  TestTube, 
  ChevronRight,
  Home,
  Building2,
  Shield,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

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
        .eq("provider_id", "medichecks")
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
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center p-2">
                <img
                  src="/lovable-uploads/provider-medichecks-new-v3.png"
                  alt="Medichecks"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <PageHeading title="Medichecks" />
                <p className="text-muted-foreground mt-1">
                  UK's leading home blood testing service
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4 text-primary" />
                <span>Home test kits</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Clinic appointments</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>UKAS Accredited</span>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b py-4">
          <div className="container mx-auto px-4 space-y-4">
            {/* Search and Sort Row */}
            <div className="flex flex-col sm:flex-row gap-3">
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

            {/* Category Pills */}
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
                          <Link to={`/medichecks/${generateTestSlug(test.test_name)}`}>
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
              <SectionHeading title="About" gradientText="Medichecks" className="mb-4" />
              <p className="text-muted-foreground mb-6">
                Medichecks is the UK's leading provider of home blood testing, offering 
                a comprehensive range of health checks. Choose between convenient home 
                finger-prick kits or book a nurse appointment for venous blood collection.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  UKAS Accredited
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  2-3 Day Results
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Home className="h-4 w-4 mr-2" />
                  Home Kits Available
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default MedichecksTestsCatalogPage;
