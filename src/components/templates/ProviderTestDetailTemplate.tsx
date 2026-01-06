import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Clock, Home, Building2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SimilarTestsSection from "@/components/SimilarTestsSection";
import TestBreadcrumb from "@/components/common/TestBreadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProviderConfig } from "@/constants/providerTestPageConfig";

export interface ProviderTestData {
  id: string;
  test_name: string;
  category: string;
  description: string;
  url: string;
  price: number | null;
  provider_test_id?: string;
}

interface ProviderTestDetailTemplateProps {
  test: ProviderTestData | null;
  providerConfig: ProviderConfig;
  isLoading: boolean;
  testId: string;
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
    <div className="container mx-auto px-4 max-w-5xl">
      <Skeleton className="h-8 w-32 mb-8" />
      <Skeleton className="h-12 w-3/4 mb-4" />
      <Skeleton className="h-64 w-full mb-8" />
    </div>
  </div>
);

// Not found component
const NotFoundState = ({ providerName }: { providerName: string }) => (
  <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
    <div className="container mx-auto px-4 max-w-5xl">
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

export default function ProviderTestDetailTemplate({
  test,
  providerConfig,
  isLoading,
  testId,
}: ProviderTestDetailTemplateProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!test) {
    return <NotFoundState providerName={providerConfig.name} />;
  }

  const pageTitle = `${test.test_name} - ${providerConfig.name} Blood Test | myhealth checkup`;
  const pageDescription = `${test.description} Book your ${test.test_name} blood test with ${providerConfig.name} through myhealth checkup. ${providerConfig.aboutText}`;

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

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <TestBreadcrumb providerName={providerConfig.name} testName={test.test_name} />

          {/* Provider Badge */}
          <div className="mb-6">
            <img 
              src={providerConfig.logo} 
              alt={providerConfig.name} 
              className="h-12 mb-4"
            />
            <Badge variant="secondary" className="mb-2">{providerConfig.badgeText}</Badge>
          </div>

          {/* Test Header */}
          <h1 className="text-4xl font-bold mb-4">{test.test_name}</h1>
          <p className="text-xl text-muted-foreground mb-8">{test.description}</p>

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
                        <span className="text-3xl font-bold text-primary">£{test.price}</span>
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
                  
                  <Button 
                    size="lg" 
                    className="w-full" 
                    asChild
                  >
                    <a 
                      href={test.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      {providerConfig.ctaButtonText}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    You'll be redirected to {providerConfig.name}'s secure booking platform
                  </p>
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
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
