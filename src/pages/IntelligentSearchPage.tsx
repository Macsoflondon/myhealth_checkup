import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import IntelligentSearch from '@/components/search/IntelligentSearch';
import PageBanner from '@/components/sections/PageBanner';

const IntelligentSearchPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Search Health Tests | myhealth checkup</title>
        <meta name="description" content="Find the right health test for your needs. Search by symptom, biomarker, or condition across all UK providers." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/search" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageBanner
          title="Intelligent"
          accent="Search"
          subtitle="Find the right health test for your needs with our smart search tool."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>
        <IntelligentSearch />
      </main>
      <Footer />
    </div>
  );
};

export default IntelligentSearchPage;
