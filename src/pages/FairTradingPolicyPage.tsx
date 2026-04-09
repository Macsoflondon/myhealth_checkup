import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import FairTradingPolicy from '@/components/compliance/FairTradingPolicy';
import PageBanner from '@/components/sections/PageBanner';

const FairTradingPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Fair Trading Policy | myhealth checkup</title>
        <meta name="description" content="Our commitment to fair, transparent, and ethical trading practices in compliance with UK Consumer Rights Act and CMA guidelines." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/fair-trading" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Fair Trading Policy"
          subtitle="Our commitment to fair, transparent, and ethical trading practices."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>
        <FairTradingPolicy />
      </main>
      <Footer />
    </div>
  );
};

export default FairTradingPolicyPage;
