import { useState, useMemo } from "react";
import QuizCTABanner from "@/components/sections/QuizCTABanner";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "@/lib/router-compat";
import MainLayout from "@/layouts/MainLayout";
import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { 
  PROVIDER_DETAILS, 
  PROVIDER_TURNAROUND_TIMES, 
  PROVIDER_COLLECTION_METHODS,
  getAllProviders,
  getProviderLogo,
  getProviderName
} from "@/constants/providers";
import { 
  TestTube2, 
  Clock, 
  MapPin, 
  Shield, 
  Check,
  X,
  ArrowRight,
  BarChart3,
  List
} from "lucide-react";

interface ProviderTestData {
  id: string;
  provider_id: string;
  test_name: string;
  price: number | null;
  category: string | null;
  biomarker_count: number | null;
  home_kit_available: boolean | null;
  clinic_visit_available: boolean | null;
  sample_type: string | null;
  collection_method: string | null;
  turnaround_days_text: string | null;
  turnaround_raw: string | null;
  lab_ukas_accredited: boolean | null;
  lab_cqc_regulated: boolean | null;
  lab_iso15189: boolean | null;
}

interface ComparisonGroupRow {
  provider_test_id: string;
  provider_id: string;
  test_name: string;
  category: string | null;
  group_key: string;
  group_provider_count: number;
}

interface ProviderStats {
  provider_id: string;
  test_count: number;
  categories: string[];
  min_price: number | null;
  max_price: number | null;
  avg_price: number | null;
}

/** Most frequently occurring non-empty value across a provider's live rows. */
const modeValue = (values: Array<string | null | undefined>): string | null => {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    const clean = (value ?? "").trim();
    if (!clean) return;
    counts.set(clean, (counts.get(clean) ?? 0) + 1);
  });
  if (counts.size === 0) return null;
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
};

export default function ProviderComparisonPage() {
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const providers = getAllProviders();

  // Fetch all standalone (non add-on) provider tests
  const { data: allTests, isLoading } = useQuery({
    queryKey: ['provider-comparison-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_tests')
        .select(
          'id, provider_id, test_name, price, category, biomarker_count, home_kit_available, clinic_visit_available, sample_type, collection_method, turnaround_days_text, turnaround_raw, lab_ukas_accredited, lab_cqc_regulated, lab_iso15189'
        )
        .eq('is_active', true)
        .or('is_addon.is.null,is_addon.eq.false')
        .order('test_name');

      if (error) throw error;
      return (data ?? []) as ProviderTestData[];
    },
  });

  // Cross-provider comparable groups, computed in the database
  const { data: comparisonGroups } = useQuery({
    queryKey: ['comparison-test-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comparison_test_groups')
        .select('provider_test_id, provider_id, test_name, category, group_key, group_provider_count')
        .gte('group_provider_count', 2);

      if (error) throw error;
      return (data ?? []).filter(
        (row): row is ComparisonGroupRow =>
          Boolean(row.provider_test_id) && Boolean(row.provider_id) && Boolean(row.group_key)
      );
    },
  });

  const testsById = useMemo(() => {
    const map = new Map<string, ProviderTestData>();
    (allTests ?? []).forEach((test) => map.set(test.id, test));
    return map;
  }, [allTests]);

  // Calculate stats per provider
  const providerStats = useMemo(() => {
    if (!allTests) return {};
    
    const stats: Record<string, ProviderStats> = {};
    
    allTests.forEach((test) => {
      if (!stats[test.provider_id]) {
        stats[test.provider_id] = {
          provider_id: test.provider_id,
          test_count: 0,
          categories: [],
          min_price: null,
          max_price: null,
          avg_price: null,
        };
      }
      
      const s = stats[test.provider_id];
      s.test_count++;
      
      if (test.category && !s.categories.includes(test.category)) {
        s.categories.push(test.category);
      }
      
      if (test.price !== null) {
        if (s.min_price === null || test.price < s.min_price) s.min_price = test.price;
        if (s.max_price === null || test.price > s.max_price) s.max_price = test.price;
      }
    });

    // Calculate averages
    Object.keys(stats).forEach((providerId) => {
      const providerTests = allTests.filter(t => t.provider_id === providerId && t.price !== null);
      if (providerTests.length > 0) {
        const total = providerTests.reduce((sum, t) => sum + (t.price || 0), 0);
        stats[providerId].avg_price = total / providerTests.length;
      }
    });

    return stats;
  }, [allTests]);

  /** Real per-test values rolled up per provider, with the static list only as a fallback. */
  const providerFacts = useMemo(() => {
    const facts: Record<
      string,
      { turnaround: string; collection: string; accreditations: string[] }
    > = {};

    providers.forEach((provider) => {
      const rows = (allTests ?? []).filter((t) => t.provider_id === provider.id);

      const turnaround =
        modeValue(rows.map((t) => t.turnaround_days_text)) ??
        modeValue(rows.map((t) => t.turnaround_raw)) ??
        PROVIDER_TURNAROUND_TIMES[provider.id] ??
        "N/A";

      const collection =
        modeValue(rows.map((t) => t.collection_method)) ??
        modeValue(rows.map((t) => t.sample_type)) ??
        PROVIDER_COLLECTION_METHODS[provider.id] ??
        "N/A";

      const liveAccreditations: string[] = [];
      if (rows.some((t) => t.lab_ukas_accredited)) liveAccreditations.push("UKAS accredited");
      if (rows.some((t) => t.lab_cqc_regulated)) liveAccreditations.push("CQC Regulated");
      if (rows.some((t) => t.lab_iso15189)) liveAccreditations.push("ISO 15189");

      facts[provider.id] = {
        turnaround,
        collection,
        accreditations:
          liveAccreditations.length > 0
            ? liveAccreditations
            : PROVIDER_DETAILS[provider.id]?.accreditations ?? [],
      };
    });

    return facts;
  }, [allTests, providers]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!allTests) return [];
    return [...new Set(allTests.map(t => t.category).filter(Boolean))] as string[];
  }, [allTests]);

  /**
   * Build side-by-side rows from the database-side grouping, keeping only groups
   * where at least two of the selected providers offer a comparable test.
   */
  const groupedTests = useMemo(() => {
    if (!comparisonGroups || selectedProviders.length < 2) return [];

    const groups = new Map<
      string,
      { label: string; byProvider: Record<string, ProviderTestData> }
    >();

    comparisonGroups.forEach((row) => {
      if (!selectedProviders.includes(row.provider_id)) return;
      const test = testsById.get(row.provider_test_id);
      if (!test) return;
      if (categoryFilter !== "all" && test.category !== categoryFilter) return;

      const existing = groups.get(row.group_key) ?? {
        label: row.test_name,
        byProvider: {} as Record<string, ProviderTestData>,
      };
      // Prefer the shortest name in the group as the display label
      if (row.test_name.length < existing.label.length) existing.label = row.test_name;
      existing.byProvider[row.provider_id] = test;
      groups.set(row.group_key, existing);
    });

    return [...groups.entries()]
      .filter(([, group]) => Object.keys(group.byProvider).length >= 2)
      .sort(([, a], [, b]) => a.label.localeCompare(b.label));
  }, [comparisonGroups, testsById, selectedProviders, categoryFilter]);

  const toggleProvider = (providerId: string) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        return prev.filter(id => id !== providerId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, providerId];
    });
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return `£${price.toFixed(2)}`;
  };

  return (
    <MainLayout>
      <Helmet>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <PageHeading
            title="Compare Providers"
            accent="Side-by-Side Analysis"
          />
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Select 2-4 providers to compare their test offerings, prices, and capabilities
          </p>
        </div>

        {/* Provider Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Select Providers to Compare (2-4)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {providers.map((provider) => {
                const isSelected = selectedProviders.includes(provider.id);
                const stats = providerStats[provider.id];
                
                return (
                  <div
                    key={provider.id}
                    onClick={() => toggleProvider(provider.id)}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }
                      ${selectedProviders.length >= 4 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={isSelected}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          className="h-8 w-auto object-contain mb-2"
                        />
                        <p className="font-medium text-sm truncate">{provider.name}</p>
                        {isLoading ? (
                          <Skeleton className="h-4 w-16 mt-1" />
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {stats?.test_count || 0} tests
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedProviders.length >= 2 ? (
          <>
            {/* Tabs for Overview vs Test Comparison */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Compare Tests
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold text-muted-foreground">Feature</th>
                        {selectedProviders.map((providerId) => (
                          <th key={providerId} className="p-4 text-center min-w-[180px]">
                            <div className="flex flex-col items-center gap-2">
                              <img
                                src={getProviderLogo(providerId)}
                                alt={getProviderName(providerId)}
                                className="h-10 w-auto object-contain"
                              />
                              <span className="font-semibold">{getProviderName(providerId)}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Tests Available */}
                      <tr className="border-b bg-muted/30">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <TestTube2 className="h-4 w-4 text-primary" />
                            Tests Available
                          </div>
                        </td>
                        {selectedProviders.map((providerId) => (
                          <td key={providerId} className="p-4 text-center">
                            <span className="text-2xl font-bold text-primary">
                              {providerStats[providerId]?.test_count || 0}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Categories */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">Categories Covered</td>
                        {selectedProviders.map((providerId) => (
                          <td key={providerId} className="p-4 text-center">
                            <span className="text-lg font-semibold">
                              {providerStats[providerId]?.categories.length || 0}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Price Range */}
                      <tr className="border-b bg-muted/30">
                        <td className="p-4 font-medium">Price Range</td>
                        {selectedProviders.map((providerId) => {
                          const stats = providerStats[providerId];
                          return (
                            <td key={providerId} className="p-4 text-center">
                              {stats && stats.min_price !== null ? (
                                <span className="text-sm">
                                  {formatPrice(stats.min_price)} - {formatPrice(stats.max_price)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Average Price */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">Average Price</td>
                        {selectedProviders.map((providerId) => (
                          <td key={providerId} className="p-4 text-center">
                            <span className="font-semibold text-primary">
                              {formatPrice(providerStats[providerId]?.avg_price || null)}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Turnaround Time */}
                      <tr className="border-b bg-muted/30">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Turnaround Time
                          </div>
                        </td>
                        {selectedProviders.map((providerId) => (
                          <td key={providerId} className="p-4 text-center">
                            <span className="text-sm">
                              {PROVIDER_TURNAROUND_TIMES[providerId] || "N/A"}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Collection Method */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Collection Method
                          </div>
                        </td>
                        {selectedProviders.map((providerId) => (
                          <td key={providerId} className="p-4 text-center">
                            <span className="text-sm">
                              {PROVIDER_COLLECTION_METHODS[providerId] || "N/A"}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Accreditations */}
                      <tr className="border-b bg-muted/30">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            Accreditations
                          </div>
                        </td>
                        {selectedProviders.map((providerId) => {
                          const details = PROVIDER_DETAILS[providerId];
                          return (
                            <td key={providerId} className="p-4 text-center">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {details?.accreditations?.map((acc) => (
                                  <Badge key={acc} variant="outline" className="text-xs">
                                    {acc}
                                  </Badge>
                                )) || <span className="text-muted-foreground">N/A</span>}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* View Catalog */}
                      <tr>
                        <td className="p-4 font-medium">Browse Tests</td>
                        {selectedProviders.map((providerId) => (
                          <td key={providerId} className="p-4 text-center">
                            <Button asChild size="sm">
                              <Link to={`/provider/${providerId}/tests`}>
                                View Catalog
                              </Link>
                            </Button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Test-by-Test Tab */}
              <TabsContent value="tests" className="mt-6">
                {/* Category Filter */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium text-sm">Filter by category:</span>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {groupedTests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-4 font-semibold">Test Name</th>
                          {selectedProviders.map((providerId) => (
                            <th key={providerId} className="p-4 text-center min-w-[160px]">
                              <img
                                src={getProviderLogo(providerId)}
                                alt={getProviderName(providerId)}
                                className="h-8 w-auto object-contain mx-auto"
                              />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {groupedTests.map(([groupKey, group], index) => (
                          <tr key={groupKey} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                            <td className="p-4">
                              <span className="font-medium">{group.label}</span>
                            </td>
                            {selectedProviders.map((providerId) => {
                              const test = group.byProvider[providerId];
                              return (
                                <td key={providerId} className="p-4 text-center">
                                  {test ? (
                                    <div className="space-y-1">
                                      <div className="font-bold text-primary">
                                        {formatPrice(test.price)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {test.biomarker_count || 0} biomarkers
                                      </div>
                                      <div className="flex justify-center gap-2">
                                        {test.home_kit_available && (
                                          <Badge variant="outline" className="text-xs">Home</Badge>
                                        )}
                                        {test.clinic_visit_available && (
                                          <Badge variant="outline" className="text-xs">Clinic</Badge>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center">
                                      <X className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <TestTube2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No matching tests found</h3>
                    <p className="text-muted-foreground">
                      {categoryFilter !== "all" 
                        ? "Try selecting a different category or 'All Categories'"
                        : "These providers don't have overlapping tests to compare"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select at least 2 providers</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose 2-4 providers from the list above to see a detailed side-by-side comparison of their test offerings, prices, and features.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to="/trusted-providers">
              ← Back to All Providers
            </Link>
          </Button>
        </div>
      </div>
      <section className="bg-white py-12 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <QuizCTABanner />
        </div>
      </section>
    </MainLayout>
  );
}
