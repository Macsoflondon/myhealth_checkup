import React from 'react';
import QuizCTABanner from "@/components/sections/QuizCTABanner";
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HowWeRank from '@/components/compliance/HowWeRank';
import PageBanner from '@/components/sections/PageBanner';

const HowWeRankPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="How We Rank"
          subtitle="Understanding our transparent methodology for comparing and ranking health test providers."
        />
        <HowWeRank />
      </main>
      <section className="bg-white py-12 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <QuizCTABanner />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HowWeRankPage;
