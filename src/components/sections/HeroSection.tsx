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
    <section className="bg-[#081129] pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <PageHeading 
            title={title} 
            accent={accent}
            className="[&_span]:text-white mb-4 sm:mb-6"
          />
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto tracking-wide font-sans font-medium text-white">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
