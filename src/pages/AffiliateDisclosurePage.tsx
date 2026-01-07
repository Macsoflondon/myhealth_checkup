import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import AffiliateDisclosure from '@/components/compliance/AffiliateDisclosure';

const AffiliateDisclosurePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb 
            segments={[
              { label: "Home", href: "/" },
              { label: "Affiliate Disclosure" }
            ]}
            backLabel="Back to Home"
          />
        </div>
        <AffiliateDisclosure />
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDisclosurePage;