import React from 'react';
import { Helmet } from 'react-helmet-async';
import FertilityTestsPage from '@/components/FertilityTestsPage';
import UKASBanner from '@/components/UKASBanner';

const FertilityTestsPageWrapper = () => {
  return (
    <>
      <Helmet>
        <title>Male Fertility Blood Tests | My Health Checkup</title>
        <meta name="description" content="Male fertility tests created by award winning fertility experts. Test hormone levels, sperm quality and sexual health markers." />
        <meta name="keywords" content="male fertility tests, sperm test, fertility hormones, reproductive health, fertility screening" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/fertility-tests" />
        
        <meta property="og:title" content="Male Fertility Blood Tests | My Health Checkup" />
        <meta property="og:description" content="Male fertility tests created by award winning fertility experts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/fertility-tests" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Male Fertility Blood Tests | My Health Checkup" />
        <meta name="twitter:description" content="Male fertility tests created by award winning fertility experts." />
      </Helmet>
      <div className="min-h-screen bg-[#081129]">
        <UKASBanner />
        <FertilityTestsPage />
      </div>
    </>
  );
};

export default FertilityTestsPageWrapper;