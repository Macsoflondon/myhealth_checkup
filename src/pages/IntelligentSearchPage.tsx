import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import IntelligentSearch from '@/components/search/IntelligentSearch';
import PageBanner from '@/components/sections/HeroSection';

const IntelligentSearchPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageBanner
          title="Intelligent"
          accent="Search"
          subtitle="Find the right health test for your needs with our smart search tool."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>
        <IntelligentSearch />
      </main>
      <Footer />
    </div>
  );
};

export default IntelligentSearchPage;
