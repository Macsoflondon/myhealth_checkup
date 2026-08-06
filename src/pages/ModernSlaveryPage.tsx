import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ModernSlaveryStatement from '@/components/compliance/ModernSlaveryStatement';
import PageBanner from '@/components/sections/PageBanner';

const ModernSlaveryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Modern Slavery Statement"
          subtitle="Our commitment to preventing modern slavery and human trafficking in our operations and supply chain."
        />
        <ModernSlaveryStatement />
      </main>
      <Footer />
    </div>
  );
};

export default ModernSlaveryPage;
