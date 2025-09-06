
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveCompareTable from "@/components/LiveCompareTable";
import { LiveCompareService } from "@/services/LiveCompareService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { providers } from "@/data/compare/providers";
import type { CompareTestData } from "@/services/LiveCompareService";

const CompareTests = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["all"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [tests, setTests] = useState<CompareTestData[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await LiveCompareService.getCategories();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  // Parse query parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    
    if (categoryParam && categories.some(cat => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search, categories]);

  // Fetch tests when filters change
  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      try {
        let results: CompareTestData[] = [];
        
        if (searchTerm.trim()) {
          results = await LiveCompareService.searchTests(searchTerm, selectedProviders);
        } else {
          const categoryName = categories.find(cat => cat.id === selectedCategory)?.name || selectedCategory;
          results = await LiveCompareService.getTestsByCategory(categoryName, selectedProviders);
        }
        
        // Sort results
        if (sortOrder === 'desc') {
          results.sort((a, b) => b.price - a.price);
        } else {
          results.sort((a, b) => a.price - b.price);
        }
        
        setTests(results);
      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [selectedCategory, selectedProviders, searchTerm, sortOrder, categories]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProviderChange = (providerId: string) => {
    if (providerId === "all") {
      setSelectedProviders(["all"]);
    } else {
      setSelectedProviders([providerId]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Compare Health Tests - myhealth checkup | Live Prices from UK Providers</title>
        <meta name="description" content="Compare health tests from Medichecks, Thriva, Randox, and more UK providers. Live pricing, real reviews, and instant comparison across 300+ tests." />
        <link rel="canonical" href="https://myhealthhub.co.uk/compare" />
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-gradient-to-b from-background to-muted/20">
        <section className="py-8 md:py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-health-primary to-health-secondary bg-clip-text text-transparent">
                Compare Health Tests
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Compare live prices and features from {providers.length} trusted UK providers. {tests.length} results found.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange("all")}
                className={cn(
                  "rounded-full",
                  selectedCategory === "all" && "bg-health-primary text-white"
                )}
              >
                All Tests
              </Button>
              {categories.slice(0, 8).map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "rounded-full",
                    selectedCategory === category.id && "bg-health-primary text-white"
                  )}
                >
                  {category.name} 
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Search and Filter Row */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for tests, conditions, or biomarkers..."
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedProviders[0]} onValueChange={handleProviderChange}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Providers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Providers</SelectItem>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Price: Low to High</SelectItem>
                        <SelectItem value="desc">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-health-primary" />
                <span className="ml-2 text-muted-foreground">Loading tests...</span>
              </div>
            )}

            <LiveCompareTable tests={tests} isLoading={isLoading} selectedCategory={selectedCategory} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompareTests;
