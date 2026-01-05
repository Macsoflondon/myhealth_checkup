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

interface ThrivaTest {
  id: string;
  test_name: string;
  category: string;
  description: string;
  url: string;
  price: number | null;
}

export default function ThrivaTestDetailPage() {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<ThrivaTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;

      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, category, description, url, price')
        .eq('provider_id', 'thriva')
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
                The Thriva test you're looking for doesn't exist or has been removed.
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

  const pageTitle = `${test.test_name} - Thriva Blood Test | myhealth checkup`;
  const pageDescription = `${test.description} Book your ${test.test_name} blood test with Thriva through myhealth checkup. At-home finger-prick testing with fast results.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/thriva/${testId}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <TestBreadcrumb providerName="Thriva" testName={test.test_name} />
          

          {/* Test Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/provider-thriva.png" 
                alt="Thriva" 
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
                  Book Now with Thriva
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
                <Home className="h-8 w-8 text-primary mb-2" />
                <CardTitle>At-Home Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Convenient finger-prick test kit delivered to your door with easy-to-follow instructions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Fast Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Results typically available within 2-3 working days via secure online portal with detailed insights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Expert Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Doctor-reviewed results with personalized health recommendations and lifestyle guidance.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* About Thriva */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Thriva</CardTitle>
              <CardDescription>Leading UK At-Home Blood Testing Service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Thriva is a UK-based health technology company specializing in convenient at-home blood testing. 
                Founded to make health monitoring accessible and easy, Thriva offers a comprehensive range of blood 
                tests that can be completed from the comfort of your home.
              </p>
              <p>
                All tests are processed in UKAS-accredited laboratories, and results are reviewed by qualified 
                doctors who provide personalized health insights and recommendations. The Thriva platform makes 
                it easy to track your health metrics over time and take proactive steps toward better wellbeing.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">UKAS Accredited</Badge>
                <Badge variant="outline">Doctor Reviewed</Badge>
                <Badge variant="outline">At-Home Testing</Badge>
                <Badge variant="outline">Fast Results</Badge>
                <Badge variant="outline">Personalized Insights</Badge>
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
                    <h4 className="font-semibold mb-1">Order Your Test</h4>
                    <p className="text-muted-foreground">
                      Choose your test and complete your order on the Thriva website. Your test kit will be dispatched immediately.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Take Your Sample</h4>
                    <p className="text-muted-foreground">
                      Follow the simple instructions to collect your finger-prick blood sample at home. Post it back using the prepaid envelope.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Lab Analysis</h4>
                    <p className="text-muted-foreground">
                      Your sample is analyzed in a UKAS-accredited laboratory by qualified professionals using the latest technology.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get Your Results</h4>
                    <p className="text-muted-foreground">
                      Receive your results online within 2-3 days with doctor-reviewed insights, personalized recommendations, and easy-to-understand explanations.
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
                <h3 className="text-2xl font-bold mb-4">Ready to Take Control of Your Health?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Book your {test.test_name} test with Thriva today and get fast, accurate results with expert guidance.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href={test.url} target="_blank" rel="noopener noreferrer">
                      Book Now with Thriva
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
