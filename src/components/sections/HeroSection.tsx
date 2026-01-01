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
    <section className="bg-[#081129] pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <PageHeading 
            title={title} 
            accent={accent}
            className="[&_span]:text-white mb-6"
          />
          <p className="text-xl mb-8 max-w-2xl mx-auto tracking-wide font-sans font-medium text-white">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
