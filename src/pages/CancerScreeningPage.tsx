import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Users, CheckCircle, Dna, ArrowRight } from 'lucide-react';
const CancerScreeningPage = () => {
  const screeningTypes = [{
    name: "Bowel Cancer Screening",
    description: "Advanced FIT test for early detection",
    price: "From £89",
    turnaround: "5-7 days",
    biomarkers: ["Faecal Immunochemical Test", "Blood in stool detection"]
  }, {
    name: "Prostate Cancer Panel",
    description: "Comprehensive PSA testing for men 40+",
    price: "From £125",
    turnaround: "3-5 days",
    biomarkers: ["PSA Total", "PSA Free", "PSA Ratio"]
  }, {
    name: "Cervical Cancer Screening",
    description: "HPV testing and cytology",
    price: "From £149",
    turnaround: "7-10 days",
    biomarkers: ["HPV DNA", "Cytology", "High-risk HPV types"]
  }, {
    name: "Multi-Cancer Detection",
    description: "Blood-based early detection panel",
    price: "From £399",
    turnaround: "10-14 days",
    biomarkers: ["Circulating tumor DNA", "Protein biomarkers", "50+ cancer types"]
  }];
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Cancer Screening Tests | Early Detection & Prevention | Compare UK Providers</title>
        <meta name="description" content="Compare cancer screening tests from leading UK providers. Prostate, bowel, breast, cervical cancer testing and early detection from top clinics." />
      </Helmet>
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center bg-[#1a1b34]">
              <div className="bg-red-500 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Dna className="h-8 w-8 text-white" />
              </div>
              <Badge className="mb-4 text-red-800 bg-white">Early Detection</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#22c0d4]">
                Cancer Screening & Early Detection
              </h1>
              <p className="text-xl mb-8 text-white">
                Comprehensive cancer screening tests for early detection and peace of mind. 
                Regular screening saves lives - start your prevention journey today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2 bg-[#e70d69]">
                  <Shield className="h-5 w-5" />
                  Compare Tests
                </Button>
                <Button variant="outline" size="lg" className="border-red-500 text-red-700 hover:bg-red-50">
                  Learn More
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
                <p className="text-[#e70d69]">All tests processed in UK-regulated laboratories</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Results</h3>
                <p className="text-[#e70d69]">Results within 3-14 days depending on test</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Review</h3>
                <p className="text-[#e70d69]">All results reviewed by qualified healthcare professionals</p>
              </div>
            </div>
          </div>
        </section>

        {/* Screening Tests */}
        <section className="py-16 bg-[#1a1b34]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#22c0d4]">Available Cancer Screening Tests</h2>
              <p className="text-xl text-[#e70d69]">Choose from our range of evidence-based screening options</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {screeningTypes.map((test, index) => <Card key={index} className="relative">
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
                          {test.biomarkers.map((marker, i) => <Badge key={i} variant="outline" className="text-xs">
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
        <section className="py-16 bg-[#1a1b34]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-[#22c0d4]">Start Your Cancer Prevention Journey</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
              Early detection saves lives. Compare cancer screening tests from trusted UK providers and take control of your health.
            </p>
            <Button size="lg" className="gap-2 bg-[#e70d69]">
              <ArrowRight className="h-5 w-5" />
              Compare All Cancer Tests
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default CancerScreeningPage;