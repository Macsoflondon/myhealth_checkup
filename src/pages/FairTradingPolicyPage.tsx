import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FairTradingPolicy from '@/components/compliance/FairTradingPolicy';

const FairTradingPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <FairTradingPolicy />
      </main>
      <Footer />
    </div>
  );
};

export default FairTradingPolicyPage;
