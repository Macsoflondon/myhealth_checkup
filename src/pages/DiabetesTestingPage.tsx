import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import ScrollFadeIn from '@/components/common/ScrollFadeIn';
import PageBanner from '@/components/sections/PageBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

const DiabetesTestingPage = () => {
  const diabetesTests = [
    {
      name: "HbA1c Test",
      description: "3-month average blood sugar levels",
      price: "From £45",
      turnaround: "2-3 days",
      ideal: "Diabetes monitoring & screening"
    },
    {
      name: "Glucose Tolerance Test",
      description: "Comprehensive diabetes assessment",
      price: "From £89",
      turnaround: "3-5 days",
      ideal: "Pre-diabetes detection"
    },
    {
      name: "Diabetes Risk Panel",
      description: "Complete metabolic screening",
      price: "From £149",
      turnaround: "5-7 days",
      ideal: "Family history concerns"
    },
    {
      name: "Advanced Diabetes Monitor",
      description: "HbA1c, insulin, C-peptide analysis",
      price: "From £199",
      turnaround: "7-10 days",
      ideal: "Comprehensive assessment"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Diabetes Testing | myhealth checkup</title>
        <meta name="description" content="Compare diabetes screening and monitoring tests from UK providers. HbA1c, glucose tolerance, and insulin resistance testing from £45." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/tests/diabetes" />
      </Helmet>
      <Header />
      <main className="flex-grow">
        <PageBanner
          title="Diabetes Testing & Monitoring"
          subtitle="Comprehensive diabetes screening and monitoring tests. Perfect for health-conscious UK adults aged 30-60 looking to manage their metabolic health proactively."
        />


        {/* Warning Signs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeading title="Early Warning" gradientText="Signs" className="mb-12" />
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "Increased thirst",
                  "Frequent urination",
                  "Unexplained weight loss",
                  "Fatigue & weakness",
                  "Blurred vision",
                  "Slow healing wounds",
                  "Tingling in hands/feet",
                  "Recurring infections"
                ].map((symptom, index) => (
                  <Card key={index} className="text-center p-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">{symptom}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Available Tests */}
        <section className="py-16 bg-white/[0.31]">
          <div className="container mx-auto px-4">
            <SectionHeading title="Diabetes Testing" gradientText="Options" className="mb-8" />
            <p className="text-xl text-muted-foreground text-center mb-8">Choose the right test for your needs</p>
            <div className="grid md:grid-cols-2 gap-6">
              {diabetesTests.map((test, index) => (
                <ScrollFadeIn key={index} delay={index * 100}>
                <Card className="relative group hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{test.name}</CardTitle>
                      <Badge variant="secondary">{test.price}</Badge>
                    </div>
                    <p className="text-muted-foreground">{test.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Results in {test.turnaround}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Ideal for: {test.ideal}</span>
                      </div>
                      <Button className="w-full">Compare Providers</Button>
                    </div>
                  </CardContent>
                </Card>
                </ScrollFadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Understanding Results */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeading title="Understanding Your" gradientText="Results" className="mb-8" />
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Normal Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-2">HbA1c: Below 5.7%</p>
                    <p className="text-sm text-green-600">Continue healthy lifestyle habits</p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-800">Pre-diabetes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-700 mb-2">HbA1c: 5.7% - 6.4%</p>
                    <p className="text-sm text-amber-600">Lifestyle changes recommended</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-800">Diabetes Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700 mb-2">HbA1c: 6.5% or higher</p>
                    <p className="text-sm text-red-600">Medical consultation advised</p>
                  </CardContent>
                </Card>
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
                  Take Control of Your Diabetes Risk
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Compare diabetes tests from trusted UK providers or find a clinic near you
                </p>
                <TooltipProvider>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/compare?category=diabetes" className="flex-1 sm:flex-initial">
                          <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-health-heading">
                            Browse All Diabetes Tests
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
                        <p>200+ clinics nationwide with instant availability</p>
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

export default DiabetesTestingPage;