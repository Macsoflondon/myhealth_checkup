import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { logger } from "@/lib/logger";
import { providersApi } from "@/api";
import type { ProviderTestData } from "@/api/supabase/providers.api";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ProviderTestCard from "@/components/providers/ProviderTestCard";
import ProviderTestDetailModal from "@/components/providers/ProviderTestDetailModal";

const ProviderTestCatalogPage = () => {
  const { providerId } = useParams();
  const [tests, setTests] = useState<ProviderTestData[]>([]);
  const [filteredTests, setFilteredTests] = useState<ProviderTestData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<ProviderTestData | null>(null);

  const provider = detailedProviders.find((p) => {
    const lowerId = p.id.toLowerCase();
    const lowerProviderId = providerId?.toLowerCase() || "";
    return lowerId === lowerProviderId || lowerId.startsWith(lowerProviderId + "-");
  });

  const resolvedProviderId = provider?.id || providerId;

  useEffect(() => {
    if (resolvedProviderId) {
      fetchProviderTests();
    }
  }, [resolvedProviderId]);

  useEffect(() => {
    filterTests();
  }, [tests, searchTerm, selectedCategory]);

  // Map from URL/detailed-provider IDs to actual DB provider_ids
  const DB_PROVIDER_MAP: Record<string, string> = {
    "randox-health": "randox",
    "goodbody": "goodbody-clinic",
    "tuli-health": "tuli-health",
  };

  const fetchProviderTests = async () => {
    if (!resolvedProviderId) return;
    try {
      setLoading(true);
      // Try multiple ID variants to find tests
      const idsToTry = [
        resolvedProviderId,
        DB_PROVIDER_MAP[resolvedProviderId],
        providerId,
        providerId ? DB_PROVIDER_MAP[providerId] : undefined,
      ].filter((id): id is string => !!id && id !== resolvedProviderId || id === resolvedProviderId);

      let finalData: ProviderTestData[] = [];
      for (const id of [...new Set(idsToTry)]) {
        const { data } = await providersApi.getProviderCatalog(id);
        if (data && data.length > 0) {
          finalData = data;
          break;
        }
      }
      setTests(finalData);
    } catch (error) {
      logger.error("Error fetching tests:", error);
      setError("Failed to load tests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = tests;
    if (searchTerm) {
      filtered = filtered.filter(
        (test) =>
          test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((test) => test.category === selectedCategory);
    }
    setFilteredTests(filtered);
  };

  const categories = ["all", ...Array.from(new Set(tests.map((test) => test.category).filter(Boolean)))];

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#081129]">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Provider Not Found</h1>
            <p className="text-gray-300">The provider you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <PageBreadcrumb
          segments={[
            { label: "Home", href: "/" },
            { label: "Providers", href: "/trusted-providers" },
            { label: provider.name },
          ]}
          backLabel="Back to Providers"
        />

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#081129] mb-2">
            Available Tests – {provider.name}
          </h1>
          <p className="text-gray-500">
            Browse all available tests and health checks offered by {provider.name}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-700"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading tests...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchProviderTests}>Try Again</Button>
          </div>
        )}

        {/* Tests Grid */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-500">
              {filteredTests.length} test{filteredTests.length !== 1 ? "s" : ""} found
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTests.map((test) => (
                <ProviderTestCard
                  key={test.id}
                  test={test}
                  providerName={provider.name}
                  onClick={() => setSelectedTest(test)}
                />
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">No tests found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Detail Modal */}
      <ProviderTestDetailModal
        test={selectedTest}
        providerName={provider.name}
        open={!!selectedTest}
        onOpenChange={(open) => {
          if (!open) setSelectedTest(null);
        }}
      />
    </div>
  );
};

export default ProviderTestCatalogPage;
