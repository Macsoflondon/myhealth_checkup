import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import HowWeRank from '@/components/compliance/HowWeRank';
import PageBanner from '@/components/sections/HeroSection';

const HowWeRankPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageBanner
          title="How We"
          accent="Rank"
          subtitle="Understanding our transparent methodology for comparing and ranking health test providers."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>
        <HowWeRank />
      </main>
      <Footer />
    </div>
  );
};

export default HowWeRankPage;
