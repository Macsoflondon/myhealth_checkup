import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet-async";
import { 
  CheckCircle2, Clock, Home, Building2, ExternalLink, ArrowLeft, 
  FlaskConical, Info, AlertTriangle, Stethoscope, HeartPulse, Shield 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SimilarTestsSection from "@/components/tests/SimilarTestsSection";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProviderConfig } from "@/constants/providerTestPageConfig";
import { supabase } from "@/integrations/supabase/client";
import { useUrlValidation, getProviderFallbackUrl } from "@/hooks/useUrlValidation";

export interface ProviderTestData {
  id: string;
  test_name: string;
  category: string;
  description: string;
  url: string;
  price: number | null;
  provider_test_id?: string;
  biomarkers_list?: string[] | null;
  biomarker_count?: number | null;
  image_url?: string | null;
  is_addon?: boolean;
  original_price?: number | null;
  discount_percentage?: number | null;
  symptoms?: string[] | null;
  conditions?: string[] | null;
  who_should_test?: string | null;
}

interface BiomarkerInfo {
  biomarker_name: string;
  description: string;
  category: string;
}

interface ProviderTestDetailTemplateProps {
  test: ProviderTestData | null;
  providerConfig: ProviderConfig;
  isLoading: boolean;
  testId: string;
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white py-12">
    <div className="container mx-auto px-4 max-w-5xl">
      <Skeleton className="h-8 w-32 mb-8" />
      <Skeleton className="h-12 w-3/4 mb-4" />
      <Skeleton className="h-64 w-full mb-8" />
    </div>
  </div>
);

// Not found component
const NotFoundState = ({ providerName }: { providerName: string }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 bg-primary-foreground">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Test Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The {providerName} test you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/compare">Browse All Tests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Booking Button Component with URL validation and fallback
const BookingButton = ({ 
  testUrl, 
  providerConfig 
}: { 
  testUrl: string; 
  providerConfig: ProviderConfig;
}) => {
  const { isValid, isLoading } = useUrlValidation(testUrl);
  const fallbackUrl = getProviderFallbackUrl(providerConfig.id);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button 
        size="lg" 
        className="w-full" 
        asChild
      >
        <a 
          href={testUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          {providerConfig.ctaButtonText}
        </a>
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        You'll be redirected to {providerConfig.name}'s secure booking platform
      </p>

      {/* Fallback option */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-center text-muted-foreground mb-2">
          Link not working?
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          asChild
        >
          <a 
            href={fallbackUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center text-xs"
          >
            Browse all {providerConfig.name} tests
          </a>
        </Button>
      </div>
    </div>
  );
};

// Biomarkers Section Component
const BiomarkersSection = ({ biomarkers, biomarkerCount }: { biomarkers: string[] | null | undefined; biomarkerCount: number | null | undefined }) => {
  const [biomarkerDetails, setBiomarkerDetails] = useState<Record<string, BiomarkerInfo>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBiomarkerDetails = async () => {
      if (!biomarkers || biomarkers.length === 0) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('biomarkers_library')
          .select('biomarker_name, description, category')
          .in('biomarker_name', biomarkers);
        
        if (!error && data) {
          const details: Record<string, BiomarkerInfo> = {};
          data.forEach((item) => {
            details[item.biomarker_name.toLowerCase()] = item;
          });
          setBiomarkerDetails(details);
        }
      } catch (err) {
        console.error('Error fetching biomarker details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBiomarkerDetails();
  }, [biomarkers]);

  if (!biomarkers || biomarkers.length === 0) {
    return null;
  }

  const displayCount = biomarkerCount || biomarkers.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Biomarkers Tested ({displayCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This test analyses the following biomarkers. Hover over each for more information.
        </p>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <TooltipProvider>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {biomarkers.map((biomarker, index) => {
                const details = biomarkerDetails[biomarker.toLowerCase()];
                
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors cursor-help">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm truncate">{biomarker}</span>
                        {details && (
                          <Info className="h-3 w-3 text-muted-foreground shrink-0 ml-auto" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      {details ? (
                        <div>
                          <p className="font-semibold">{details.biomarker_name}</p>
                          <p className="text-xs text-muted-foreground">{details.category}</p>
                          <p className="text-sm mt-1">{details.description}</p>
                        </div>
                      ) : (
                        <p>{biomarker}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
};

// Symptoms Section Component
const SymptomsSection = ({ symptoms }: { symptoms: string[] | null | undefined }) => {
  if (!symptoms || symptoms.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Symptoms This Test Addresses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {symptoms.map((symptom, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
              <span className="text-sm">{symptom}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// Conditions Section Component
const ConditionsSection = ({ conditions }: { conditions: string[] | null | undefined }) => {
  if (!conditions || conditions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          Conditions This Test Can Detect
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {conditions.map((condition, i) => (
            <li key={i} className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary mt-1 shrink-0" />
              <span className="text-sm">{condition}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// Add-on Warning Component
const AddonWarning = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold text-amber-800">Add-on Test</p>
        <p className="text-sm text-amber-700">
          This biomarker test can only be added to another blood test panel from Lola Health. 
          Browse their test packages to add this biomarker.
        </p>
      </div>
    </div>
  </div>
);

export default function ProviderTestDetailTemplate({
  test,
  providerConfig,
  isLoading,
  testId,
}: ProviderTestDetailTemplateProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!test) {
    return <NotFoundState providerName={providerConfig.name} />;
  }

  // Parse biomarkers from JSON if needed
  const biomarkers = Array.isArray(test.biomarkers_list) 
    ? test.biomarkers_list 
    : null;

  const pageTitle = `${test.test_name} - ${providerConfig.name} Blood Test | myhealth checkup`;
  const pageDescription = `${test.description} Book your ${test.test_name} blood test with ${providerConfig.name} through myhealth checkup. ${providerConfig.aboutText}`;

  const hasDiscount = test.original_price && test.original_price > (test.price || 0);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`${providerConfig.canonicalBase}/${testId}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 bg-primary-foreground">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb with Back Button */}
          <PageBreadcrumb 
            segments={[
              { label: "Home", href: "/" },
              { label: "Compare Tests", href: "/compare" },
              { label: providerConfig.name, href: `/providers/${providerConfig.id}` },
              { label: test.test_name }
            ]}
            backLabel="Back to Compare"
          />

          {/* Provider Badge */}
          <div className="mb-6">
            <img 
              src={providerConfig.logo} 
              alt={providerConfig.name} 
              className="h-12 mb-4"
            />
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">{providerConfig.badgeText}</Badge>
              {test.is_addon && (
                <Badge variant="outline" className="border-amber-500 text-amber-700">
                  Add-on
                </Badge>
              )}
            </div>
          </div>

          {/* Product Image */}
          {test.image_url && (
            <div className="mb-6">
              <img 
                src={test.image_url} 
                alt={test.test_name}
                className="rounded-lg max-w-xs h-auto"
              />
            </div>
          )}

          {/* Test Header */}
          <h1 className="text-4xl font-bold mb-4">{test.test_name}</h1>
          <p className="text-xl text-muted-foreground mb-8">{test.description}</p>

          {/* Add-on Warning */}
          {test.is_addon && <AddonWarning />}

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About This Test */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Blood Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The {test.test_name} from {providerConfig.name} is a {providerConfig.aboutText}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    {providerConfig.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold">{feature.title}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Biomarkers Section */}
              <BiomarkersSection 
                biomarkers={biomarkers} 
                biomarkerCount={test.biomarker_count} 
              />

              {/* Symptoms Section */}
              <SymptomsSection symptoms={test.symptoms} />

              {/* Conditions Section */}
              <ConditionsSection conditions={test.conditions} />

              {/* Sample Collection Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Sample Collection Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {providerConfig.sampleOptions.map((option, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-start space-x-4">
                        {option.icon === 'home' ? (
                          <Home className="h-6 w-6 text-primary mt-1" />
                        ) : (
                          <Building2 className="h-6 w-6 text-primary mt-1" />
                        )}
                        <div>
                          <h3 className="font-semibold mb-2">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Why Choose Provider */}
              <Card>
                <CardHeader>
                  <CardTitle>{providerConfig.whyChoose.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {providerConfig.whyChoose.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span><strong>{item.bold}</strong> {item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Book This Test</CardTitle>
                  <p className="text-sm text-muted-foreground">{test.category}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {test.price && (
                    <>
                      <div className="text-center py-2">
                        <span className="text-3xl font-bold text-primary">
                          £{test.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-lg text-muted-foreground line-through ml-2">
                              £{test.original_price?.toFixed(2)}
                            </span>
                            {test.discount_percentage && (
                              <Badge className="ml-2 bg-green-600 text-white hover:bg-green-700">
                                {test.discount_percentage}% OFF
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Turnaround Time</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-semibold">{providerConfig.turnaround}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <BookingButton 
                    testUrl={test.url}
                    providerConfig={providerConfig}
                  />
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Sample Type</p>
                    <p className="text-muted-foreground">{providerConfig.quickInfo.sampleType}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">Lab Processing</p>
                    <p className="text-muted-foreground">{providerConfig.quickInfo.labProcessing}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">Results Delivery</p>
                    <p className="text-muted-foreground">{providerConfig.quickInfo.resultsDelivery}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">Support</p>
                    {providerConfig.quickInfo.supportPhone && (
                      <p className="text-muted-foreground">Phone: {providerConfig.quickInfo.supportPhone}</p>
                    )}
                    {providerConfig.quickInfo.supportEmail && (
                      <p className="text-muted-foreground">Email: {providerConfig.quickInfo.supportEmail}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Tests Section */}
          <div className="mb-12">
            <SimilarTestsSection 
              category={test.category}
              currentTestName={test.test_name}
              currentProvider={providerConfig.id}
            />
          </div>

          {/* CTA Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8 text-center">
              <SectionHeading 
                title="Ready to Take Control" 
                gradientText="of Your Health?" 
                className="mb-4"
              />
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {providerConfig.ctaText.replace('your test', `your ${test.test_name}`)}
              </p>
              <Button size="lg" asChild>
                <a href={test.url} target="_blank" rel="noopener noreferrer">
                  Book Your Test Now
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
