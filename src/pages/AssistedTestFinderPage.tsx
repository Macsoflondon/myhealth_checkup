import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TestFinderQuiz } from "@/components/testFinder/TestFinderQuiz";

const AssistedTestFinderPage = () => {
  return (
    <>
      <Helmet>
        <title>Find Your Health Test | myhealth checkup</title>
        <meta name="description" content="Answer a few questions and we'll match you to private health tests that fit your goals, concerns, and preferences." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/find-test" />
        <meta property="og:title" content="Find Your Health Test | myhealth checkup" />
        <meta property="og:description" content="Answer a few questions and we'll match you to private health tests that fit your goals, concerns, and preferences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/find-test" />
      </Helmet>

      <div className="min-h-screen bg-white text-[#081129] flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-2xl mx-auto">
            <header className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1B3A6B]">Find your health test</h1>
              <p className="text-[#1B3A6B]/70 mt-2 text-sm sm:text-base">
                A short, private questionnaire — no account required. We'll suggest tests that fit
                your goals and pre-fill the comparison filters.
              </p>
            </header>
            <TestFinderQuiz />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AssistedTestFinderPage;
