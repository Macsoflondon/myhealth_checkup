import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AffiliateDisclosure from '@/components/compliance/AffiliateDisclosure';
import PageBanner from '@/components/sections/PageBanner';

const AffiliateDisclosurePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Affiliate Disclosure | myhealth checkup</title>
        <meta name="description" content="Full transparency about our commercial relationships and how we fund myhealth checkup while maintaining editorial independence." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/affiliate-disclosure" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Affiliate Disclosure"
          subtitle="Full transparency about our commercial relationships and how we fund our platform."
        />
        <AffiliateDisclosure />
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDisclosurePage;
