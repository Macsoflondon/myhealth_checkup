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
    <section className="bg-[#081129] pt-6 pb-4 sm:pt-8 sm:pb-6 md:pt-10 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <PageHeading 
            title={title} 
            accent={accent}
            className="[&_span]:text-white mb-3 sm:mb-4"
          />
          <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-5 max-w-2xl mx-auto tracking-wide font-sans font-medium text-white">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
