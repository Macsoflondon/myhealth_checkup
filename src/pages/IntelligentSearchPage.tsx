import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackButton from '@/components/ui/BackButton';
import IntelligentSearch from '@/components/search/IntelligentSearch';

const IntelligentSearchPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 pt-4">
          <BackButton />
        </div>
        <IntelligentSearch />
      </main>
      <Footer />
    </div>
  );
};

export default IntelligentSearchPage;
