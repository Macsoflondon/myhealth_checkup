import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AssistedTestFinder } from '@/components/AssistedTestFinder';

const AssistedTestFinderPage = () => {
  return (
    <>
      <Helmet>
        <title>Find Your Perfect Health Test | My Health Checkup</title>
        <meta name="description" content="Let us help you find the perfect health test for your needs with our guided questionnaire." />
        <meta name="keywords" content="health test finder, personalised health tests, health screening questionnaire" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/find-test" />
        
        <meta property="og:title" content="Find Your Perfect Health Test | My Health Checkup" />
        <meta property="og:description" content="Let us help you find the perfect health test for your needs with our guided questionnaire." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/find-test" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Find Your Perfect Health Test | My Health Checkup" />
        <meta name="twitter:description" content="Let us help you find the perfect health test for your needs with our guided questionnaire." />
      </Helmet>
      <AssistedTestFinder />
    </>
  );
};

export default AssistedTestFinderPage;