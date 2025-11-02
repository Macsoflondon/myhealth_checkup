import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, Activity, Users, Zap, TestTube2, Target, Stethoscope } from 'lucide-react';

const mensHealthTests = [
  {
    id: "premium-complete-blood",
    name: "Premium Complete Blood Test",
    description: "Comprehensive health analysis including full blood count, organ function, vitamins, and cardiovascular markers",
    icon: Stethoscope,
    category: "Complete Health",
    price: "£199",
    biomarkers: ["Full Blood Count", "Liver Function", "Kidney Function", "Lipid Profile", "Diabetes Markers", "Vitamins", "Minerals"],
    suitableFor: ["Complete health overview", "Annual health check", "Health optimization", "Preventive screening"],
    turnaround: "24-48 hours"
  },
  {
    id: "advanced-well-man",
    name: "Advanced Well Man Test",
    description: "Comprehensive men's health screening including hormones, prostate markers, and cardiovascular health",
    icon: Shield,
    category: "Men's Wellness",
    price: "£149",
    biomarkers: ["PSA", "Testosterone", "Cholesterol Panel", "Blood Sugar", "Liver Function", "Kidney Function"],
    suitableFor: ["Men 40+", "Routine health screening", "Prostate health monitoring", "Hormone assessment"],
    turnaround: "24-48 hours"
  },
  {
    id: "male-hormones",
    name: "Male Hormones Blood Test", 
    description: "Comprehensive hormone panel including testosterone, SHBG, and reproductive health markers",
    icon: Activity,
    category: "Hormone Health",
    price: "£89",
    biomarkers: ["Total Testosterone", "Free Testosterone", "SHBG", "LH", "FSH", "Prolactin"],
    suitableFor: ["Low energy/libido", "Muscle building", "Weight management", "Fertility concerns"],
    turnaround: "24-48 hours"
  },
  {
    id: "erectile-dysfunction", 
    name: "Erectile Dysfunction Blood Test",
    description: "Specialized testing to identify underlying causes of erectile dysfunction including hormones and vascular health",
    icon: Heart,
    category: "Sexual Health",
    price: "£125",
    biomarkers: ["Testosterone", "Prolactin", "HbA1c", "Lipid Profile", "Thyroid Function", "PSA"],
    suitableFor: ["ED symptoms", "Performance issues", "Vascular health concerns", "Hormone imbalances"],
    turnaround: "24-48 hours"
  },
  {
    id: "prostate-tests",
    name: "Prostate Tests",
    description: "Comprehensive prostate health screening including PSA and related markers for early detection",
    icon: Target,
    category: "Prostate Health", 
    price: "£65",
    biomarkers: ["Total PSA", "Free PSA", "PSA Ratio", "Digital Rectal Exam"],
    suitableFor: ["Men 50+", "Family history", "Urinary symptoms", "Prostate health monitoring"],
    turnaround: "24-48 hours"
  },
  {
    id: "testosterone-blood",
    name: "Testosterone Blood Test",
    description: "Essential testosterone testing to assess male hormone levels and hormonal health",
    icon: Zap,
    category: "Hormone Health",
    price: "£45",
    biomarkers: ["Total Testosterone", "Free Testosterone", "SHBG"],
    suitableFor: ["Low energy", "Decreased libido", "Muscle loss", "Mood changes"],
    turnaround: "24-48 hours"
  }
];

const healthConcerns = [
  {
    name: "Low Testosterone",
    description: "Decreased energy, libido, and muscle mass",
    symptoms: ["Fatigue", "Reduced libido", "Muscle weakness", "Mood changes"],
    recommendedTest: "Male Hormones Blood Test"
  },
  {
    name: "Prostate Health",
    description: "Prostate enlargement or cancer screening",
    symptoms: ["Frequent urination", "Weak stream", "Incomplete emptying", "Night urination"],
    recommendedTest: "Prostate Tests"
  },
  {
    name: "Erectile Dysfunction",
    description: "Difficulty achieving or maintaining erections",
    symptoms: ["Reduced erection quality", "Performance anxiety", "Decreased confidence", "Relationship stress"],
    recommendedTest: "Erectile Dysfunction Blood Test"
  },
  {
    name: "General Health Decline",
    description: "Overall health and wellness concerns", 
    symptoms: ["General fatigue", "Weight changes", "Health anxiety", "Preventive care"],
    recommendedTest: "Premium Complete Blood Test"
  }
];

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    "Complete Health": "bg-red-500 text-white",
    "Men's Wellness": "bg-[#081129] text-white",
    "Hormone Health": "bg-pink-600 text-white",
    "Sexual Health": "bg-purple-500 text-white",
    "Prostate Health": "bg-[#081129] text-white"
  };
  return colorMap[category] || "bg-gray-500 text-white";
};

const getCategoryBorderColor = (category: string) => {
  const borderColorMap: { [key: string]: string } = {
    "Complete Health": "border-red-500",
    "Men's Wellness": "border-blue-500",
    "Hormone Health": "border-pink-600",
    "Sexual Health": "border-purple-500",
    "Prostate Health": "border-blue-500"
  };
  return borderColorMap[category] || "border-gray-500";
};

const getCategoryButtonColor = (category: string) => {
  const buttonColorMap: { [key: string]: string } = {
    "Complete Health": "bg-red-500 hover:bg-red-600",
    "Men's Wellness": "bg-[#081129] hover:bg-[#081129]/90",
    "Hormone Health": "bg-pink-600 hover:bg-pink-700",
    "Sexual Health": "bg-purple-500 hover:bg-purple-600",
    "Prostate Health": "bg-[#081129] hover:bg-[#081129]/90"
  };
  return buttonColorMap[category] || "bg-gray-500 hover:bg-gray-600";
};

const MensHealthPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Men's Health Blood Tests | Male Hormone & Prostate Testing | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Comprehensive men's health testing including testosterone, prostate PSA, erectile dysfunction, and complete male wellness screening from £45." />
        <meta name="keywords" content="men's health tests, testosterone test, prostate PSA test, male hormones, erectile dysfunction test, well man test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/mens-health" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Men's Health Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Professional men's health testing including hormones, prostate, and wellness screening" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/mens-health" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Men's Health Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Comprehensive men's health testing with fast results" />
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-background">
      {/* Hero Section */}
      <section className="bg-[#081129] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Men's Health Blood Tests
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto tracking-wide text-white">
              Comprehensive male health screening including testosterone, prostate health, erectile dysfunction, 
              and complete wellness testing tailored for men's unique health needs.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-health-heading">
                  Browse All Tests
                </Button>
                <Button size="lg" className="bg-[#22C0D4] hover:bg-[#E70D69] text-white transition-colors">
                  Find a Clinic
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-[#081129] my-[20px]">
                Why Men's Health Testing Matters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Identify potential health issues before symptoms develop
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Optimize Performance</h3>
                  <p className="text-muted-foreground">
                    Maximize energy, strength, and overall male vitality
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Preventive Care</h3>
                  <p className="text-muted-foreground">
                    Take control of your health with proactive screening
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mensHealthTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className={`group hover:shadow-lg transition-all duration-300 ${getCategoryBorderColor(test.category)} border-2 hover:border-opacity-80 h-full flex flex-col`}>
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
                        <CardTitle className="text-lg leading-tight mb-3 h-12 flex items-start" style={{color: '#081129'}}>{test.name}</CardTitle>
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
                              {test.biomarkers.slice(0, 3).map((biomarker) => (
                                <Badge key={biomarker} variant="outline" className="text-xs">
                                  {biomarker}
                                </Badge>
                              ))}
                              {test.biomarkers.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{test.biomarkers.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2">Suitable For:</h4>
                            <ul className="text-xs text-muted-foreground space-y-1 min-h-[2.5rem]">
                              {test.suitableFor.slice(0, 2).map((item, index) => (
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
                  Common Men's Health Concerns
                </h2>
                <p className="text-lg text-gray-300">
                  Find the right test for your specific health concerns
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
      </main>
      <Footer />
    </div>
  );
};

export default MensHealthPage;