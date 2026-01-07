import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import IntelligentSearch from '@/components/search/IntelligentSearch';

const IntelligentSearchPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageBreadcrumb 
          segments={[{ label: "Home", href: "/" }, { label: "Intelligent Search" }]} 
          backLabel="Back"
        />
        <IntelligentSearch />
      </main>
      <Footer />
    </div>
  );
};

export default IntelligentSearchPage;
