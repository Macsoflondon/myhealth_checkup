import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  PROVIDER_DETAILS, 
  PROVIDER_TURNAROUND_TIMES, 
  PROVIDER_COLLECTION_METHODS,
  getAllProviders 
} from "@/constants/providers";
import { 
  ExternalLink, 
  TestTube2, 
  Clock, 
  MapPin, 
  Shield, 
  ChevronRight,
  Building2,
  BarChart3
} from "lucide-react";

interface ProviderStats {
  provider_id: string;
  test_count: number;
  categories: string[];
}

const PROVIDER_CATALOG_ROUTES: Record<string, string> = {
  'goodbody-clinic': '/providers/goodbody-clinic',
  'medichecks': '/providers/medichecks',
  'thriva': '/providers/thriva',
  'randox': '/providers/randox',
  'lola-health': '/providers/lola-health',
  'tuli-health': '/providers/tuli-health',
  'london-medical-laboratory': '/providers/london-medical-laboratory',
};

export default function AllProvidersPage() {
  const { data: providerStats, isLoading } = useQuery({
    queryKey: ['provider-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_tests')
        .select('provider_id, category')
        .eq('is_active', true);

      if (error) throw error;

      const statsMap: Record<string, ProviderStats> = {};
      
      data?.forEach((test) => {
        if (!statsMap[test.provider_id]) {
          statsMap[test.provider_id] = {
            provider_id: test.provider_id,
            test_count: 0,
            categories: [],
          };
        }
        statsMap[test.provider_id].test_count++;
        if (test.category && !statsMap[test.provider_id].categories.includes(test.category)) {
          statsMap[test.provider_id].categories.push(test.category);
        }
      });

      return statsMap;
    },
  });

  const providers = getAllProviders();

  const totalTests = providerStats 
    ? Object.values(providerStats).reduce((sum, p) => sum + p.test_count, 0) 
    : 0;

  const allCategories = providerStats 
    ? [...new Set(Object.values(providerStats).flatMap(p => p.categories))]
    : [];

  return (
    <MainLayout>
      <Helmet>
        <title>UK Health Test Providers | Compare Blood Tests | myhealth checkup</title>
        <meta 
          name="description" 
          content="Browse our network of UKAS-accredited and CQC-registered health test providers. Compare prices, turnaround times, and test options from trusted UK laboratories."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <PageHeading
            title="Our Trusted Providers"
            accent="Compare UK's Leading Health Test Labs"
          />
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse blood tests and health screenings from UKAS-accredited laboratories and CQC-registered clinics
          </p>
          <div className="mt-6">
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/providers/compare">
                <BarChart3 className="h-5 w-5" />
                Compare Providers Side-by-Side
              </Link>
            </Button>
          </div>
          
          {/* Summary Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">{providers.length} Providers</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
              <TestTube2 className="h-5 w-5 text-secondary-foreground" />
              <span className="font-semibold text-foreground">
                {isLoading ? <Skeleton className="h-4 w-12 inline-block" /> : `${totalTests} Tests`}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full">
              <Shield className="h-5 w-5 text-accent-foreground" />
              <span className="font-semibold text-foreground">
                {isLoading ? <Skeleton className="h-4 w-16 inline-block" /> : `${allCategories.length} Categories`}
              </span>
            </div>
          </div>
        </div>

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => {
            const stats = providerStats?.[provider.id];
            const catalogRoute = PROVIDER_CATALOG_ROUTES[provider.id];
            const turnaround = PROVIDER_TURNAROUND_TIMES[provider.id];
            const collectionMethod = PROVIDER_COLLECTION_METHODS[provider.id];
            const details = PROVIDER_DETAILS[provider.id];

            return (
              <Card key={provider.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="h-16 w-32 flex items-center">
                      <img
                        src={provider.logo}
                        alt={`${provider.name} logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    {details?.accreditations && (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {details.accreditations.map((acc) => (
                          <Badge 
                            key={acc} 
                            variant="outline" 
                            className="text-xs bg-background border-primary/30 text-primary"
                          >
                            {acc}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mt-3">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {isLoading ? (
                          <Skeleton className="h-8 w-12 mx-auto" />
                        ) : (
                          stats?.test_count || 0
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">Tests Available</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-[hsl(var(--chart-2))]">
                        {isLoading ? (
                          <Skeleton className="h-8 w-12 mx-auto" />
                        ) : (
                          stats?.categories.length || 0
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">Categories</div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-2 text-sm">
                    {turnaround && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Results in {turnaround}</span>
                      </div>
                    )}
                    {collectionMethod && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{collectionMethod}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    {catalogRoute ? (
                      <Button asChild className="flex-1 group-hover:bg-primary">
                        <Link to={catalogRoute}>
                          Browse Tests
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="flex-1" variant="secondary">
                        Coming Soon
                      </Button>
                    )}
                    <Button asChild variant="outline" size="icon">
                      <a 
                        href={provider.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`Visit ${provider.name} website`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Banner */}
        <div className="mt-12 p-6 bg-muted/30 rounded-xl text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Quality You Can Trust
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All providers in our network are UKAS-accredited and/or CQC-registered, 
            ensuring your tests are processed in ISO 15189 certified laboratories 
            with the highest standards of accuracy and reliability.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
