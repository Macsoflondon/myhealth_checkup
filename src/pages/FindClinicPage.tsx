import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UKASBanner from "@/components/UKASBanner";
import ClinicFinder from "@/components/ClinicFinder";
import { MapPin, Shield, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/sections/HeroSection";

const FindClinicPage = () => {
  const benefits = [
    {
      icon: MapPin,
      title: "Nationwide Coverage",
      description: "150+ clinic locations across the UK from 7 trusted providers"
    },
    {
      icon: Shield,
      title: "UKAS Accredited",
      description: "All clinics partner with UKAS-accredited laboratories"
    },
    {
      icon: Clock,
      title: "Convenient Hours",
      description: "Flexible appointment times including evenings and weekends"
    },
    {
      icon: Award,
      title: "Professional Service",
      description: "Trained phlebotomists and modern clinical facilities"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Find a Blood Test Clinic Near You | myhealth checkup</title>
        <meta 
          name="description" 
          content="Find UKAS-accredited blood test clinics near you. Search by postcode, filter by distance and provider. 150+ locations nationwide from trusted UK providers." 
        />
        <meta 
          name="keywords" 
          content="blood test clinic, phlebotomy clinic, private blood test location, UKAS clinic, health test centre near me, UK blood test" 
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/find-clinic" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Find a Blood Test Clinic Near You | myhealth checkup" />
        <meta property="og:description" content="Find UKAS-accredited blood test clinics near you. 150+ locations nationwide from trusted UK providers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/find-clinic" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find a Blood Test Clinic Near You" />
        <meta name="twitter:description" content="Search UKAS-accredited blood test clinics by postcode. 150+ locations nationwide." />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "myhealth checkup - Clinic Finder",
            "description": "Find UKAS-accredited blood test clinics across the UK",
            "url": "https://myhealthcheckup.co.uk/find-clinic",
            "areaServed": {
              "@type": "Country",
              "name": "United Kingdom"
            }
          })}
        </script>
      </Helmet>

      <UKASBanner />
      <Header />

      <main className="min-h-screen bg-background">
        <HeroSection
          title="Find Your Nearest Blood Test Clinic"
          subtitle="Search over 150 UKAS-accredited clinic locations across the UK. Enter your postcode to find convenient testing facilities near you."
        >
          {/* Stats Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-bold text-[#FA6980]">7</span>
              <span className="text-white ml-2">Trusted Providers</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-bold text-[#22C0D4]">150+</span>
              <span className="text-white ml-2">Clinic Locations</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-bold text-[#FA6980]">UKAS</span>
              <span className="text-white ml-2">Accredited Labs</span>
            </div>
          </div>
        </HeroSection>

        {/* Benefits Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-[#FA6980]/10 flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-7 h-7 text-[#FA6980]" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Clinic Finder */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <ClinicFinder />
          </div>
        </section>

        {/* Information Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-muted">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#081129]">
                    About Our Clinic Network
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      All clinics in our network partner with UKAS-accredited laboratories, 
                      ensuring the highest standards of testing accuracy and reliability. 
                      Our clinic finder helps you locate convenient testing facilities across the UK.
                    </p>
                    <p>
                      <strong className="text-foreground">Sample Collection Methods:</strong> Most clinics offer venous blood draw services 
                      performed by qualified phlebotomists. Some providers also offer finger-prick 
                      tests for specific panels.
                    </p>
                    <p>
                      <strong className="text-foreground">Booking Process:</strong> Once you've selected a test from our comparison tool, 
                      you'll be directed to the provider's website to book your appointment. 
                      You can then choose your preferred clinic location during the booking process.
                    </p>
                    <p className="text-sm border-t pt-4 mt-4">
                      <strong className="text-foreground">Disclaimer:</strong> This platform provides general health information. 
                      It is not medical advice or a substitute for consultation with a qualified 
                      healthcare professional. All tests are delivered, processed, and reported 
                      by the provider you select.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Providers Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Partnered Testing Providers
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our clinic network includes locations from seven trusted UK private health testing providers
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 items-center">
                {[
                  { name: "Medichecks", logo: "/lovable-uploads/provider-medichecks-new-v3.png" },
                  { name: "Thriva", logo: "/lovable-uploads/provider-thriva.png" },
                  { name: "Goodbody", logo: "/lovable-uploads/provider-goodbody-new-v4.png" },
                  { name: "Randox", logo: "/lovable-uploads/provider-randox.png" },
                  { name: "Tuli Health", logo: "/lovable-uploads/provider-tuli-health.png" },
                  { name: "Lola Health", logo: "/lovable-uploads/provider-lola-health.png" },
                  { name: "London Medical Lab", logo: "/lovable-uploads/provider-london-medical.png" }
                ].map((provider, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <img 
                      src={provider.logo} 
                      alt={`${provider.name} logo`}
                      className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default FindClinicPage;
