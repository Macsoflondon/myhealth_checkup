import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import FairTradingPolicy from '@/components/compliance/FairTradingPolicy';

const FairTradingPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageBreadcrumb 
          segments={[{ label: "Home", href: "/" }, { label: "Fair Trading Policy" }]} 
          backLabel="Back"
        />
        <FairTradingPolicy />
      </main>
      <Footer />
    </div>
  );
};

export default FairTradingPolicyPage;
