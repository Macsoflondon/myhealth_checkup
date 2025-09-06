import { useState, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/compliance/CookieConsent";

// Lazy load heavy components for better performance
const NewHero = lazy(() => import("@/components/NewHero"));
const FeaturedProviders = lazy(() => import("@/components/FeaturedProviders"));
const CategoryFilters = lazy(() => import("@/components/CategoryFilters"));
const TestCategories = lazy(() => import("@/components/TestCategories"));
const MediaSpotlight = lazy(() => import("@/components/MediaSpotlight"));
const HealthBenefitsInfographic = lazy(() => import("@/components/HealthBenefitsInfographic"));
const FounderStory = lazy(() => import("@/components/FounderStory"));
const PartnerShowcase = lazy(() => import("@/components/PartnerShowcase"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const HealthResources = lazy(() => import("@/components/HealthResources"));
const CallToAction = lazy(() => import("@/components/CallToAction"));
const EnhancedClinicMap = lazy(() => import("@/components/map/EnhancedClinicMap").then(m => ({ default: m.EnhancedClinicMap })));
const VideoUpload = lazy(() => import("@/components/VideoUpload").then(m => ({ default: m.VideoUpload })));
const VideoPlayer = lazy(() => import("@/components/VideoPlayer").then(m => ({ default: m.VideoPlayer })));
const MostPopularTests = lazy(() => import("@/components/MostPopularTests"));
const UKASBanner = lazy(() => import("@/components/UKASBanner"));
const BackToTop = lazy(() => import("@/components/BackToTop"));

const Index = () => {
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  
  const title = "UK's Leading Health Test Comparison Platform | myhealth checkup";
  const description = "Compare private blood tests, health screenings, and wellness services across 10+ leading UK providers. Hospital-grade testing with high-street convenience for health-conscious adults aged 30-60.";
  const canonical = "https://myhealthhub.co.uk";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": title,
    "description": description,
    "url": canonical,
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

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="private health tests, blood tests, health screening, UK health providers, medical testing, wellness checks, private healthcare" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="canonical" href={canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="myhealth checkup" />
        <meta property="og:locale" content="en_GB" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="@myhealthhub" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//api.postcodes.io" />
        <link rel="dns-prefetch" href="//tile.openstreetmap.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse"></div>}>
            <UKASBanner />
          </Suspense>
          
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>}>
            <NewHero />
          </Suspense>
          
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse"></div>}>
            <HowItWorks />
          </Suspense>
          
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse"></div>}>
            <FeaturedProviders />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse"></div>}>
            <CategoryFilters />
          </Suspense>
          
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse"></div>}>
            <TestCategories />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse"></div>}>
            <MostPopularTests />
          </Suspense>
          
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse"></div>}>
            <MediaSpotlight />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse"></div>}>
            <HealthBenefitsInfographic />
          </Suspense>
          
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse"></div>}>
            <FounderStory />
          </Suspense>
          
          <Suspense fallback={<div className="h-32 bg-muted animate-pulse"></div>}>
            <PartnerShowcase />
          </Suspense>
          
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse"></div>}>
            <HealthResources />
          </Suspense>
          
          <Suspense fallback={<div className="h-[600px] bg-muted animate-pulse"></div>}>
            <EnhancedClinicMap />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse"></div>}>
            <CallToAction />
          </Suspense>
          
          {uploadedVideoUrl && (
            <Suspense fallback={<div className="h-64 bg-muted animate-pulse"></div>}>
              <VideoPlayer src={uploadedVideoUrl} />
            </Suspense>
          )}
          
          <Suspense fallback={<div className="h-32 bg-muted animate-pulse"></div>}>
            <VideoUpload onVideoUploaded={setUploadedVideoUrl} />
          </Suspense>
        </main>
        <Footer />
        <CookieConsent />
        <Suspense fallback={<div />}>
          <BackToTop />
        </Suspense>
      </div>
    </>
  );
};

export default Index;