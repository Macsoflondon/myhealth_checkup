import React from 'react';
import PageHeading from '@/components/ui/page-heading';

interface HeroSectionProps {
  title: string;
  accent?: string;
  subtitle: string;
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, accent, subtitle, children }) => {
  return (
    <section className="bg-[#081129] pt-3 pb-2 sm:pt-4 sm:pb-3 md:pt-5 md:pb-4">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <PageHeading 
            title={title} 
            accent={accent}
            className="[&_span]:text-white mb-3 sm:mb-4"
          />
          <p className="text-base sm:text-lg md:text-xl mb-2 sm:mb-3 max-w-3xl mx-auto tracking-wide font-sans font-medium text-[#22c0d4]">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
