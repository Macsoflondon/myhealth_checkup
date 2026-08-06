import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import IntelligentSearch from '@/components/search/IntelligentSearch';
import PageBanner from '@/components/sections/PageBanner';

const IntelligentSearchPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
      </Helmet>
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageBanner
          title="Intelligent"
          accent="Search"
          subtitle="Find the right health test for your needs with our smart search tool."
        />
        <IntelligentSearch />
      </main>
      <Footer />
    </div>
  );
};

export default IntelligentSearchPage;
