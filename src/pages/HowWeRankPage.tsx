import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import HowWeRank from '@/components/compliance/HowWeRank';

const HowWeRankPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb 
            segments={[
              { label: "Home", href: "/" },
              { label: "How We Rank" }
            ]}
            backLabel="Back to Home"
          />
        </div>
        <HowWeRank />
      </main>
      <Footer />
    </div>
  );
};

export default HowWeRankPage;