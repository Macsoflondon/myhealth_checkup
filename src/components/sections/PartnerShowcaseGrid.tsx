import { Link } from "react-router-dom";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

const PartnerShowcaseGrid = () => {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-brand-navy relative overflow-hidden">
      <NavyDecorativeCircles />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-3 sm:mb-4 md:mb-5">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
            <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
              Featured Partners
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3">
            <span className="text-white">Our Featured Partners of </span>
            <span className="text-white">the Month</span>
          </h2>
          <p className="text-white/60 font-sans text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Handpicked providers delivering trusted, accredited health testing across the UK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Row 1: GoodBody — Text left, Video right */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-28 items-stretch mb-14">
            <div className="pt-20 space-y-6 text-center md:text-left flex flex-col md:-ml-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-20">
                <img
                  src="/lovable-uploads/provider-goodbody-new-v3.png"
                  alt="GoodBody Clinic logo"
                  className="h-56 w-auto mx-auto md:mx-0 flex-shrink-0"
                />
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight whitespace-nowrap">
                    Know more.
                    <br />
                    Live Better.
                  </h2>
                </div>
              </div>
              <p className="text-white text-sm sm:text-base font-sans font-medium leading-relaxed">
                GoodBody Clinics, provide comprehensive private health checks at affordable prices.
              </p>
              <p className="text-white text-sm sm:text-base font-sans font-medium leading-relaxed">
                Visit one of over 200 nationwide locations, or opt for their convenient home testing service. GoodBody
                Clinics has got you covered, Regulated by the CQC and only exclusively utilise UKAS-accredited
                laboratories for our analysis.
              </p>
              <p className="text-white text-sm sm:text-base font-sans font-medium leading-relaxed">
                Providing you with a comprehensive GP review of your results and featuring over 60 different blood and
                wellness tests for you to choose from. They offer a blend of clinical precision and convenient
                high-street accessibility.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  to="/providers/goodbody-clinic"
                  className="inline-block bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
                >
                  View GoodBody profile
                </Link>
              </div>
            </div>
            <div className="relative rounded-xl flex items-stretch pt-20 md:-mr-4">
              <video
                ref={(el) => {
                  if (el) el.playbackRate = 0.5;
                }}
                src="/videos/goodbody-promo.mp4?v=2"
                autoPlay
                loop
                muted
                playsInline
                className="w-full object-cover rounded-xl min-h-[250px] max-h-[400px]"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-brand-turquoise/30 to-transparent" />
          </div>

          {/* Start Your Journey Today — Full-width CTA between providers */}
          <div className="md:col-span-2 bg-[#081129] rounded-2xl shadow-md p-8 lg:p-10 flex flex-col text-center items-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
              <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
                Start Your Journey Today
              </span>
              <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              <span className="text-white">Take Control of </span>
              <span className="text-white">Your Health Today</span>
            </h2>
            <p className="text-base lg:text-lg text-white leading-relaxed mb-8 max-w-md">
              Compare trusted, accredited health tests from leading UK providers. Find the right test for your needs
              in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 w-full max-w-md">
              <Link
                to="/compare"
                className="bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
              >
                Compare tests
              </Link>
              <Link
                to="/assisted-test-finder"
                className="bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
              >
                Take the health quiz
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs sm:text-sm text-white">
              <span>✓ UKAS Accredited Labs</span>
              <span>✓ CQC Regulated</span>
              <span>✓ Free to Compare</span>
            </div>
          </div>

          {/* Divider */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-brand-turquoise/30 to-transparent" />
          </div>

          {/* Row 2: Medichecks — Video left, Text right */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-stretch mb-14">
            <div className="relative md:order-1 rounded-xl flex items-stretch pt-20 md:-ml-4">
              <video
                src="/videos/medichecks-promo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full object-cover rounded-xl min-h-[250px] max-h-[400px]"
              />
            </div>
            <div className="pt-20 space-y-6 md:order-2 text-center md:text-left flex flex-col">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-20">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight whitespace-nowrap">
                    Unlock the
                    <br />
                    Ultimate You.
                  </h2>
                </div>
                <img
                  src="/lovable-uploads/provider-medichecks-new-v3.png"
                  alt="Medichecks logo"
                  className="h-56 w-auto mx-auto md:mx-0 flex-shrink-0"
                />
              </div>
              <p className="text-white text-sm sm:text-base font-sans font-medium leading-relaxed">
                Medichecks provide private blood tests and health checks designed for clarity, speed, and clinical
                accuracy.
              </p>
              <p className="text-white text-sm sm:text-base font-sans font-medium leading-relaxed">
                Choose from convenient at home testing kits or attend a nationwide network of partner clinics. All
                samples are analysed by UKAS accredited laboratories, with services delivered through CQC regulated
                clinical partners.
              </p>
              <p className="text-white text-sm sm:text-base font-sans font-medium leading-relaxed">
                Results include a clear GP reviewed report, helping you understand your biomarkers and take informed
                next steps.
              </p>
              <p className="text-white text-sm sm:text-base font-sans font-medium leading-relaxed">
                Medichecks combine medical rigour with flexible access, offering a wide range of blood and wellness
                tests across hormones, nutrition, heart health, and preventative screening.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  to="/providers/medichecks"
                  className="inline-block bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
                >
                  View Medichecks profile
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: Find a Clinic — Full width */}
          <div className="md:col-span-2">
            <div className="bg-[#081129] rounded-2xl shadow-md p-8 lg:p-10 flex flex-col text-center items-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
                <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
                  Find Your Clinic
                </span>
                <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
                <span className="text-white">Find a Clinic </span>
                <span className="text-white">Near You</span>
              </h2>
              <p className="text-base lg:text-lg text-white leading-relaxed mb-8 max-w-md">
                Access a nationwide network of CQC-regulated clinics offering professional venous blood draws and health
                screenings. Walk in or book online.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <p className="font-heading text-xl lg:text-2xl font-bold text-[#22c0d4]">200+</p>
                  <p className="text-xs sm:text-sm text-white">Clinic Locations</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-xl lg:text-2xl font-bold text-[#22c0d4]">7</p>
                  <p className="text-xs sm:text-sm text-white">Partner Networks</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-xl lg:text-2xl font-bold text-[#22c0d4]">UK-wide</p>
                  <p className="text-xs sm:text-sm text-white">Coverage</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8 w-full max-w-md">
                <Link
                  to="/find-clinic"
                  className="bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
                >
                  Find your nearest clinic
                </Link>
                <Link
                  to="/find-clinic"
                  className="bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
                >
                  Browse all clinic locations
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs sm:text-sm text-white">
                <span>✓ CQC Regulated</span>
                <span>✓ 200+ Locations</span>
                <span>✓ Walk-in Available</span>
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
