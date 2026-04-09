import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import HowWeRank from '@/components/compliance/HowWeRank';
import PageBanner from '@/components/sections/PageBanner';

const HowWeRankPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>How We Rank Providers | myhealth checkup</title>
        <meta name="description" content="Our transparent methodology for comparing and ranking UK health test providers based on accreditation, price, turnaround, and user reviews." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/how-we-rank" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="How We Rank"
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
