import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowWeRank from '@/components/compliance/HowWeRank';

const HowWeRankPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <HowWeRank />
      </main>
      <Footer />
    </div>
  );
};

export default HowWeRankPage;
