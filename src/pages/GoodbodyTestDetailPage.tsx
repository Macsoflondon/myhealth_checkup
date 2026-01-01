import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock,
  Droplets,
  Building2,
  FlaskConical,
  Users,
  Stethoscope,
  ExternalLink
} from "lucide-react";
import SimilarTestsSection from "@/components/SimilarTestsSection";
import TestBreadcrumb from "@/components/common/TestBreadcrumb";
import PageHeading from "@/components/ui/page-heading";
import { getGoodbodyTestByName, GoodbodyTestDetail } from "@/data/goodbodyTestDetails";
import { buildProviderBookingUrl, externalLinkProps } from "@/utils/urlTracking";

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

  // Get rich content from our data file
  const testDetails: GoodbodyTestDetail | undefined = getGoodbodyTestByName(test.test_name);
  
  // Build booking URL with UTM tracking
  const bookingUrl = buildProviderBookingUrl(
    testDetails?.goodbodyUrl || test.url || "https://health.goodbodyclinic.com",
    "goodbody-clinic",
    test.test_name
  );

  // Parse biomarkers from rich content or database
  const biomarkers = testDetails?.biomarkers || 
    (test.biomarkers_list ? (Array.isArray(test.biomarkers_list) ? test.biomarkers_list : []) : []);

  const pageTitle = `${test.test_name} - GoodBody Clinic | Blood Test UK`;
  const pageDescription = testDetails?.description || 
    `${test.description} Book your ${test.test_name} at GoodBody Clinic pharmacy locations across the UK. Professional venous blood collection with UKAS-accredited lab analysis. Price: £${test.price}`;

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
                      <Badge className="mb-3 bg-primary hover:bg-primary/90">
                        {test.category || testDetails?.category}
                      </Badge>
                      <PageHeading 
                        title={test.test_name}
                        accent={testDetails?.headline || "Blood Test"}
                        centered={false}
                        className="text-2xl sm:text-3xl md:text-4xl"
                      />
                      <p className="text-lg text-muted-foreground mt-4">
                        {testDetails?.detailedDescription || test.description}
                      </p>
                    </div>
                    <img 
                      src="/lovable-uploads/provider-goodbody-new-v4.png" 
                      alt="GoodBody Clinic" 
                      className="w-24 h-24 object-contain ml-4"
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Turnaround Time</h3>
                        <p className="text-sm text-muted-foreground">
                          {testDetails?.turnaround || "2-3 working days"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Droplets className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Sample Collection</h3>
                        <p className="text-sm text-muted-foreground">
                          {testDetails?.sampleType || "Venous blood draw at pharmacy clinic"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Location</h3>
                        <p className="text-sm text-muted-foreground">
                          Multiple pharmacy clinics across the UK
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
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

              {/* Biomarkers Section */}
              {biomarkers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-primary" />
                      What&apos;s Tested ({biomarkers.length} Biomarkers)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {biomarkers.map((biomarker: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                          <span className="text-sm">{biomarker}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Who Should Take This Test */}
              {testDetails?.whoShouldTake && testDetails.whoShouldTake.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Who Should Take This Test?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {testDetails.whoShouldTake.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Preparation Instructions */}
              {testDetails?.preparation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Preparation Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{testDetails.preparation}</p>
                  </CardContent>
                </Card>
              )}

              {/* Key Features */}
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Why Choose GoodBody Clinic?</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Professional Blood Collection", desc: "Trained phlebotomists at all locations" },
                      { title: "Convenient Pharmacy Locations", desc: "Clinics across the UK" },
                      { title: "UKAS-Accredited Analysis", desc: "ISO 15189 certified laboratories" },
                      { title: "Walk-in or Pre-booked", desc: "Flexible appointment options" },
                      { title: "Fast Turnaround", desc: "Most results within 2-3 working days" },
                      { title: "Expert Guidance", desc: "Clear results with clinical interpretation" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{feature.title}</p>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
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
              <Card className="sticky top-24 border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Test Price</p>
                    <p className="text-5xl font-bold text-primary">
                      £{test.price || testDetails?.price || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Price includes clinic visit and lab analysis
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full"
                      size="lg"
                      variant="gradient"
                      asChild
                    >
                      <a 
                        href={bookingUrl}
                        {...externalLinkProps}
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book on GoodBody
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <Link to="/find-a-clinic?provider=goodbody-clinic">
                        <MapPin className="mr-2 h-4 w-4" />
                        Find Nearest Clinic
                      </Link>
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-semibold mb-2">What&apos;s Included:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          Professional blood collection
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          UKAS-accredited lab analysis
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          Detailed results report
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          Clinical interpretation guide
                        </li>
                      </ul>
                    </div>

                    {test.phlebotomy_included === false && test.phlebotomy_cost && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-muted-foreground">
                          <strong>Note:</strong> Phlebotomy (blood draw) costs an additional £{test.phlebotomy_cost}
                        </p>
                      </div>
                    )}

                    <div className="bg-accent/20 p-4 rounded-lg">
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
