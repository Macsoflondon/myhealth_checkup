import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UKASBanner from '@/components/UKASBanner';
import BackButton from '@/components/ui/BackButton';
import ScrollFadeIn from '@/components/common/ScrollFadeIn';
import HeroSection from '@/components/sections/HeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, Zap, Shield, Heart, Droplets, ArrowRight } from 'lucide-react';
const GutHealthPage = () => {
  const gutTests = [{
    name: "Basic Gut Health",
    description: "Essential digestive markers",
    price: "From £89",
    markers: ["Calprotectin", "Gut inflammation", "Basic microbiome"]
  }, {
    name: "Comprehensive Stool Analysis",
    description: "Complete digestive function assessment",
    price: "From £179",
    markers: ["Microbiome diversity", "Parasites", "Yeast", "Inflammation", "Digestion"]
  }, {
    name: "Food Intolerance Panel",
    description: "IgG antibody testing for 200+ foods",
    price: "From £149",
    markers: ["Food sensitivities", "IgG antibodies", "Elimination guide"]
  }, {
    name: "Advanced Gut Microbiome",
    description: "DNA sequencing of gut bacteria",
    price: "From £299",
    markers: ["Bacterial diversity", "Beneficial bacteria", "Pathogenic bacteria", "Personalised recommendations"]
  }];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Gut Health & Microbiome Testing | Compare UK Providers | MyHealthHub</title>
        <meta name="description" content="Compare gut health tests from top UK providers. Microbiome analysis, food intolerance testing, and digestive health screening from £89." />
      </Helmet>
      <UKASBanner />
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 pt-4">
          <BackButton />
        </div>
        <HeroSection
          title="Gut Health & Microbiome Testing"
          subtitle="Discover the secrets of your gut microbiome. Advanced testing for digestive health, food intolerances, and gut-brain connection for UK adults aged 30-60."
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2 bg-amber-500 hover:bg-amber-600">
              <Activity className="h-5 w-5" />
              Compare Tests
            </Button>
            <Button variant="outline" size="lg" className="border-amber-500 text-amber-700 hover:bg-amber-50">
              Learn More
            </Button>
          </div>
        </HeroSection>

        {/* Gut Health Impact */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#081129] my-[20px]">Your Gut Affects Everything</h2>
              <p className="text-xl text-muted-foreground">The gut-body connection</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Immunity</h3>
                <p className="text-sm text-muted-foreground">70% of immune system is in your gut</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Mental Health</h3>
                <p className="text-sm text-muted-foreground">Gut produces 90% of serotonin</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Energy</h3>
                <p className="text-sm text-muted-foreground">Nutrients absorption affects energy</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Heart Health</h3>
                <p className="text-sm text-muted-foreground">Gut bacteria affect cholesterol</p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Tests */}
        <section className="py-16 bg-white/[0.31]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#081129] my-[20px]">Gut Health Testing Options</h2>
              <p className="text-xl text-muted-foreground">From basic screening to comprehensive analysis</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {gutTests.map((test, index) => <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{test.name}</CardTitle>
                      <Badge variant="secondary">{test.price}</Badge>
                    </div>
                    <p className="text-muted-foreground">{test.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">What's Analyzed:</h4>
                        <div className="flex flex-wrap gap-1">
                          {test.markers.map((marker, i) => <Badge key={i} variant="outline" className="text-xs">
                              {marker}
                            </Badge>)}
                        </div>
                      </div>
                      <Button className="w-full">Compare Providers</Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4 text-center">
            <ScrollFadeIn>
              <h2 className="text-3xl font-bold mb-4">Ready to Test Your Gut Health?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Compare providers and find the perfect gut health test for your needs. Start your digestive health journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/compare?category=gut-health" className="flex-1 sm:flex-initial">
                        <Button size="lg" className="w-full gap-2 bg-amber-500 hover:bg-amber-600">
                          <ArrowRight className="h-5 w-5" />
                          Browse All Gut Health Tests
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
export default GutHealthPage;