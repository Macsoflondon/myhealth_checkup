import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StandardPageHero } from "@/components/layout/StandardPageHero";
import { TestFinderQuiz } from "@/components/testFinder/TestFinderQuiz";

const AssistedTestFinderPage = () => {
  return (
    <>
      <Helmet>
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white text-[#081129] flex flex-col">
        <Header />
        <StandardPageHero
          title="Assisted Test Finder"
          strapline="A short, private questionnaire — no account required. We'll suggest tests that fit your goals and pre-fill the comparison filters."
        />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-2xl mx-auto">
            <TestFinderQuiz />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AssistedTestFinderPage;
