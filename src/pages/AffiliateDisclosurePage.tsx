import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AffiliateDisclosure from '@/components/compliance/AffiliateDisclosure';

const AffiliateDisclosurePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <AffiliateDisclosure />
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDisclosurePage;