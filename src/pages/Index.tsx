
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedHero from "@/components/EnhancedHero";
import TestCategories from "@/components/TestCategories";
import FeaturedTests from "@/components/FeaturedTests";
import HealthBenefitsInfographic from "@/components/HealthBenefitsInfographic";
import AgeSpecificRecommendations from "@/components/AgeSpecificRecommendations";
import ProactiveHealthJourney from "@/components/ProactiveHealthJourney";
import HowItWorks from "@/components/HowItWorks";
import Subscriptions from "@/components/Subscriptions";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "My Health & Wellness Hub",
    "description": "Hospital-grade health tests with high-street convenience for preventive health screening targeting health-conscious adults aged 30-60",
    "url": "https://myhealthwellnesshub.com",
    "sameAs": [
      "https://www.facebook.com/myhealthhub",
      "https://www.twitter.com/myhealthhub",
      "https://www.instagram.com/myhealthhub"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "United Kingdom"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Health-conscious adults aged 30-60",
      "geographicArea": "United Kingdom"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Health & Wellness Hub - Proactive Health Testing for Adults 30-60 | UK</title>
        <meta name="description" content="Transform your health with hospital-grade testing designed for health-conscious UK adults. Early detection, longevity benefits, and family protection. Compare top providers and add healthy years to your life." />
        <meta name="keywords" content="private health tests UK, preventive health screening, adults 30-60, cancer screening, hormone tests, longevity, family health, early detection, proactive healthcare" />
        <link rel="canonical" href="https://myhealthwellnesshub.com/" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Health & Wellness Hub - Add Healthy Years to Your Life" />
        <meta property="og:description" content="Hospital-grade health testing for proactive adults. Early detection saves lives and adds healthy years. Compare providers and protect your family's future." />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        <meta property="og:url" content="https://myh ealthwellnesshub.com/" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Add 12+ Healthy Years to Your Life - Health & Wellness Hub" />
        <meta name="twitter:description" content="Proactive health testing for UK adults 30-60. Early detection, expert guidance, provider comparisons." />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        
        {/* Structured data JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Header />
      <main className="flex-grow">
        <EnhancedHero />
        <HealthBenefitsInfographic />
        <TestCategories />
        
        {/* Professional image divider */}
        <div className="bg-white py-10 mb-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/0f893895-7295-432a-ba20-d09d4a8c4f14.png" 
                alt="Professional health testing kits for proactive health monitoring" 
                className="max-w-full md:max-w-2xl h-auto rounded-lg shadow-md" 
              />
            </div>
          </div>
        </div>
        
        <AgeSpecificRecommendations />
        <ProactiveHealthJourney />
        <HowItWorks />
        <FeaturedTests />
        <Subscriptions />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
