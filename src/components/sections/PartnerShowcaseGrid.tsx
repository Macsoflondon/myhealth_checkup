import { Link } from "react-router-dom";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";
import GoodbodyTestGallery from "@/components/sections/GoodbodyTestGallery";
import { FeaturedPublications } from "@/components/sections/FeaturedPublications";
import UKRegionMap from "@/components/sections/UKRegionMap";

const PartnerShowcaseGrid = () => {

  return (
    <section className="w-full py-8 sm:py-10 md:py-12 bg-brand-navy relative overflow-hidden">
      <NavyDecorativeCircles />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative">
        <div className="text-center mb-3 sm:mb-4 md:mb-5">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
            <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
              Featured Partners
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-heading font-bold mb-3">
            <span className="text-white">Our Featured Partners of </span>
            <span className="text-white">the Month</span>
          </h2>
          <p className="text-white font-sans text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Handpicked providers delivering trusted, accredited health testing across the UK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* GoodBody Test Gallery */}
          <GoodbodyTestGallery />

          {/* Divider */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-brand-turquoise/70 to-transparent" />
          </div>

        </div>
      </div>

      {/* Featured Publications carousel between Goodbody and Medichecks */}
      <FeaturedPublications />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">

          {/* Row 2: Medichecks — Logo beside Video */}
          <div className="md:col-span-2 mt-8 mb-2 pt-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src="/lovable-uploads/provider-medichecks-new-v3.png"
                  alt="Medichecks logo"
                  className="h-48 sm:h-44 md:h-52 w-auto object-contain"
                />
              </div>

              {/* Video */}
              <div className="relative rounded-xl w-full max-w-2xl">
                <video
                  src="/videos/medichecks-promo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-contain rounded-xl max-h-[400px]"
                />
              </div>
            </div>

            {/* CTA below */}
            <div className="flex justify-center mt-7">
              <Link
                to="/provider/medichecks"
                className="inline-block bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              >
                View Medichecks profile
              </Link>
            </div>
          </div>

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
                  <p className="font-heading text-base lg:text-lg font-bold text-[#22c0d4]">200+</p>
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
              <div className="flex flex-row flex-wrap gap-2 justify-center mb-5 w-full max-w-md">
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
                <span>✓ CQC Regulated</span>
                <span>✓ 200+ Locations</span>
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
