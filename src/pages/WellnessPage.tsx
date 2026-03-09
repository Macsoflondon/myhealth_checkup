import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UKASBanner from "@/components/UKASBanner";
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import { Button } from "@/components/ui/button";
import { Heart, Activity, Shield } from "lucide-react";
import HeroSection from "@/components/sections/HeroSection";

const wellnessCategoryCards = [
  { id: "longevity-tests", name: "Longevity Tests", count: 3, desc: "Comprehensive health markers for longevity and preventive care", icon: "⟳", accent: "#00d4c8", tag: "PREVENTIVE" },
  { id: "iron-tests", name: "Iron Tests", count: 2, desc: "Iron levels, ferritin, and anaemia screening", icon: "◈", accent: "#e91e8c", tag: "ESSENTIAL" },
  { id: "heart-health", name: "Heart Health", count: 2, desc: "Cardiovascular risk assessment and heart health monitoring", icon: "♡", accent: "#ff4d6d", tag: "CRITICAL" },
  { id: "energy-tests", name: "Energy Tests", count: 3, desc: "Fatigue, tiredness, and energy level testing", icon: "◎", accent: "#f0a500", tag: "WELLNESS" },
  { id: "nutrition-tests", name: "Nutrition Tests", count: 2, desc: "Vitamin levels and nutritional deficiency screening", icon: "◇", accent: "#00c896", tag: "WELLNESS" },
  { id: "allergy-testing", name: "Allergy Tests", count: 1, desc: "Allergy screening and immune response testing", icon: "◉", accent: "#ff7043", tag: "IMMUNE" },
  { id: "sexual-health", name: "Sexual Health", count: 2, desc: "Comprehensive sexual health and hormone screening", icon: "⬡", accent: "#9b59b6", tag: "SPECIALIST" },
  { id: "gp-monitoring", name: "GP Monitoring", count: 4, desc: "Routine health checks and general practitioner monitoring", icon: "⊕", accent: "#00b4d8", tag: "ROUTINE" },
  { id: "antibody-tests", name: "Antibody Tests", count: 2, desc: "Antibody screening and autoimmune disease detection", icon: "⋈", accent: "#e91e8c", tag: "IMMUNE" },
  { id: "infection-tests", name: "Infection Tests", count: 2, desc: "Infectious disease screening and pathogen detection", icon: "⬟", accent: "#5b9bd5", tag: "SPECIALIST" },
  { id: "immunity-tests", name: "Immunity Tests", count: 2, desc: "Immune system function and defense assessment", icon: "◬", accent: "#f0b429", tag: "IMMUNE" },
  { id: "autoimmunity-tests", name: "Autoimmunity", count: 2, desc: "Autoimmune condition screening and monitoring", icon: "◑", accent: "#e91e8c", tag: "SPECIALIST" },
  { id: "liver-health", name: "Liver Health", count: 2, desc: "Liver function testing and hepatic health monitoring", icon: "⬢", accent: "#ff5c5c", tag: "ORGAN" },
  { id: "kidney-health", name: "Kidney Health", count: 1, desc: "Kidney function assessment and renal health screening", icon: "◐", accent: "#00d4c8", tag: "ORGAN" },
];

const tagColors: Record<string, string> = {
  PREVENTIVE: "#00d4c8",
  ESSENTIAL: "#e91e8c",
  CRITICAL: "#ff4d6d",
  WELLNESS: "#00c896",
  IMMUNE: "#9b59b6",
  SPECIALIST: "#5b9bd5",
  ROUTINE: "#00b4d8",
  ORGAN: "#ff7043",
};

const WellnessPage = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const tags = ["ALL", ...Array.from(new Set(wellnessCategoryCards.map((c) => c.tag)))];
  const filtered = filter === "ALL" ? wellnessCategoryCards : wellnessCategoryCards.filter((c) => c.tag === filter);
  return <>
      <Helmet>
        <title>Wellness Blood Tests | Comprehensive Health Screening | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Comprehensive wellness blood tests including liver, kidney, cardiac risk, sports fitness, and stress testing. Professional health screening from £25." />
        <meta name="keywords" content="wellness blood tests, health screening, liver test, kidney test, cardiac risk, sports fitness test, anaemia test, cortisol test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/wellness" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Wellness Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Comprehensive wellness blood tests for optimal health monitoring and screening" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/wellness" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wellness Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Comprehensive wellness blood tests for optimal health monitoring" />
      </Helmet>
      
      <UKASBanner />
      <Header />
      
      <main className="min-h-screen bg-background">
        <PageBreadcrumb 
          segments={[{ label: "Home", href: "/" }, { label: "Wellness" }]} 
          backLabel="Back"
        />
        <HeroSection
          title="General Wellness"
          subtitle="Comprehensive wellness and lifestyle health tests to optimize your wellbeing. Monitor key health markers and prevent potential health issues."
        />

        {/* Action Buttons Bar */}
        <section className="bg-[#22C0D4] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/compare?category=general-health">
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
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-12">
                Why Choose Wellness Testing?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Identify potential health issues before they become serious problems
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Optimize Performance</h3>
                  <p className="text-muted-foreground">
                    Monitor key biomarkers to enhance your physical and mental performance
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Heart className="h-8 w-8 text-white" />
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

        {/* Category Grid */}
        <section className="py-16 bg-[#081129]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-[#22c0d4]">
                  Browse Tests by Category
                </h2>
                <p className="text-lg text-white">
                  Choose from our comprehensive range of wellness testing categories
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wellnessCategories.map(category => {
                const IconComponent = category.icon;
                return <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${category.colorClass}`} style={{
                        backgroundColor: category.colorHex
                      }} />
                          <CardTitle className="text-xl leading-tight text-health-heading">
                            {category.name}
                          </CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {category.testCount} {category.testCount === 1 ? 'test' : 'tests'}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm text-muted-foreground mb-4">
                          {category.description}
                        </CardDescription>
                        <Link to={`/compare?category=${category.id}`}>
                          <Button className="w-full transition-colors" style={{
                        backgroundColor: category.colorHex,
                        color: 'white'
                      }}>
                            View Tests
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>;
              })}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>;
};
export default WellnessPage;