import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Shield, Users, Zap, Moon, Droplet, TestTube2, Stethoscope, Brain, Bug } from "lucide-react";

const wellnessTests = [
  {
    id: "hepatitis-screening",
    name: "Hepatitis Screening Blood Test",
    description: "Comprehensive screening for Hepatitis A, B, and C to protect your liver health",
    icon: Shield,
    category: "Liver Health",
    price: "£89"
  },
  {
    id: "liver-blood-test",
    name: "Liver Blood Test",
    description: "Monitor liver function with comprehensive liver enzyme and protein testing",
    icon: Heart,
    category: "Liver Health", 
    price: "£65"
  },
  {
    id: "kidney-blood-test",
    name: "Kidney Blood Test",
    description: "Assess kidney function and health with creatinine, urea, and eGFR testing",
    icon: Droplet,
    category: "Kidney Health",
    price: "£55"
  },
  {
    id: "cardiac-risk",
    name: "Cardiac Risk Blood Test",
    description: "Evaluate cardiovascular risk with cholesterol, triglycerides, and cardiac markers",
    icon: Activity,
    category: "Heart Health",
    price: "£75"
  },
  {
    id: "sports-fitness",
    name: "Sports & Fitness Blood Test",
    description: "Optimize athletic performance with specialized fitness and nutrition biomarkers",
    icon: Zap,
    category: "Sports Performance",
    price: "£125"
  },
  {
    id: "tiredness-test",
    name: "Tiredness Blood Test",
    description: "Identify causes of fatigue with comprehensive energy and vitamin analysis",
    icon: Moon,
    category: "Energy & Fatigue",
    price: "£95"
  },
  {
    id: "anaemia-test",
    name: "Anaemia Blood Test",
    description: "Screen for anaemia with iron studies, B12, folate, and blood count analysis",
    icon: TestTube2,
    category: "Blood Health",
    price: "£45"
  },
  {
    id: "full-blood-count",
    name: "Full Blood Count Test",
    description: "Complete analysis of blood cells including red cells, white cells, and platelets",
    icon: Stethoscope,
    category: "Blood Health",
    price: "£35"
  },
  {
    id: "blood-group",
    name: "Blood Group Blood Test",
    description: "Determine your ABO blood group and Rhesus factor for medical records",
    icon: Users,
    category: "General Health",
    price: "£25"
  },
  {
    id: "cortisol-stress",
    name: "Cortisol Stress Blood Test",
    description: "Measure stress hormone levels to assess adrenal function and stress impact",
    icon: Brain,
    category: "Stress & Hormones",
    price: "£65"
  },
  {
    id: "helicobacter-pylori",
    name: "Helicobacter Pylori Blood Test",
    description: "Screen for H. pylori bacteria that can cause stomach ulcers and digestive issues",
    icon: Bug,
    category: "Digestive Health",
    price: "£45"
  }
];

const WellnessPage = () => {
  return (
    <>
      <Helmet>
        <title>Wellness Blood Tests | Comprehensive Health Screening | My Health Checkup</title>
        <meta name="description" content="Comprehensive wellness blood tests including liver, kidney, cardiac risk, sports fitness, and stress testing. Professional health screening from £25." />
        <meta name="keywords" content="wellness blood tests, health screening, liver test, kidney test, cardiac risk, sports fitness test, anaemia test, cortisol test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/wellness" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Wellness Blood Tests | My Health Checkup" />
        <meta property="og:description" content="Comprehensive wellness blood tests for optimal health monitoring and screening" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/wellness" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wellness Blood Tests | My Health Checkup" />
        <meta name="twitter:description" content="Comprehensive wellness blood tests for optimal health monitoring" />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-health-heading mb-6">
                Wellness Blood Tests
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Comprehensive wellness and lifestyle health tests to optimize your wellbeing. 
                Monitor key health markers and prevent potential health issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Browse All Tests
                </Button>
                <Button size="lg" variant="outline">
                  Find a Clinic
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tests Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Available Wellness Tests
                </h2>
                <p className="text-lg text-muted-foreground">
                  Choose from our comprehensive range of wellness blood tests
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wellnessTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-health-heading/10 text-health-heading group-hover:bg-health-heading group-hover:text-white transition-colors">
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <Badge variant="secondary" className="text-xs">
                                {test.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-health-heading">{test.price}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight text-health-heading">{test.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {test.description}
                        </CardDescription>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Compare Providers
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-12">
                Why Choose Wellness Testing?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Identify potential health issues before they become serious problems
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Optimize Performance</h3>
                  <p className="text-muted-foreground">
                    Monitor key biomarkers to enhance your physical and mental performance
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Peace of Mind</h3>
                  <p className="text-muted-foreground">
                    Regular monitoring gives you confidence in your health status
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default WellnessPage;