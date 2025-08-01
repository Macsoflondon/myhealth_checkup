import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Shield, Heart } from 'lucide-react';

const GutHealthPage = () => {
  const gutTests = [
    {
      name: "Basic Gut Health",
      description: "Essential digestive markers",
      price: "From £89",
      markers: ["Calprotectin", "Gut inflammation", "Basic microbiome"]
    },
    {
      name: "Comprehensive Stool Analysis",
      description: "Complete digestive function assessment",
      price: "From £179",
      markers: ["Microbiome diversity", "Parasites", "Yeast", "Inflammation", "Digestion"]
    },
    {
      name: "Food Intolerance Panel",
      description: "IgG antibody testing for 200+ foods",
      price: "From £149",
      markers: ["Food sensitivities", "IgG antibodies", "Elimination guide"]
    },
    {
      name: "Advanced Gut Microbiome",
      description: "DNA sequencing of gut bacteria",
      price: "From £299",
      markers: ["Bacterial diversity", "Beneficial bacteria", "Pathogenic bacteria", "Personalised recommendations"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-purple-100 text-purple-800">Digestive Health</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Gut Health & Microbiome Testing
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover the secrets of your gut microbiome. Advanced testing for digestive health, 
                food intolerances, and gut-brain connection for UK adults aged 30-60.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <Activity className="h-5 w-5" />
                  Test My Gut
                </Button>
                <Button variant="outline" size="lg">
                  Symptoms Guide
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Gut Health Impact */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Your Gut Affects Everything</h2>
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
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Gut Health Testing Options</h2>
              <p className="text-xl text-muted-foreground">From basic screening to comprehensive analysis</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {gutTests.map((test, index) => (
                <Card key={index} className="relative">
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
                          {test.markers.map((marker, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {marker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full">Compare Providers</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Common Gut Issues */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Common Gut Health Issues</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">IBS Symptoms</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Bloating and gas</li>
                    <li>• Abdominal pain</li>
                    <li>• Irregular bowel movements</li>
                    <li>• Food sensitivities</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Microbiome Imbalance</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Frequent infections</li>
                    <li>• Mood disorders</li>
                    <li>• Skin problems</li>
                    <li>• Weight management issues</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Food Intolerances</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Digestive discomfort after eating</li>
                    <li>• Headaches or migraines</li>
                    <li>• Joint pain</li>
                    <li>• Fatigue after meals</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Leaky Gut Syndrome</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Chronic inflammation</li>
                    <li>• Autoimmune reactions</li>
                    <li>• Nutrient deficiencies</li>
                    <li>• Mental fog</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GutHealthPage;