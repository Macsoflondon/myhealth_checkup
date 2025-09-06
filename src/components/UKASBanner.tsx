import React from 'react';
import { Award } from 'lucide-react';
const UKASBanner = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Award className="w-4 h-4 text-white mr-2 flex-shrink-0" />
          <span className="text-white font-medium text-xs sm:text-sm text-center">
            All our partner labs hold UKAS accreditations
          </span>
        </div>
      </div>
    </div>
  );
};
export default UKASBanner;