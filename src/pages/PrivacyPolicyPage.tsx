
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrivacyPolicy from '@/components/compliance/PrivacyPolicy';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PrivacyPolicy />
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
