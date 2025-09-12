import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedProviders from '@/components/FeaturedProviders';

const TrustedProvidersPage = () => {
  return (
    <>
      <Helmet>
        <title>Trusted UK Health Test Providers | Quality Assured Testing Services</title>
        <meta 
          name="description" 
          content="Discover our network of trusted, accredited UK health test providers. UKAS certified labs, CQC registered clinics, and award-winning testing services." 
        />
        <meta name="keywords" content="trusted UK health providers, UKAS accredited labs, CQC registered clinics, health test providers, medical testing UK" />
        <link rel="canonical" href="https://healthhubcompare.com/trusted-providers" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Trusted UK Health Test Providers | Quality Assured Testing Services" />
        <meta property="og:description" content="Discover our network of trusted, accredited UK health test providers. UKAS certified labs and award-winning testing services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://healthhubcompare.com/trusted-providers" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trusted UK Health Test Providers" />
        <meta name="twitter:description" content="Discover our network of trusted, accredited UK health test providers." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Trusted UK Health Test Providers",
            "description": "Network of trusted, accredited UK health test providers with UKAS certification and CQC registration",
            "url": "https://healthhubcompare.com/trusted-providers",
            "mainEntity": {
              "@type": "Organization",
              "name": "HealthHub Compare",
              "description": "UK's leading health test comparison platform"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <FeaturedProviders />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TrustedProvidersPage;