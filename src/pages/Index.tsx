import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewHero from "@/components/NewHero";
import FeaturedProviders from "@/components/FeaturedProviders";
import CategoryFilters from "@/components/CategoryFilters";
import TestCategories from "@/components/TestCategories";
import MediaSpotlight from "@/components/MediaSpotlight";
import HealthBenefitsInfographic from "@/components/HealthBenefitsInfographic";
import FounderStory from "@/components/FounderStory";
import PartnerShowcase from "@/components/PartnerShowcase";
import HowItWorks from "@/components/HowItWorks";
import HealthResources from "@/components/HealthResources";
import CallToAction from "@/components/CallToAction";
import ClinicMap from "@/components/ClinicMap";
import CookieConsent from "@/components/compliance/CookieConsent";
import { VideoUpload } from "@/components/VideoUpload";
import { VideoPlayer } from "@/components/VideoPlayer";
import MostPopularTests from "@/components/MostPopularTests";
import UKASBanner from "@/components/UKASBanner";
const Index = () => {
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "myhealth checkup - UK's Leading Health Test Comparison Platform",
    "description": "Compare private blood tests, health screenings, and wellness services across 10+ leading UK providers. Hospital-grade testing with high-street convenience for health-conscious adults aged 30-60.",
    "url": "https://myhealthhub.co.uk",
    "sameAs": ["https://www.facebook.com/myhealthhub", "https://www.twitter.com/myhealthhub", "https://www.instagram.com/myhealthhub"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "United Kingdom"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Health-conscious adults aged 30-60",
      "geographicArea": "United Kingdom"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": "29",
      "highPrice": "299",
      "offerCount": "100+"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>myhealth checkup - Compare Private Blood Tests & Health Screenings UK 2024</title>
        <meta name="description" content="UK's leading health test comparison platform. Compare private blood tests, hormone checks, and health screenings from 10+ providers. Hospital-grade testing, real-time prices, expert reviews. Find your perfect health test today." />
        <meta name="keywords" content="private blood tests UK, health screening comparison, blood test prices UK, hormone testing, vitamin tests, cancer screening, health MOT UK, at-home blood tests, private health tests comparison 2024" />
        <link rel="canonical" href="https://myhealthhub.co.uk/" />
        
        {/* Enhanced Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="myhealth checkup" />
        <meta property="og:title" content="myhealth checkup - Compare Private Blood Tests & Health Screenings UK" />
        <meta property="og:description" content="Compare private health tests from 10+ UK providers. Real-time prices, expert reviews, and AI recommendations. Hospital-grade testing made simple." />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        <meta property="og:url" content="https://myhealthhub.co.uk/" />
        <meta property="og:locale" content="en_GB" />
        
        {/* Enhanced Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myhealthhub" />
        <meta name="twitter:title" content="myhealth checkup - UK's Leading Health Test Comparison Platform" />
        <meta name="twitter:description" content="Compare private blood tests, health screenings & wellness services. Real-time prices from 10+ providers. AI-powered recommendations." />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        
        {/* Structured data JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <UKASBanner />
      <Header />
      
      <main className="flex-1">
        <NewHero />
        <FeaturedProviders />
        <MostPopularTests />
        <TestCategories />
        <HowItWorks />
        <MediaSpotlight />
        <HealthBenefitsInfographic />
        <FounderStory />
        <PartnerShowcase />
        <HealthResources />
        <CallToAction />
        <ClinicMap />
      </main>
      
      <Footer />
      <CookieConsent />
    </div>;
};
export default Index;