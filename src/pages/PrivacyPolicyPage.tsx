import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import PrivacyPolicy from '@/components/compliance/PrivacyPolicy';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb 
            segments={[
              { label: "Home", href: "/" },
              { label: "Privacy Policy" }
            ]}
            backLabel="Back to Home"
          />
        </div>
        <PrivacyPolicy />
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
