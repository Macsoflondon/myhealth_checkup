import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MostPopularTests from '@/components/tests/MostPopularTests';
import CategoryPageBottom from '@/components/sections/CategoryPageBottom';
import { Star, TrendingUp, Shield } from 'lucide-react';

const MostPopularTestsPage = () => {
  return (
    <>
      <Helmet>
        <title>Most Popular Tests | myhealth checkup</title>
        <meta name="description" content="Discover our most popular health tests, trusted by thousands of customers. Comprehensive blood testing from £159." />
        <meta name="keywords" content="popular health tests, blood tests, health screening, comprehensive health check" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/popular-tests" />
        
        <meta property="og:title" content="Most Popular Tests | myhealth checkup" />
        <meta property="og:description" content="Discover our most popular health tests, trusted by thousands of customers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/popular-tests" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Most Popular Tests | myhealth checkup" />
        <meta name="twitter:description" content="Discover our most popular health tests, trusted by thousands of customers." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Most Popular Health Tests",
          "description": "Discover our most popular health tests, trusted by thousands of customers.",
          "url": "https://myhealthcheckup.co.uk/popular-tests",
          "isPartOf": { "@type": "WebSite", "name": "myhealth checkup", "url": "https://myhealthcheckup.co.uk" },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myhealthcheckup.co.uk" },
              { "@type": "ListItem", "position": 2, "name": "Popular Tests" }
            ]
          }
        })}</script>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        
        <Header />
        <main className="flex-1 bg-background">
          <MostPopularTests />
          <CategoryPageBottom
            benefitsTitle="Why Choose Our Most Popular Tests?"
            benefits={[
              { icon: Star, title: "Trusted by Thousands", description: "Our highest-rated tests chosen by customers across the UK" },
              { icon: TrendingUp, title: "Comprehensive Insights", description: "Thorough biomarker panels for a complete health picture" },
              { icon: Shield, title: "Accredited Labs", description: "All tests processed by UKAS-accredited laboratories" },
            ]}
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MostPopularTestsPage;