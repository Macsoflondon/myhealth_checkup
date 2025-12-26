import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollFadeIn from "@/components/common/ScrollFadeIn";
import HeroSection from "@/components/sections/HeroSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, Activity, Shield, TestTube2, Users } from "lucide-react";

const thyroidTests = [
  {
    id: "thyroid-blood-test",
    name: "Thyroid Blood Test",
    description: "Essential thyroid function screening including TSH, T3, and T4 to assess thyroid hormone levels and overall thyroid health",
    icon: Heart,
    category: "Basic Thyroid",
    price: "£69",
    biomarkers: ["TSH", "Free T3", "Free T4"],
    suitableFor: ["Fatigue concerns", "Weight changes", "Temperature sensitivity", "General screening"],
    turnaround: "1-2 days"
  },
  {
    id: "thyroid-function-antibodies",
    name: "Thyroid Function with Antibodies Test",
    description: "Comprehensive thyroid assessment including hormone levels plus antibody testing for autoimmune thyroid conditions",
    icon: Shield,
    category: "Advanced Thyroid",
    price: "£125",
    biomarkers: ["TSH", "Free T3", "Free T4", "Anti-TPO", "Anti-Thyroglobulin"],
    suitableFor: ["Family history of thyroid disease", "Suspected autoimmune conditions", "Comprehensive screening", "Previous abnormal results"],
    turnaround: "1-2 days"
  }
];

const healthConcerns = [
  {
    name: "Unexplained Fatigue",
    description: "Persistent tiredness despite adequate rest",
    symptoms: ["Chronic tiredness", "Low energy", "Difficulty concentrating", "Sleep issues"],
    recommendedTest: "Thyroid Blood Test"
  },
  {
    name: "Weight Changes",
    description: "Unexplained weight gain or difficulty losing weight",
    symptoms: ["Weight gain", "Slow metabolism", "Difficulty losing weight", "Increased appetite"],
    recommendedTest: "Thyroid Function with Antibodies Test"
  },
  {
    name: "Temperature Sensitivity",
    description: "Feeling too hot or too cold",
    symptoms: ["Cold intolerance", "Heat sensitivity", "Sweating changes", "Temperature regulation issues"],
    recommendedTest: "Thyroid Blood Test"
  },
  {
    name: "Autoimmune Symptoms",
    description: "Signs of possible autoimmune thyroid conditions",
    symptoms: ["Family history", "Joint pain", "Hair loss", "Skin changes"],
    recommendedTest: "Thyroid Function with Antibodies Test"
  }
];

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    "Basic Thyroid": "bg-cyan-500 text-white",
    "Advanced Thyroid": "bg-teal-500 text-white"
  };
  return colorMap[category] || "bg-gray-500 text-white";
};

const getCategoryButtonColor = (category: string) => {
  const buttonColorMap: { [key: string]: string } = {
    "Basic Thyroid": "bg-cyan-500 hover:bg-cyan-600",
    "Advanced Thyroid": "bg-teal-500 hover:bg-teal-600"
  };
  return buttonColorMap[category] || "bg-gray-500 hover:bg-gray-600";
};

const ThyroidPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Thyroid Blood Tests | TSH, T3, T4 & Antibody Testing | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Comprehensive thyroid function tests including TSH, T3, T4, and thyroid antibodies. Professional thyroid screening from £69 with fast results." />
        <meta name="keywords" content="thyroid blood test, TSH test, T3 T4 test, thyroid antibodies, hypothyroid, hyperthyroid, thyroid function test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/thyroid" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Thyroid Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Comprehensive thyroid function testing including hormones and antibodies" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/thyroid" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Thyroid Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Professional thyroid function testing with fast results" />
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-background">
        <HeroSection
          title="Thyroid Blood Tests"
          subtitle="Monitor your thyroid health with comprehensive hormone testing including TSH, T3, T4, and thyroid antibodies. Essential for detecting thyroid disorders and optimizing treatment."
        />

        {/* Action Buttons Bar */}
        <section className="bg-[#22C0D4] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/compare?category=thyroid">
                <Button size="lg" className="bg-[#081129] text-white hover:bg-[#081129]/90 font-semibold">
                  Compare Tests
                </Button>
              </Link>
              <Link to="/cancer-biomarkers">
                <Button size="lg" variant="outline" className="border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold">
                  Biomarker Guide
                </Button>
              </Link>
              <Link to="/find-clinic">
                <Button size="lg" className="bg-[#081129] text-white hover:bg-[#081129]/90 font-semibold">
                  Find Clinic
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-[#081129] my-[20px]">
                Why Test Your Thyroid?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Energy & Metabolism</h3>
                  <p className="text-muted-foreground">
                    Thyroid hormones regulate metabolism, energy levels, and weight
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <TestTube2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Identify thyroid disorders before symptoms become severe
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Treatment Monitoring</h3>
                  <p className="text-muted-foreground">
                    Track treatment effectiveness and optimize thyroid medication
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Tests */}
        <section className="py-16 bg-white/[0.31]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {thyroidTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 bg-white shadow-md border-2 hover:border-opacity-80 h-full flex flex-col">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Badge className={`text-xs whitespace-nowrap ${getCategoryColor(test.category)}`}>
                              {test.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Results in {test.turnaround}</p>
                            <span className="text-2xl font-bold text-health-heading">{test.price}</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl leading-tight mb-3 h-12 flex items-start" style={{color: '#081129'}}>{test.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground h-16 leading-relaxed">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 flex-1 flex flex-col space-y-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Biomarkers Tested: {test.biomarkers.length}
                              <br />
                              Key Biomarkers:
                            </h4>
                            <div className="flex flex-wrap gap-1 min-h-[2.5rem]">
                              {test.biomarkers.map((biomarker) => (
                                <Badge key={biomarker} variant="outline" className="text-xs">
                                  {biomarker}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2">Suitable For:</h4>
                            <ul className="text-xs text-muted-foreground space-y-1 min-h-[2.5rem]">
                              {test.suitableFor.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-auto pt-4">
                          <Button className={`w-full text-white ${getCategoryButtonColor(test.category)}`}>
                            Compare Providers
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Health Concerns */}
        <section className="py-16 bg-[#081129]">
          <div className="container mx-auto px-4 shadow-2xl shadow-white/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Common Thyroid Health Concerns
                </h2>
                <p className="text-lg text-gray-300">
                  Understanding what thyroid tests can detect
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthConcerns.map((concern, index) => (
                  <Card key={index} className="border-border bg-white shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">{concern.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {concern.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-foreground">Common Symptoms:</h4>
                        <div className="flex flex-wrap gap-1">
                          {concern.symptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-foreground">Recommended Test:</h4>
                        <p className="text-sm text-[#e70d69] font-medium">{concern.recommendedTest}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <ScrollFadeIn>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-[#081129]">
                  Monitor Your Thyroid Health Today
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Compare thyroid tests from trusted UK providers or find a clinic near you
                </p>
                <TooltipProvider>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/compare?category=thyroid" className="flex-1 sm:flex-initial">
                          <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-health-heading">
                            Browse All Thyroid Tests
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Compare prices from 7+ trusted UK providers</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/find-clinic" className="flex-1 sm:flex-initial">
                          <Button size="lg" className="w-full bg-[#22C0D4] hover:bg-[#E70D69] text-white transition-colors">
                            Find a Clinic
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>150+ clinics nationwide with instant availability</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </ScrollFadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ThyroidPage;