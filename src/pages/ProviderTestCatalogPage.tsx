import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { detailedProviders } from "@/data/compare/detailedProviders";

interface ProviderTest {
  id: string;
  test_name: string;
  description: string;
  price: number;
  category: string;
  url: string;
  image_url?: string;
}

const ProviderTestCatalogPage = () => {
  const { providerId } = useParams();
  const [tests, setTests] = useState<ProviderTest[]>([]);
  const [filteredTests, setFilteredTests] = useState<ProviderTest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const provider = detailedProviders.find(p => p.id.toLowerCase() === providerId?.toLowerCase());

  useEffect(() => {
    if (providerId) {
      fetchProviderTests();
    }
  }, [providerId]);

  useEffect(() => {
    filterTests();
  }, [tests, searchTerm, selectedCategory]);

  const fetchProviderTests = async () => {
    try {
      setLoading(true);
      
      // First try to get existing tests
      const { data: existingTests, error: fetchError } = await supabase
        .from('provider_tests')
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_active', true);

      if (fetchError) {
        console.error('Fetch error:', fetchError);
      }

      // If no tests exist, trigger scraping
      if (!existingTests || existingTests.length === 0) {
        console.log('No tests found, triggering scraper...');
        const { data: scrapeResult } = await supabase.functions.invoke('provider-scraper', {
          body: { providerId, action: 'scrape' }
        });
        
        console.log('Scrape result:', scrapeResult);
        
        // Fetch tests again after scraping
        const { data: newTests } = await supabase
          .from('provider_tests')
          .select('*')
          .eq('provider_id', providerId)
          .eq('is_active', true);
        
        setTests(newTests || []);
      } else {
        setTests(existingTests);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError('Failed to load tests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = tests;

    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(test => test.category === selectedCategory);
    }

    setFilteredTests(filtered);
  };

  const categories = ["all", ...Array.from(new Set(tests.map(test => test.category)))];

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Provider Not Found</h1>
            <p className="text-muted-foreground">The provider you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6">
          <Link 
            to={`/provider/${providerId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {provider.name}
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Tests - {provider.name}</h1>
          <p className="text-muted-foreground">
            Browse all available tests and health checks offered by {provider.name}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchProviderTests}>Try Again</Button>
          </div>
        )}

        {/* Tests Grid */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg leading-tight">{test.test_name}</CardTitle>
                      <Badge variant="secondary">{test.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {test.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {test.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-primary">
                        £{test.price?.toFixed(2) || 'Price on request'}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <Link to={`/provider/${providerId}/tests/${test.id}`}>
                            View Details
                          </Link>
                        </Button>
                        
                        {test.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a 
                              href={test.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No tests found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProviderTestCatalogPage;