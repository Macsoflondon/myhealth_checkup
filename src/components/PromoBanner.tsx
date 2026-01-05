import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <div className="bg-blue-900 text-white py-2 text-center text-sm">
      <div className="container mx-auto px-4">
        <span className="font-medium">20% off all tests with code SUMMER20</span>
      </div>
    </div>
  );
};

export default PromoBanner;