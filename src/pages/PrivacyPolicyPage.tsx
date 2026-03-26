import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import PrivacyPolicy from '@/components/compliance/PrivacyPolicy';
import PageBanner from '@/components/sections/PageBanner';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageBanner
          title="Privacy"
          accent="Policy"
          subtitle="How we collect, use, and protect your personal data in compliance with UK GDPR."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>
        <PrivacyPolicy />
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
