import React from 'react';
import { Award } from 'lucide-react';
import { scrollToTop } from '@/lib/utils';

const UKASBanner = () => {
  const handleClick = () => {
    scrollToTop();
  };

  return (
    <div 
      className="py-2 bg-[hsl(var(--section-dark))] cursor-pointer hover:bg-[hsl(var(--section-dark))]/90 transition-colors duration-200" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label="Return to top of page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Award className="w-4 h-4 text-white mr-2 flex-shrink-0" />
          <span className="font-medium text-xs sm:text-sm text-center text-[#e70d69]">
            All our partner labs hold UKAS accreditations
          </span>
        </div>
      </div>
    </div>
  );
};
export default UKASBanner;