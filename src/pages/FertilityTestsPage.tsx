import React from 'react';
import { Helmet } from 'react-helmet-async';
import FertilityTestsPage from '@/components/FertilityTestsPage';
import UKASBanner from '@/components/UKASBanner';

const FertilityTestsPageWrapper = () => {
  return (
    <>
      <Helmet>
        <title>Prenatal & Pregnancy Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Non-invasive prenatal testing (NIPT), gender reveal, and paternity tests during pregnancy. Safe screening from 8 weeks." />
        <meta name="keywords" content="NIPT, prenatal testing, gender reveal, prenatal paternity, pregnancy blood test, chromosome screening" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/fertility-tests" />
        
        <meta property="og:title" content="Prenatal & Pregnancy Blood Tests | myhealth checkup" />
        <meta property="og:description" content="Non-invasive prenatal testing (NIPT), gender reveal, and paternity tests during pregnancy." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/fertility-tests" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Prenatal & Pregnancy Blood Tests | myhealth checkup" />
        <meta name="twitter:description" content="Non-invasive prenatal testing (NIPT), gender reveal, and paternity tests." />
      </Helmet>
      <div className="min-h-screen bg-[#081129]">
        <UKASBanner />
        <FertilityTestsPage />
      </div>
    </>
  );
};

export default FertilityTestsPageWrapper;