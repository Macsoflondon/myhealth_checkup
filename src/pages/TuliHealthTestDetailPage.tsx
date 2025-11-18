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

interface TuliHealthTest {
  id: string;
  test_name: string;
  category: string;
  description: string;
  url: string;
  price: number | null;
}

export default function TuliHealthTestDetailPage() {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<TuliHealthTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;

      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, category, description, url, price')
        .eq('provider_id', 'tuli-health')
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
          <Link to="/compare-tests" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Compare Tests
          </Link>
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Test Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The Tuli Health test you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/compare-tests">Browse All Tests</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const pageTitle = `${test.test_name} - Tuli Health Test | myhealth checkup`;
  const pageDescription = `${test.description} Book your ${test.test_name} test with Tuli Health through myhealth checkup. Convenient testing with expert support.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/tuli-health/${testId}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/compare-tests" className="hover:text-primary">Compare Tests</Link>
            <span>/</span>
            <span className="text-foreground">Tuli Health</span>
            <span>/</span>
            <span className="text-foreground">{test.test_name}</span>
          </nav>

          {/* Test Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/provider-tuli-health.png" 
                alt="Tuli Health" 
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
                  Book Now with Tuli Health
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/compare-tests">Compare with Other Providers</Link>
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <Home className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Flexible Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Choose between convenient at-home testing or clinic visits to suit your preferences and lifestyle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Quick Turnaround</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fast processing and results delivery with clear, easy-to-understand health reports.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Quality Assured</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All tests processed in accredited laboratories with rigorous quality control standards.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* About Tuli Health */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Tuli Health</CardTitle>
              <CardDescription>Modern Healthcare Testing Services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Tuli Health is a modern healthcare testing provider committed to making health screening accessible, 
                convenient, and affordable. With a focus on customer experience and clinical excellence, Tuli Health 
                offers a comprehensive range of blood tests and health screenings.
              </p>
              <p>
                Whether you prefer the convenience of at-home testing or the reassurance of a clinic visit, Tuli Health 
                provides flexible options to suit your needs. All tests are processed in accredited laboratories, and 
                results are delivered with clear explanations and actionable insights.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">Accredited Labs</Badge>
                <Badge variant="outline">Flexible Options</Badge>
                <Badge variant="outline">Fast Results</Badge>
                <Badge variant="outline">Expert Support</Badge>
                <Badge variant="outline">Affordable Prices</Badge>
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
                    <h4 className="font-semibold mb-1">Choose Your Test</h4>
                    <p className="text-muted-foreground">
                      Select your desired test and choose between at-home or clinic collection based on your preference.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Collect Your Sample</h4>
                    <p className="text-muted-foreground">
                      Either receive an at-home test kit with clear instructions or visit a partner clinic for professional sample collection.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Laboratory Processing</h4>
                    <p className="text-muted-foreground">
                      Your sample is sent to an accredited laboratory where it's analyzed using the latest diagnostic technology.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Review Your Results</h4>
                    <p className="text-muted-foreground">
                      Access your results securely online with clear explanations and recommendations for your next steps.
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
                <h3 className="text-2xl font-bold mb-4">Take the First Step Towards Better Health</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Book your {test.test_name} with Tuli Health today for convenient, reliable testing.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href={test.url} target="_blank" rel="noopener noreferrer">
                      Book Now with Tuli Health
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/compare-tests">Compare Providers</Link>
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
