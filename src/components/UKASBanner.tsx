import React from 'react';
import { Shield } from 'lucide-react';
const UKASBanner = () => {
  return <div className="py-2" style={{
    background: 'linear-gradient(to right, #22C0D4, #1BA7C7)'
  }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Shield className="w-4 h-4 text-health-success mr-2 flex-shrink-0" aria-hidden="true" />
          <span className="font-medium text-xs sm:text-sm text-center text-white">
            All our partner labs hold UKAS accreditations
          </span>
        </div>
      </div>
    </div>;
};
export default UKASBanner;