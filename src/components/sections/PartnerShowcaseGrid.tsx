import { Link } from "react-router-dom";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

import { FeaturedPublications } from "@/components/sections/FeaturedPublications";

import DreamHealthShowcase from "@/components/sections/DreamHealthShowcase";
import GoodbodyBentoShowcase from "@/components/sections/GoodbodyBentoShowcase";

const PartnerShowcaseGrid = () => {

  return (
    <section className="w-full py-8 sm:py-10 md:py-12 bg-brand-navy relative overflow-hidden">
      <NavyDecorativeCircles />

      {/* Featured Partners of the Month — Goodbody (moved above the publications carousel) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          <div className="md:col-span-2 text-center mt-2 sm:mt-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
              <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
                Featured Partner
              </span>
              <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white md:text-5xl">
              Our Featured Partner of the Month
            </h2>
          </div>

          <GoodbodyBentoShowcase />
        </div>
      </div>

      {/* Our Providers Most Popular Tests */}
      <DreamHealthShowcase />

      {/* Featured Publications carousel */}
      <FeaturedPublications />


      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default PartnerShowcaseGrid;
