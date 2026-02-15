import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RecommendationEngine from '@/components/ai/RecommendationEngine';

const RecommendationsPage = () => {
  return (
    <>
      <Helmet>
        <title>AI Health Recommendations - Personalised Wellness Test Suggestions | myhealth checkup</title>
        <meta 
          name="description" 
          content="Get personalized health test recommendations from our AI-powered wellness assistant. Discover relevant tests from trusted UK providers based on your wellness goals and health interests." 
        />
        <meta name="keywords" content="health test recommendations, AI wellness assistant, personalized health screening, UK health tests, preventive healthcare" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/recommendations" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="AI Health Recommendations - Personalized Wellness Test Suggestions" />
        <meta property="og:description" content="Get personalized health test recommendations from our AI-powered wellness assistant. Discover relevant tests from trusted UK providers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/recommendations" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Health Recommendations - Personalized Wellness Test Suggestions" />
        <meta name="twitter:description" content="Get personalized health test recommendations from our AI-powered wellness assistant." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Health Recommendations",
            "description": "AI-powered wellness test recommendation system for personalized health screening suggestions",
            "url": "https://myhealthcheckup.co.uk/recommendations",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "GBP"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <RecommendationEngine />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default RecommendationsPage;