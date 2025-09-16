
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntelligentSearch from '@/components/search/IntelligentSearch';

const IntelligentSearchPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <IntelligentSearch />
      </main>
      <Footer />
    </div>
  );
};

export default IntelligentSearchPage;
