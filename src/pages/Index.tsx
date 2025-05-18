
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TestCategories from "@/components/TestCategories";
import FeaturedTests from "@/components/FeaturedTests";
import HowItWorks from "@/components/HowItWorks";
import Subscriptions from "@/components/Subscriptions";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "My SalusHub",
    "description": "Hospital-grade health tests with high-street convenience for preventive health screening",
    "url": "https://mysalushub.com",
    "logo": "https://mysalushub.com/logo.png",
    "sameAs": [
      "https://www.facebook.com/mysalushub",
      "https://www.twitter.com/mysalushub",
      "https://www.instagram.com/mysalushub"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "United Kingdom"
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
        <title>My SalusHub - Preventive Health Testing Service</title>
        <meta name="description" content="My SalusHub offers hospital-grade health tests with high-street convenience for preventive health screening and early detection." />
        <meta name="keywords" content="health tests, preventive health, medical testing, blood tests, health screening, wellness tests" />
        <link rel="canonical" href="https://mysalushub.com/" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="My SalusHub - Preventive Health Testing" />
        <meta property="og:description" content="Hospital-grade tests with high-street convenience for early detection and prevention." />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        <meta property="og:url" content="https://mysalushub.com/" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My SalusHub - Preventive Health Testing" />
        <meta name="twitter:description" content="Hospital-grade tests with high-street convenience." />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        
        {/* Structured data JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Header />
      <main className="flex-grow">
        <Hero />
        <TestCategories />
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
