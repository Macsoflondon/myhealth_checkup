import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MostPopularTests from '@/components/MostPopularTests';
import UKASBanner from '@/components/UKASBanner';
import BackButton from '@/components/ui/BackButton';

const MostPopularTestsPage = () => {
  return (
    <>
      <Helmet>
        <title>Most Popular Health Tests | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Discover our most popular health tests, trusted by thousands of customers. Comprehensive blood testing from £159." />
        <meta name="keywords" content="popular health tests, blood tests, health screening, comprehensive health check" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/popular-tests" />
        
        <meta property="og:title" content="Most Popular Health Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Discover our most popular health tests, trusted by thousands of customers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/popular-tests" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Most Popular Health Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Discover our most popular health tests, trusted by thousands of customers." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <UKASBanner />
        <Header />
        <main className="flex-1 bg-[#081129]">
          <div className="container mx-auto px-4 pt-4">
            <BackButton className="text-white hover:text-white/80" />
          </div>
          <MostPopularTests />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MostPopularTestsPage;