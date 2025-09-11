import React from 'react';
import { Award } from 'lucide-react';
const UKASBanner = () => {
  return <div className="py-2 bg-[hsl(var(--section-dark))] bg-[t#] bg-[#79c9d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Award className="w-4 h-4 text-white mr-2 flex-shrink-0" />
          <span className="text-xs text-center font-bold sm:text-base text-white">ALL OUR PARTNER LABS HOLD UKAS ACCREDITATIONS</span>
        </div>
      </div>
    </div>;
};
export default UKASBanner;