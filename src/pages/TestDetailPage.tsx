import { useEffect, useState } from "react";
import { useParams, Link } from "@/lib/router-compat";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Clock, Shield, TestTube, Users, CheckCircle, AlertCircle, Home, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getProviderRating } from "@/constants/providerRatings";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { TestProviderPriceTable } from "@/components/compare/TestProviderPriceTable";
import { buildProviderBookingUrl, externalLinkProps } from "@/utils/urlTracking";
import { getProviderLogo, normalizeProviderId } from "@/constants/providers";
import { resolveTurnaround, resolveCollection } from '@/lib/resolve-test-fields';
import { logger } from "@/lib/logger";

interface TestDetail {
  id: string;
  test_name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  url: string | null;
  image_url?: string | null;
  provider_id: string;
  biomarker_count?: number | null;
  turnaround_days_text?: string | null;
  turnaround_raw?: string | null;
  collection_method?: string | null;
  sample_type?: string | null;
  home_kit_available?: boolean | null;
  clinic_visit_available?: boolean | null;
  lab_ukas_accredited?: boolean | null;
  lab_cqc_regulated?: boolean | null;
  lab_iso15189?: boolean | null;
}

/** Row-level values win; the static provider lookup is only a last resort. */
interface ProviderTestOption {
  id: string;
  providerId: string;
  providerName: string;
  price: number;
  turnaroundTime: string;
  collectionMethod: string;
  biomarkerCount?: number;
  url?: string;
  rating?: number;
  reviews?: string;
}

const TestDetailPage = () => {
  const { providerId, testId } = useParams();
  const canonicalProviderId = normalizeProviderId(providerId || '');
  const [test, setTest] = useState<TestDetail | null>(null);
  const [otherProviders, setOtherProviders] = useState<ProviderTestOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const provider = detailedProviders.find(p => 
    p.id.toLowerCase() === canonicalProviderId ||
    p.id.toLowerCase().startsWith(canonicalProviderId + '-')
  );

  // Provider ratings now imported from shared constants

  useEffect(() => {
    if (testId) {
      fetchTestDetail();
    }
  }, [testId]);

  const fetchTestDetail = async () => {
    try {
      setLoading(true);
      
      // Fetch the main test
      const { data, error: fetchError } = await supabase
        .from('provider_tests')
        .select('*')
        .eq('id', testId ?? '')
        .eq('is_active', true)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setTest(data);

      // Verified cross-provider matches only, via the comparison_test_groups view
      const { data: ownGroup } = await supabase
        .from('comparison_test_groups')
        .select('group_key')
        .eq('provider_test_id', testId ?? '')
        .maybeSingle();

      const groupKey = ownGroup?.group_key;

      if (groupKey) {
        const { data: siblings } = await supabase
          .from('comparison_test_groups')
          .select('provider_test_id, provider_id')
          .eq('group_key', groupKey)
          .neq('provider_test_id', testId ?? '');

        const siblingIds = (siblings ?? [])
          .map((row) => row.provider_test_id)
          .filter((id): id is string => Boolean(id));

        if (siblingIds.length > 0) {
          const { data: siblingTests } = await supabase
            .from('provider_tests')
            .select('*')
            .in('id', siblingIds)
            .eq('is_active', true);

          const providerOptions: ProviderTestOption[] = (siblingTests ?? []).map((t) => {
            const provRating = getProviderRating(t.provider_id);
            return {
              id: t.id,
              providerId: t.provider_id,
              providerName: detailedProviders.find(p => p.id === t.provider_id)?.name || t.provider_id,
              price: t.price || 0,
              turnaroundTime: resolveTurnaround(t, t.provider_id),
              collectionMethod: resolveCollection(t, t.provider_id),
              biomarkerCount: t.biomarker_count || undefined,
              url: t.url || undefined,
              rating: provRating?.rating,
              reviews: provRating?.reviewsFormatted
            };
          });
          setOtherProviders(providerOptions);
        }
      }
    } catch (error) {
      logger.error('Error fetching test detail:', error);
      setError('Failed to load test details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-foreground">Provider Not Found</h1>
            <p className="text-muted-foreground mb-6">The provider you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/compare">Browse All Tests</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading test details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">Test Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The test you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link to={`/provider/${providerId}/tests`}>Back to Tests</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentProviderRating = getProviderRating(canonicalProviderId);

  const accreditationBadges: string[] = [
    test.lab_ukas_accredited ? 'UKAS Accredited Lab' : null,
    test.lab_cqc_regulated ? 'CQC Regulated' : null,
    test.lab_iso15189 ? 'ISO 15189 Certified' : null,
  ].filter((label): label is string => Boolean(label));
  const bookingUrl = test.url ? buildProviderBookingUrl(test.url, canonicalProviderId, test.test_name) : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${test.test_name} | myhealth checkup`.slice(0, 60)}</title>
        <meta
          name="description"
          content={`Compare the ${test.test_name} across accredited UK providers${
            test.price != null ? ` from £${test.price.toFixed(2)}` : ""
          }. View biomarkers, sample method, turnaround and pricing side-by-side.${
            provider?.name ? ` Available from ${provider.name}.` : ""
          }`.slice(0, 158)}
        />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/provider/${providerId}/tests/${testId}`} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="myhealth checkup" />
        <meta property="og:title" content={`${test.test_name} | myhealth checkup`.slice(0, 60)} />
        <meta property="og:description" content={`Compare the ${test.test_name} across accredited UK providers${test.price != null ? ` from £${test.price.toFixed(2)}` : ""}.`} />
        <meta property="og:url" content={`https://myhealthcheckup.co.uk/provider/${providerId}/tests/${testId}`} />
        <meta property="og:locale" content="en_GB" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": test.test_name,
          "description": test.description || `${test.test_name} private health test available from accredited UK providers.`,
          "brand": provider?.name ? { "@type": "Brand", "name": provider.name } : undefined,
          "image": test.image_url || "https://myhealthcheckup.co.uk/og-image.png",
          "category": test.category || "Health Test",
          ...(test.price != null ? {
            "offers": {
              "@type": "Offer",
              "priceCurrency": "GBP",
              "price": test.price.toFixed(2),
              "availability": "https://schema.org/InStock",
              "url": `https://myhealthcheckup.co.uk/provider/${providerId}/tests/${testId}`,
              ...(provider?.name ? { "seller": { "@type": "Organization", "name": provider.name } } : {})
            }
          } : {})
        })}</script>
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          <Link to="/compare" className="text-muted-foreground hover:text-primary transition-colors">
            Compare Tests
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to={`/provider/${providerId}`} className="text-muted-foreground hover:text-primary transition-colors">
            {provider.name}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{test.test_name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Header */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{test.test_name}</h1>
                {test.category && (
                  <Badge variant="secondary" className="text-sm">
                    {test.category}
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-muted-foreground mb-4">
                {test.description || `Comprehensive ${test.test_name.toLowerCase()} with professional analysis.`}
              </p>
            </div>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This comprehensive {test.test_name.toLowerCase()} includes detailed analysis 
                  and professional interpretation of your results from {provider.name}.
                </p>
                
                <div className="grid sm:grid-cols-3 gap-3">
                  {accreditationBadges.map((label) => (
                    <div key={label} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}

                  <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                    <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-sm font-medium">{resolveTurnaround(test, canonicalProviderId)}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                    {test.home_kit_available && !test.clinic_visit_available ? (
                      <Home className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Building2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{resolveCollection(test, canonicalProviderId)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Who Should Take This Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Who Should Take This Test?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Anyone looking to monitor their overall health</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Those with specific symptoms they want to investigate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>People seeking peace of mind about their health</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Those who want to track changes in their biomarkers over time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose {provider.name}?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Accurate and reliable results from {provider.name}</span>
                  </li>
                  {provider.accreditation && (
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{provider.accreditation}</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Professional medical interpretation included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Secure online results portal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Expert customer support available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Compare Prices Section */}
            {otherProviders.length > 0 && (
              <TestProviderPriceTable
                testName={test.test_name}
                providers={[
                  {
                    id: test.id,
                    providerId: providerId || '',
                    providerName: provider.name,
                    price: test.price || 0,
                    turnaroundTime: resolveTurnaround(test, canonicalProviderId),
                    collectionMethod: resolveCollection(test, canonicalProviderId),
                    biomarkerCount: test.biomarker_count || undefined,
                    url: test.url || undefined,
                    rating: currentProviderRating?.rating,
                    reviews: currentProviderRating?.reviewsFormatted
                  },
                  ...otherProviders
                ]}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-center">Book This Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    £{test.price?.toFixed(2) || 'Price on request'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Includes all fees and analysis
                  </p>
                </div>
                
                <div className="space-y-3">
                  {bookingUrl ? (
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
                      <a href={bookingUrl} {...externalLinkProps}>
                        Book
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full" asChild>
                      <Link to={`/provider/${providerId}`}>
                        View Provider
                      </Link>
                    </Button>
                  )}
                  
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/compare">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Compare All Tests
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Provider Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getProviderLogo(canonicalProviderId)} 
                        alt={provider.name}
                        loading="lazy"
                        decoding="async"
                        className="h-8 w-8 object-contain"
                      />
                      <span className="font-medium">{provider.name}</span>
                    </div>
                    {provider.accreditation && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>{provider.accreditation}</span>
                      </div>
                    )}
                    {provider.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium">Phone:</span>
                        <a href={`tel:${provider.phone}`} className="hover:text-primary">
                          {provider.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestDetailPage;
