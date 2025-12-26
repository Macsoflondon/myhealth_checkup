import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UKASBanner from '@/components/UKASBanner';
import ScrollFadeIn from '@/components/common/ScrollFadeIn';
import HeroSection from '@/components/sections/HeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sun, Zap, Shield, Leaf } from 'lucide-react';
const VitaminDeficiencyPage = () => {
  const vitaminTests = [{
    name: "Vitamin D Test",
    description: "Essential for bone health & immunity",
    price: "From £39",
    deficiency: "Very common in UK",
    symptoms: ["Fatigue", "Bone pain", "Muscle weakness", "Mood changes"]
  }, {
    name: "B12 & Folate Panel",
    description: "Energy and nervous system support",
    price: "From £69",
    deficiency: "Common in vegetarians",
    symptoms: ["Tiredness", "Memory issues", "Mood disorders", "Tingling"]
  }, {
    name: "Iron Studies",
    description: "Complete iron deficiency screening",
    price: "From £89",
    deficiency: "Affects 25% of women",
    symptoms: ["Fatigue", "Pale skin", "Cold hands", "Brittle nails"]
  }, {
    name: "Complete Vitamin Panel",
    description: "Comprehensive vitamin & mineral analysis",
    price: "From £199",
    deficiency: "Multiple deficiencies",
    symptoms: ["Multiple symptoms", "Poor immunity", "Low energy", "Poor healing"]
  }];
  const commonDeficiencies = [{
    vitamin: "Vitamin D",
    percentage: "40%",
    icon: Sun,
    color: "text-yellow-600"
  }, {
    vitamin: "Iron",
    percentage: "25%",
    icon: Zap,
    color: "text-red-600"
  }, {
    vitamin: "B12",
    percentage: "15%",
    icon: Shield,
    color: "text-blue-600"
  }, {
    vitamin: "Folate",
    percentage: "10%",
    icon: Leaf,
    color: "text-green-600"
  }];
  return <div className="min-h-screen flex flex-col">
      <UKASBanner />
      <Header />
      <main className="flex-grow">
        <HeroSection
          title="Vitamin & Mineral Testing"
          subtitle="Discover hidden vitamin deficiencies affecting your energy, immunity, and wellbeing. Essential testing for health-conscious UK adults aged 30-60."
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Leaf className="h-5 w-5" />
              Test My Vitamins
            </Button>
            <Button variant="outline" size="lg">
              Symptoms Checker
            </Button>
          </div>
        </HeroSection>

        {/* Common Deficiencies */}
        

        {/* Available Tests */}
        <section className="py-16 bg-white/[0.31]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#081129] my-[20px]">Vitamin Deficiency Tests</h2>
              <p className="text-xl text-muted-foreground">Identify and address nutritional gaps</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {vitaminTests.map((test, index) => <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{test.name}</CardTitle>
                      <Badge variant="secondary">{test.price}</Badge>
                    </div>
                    <p className="text-muted-foreground">{test.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-amber-800">{test.deficiency}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Common Symptoms:</h4>
                        <div className="flex flex-wrap gap-1">
                          {test.symptoms.map((symptom, i) => <Badge key={i} variant="outline" className="text-xs">
                              {symptom}
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

        {/* Why Test For Deficiencies */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#081129] my-[20px]">Why Test for Vitamin Deficiencies?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    Boost Energy Levels
                  </h3>
                  <p className="text-muted-foreground">
                    Many people suffer from chronic fatigue due to undiagnosed vitamin deficiencies. 
                    B12, Iron, and Vitamin D are crucial for energy production.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-500" />
                    Strengthen Immunity
                  </h3>
                  <p className="text-muted-foreground">
                    Vitamins C, D, and Zinc are essential for a strong immune system. 
                    Deficiencies can lead to frequent infections and slow recovery.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sun className="h-6 w-6 text-orange-500" />
                    Improve Mood
                  </h3>
                  <p className="text-muted-foreground">
                    Vitamin D, B12, and Folate deficiencies are linked to depression and mood disorders. 
                    Proper levels support mental wellbeing.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-green-500" />
                    Support Long-term Health
                  </h3>
                  <p className="text-muted-foreground">
                    Prevent long-term complications like osteoporosis, cardiovascular disease, 
                    and neurological problems through early detection and correction.
                  </p>
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
                  Discover Your Vitamin Levels Today
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Compare vitamin tests from trusted UK providers or find a clinic near you
                </p>
                <TooltipProvider>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/compare?category=vitamins" className="flex-1 sm:flex-initial">
                          <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-health-heading">
                            Browse All Vitamin Tests
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
    </div>;
};
export default VitaminDeficiencyPage;