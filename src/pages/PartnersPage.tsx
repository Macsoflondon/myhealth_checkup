import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UKASBanner from '@/components/UKASBanner';
import HeroSection from '@/components/sections/HeroSection';
import PageHeading from '@/components/ui/page-heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Award, Users, TrendingUp } from 'lucide-react';
const PartnersPage = () => {
  const partnerTiers = [{
    name: "Premium Partners",
    description: "Leading healthcare providers with comprehensive test portfolios",
    partners: [{
      name: "Medichecks",
      specialty: "Comprehensive health testing",
      accreditation: "UKAS"
    }, {
      name: "Thriva",
      specialty: "Subscription health monitoring",
      accreditation: "MHRA"
    }, {
      name: "Everlywell",
      specialty: "At-home testing solutions",
      accreditation: "CLIA"
    }, {
      name: "Forth",
      specialty: "Hormone and fertility testing",
      accreditation: "UKAS"
    }]
  }, {
    name: "Specialist Partners",
    description: "Expert providers focusing on specific health areas",
    partners: [{
      name: "Randox Health",
      specialty: "Advanced diagnostics",
      accreditation: "ISO 15189"
    }, {
      name: "Blue Horizon",
      specialty: "Thyroid and nutrition",
      accreditation: "UKAS"
    }, {
      name: "London Medical Laboratory",
      specialty: "Executive health screening",
      accreditation: "CQC"
    }, {
      name: "Better2Know",
      specialty: "Sexual health testing",
      accreditation: "UKAS"
    }]
  }];
  const accreditations = [{
    name: "UKAS",
    description: "United Kingdom Accreditation Service",
    icon: Shield
  }, {
    name: "CQC",
    description: "Care Quality Commission",
    icon: Award
  }, {
    name: "MHRA",
    description: "Medicines and Healthcare Regulatory Agency",
    icon: Shield
  }, {
    name: "ISO 15189",
    description: "Medical Laboratory Standard",
    icon: Award
  }];
  return <div className="min-h-screen flex flex-col">
      <UKASBanner />
      <Header />
      <main className="flex-grow">
        <HeroSection
          title="Our Healthcare"
          accent="Partners"
          subtitle="We partner with the UK's most trusted and accredited healthcare providers to bring you reliable, high-quality health testing services."
        />

        {/* Partner Standards */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#081129]">Our Partnership Standards</h2>
              <p className="text-[#081129] font-medium text-base">Every partner meets our strict quality criteria</p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {accreditations.map((accreditation, index) => <Card key={index} className="text-center p-3 bg-[#081129] shadow-white shadow-lg">
                  <accreditation.icon className="h-8 w-8 text-white mx-auto mb-2" />
                  <h3 className="mb-1 text-[#22c0d4] text-base font-bold">{accreditation.name}</h3>
                  <p className="text-xs text-[#22c0d4] font-semibold">{accreditation.description}</p>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Partner Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#081129]">Partner Network</h2>
              <p className="text-xl text-[#081129]">Curated providers across all health testing categories</p>
            </div>
            <div className="space-y-12">
              {partnerTiers.map((tier, tierIndex) => <div key={tierIndex}>
                  <div className="text-center mb-8">
                    <h3 className="font-bold mb-2 text-2xl text-[#081129]">{tier.name}</h3>
                    <p className="font-medium text-[#081129]">{tier.description}</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tier.partners.map((partner, partnerIndex) => <Card key={partnerIndex} className="relative rounded-3xl">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{partner.name}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {partner.accreditation}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="bg-white">
                          <p className="mb-4 text-[#081129] text-sm font-semibold">{partner.specialty}</p>
                          <Button variant="outline" size="sm" className="w-full">
                            View Tests
                          </Button>
                        </CardContent>
                      </Card>)}
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Partnership Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#081129]">Why Providers Partner With Us</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Users className="h-8 w-8 text-[#081129]" />
                    <h3 className="text-xl font-semibold">Reach More Customers</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Connect with health-conscious UK adults aged 30-60 actively seeking quality health testing services.
                  </p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <TrendingUp className="h-8 w-8 text-[#081129]" />
                    <h3 className="text-xl font-semibold">Increase Visibility</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Showcase your services alongside industry leaders and benefit from our marketing reach.
                  </p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Shield className="h-8 w-8 text-[#081129]" />
                    <h3 className="text-xl font-semibold">Quality Assurance</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Join a network of trusted providers committed to the highest standards of healthcare delivery.
                  </p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Award className="h-8 w-8 text-[#081129]" />
                    <h3 className="text-xl font-semibold">Industry Recognition</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Gain recognition as a preferred provider in the UK's leading health testing comparison platform.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Become a Partner */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-[#081129]">Become a Partner</h2>
              <p className="text-xl text-[#081129] mb-8">
                Are you a healthcare provider interested in joining our network? 
                We'd love to hear from you.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Partnership Requirements</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• UKAS or equivalent accreditation</li>
                    <li>• UK regulatory compliance</li>
                    <li>• Proven quality standards</li>
                    <li>• Customer service excellence</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">What We Offer</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 bg-[#081129]">
                    <li>• Marketing support</li>
                    <li>• Technology integration</li>
                    <li>• Customer insights</li>
                    <li className="text-[t#ransparent] text-white">• Performance analytics</li>
                  </ul>
                </Card>
              </div>
              <Button size="lg">Apply to Become a Partner</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default PartnersPage;