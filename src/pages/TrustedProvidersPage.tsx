import React from 'react';
import QuizCTABanner from "@/components/sections/QuizCTABanner";
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedProvidersGlass from '@/components/sections/FeaturedProvidersGlass';
import { StandardPageHero } from '@/components/layout/StandardPageHero';

const TrustedProvidersPage = () => {
  return (
    <>
      <Helmet>
         <meta name="keywords" content="trusted UK health providers, UKAS accredited labs, CQC regulated clinics, health test providers, medical testing UK" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Trusted UK Health Test Providers",
            "description": "Network of trusted & accredited UK health test providers with UKAS certification and CQC registration",
            "url": "https://myhealthcheckup.co.uk/trusted-providers",
            "mainEntity": {
              "@type": "Organization",
              "name": "myhealth checkup",
              "description": "UK's leading health test comparison platform"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <StandardPageHero
          title="Our Providers"
          strapline="The UKAS-accredited laboratories and CQC-regulated clinics we compare, with their accreditations shown in full."
          stats={["UKAS-accredited labs", "CQC regulated", "ISO 15189 where applicable"]}
        />
        <main className="flex-1">
          <FeaturedProvidersGlass />
        </main>
      <section className="bg-white py-12 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <QuizCTABanner />
        </div>
      </section>
        <Footer />
      </div>
    </>
  );
};

export default TrustedProvidersPage;