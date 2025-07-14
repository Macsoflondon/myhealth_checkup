import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Users, CheckCircle } from 'lucide-react';

const CancerScreeningPage = () => {
  const screeningTypes = [
    {
      name: "Bowel Cancer Screening",
      description: "Advanced FIT test for early detection",
      price: "From £89",
      turnaround: "5-7 days",
      biomarkers: ["Faecal Immunochemical Test", "Blood in stool detection"]
    },
    {
      name: "Prostate Cancer Panel",
      description: "Comprehensive PSA testing for men 40+",
      price: "From £125",
      turnaround: "3-5 days", 
      biomarkers: ["PSA Total", "PSA Free", "PSA Ratio"]
    },
    {
      name: "Cervical Cancer Screening",
      description: "HPV testing and cytology",
      price: "From £149",
      turnaround: "7-10 days",
      biomarkers: ["HPV DNA", "Cytology", "High-risk HPV types"]
    },
    {
      name: "Multi-Cancer Detection",
      description: "Blood-based early detection panel",
      price: "From £399",
      turnaround: "10-14 days",
      biomarkers: ["Circulating tumor DNA", "Protein biomarkers", "50+ cancer types"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Early Detection Saves Lives</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Cancer Screening Tests
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Advanced screening tests for early cancer detection. UKAS-accredited labs, 
                expert-reviewed results, and comprehensive support for UK adults aged 30-60.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <Shield className="h-5 w-5" />
                  Compare Tests
                </Button>
                <Button variant="outline" size="lg">
                  Speak to Expert
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">UKAS Accredited</h3>
                <p className="text-muted-foreground">All tests processed in UK-regulated laboratories</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Results</h3>
                <p className="text-muted-foreground">Results within 3-14 days depending on test</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Review</h3>
                <p className="text-muted-foreground">All results reviewed by qualified healthcare professionals</p>
              </div>
            </div>
          </div>
        </section>

        {/* Screening Tests */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Available Cancer Screening Tests</h2>
              <p className="text-xl text-muted-foreground">Choose from our range of evidence-based screening options</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {screeningTypes.map((test, index) => (
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
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Results in {test.turnaround}</span>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Biomarkers Tested:</h4>
                        <div className="flex flex-wrap gap-1">
                          {test.biomarkers.map((marker, i) => (
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

        {/* Who Should Get Screened */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Who Should Consider Cancer Screening?</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">Adults 30-60 Years</h3>
                        <p className="text-muted-foreground">Health-conscious individuals looking for preventive care and early detection</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">Family History</h3>
                        <p className="text-muted-foreground">Those with family history of cancer or genetic predisposition</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">Lifestyle Risk Factors</h3>
                        <p className="text-muted-foreground">Smokers, heavy drinkers, or those with other risk factors</p>
                      </div>
                    </div>
                  </CardContent>
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

export default CancerScreeningPage;