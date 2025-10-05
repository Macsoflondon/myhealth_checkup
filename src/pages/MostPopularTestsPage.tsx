import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MostPopularTests from '@/components/MostPopularTests';
import UKASBanner from '@/components/UKASBanner';

const MostPopularTestsPage = () => {
  return (
    <>
      <Helmet>
        <title>Most Popular Health Tests | My Health Checkup</title>
        <meta name="description" content="Discover our most popular health tests, trusted by thousands of customers. Comprehensive blood testing from £159." />
        <meta name="keywords" content="popular health tests, blood tests, health screening, comprehensive health check" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/popular-tests" />
        
        <meta property="og:title" content="Most Popular Health Tests | My Health Checkup" />
        <meta property="og:description" content="Discover our most popular health tests, trusted by thousands of customers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/popular-tests" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Most Popular Health Tests | My Health Checkup" />
        <meta name="twitter:description" content="Discover our most popular health tests, trusted by thousands of customers." />
      </Helmet>
      <div className="min-h-screen bg-[#081129]">
        <UKASBanner />
        <Header />
        <MostPopularTests />
        <Footer />
      </div>
    </>
  );
};

export default MostPopularTestsPage;