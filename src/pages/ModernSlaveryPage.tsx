import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import ModernSlaveryStatement from '@/components/compliance/ModernSlaveryStatement';
import PageBanner from '@/components/sections/HeroSection';

const ModernSlaveryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageBanner
          title="Modern Slavery"
          accent="Statement"
          subtitle="Our commitment to preventing modern slavery and human trafficking in our operations and supply chain."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>
        <ModernSlaveryStatement />
      </main>
      <Footer />
    </div>
  );
};

export default ModernSlaveryPage;
