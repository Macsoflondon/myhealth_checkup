import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import HeroSection from '@/components/sections/HeroSection';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Droplets, Activity, Brain, Bone, Shield } from 'lucide-react';

const healthConditions = [
  {
    id: 'diabetes',
    name: 'Diabetes & Blood Sugar',
    description: 'Monitor blood glucose levels, HbA1c, and diabetes risk markers',
    icon: Droplets,
    path: '/tests/diabetes',
    colorHex: '#e70d69'
  },
  {
    id: 'heart-health',
    name: 'Heart Health',
    description: 'Cardiovascular risk assessment including cholesterol and inflammation markers',
    icon: Heart,
    path: '/tests/heart',
    colorHex: '#22c0d4'
  },
  {
    id: 'thyroid',
    name: 'Thyroid Disorders',
    description: 'Comprehensive thyroid function testing for hypo/hyperthyroidism',
    icon: Activity,
    path: '/thyroid',
    colorHex: '#22c0d4'
  },
  {
    id: 'liver',
    name: 'Liver Health',
    description: 'Liver function tests to assess liver health and detect issues early',
    icon: Shield,
    path: '/compare?category=liver',
    colorHex: '#059669'
  },
  {
    id: 'kidney',
    name: 'Kidney Function',
    description: 'Tests to monitor kidney health and detect potential problems',
    icon: Droplets,
    path: '/compare?category=kidney',
    colorHex: '#7c3aed'
  },
  {
    id: 'vitamin-deficiency',
    name: 'Vitamin Deficiencies',
    description: 'Identify nutritional deficiencies affecting your health',
    icon: Brain,
    path: '/tests/vitamins',
    colorHex: '#f59e0b'
  }
];

const ConditionsPage = () => {
  return (
    <>
      <Helmet>
        <title>Health Conditions Testing | myhealth checkup</title>
        <meta name="description" content="Specialised health tests for specific medical conditions including diabetes, heart health, thyroid disorders, and more. Professional testing from trusted UK providers." />
        <meta name="keywords" content="health conditions testing, diabetes test, heart health test, thyroid test, liver function test, kidney function test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/conditions" />
        <meta property="og:title" content="Health Conditions Testing | myhealth checkup" />
        <meta property="og:description" content="Specialised health tests for specific medical conditions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/conditions" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        
        <Header />
        
        <main className="flex-1 bg-background">
          <HeroSection
            title="Health Conditions"
            accent="Testing"
            subtitle="Specialised testing for specific health conditions and symptoms. Get answers and take control of your health."
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assisted-test-finder">
                <Button size="lg" className="bg-[#e70d69] hover:bg-[#e70d69]/90 text-white">
                  Find Your Test
                </Button>
              </Link>
              <Link to="/compare">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Compare All Tests
                </Button>
              </Link>
            </div>
          </HeroSection>

          <div className="container mx-auto px-4 pt-4">
            <PageBreadcrumb />
          </div>

          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-[#081129]">Browse by Health Condition</h2>
                  <p className="text-lg text-muted-foreground">Find the right tests for your specific health concerns</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {healthConditions.map(condition => {
                    const IconComponent = condition.icon;
                    return (
                      <Card key={condition.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${condition.colorHex}20` }}>
                              <IconComponent className="h-5 w-5" style={{ color: condition.colorHex }} />
                            </div>
                            <CardTitle className="text-xl leading-tight text-[#081129]">{condition.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm text-muted-foreground mb-4">{condition.description}</CardDescription>
                          <Link to={condition.path}>
                            <Button className="w-full text-white transition-colors" style={{ backgroundColor: condition.colorHex }}>View Tests</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-[#081129]">Not Sure Which Test You Need?</h2>
                <p className="text-lg text-muted-foreground mb-8">Use our guided questionnaire to find the perfect test for your symptoms</p>
                <Link to="/assisted-test-finder">
                  <Button size="lg" className="bg-[#e70d69] hover:bg-[#e70d69]/90 text-white">Take Our Health Questionnaire</Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ConditionsPage;
