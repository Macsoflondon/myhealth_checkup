import React from 'react';
import { Helmet } from 'react-helmet-async';

const WellnessPage = () => {
  return (
    <>
      <Helmet>
        <title>Wellness Tests | My Health Checkup</title>
        <meta name="description" content="Comprehensive wellness and lifestyle health tests to optimize your wellbeing." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/wellness" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Wellness Tests</h1>
            <p className="text-lg text-gray-600 mb-8">
              Optimize your health and wellbeing with our comprehensive wellness testing options.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-gray-600">
                We're developing a comprehensive wellness testing program. 
                Check back soon for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WellnessPage;