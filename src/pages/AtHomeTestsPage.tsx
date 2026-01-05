import React from 'react';
import { Helmet } from 'react-helmet-async';

const AtHomeTestsPage = () => {
  return (
    <>
      <Helmet>
        <title>At-Home Health Tests | My Health Checkup</title>
        <meta name="description" content="Convenient at-home health testing kits with professional lab analysis and fast results." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/at-home-tests" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">At-Home Health Tests</h1>
            <p className="text-lg text-gray-600 mb-8">
              Take control of your health with our convenient at-home testing kits. 
              Professional lab analysis with results delivered to your door.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-gray-600">
                We're working on bringing you a comprehensive range of at-home health tests. 
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AtHomeTestsPage;