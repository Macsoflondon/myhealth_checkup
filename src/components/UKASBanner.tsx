import React from 'react';
import { Award } from 'lucide-react';
const UKASBanner = () => {
  return <div className="py-2" style={{
    background: '#1a1b34'
  }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center bg-[t] bg-[#1a1b34]">
          <Award className="w-4 h-4 text-white mr-2 flex-shrink-0 bg-[t] bg-[#1a1b34]" />
          <span className="font-medium text-xs sm:text-sm text-center text-[#e70d69]">
            All our partner labs hold UKAS accreditations
          </span>
        </div>
      </div>
    </div>;
};
export default UKASBanner;