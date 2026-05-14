import { Link } from "react-router-dom";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

import { FeaturedPublications } from "@/components/sections/FeaturedPublications";
import UKRegionMap from "@/components/sections/UKRegionMap";
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

          <GoodbodyTestGallery />
        </div>
      </div>

      {/* Our Providers Most Popular Tests */}
      <DreamHealthShowcase />

      {/* Featured Publications carousel */}
      <FeaturedPublications />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">

          {/* Bottom Row: Find a Clinic — Full width */}
          <div className="md:col-span-2 mt-10 sm:mt-14">
            <div className="bg-[#081129] rounded-2xl shadow-md p-5 lg:p-6 flex flex-col text-center items-center">
              <UKRegionMap />
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
                <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
                  Find Your Clinic
                </span>
                <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-heading font-bold mb-2">
                <span className="text-white">Find a Clinic </span>
                <span className="text-white">Near You</span>
              </h2>
              <p className="text-base lg:text-lg text-white leading-relaxed mb-5 max-w-md">
                Access a nationwide network of CQC-regulated clinics offering professional venous blood draws and health
                screenings. Book online for a convenient appointment.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center">
                  <p className="font-heading text-base lg:text-lg font-bold text-[#22c0d4]">250+</p>
                  <p className="text-xs sm:text-sm text-white">Clinic Locations</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-base lg:text-lg font-bold text-[#22c0d4]">7</p>
                  <p className="text-xs sm:text-sm text-white">Partner Networks</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-base lg:text-lg font-bold text-[#22c0d4]">UK-wide</p>
                  <p className="text-xs sm:text-sm text-white">Coverage</p>
                </div>
              </div>
              <div className="flex flex-row flex-nowrap gap-2 justify-center mb-5 w-full max-w-md">
                <Link
                  to="/find-clinic"
                  className="flex-1 min-w-0 bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap text-center pt-[14px]"
                >
                  Find your nearest clinic
                </Link>
                <Link
                  to="/find-clinic"
                  className="flex-1 min-w-0 bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap text-center pt-[14px]"
                >
                  Browse all clinic locations
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs sm:text-sm text-white">
                <span>✓ CQC Regulated Providers</span>
                <span>✓ 250+ Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default PartnerShowcaseGrid;
