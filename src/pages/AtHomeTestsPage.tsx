import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UKASBanner from '@/components/UKASBanner';
import HeroSection from '@/components/sections/HeroSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Clock, Shield, CheckCircle, Droplets, TestTube2 } from 'lucide-react';

const atHomeTestCategories = [
  {
    id: 'finger-prick',
    name: 'Finger Prick Tests',
    description: 'Simple self-collection tests with just a few drops of blood',
    icon: Droplets,
    testCount: 45,
    colorHex: '#e70d69'
  },
  {
    id: 'saliva',
    name: 'Saliva Tests',
    description: 'Non-invasive hormone and wellness testing',
    icon: TestTube2,
    testCount: 12,
    colorHex: '#22c0d4'
  },
  {
    id: 'urine',
    name: 'Urine Tests',
    description: 'Convenient sample collection for various health markers',
    icon: TestTube2,
    testCount: 8,
    colorHex: '#3A5F85'
  }
];

const AtHomeTestsPage = () => {
  return (
    <>
      <Helmet>
        <title>At-Home Health Tests | Convenient Home Testing Kits | myhealth checkup</title>
        <meta name="description" content="Convenient at-home health testing kits with professional lab analysis and fast results. Finger prick, saliva, and urine tests delivered to your door." />
        <meta name="keywords" content="at home blood test, home testing kit, finger prick test, health test at home, private blood test UK" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/at-home-tests" />
        
        <meta property="og:title" content="At-Home Health Tests | myhealth checkup" />
        <meta property="og:description" content="Convenient at-home health testing kits with professional lab analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/at-home-tests" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <UKASBanner />
        <Header />
        
        <main className="flex-1 bg-background">
          <HeroSection
            title="At-Home Health Tests"
            subtitle="Take control of your health with our convenient at-home testing kits. Professional lab analysis with results delivered securely online."
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Home className="h-5 w-5 text-[#22c0d4]" />
              <span className="text-white text-sm font-medium">Test from the comfort of home</span>
            </div>
          </HeroSection>

          {/* Action Buttons Bar */}
          <section className="bg-[#22C0D4] py-4">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/compare?collection=home">
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

          {/* Benefits */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Home className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#081129]">Convenient</h3>
                    <p className="text-muted-foreground">
                      Test from home - no clinic visit required. Kits delivered to your door.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#081129]">Fast Results</h3>
                    <p className="text-muted-foreground">
                      Results typically available within 24-48 hours of lab receipt.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#081129]">UKAS Accredited</h3>
                    <p className="text-muted-foreground">
                      All samples analysed in UKAS-accredited laboratories.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Test Categories */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-[#081129]">
                    Browse by Sample Type
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Choose the collection method that suits you best
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {atHomeTestCategories.map(category => {
                    const IconComponent = category.icon;
                    return (
                      <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${category.colorHex}20` }}
                            >
                              <IconComponent className="h-5 w-5" style={{ color: category.colorHex }} />
                            </div>
                            <CardTitle className="text-xl leading-tight text-[#081129]">
                              {category.name}
                            </CardTitle>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {category.testCount} tests available
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm text-muted-foreground mb-4">
                            {category.description}
                          </CardDescription>
                          <Link to={`/compare?sample=${category.id}`}>
                            <Button 
                              className="w-full text-white transition-colors"
                              style={{ backgroundColor: category.colorHex }}
                            >
                              View Tests
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-[#081129]">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    How At-Home Testing Works
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { step: '1', title: 'Order Online', desc: 'Choose your test and have it delivered' },
                    { step: '2', title: 'Collect Sample', desc: 'Follow simple instructions at home' },
                    { step: '3', title: 'Post Back', desc: 'Use the prepaid return envelope' },
                    { step: '4', title: 'Get Results', desc: 'View results online within 48 hours' }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-[#081129]">
                  Ready to Test from Home?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Compare at-home tests from trusted UK providers
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/compare?collection=home">
                    <Button size="lg" className="bg-[#e70d69] hover:bg-[#e70d69]/90 text-white">
                      Browse All At-Home Tests
                    </Button>
                  </Link>
                  <Link to="/find-clinic">
                    <Button size="lg" variant="outline" className="border-[#22c0d4] text-[#22c0d4] hover:bg-[#22c0d4]/10">
                      Prefer a Clinic Visit?
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AtHomeTestsPage;