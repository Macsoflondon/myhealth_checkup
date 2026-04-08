import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import AffiliateDisclosure from '@/components/compliance/AffiliateDisclosure';
import PageBanner from '@/components/sections/PageBanner';

const AffiliateDisclosurePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Affiliate Disclosure"
          subtitle="Full transparency about our commercial relationships and how we fund our platform."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>
        <AffiliateDisclosure />
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDisclosurePage;
