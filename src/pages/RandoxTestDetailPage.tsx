import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Clock, Home, Building2, ArrowLeft, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TestBreadcrumb from "@/components/common/TestBreadcrumb";

interface RandoxTest {
  id: string;
  test_name: string;
  category: string;
  description: string;
  url: string;
  price: number | null;
}

export default function RandoxTestDetailPage() {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<RandoxTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;

      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, category, description, url, price')
        .eq('provider_id', 'randox')
        .eq('provider_test_id', testId)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setTest(data);
      }
      setLoading(false);
    };

    fetchTest();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full mb-8" />
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/compare" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Compare Tests
          </Link>
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Test Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The Randox Health test you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/compare">Browse All Tests</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const pageTitle = `${test.test_name} - Randox Health Test | myhealth checkup`;
  const pageDescription = `${test.description} Book your ${test.test_name} health test with Randox Health through myhealth checkup. State-of-the-art clinics with advanced diagnostics.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/randox/${testId}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <TestBreadcrumb providerName="Randox Health" testName={test.test_name} />
          

          {/* Test Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/provider-randox.png" 
                alt="Randox Health" 
                className="h-12 w-auto"
              />
              <Badge variant="secondary">{test.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{test.test_name}</h1>
            <p className="text-xl text-muted-foreground mb-6">{test.description}</p>
            
            {test.price && (
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">£{test.price}</span>
                <span className="text-muted-foreground">per test</span>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="group">
                <a href={test.url} target="_blank" rel="noopener noreferrer">
                  Book Now with Randox Health
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/compare">Compare with Other Providers</Link>
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Modern Clinics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  State-of-the-art health clinics equipped with the latest diagnostic technology and facilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Comprehensive Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Extensive range of health screenings and diagnostic tests with detailed biomarker analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Expert Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Professional healthcare team providing personalized consultation and health recommendations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* About Randox Health */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Randox Health</CardTitle>
              <CardDescription>Global Leader in Diagnostic Testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Randox Health is an international healthcare company offering comprehensive health screening and 
                diagnostic testing services. With state-of-the-art health clinics across the UK, Randox Health 
                provides advanced preventative health testing to help people take control of their wellbeing.
              </p>
              <p>
                As a world-leading diagnostic company, Randox operates cutting-edge laboratories and develops 
                innovative testing technologies. Their comprehensive health checks provide detailed insights into 
                your health status, enabling early detection and prevention of potential health issues.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">ISO Certified</Badge>
                <Badge variant="outline">Advanced Diagnostics</Badge>
                <Badge variant="outline">Expert Consultations</Badge>
                <Badge variant="outline">UK-Wide Clinics</Badge>
                <Badge variant="outline">Comprehensive Screening</Badge>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Simple 4-Step Process</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Book Your Appointment</h4>
                    <p className="text-muted-foreground">
                      Choose your preferred test and book an appointment at a Randox Health clinic convenient to you.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Visit the Clinic</h4>
                    <p className="text-muted-foreground">
                      Attend your appointment where trained professionals will take your blood sample in a comfortable, modern setting.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Laboratory Analysis</h4>
                    <p className="text-muted-foreground">
                      Your sample is analyzed using cutting-edge technology in Randox's world-class laboratories.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Receive Results & Consultation</h4>
                    <p className="text-muted-foreground">
                      Get your comprehensive results with a consultation from healthcare professionals to discuss findings and recommendations.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Invest in Your Health?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Book your {test.test_name} with Randox Health today for comprehensive testing and expert guidance.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href={test.url} target="_blank" rel="noopener noreferrer">
                      Book Now with Randox Health
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/compare">Compare Providers</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
