import React from 'react';
import { Helmet } from 'react-helmet-async';

const ConditionsPage = () => {
  return (
    <>
      <Helmet>
        <title>Health Conditions Testing | My Health Checkup</title>
        <meta name="description" content="Specialized health tests for specific medical conditions and symptoms." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/conditions" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Health Conditions Testing</h1>
            <p className="text-lg text-gray-600 mb-8">
              Specialized testing for specific health conditions and symptoms to help you get answers.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-gray-600">
                We're expanding our condition-specific testing options. 
                More details coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConditionsPage;