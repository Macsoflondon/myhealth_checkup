import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock,
  Droplets,
  Building2
} from "lucide-react";
import SimilarTestsSection from "@/components/SimilarTestsSection";
import TestBreadcrumb from "@/components/common/TestBreadcrumb";

const GoodbodyTestDetailPage = () => {
  const { testId } = useParams<{ testId: string }>();

  const { data: test, isLoading } = useQuery({
    queryKey: ["goodbody-test", testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("*")
        .eq("provider_id", "goodbody-clinic")
        .eq("id", testId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading test details...</div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Test not found</h2>
          <Link to="/compare">
            <Button>Return to Compare Tests</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = `${test.test_name} - GoodBody Clinic | Blood Test London`;
  const pageDescription = `${test.description} Book your ${test.test_name} at GoodBody Clinic pharmacy locations across London. Professional venous blood collection with UKAS-accredited lab analysis. Price: £${test.price}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/goodbody/${testId}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4 py-6">
          <TestBreadcrumb providerName="GoodBody Clinic" testName={test.test_name} />

          <Link to="/compare">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Compare
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Test Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <Badge className="mb-3 bg-[#3A5F85] hover:bg-[#3A5F85]/90">
                        {test.category}
                      </Badge>
                      <h1 className="text-4xl font-bold mb-4">{test.test_name}</h1>
                      <p className="text-lg text-muted-foreground">{test.description}</p>
                    </div>
                    <img 
                      src="/lovable-uploads/provider-goodbody-new-v3.png" 
                      alt="GoodBody Clinic" 
                      className="w-24 h-24 object-contain ml-4"
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-[#FA6980] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Turnaround Time</h3>
                        <p className="text-sm text-muted-foreground">2-3 working days</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Droplets className="h-5 w-5 text-[#FA6980] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Sample Collection</h3>
                        <p className="text-sm text-muted-foreground">
                          Venous blood draw at pharmacy clinic
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#FA6980] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Location</h3>
                        <p className="text-sm text-muted-foreground">
                          Multiple pharmacy clinics across London
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-[#FA6980] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Accreditation</h3>
                        <p className="text-sm text-muted-foreground">
                          UKAS ISO 15189, CQC Registered
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Why Choose GoodBody Clinic?</h2>
                  <div className="space-y-3">
                    {[
                      "Professional venous blood collection by trained phlebotomists",
                      "Convenient pharmacy locations across London",
                      "UKAS-accredited laboratory analysis",
                      "Walk-in or pre-booked appointments",
                      "Fast 2-3 day turnaround for most tests",
                      "Clear, detailed results with clinical guidance"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#FA6980] mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Similar Tests */}
              <SimilarTestsSection 
                category={test.category || "General Health"}
                currentTestName={test.test_name}
                currentProvider="goodbody-clinic"
              />
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-[#FA6980]/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Test Price</p>
                    <p className="text-5xl font-bold text-[#FA6980]">£{test.price}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Price includes clinic visit and lab analysis
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-[#FA6980] hover:bg-[#FA6980]/90 text-white"
                      size="lg"
                      asChild
                    >
                      <a 
                        href={test.url || "https://goodbody.co.uk"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book Appointment
                      </a>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <Link to="/find-clinic">
                        <MapPin className="mr-2 h-4 w-4" />
                        Find Nearest Clinic
                      </Link>
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-semibold mb-2">What's Included:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FA6980]">•</span>
                          Professional blood collection
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FA6980]">•</span>
                          UKAS-accredited lab analysis
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FA6980]">•</span>
                          Detailed results report
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FA6980]">•</span>
                          Clinical interpretation guide
                        </li>
                      </ul>
                    </div>

                    <div className="bg-accent/50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">Need Help Choosing?</p>
                      <p className="text-muted-foreground mb-3">
                        Contact GoodBody Clinic for expert advice on which test is right for you.
                      </p>
                      <p className="text-sm">
                        <strong>Phone:</strong> 020 7099 6657<br />
                        <strong>Email:</strong> info@goodbody.co.uk
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoodbodyTestDetailPage;
