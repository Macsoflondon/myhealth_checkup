import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AssistedTestFinder } from '@/components/tests/AssistedTestFinder';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


const AssistedTestFinderPage = () => {
  return (
    <>
      <Helmet>
        <title>Find Your Perfect Health Test | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Let us help you find the perfect health test for your needs with our guided questionnaire." />
        <meta name="keywords" content="health test finder, personalised health tests, health screening questionnaire" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/find-test" />
        
        <meta property="og:title" content="Find Your Perfect Health Test | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Let us help you find the perfect health test for your needs with our guided questionnaire." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/find-test" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Find Your Perfect Health Test | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Let us help you find the perfect health test for your needs with our guided questionnaire." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        
        <Header />
        <main className="flex-1">
          <AssistedTestFinder />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AssistedTestFinderPage;