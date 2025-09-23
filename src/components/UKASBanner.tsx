import React from 'react';
import { Award } from 'lucide-react';
const UKASBanner = () => {
  return <div className="bg-[#081129] rounded-none py-0 bg-[#081129] my-[10px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#081129] my-0 py-0">
        <div className="flex items-center justify-center my-0">
          <Award className="w-4 h-4 text-health-success mr-2 flex-shrink-0" />
          <span className="font-bold text-white my-0 py-[10px] flex justify-center items-center text-base">ALL OUR PARTNER LABS HOLD UKAS ACCREDITATIONS</span>
        </div>
      </div>
    </div>;
};
export default UKASBanner;