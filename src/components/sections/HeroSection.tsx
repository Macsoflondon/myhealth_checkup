import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, children }) => {
  return (
    <section className="bg-[#081129] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-normal mb-6 text-white">
            {title}
          </h1>
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
