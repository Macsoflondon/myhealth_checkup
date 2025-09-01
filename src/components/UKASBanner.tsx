import React from 'react';
import { Award } from 'lucide-react';

const UKASBanner = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Award className="w-5 h-5 text-white mr-2" />
          <span className="text-white font-medium text-sm md:text-base underline">
            All our partner labs hold UKAS accreditations
          </span>
        </div>
      </div>
    </div>
  );
};

export default UKASBanner;