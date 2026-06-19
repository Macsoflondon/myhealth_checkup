import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PrivacyPolicy from '@/components/compliance/PrivacyPolicy';
import PageBanner from '@/components/sections/PageBanner';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy | myhealth checkup</title>
        <meta name="description" content="How we collect, use, and protect your personal data in compliance with UK GDPR and the Data Protection Act 2018." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/privacy-policy" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Privacy Policy"
          subtitle="How we collect, use, and protect your personal data in compliance with UK GDPR."
        />
        <PrivacyPolicy />
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
