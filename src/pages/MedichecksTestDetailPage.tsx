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
import SimilarTestsSection from "@/components/SimilarTestsSection";
import TestBreadcrumb from "@/components/common/TestBreadcrumb";

interface MedichecksTest {
  id: string;
  test_name: string;
  category: string;
  description: string;
  url: string;
  price: number | null;
}

export default function MedichecksTestDetailPage() {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<MedichecksTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;

      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, category, description, url, price')
        .eq('provider_id', 'medichecks')
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
                The Medichecks test you're looking for doesn't exist or has been removed.
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

  const pageTitle = `${test.test_name} - Medichecks Blood Test | myhealth checkup`;
  const pageDescription = `${test.description} Book your ${test.test_name} blood test with Medichecks through myhealth checkup. UKAS-accredited labs, doctor-reviewed results, fast 2-day turnaround.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/medichecks/${testId}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <TestBreadcrumb providerName="Medichecks" testName={test.test_name} />

          {/* Provider Badge */}
          <div className="mb-6">
            <img 
              src="/lovable-uploads/provider-medichecks-new-v3.png" 
              alt="Medichecks" 
              className="h-12 mb-4"
            />
            <Badge variant="secondary" className="mb-2">Medichecks Blood Test</Badge>
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
                    The {test.test_name} from Medichecks is a comprehensive {test.category.toLowerCase()} blood test 
                    that provides detailed insights into your health markers. All tests are processed by UKAS-accredited 
                    laboratories (ISO 15189) and reviewed by qualified doctors.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Doctor Reviewed</p>
                        <p className="text-sm text-muted-foreground">All results reviewed by qualified doctors</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">UKAS Accredited</p>
                        <p className="text-sm text-muted-foreground">ISO 15189 accredited laboratories</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Fast Results</p>
                        <p className="text-sm text-muted-foreground">2 working days from sample receipt</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Flexible Collection</p>
                        <p className="text-sm text-muted-foreground">Home kit or clinic options</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Collection Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Sample Collection Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Home className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Home Finger-Prick Kit</h3>
                      <p className="text-sm text-muted-foreground">
                        Easy-to-use finger-prick collection kit delivered to your home. Simple instructions included. 
                        Return via Royal Mail using the prepaid envelope.
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start space-x-4">
                    <Building2 className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Clinic Venous Blood Draw</h3>
                      <p className="text-sm text-muted-foreground">
                        Professional venous blood draw at a TDL clinic or partner location. More comfortable for 
                        comprehensive panels requiring larger sample volumes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Medichecks */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Medichecks?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span><strong>UK's Leading Provider:</strong> Over 300 blood tests with 90,000+ customer reviews (4.7/5 on Feefo)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span><strong>Medical Excellence:</strong> UKAS-accredited labs and doctor-reviewed results with personalised insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span><strong>Convenient Testing:</strong> Flexible sample collection with home kits, clinic visits, or home nurse service</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span><strong>Comprehensive Coverage:</strong> Extensive test catalogue covering 12+ health categories</span>
                    </li>
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
                  <CardDescription>
                    {test.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Turnaround Time</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-semibold">2 working days</span>
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
                      Book with Medichecks
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    You'll be redirected to Medichecks' secure booking platform
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
                    <p className="text-muted-foreground">Finger-prick or venous blood</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">Lab Processing</p>
                    <p className="text-muted-foreground">TDL, Eurofins (UKAS accredited)</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">Results Delivery</p>
                    <p className="text-muted-foreground">Online dashboard with doctor commentary</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">Support</p>
                    <p className="text-muted-foreground">Phone: 03450 600 600</p>
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
              currentProvider="medichecks"
            />
          </div>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Book your {test.test_name} with Medichecks today and get doctor-reviewed results 
                in just 2 working days. Join over 90,000 satisfied customers who trust Medichecks 
                for their health testing needs.
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
