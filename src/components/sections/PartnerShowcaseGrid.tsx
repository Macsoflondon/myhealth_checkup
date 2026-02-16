import { Link } from "react-router-dom";

import goodbodyLogo from "@/assets/goodbody-logo-new.png";

const PartnerShowcaseGrid = () => {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-brand-navy relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-turquoise/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-48 h-48 bg-brand-pink/5 rounded-full translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-brand-turquoise/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-brand-pink/5 rounded-full -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-[15%] right-1/4 w-40 h-40 bg-brand-turquoise/5 rounded-full" />
      <div className="absolute bottom-1/4 left-[10%] w-48 h-48 bg-brand-pink/5 rounded-full -translate-x-1/2" />
      <div className="absolute top-[60%] right-[5%] w-36 h-36 bg-brand-turquoise/5 rounded-full translate-x-1/2" />
      {/* Additional decorative half-circles */}
      <div className="absolute top-[40%] left-[20%] w-64 h-64 bg-brand-turquoise/[0.03] rounded-full -translate-x-1/2" />
      <div className="absolute bottom-[15%] right-[15%] w-52 h-52 bg-brand-pink/[0.04] rounded-full translate-x-1/3" />
      <div className="absolute top-[10%] left-[45%] w-44 h-44 bg-brand-turquoise/[0.04] rounded-full -translate-y-1/3" />
      <div className="absolute bottom-[40%] left-0 w-60 h-60 bg-brand-pink/[0.03] rounded-full -translate-x-2/3" />
      <div className="absolute top-[70%] right-[30%] w-36 h-36 bg-brand-turquoise/[0.03] rounded-full" />
      <div className="absolute bottom-0 left-[30%] w-48 h-48 bg-brand-pink/[0.04] rounded-full translate-y-1/2" />
      <div className="absolute top-0 right-[45%] w-40 h-40 bg-brand-turquoise/[0.03] rounded-full -translate-y-1/2" />
      <div className="absolute top-[5%] left-[60%] w-56 h-56 bg-brand-pink/[0.03] rounded-full" />
      <div className="absolute bottom-[30%] right-[50%] w-44 h-44 bg-brand-turquoise/[0.04] rounded-full" />
      <div className="absolute top-[50%] left-[10%] w-68 h-68 bg-brand-pink/[0.03] rounded-full -translate-x-1/4" />
      <div className="absolute bottom-[5%] left-[55%] w-52 h-52 bg-brand-turquoise/[0.03] rounded-full translate-y-1/4" />
      <div className="absolute top-[25%] right-[5%] w-60 h-60 bg-brand-pink/[0.04] rounded-full translate-x-1/3" />
      <div className="absolute bottom-[50%] left-[35%] w-36 h-36 bg-brand-turquoise/[0.04] rounded-full" />
      <div className="absolute top-[80%] right-[20%] w-48 h-48 bg-brand-pink/[0.03] rounded-full" />
      <div className="absolute top-[15%] left-[75%] w-40 h-40 bg-brand-turquoise/[0.03] rounded-full" />
      <div className="absolute bottom-[60%] right-[60%] w-56 h-56 bg-brand-pink/[0.04] rounded-full" />
      <div className="absolute top-[90%] left-[5%] w-44 h-44 bg-brand-turquoise/[0.04] rounded-full translate-y-1/3" />
      <div className="absolute top-[35%] right-[35%] w-52 h-52 bg-brand-pink/[0.03] rounded-full" />
      <div className="absolute bottom-[45%] left-[65%] w-48 h-48 bg-brand-turquoise/[0.03] rounded-full" />
      <div className="absolute top-[55%] right-[55%] w-60 h-60 bg-brand-pink/[0.04] rounded-full" />
      <div className="absolute bottom-[70%] left-[40%] w-36 h-36 bg-brand-turquoise/[0.04] rounded-full" />
      <div className="absolute top-[45%] right-[75%] w-44 h-44 bg-brand-pink/[0.03] rounded-full" />

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
            <span className="bg-gradient-to-r from-brand-turquoise to-brand-pink bg-clip-text text-transparent">
              the Month
            </span>
          </h2>
          <p className="text-white/60 font-sans text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Handpicked providers delivering trusted, accredited health testing across the UK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-center">

          {/* Top-Left: Goodbody Feature Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="p-5 lg:p-6 flex flex-col justify-center">
              <img
                src={goodbodyLogo}
                alt="GoodBody Clinic logo"
                className="h-[140px] w-auto object-contain -mb-4 self-center"
                loading="lazy"
              />
              <h3 className="font-heading text-xl lg:text-2xl font-bold text-[#081129] mb-2">
                Know more.<br />Live Better.
              </h3>
              <p className="text-sm lg:text-base text-[#081129]/70 leading-relaxed mb-2">
                GoodBody Clinics, provide comprehensive private health checks at affordable prices.
              </p>
              <p className="text-sm lg:text-base text-[#081129]/70 leading-relaxed mb-2">
                Visit one of over 200 nationwide locations, or opt for their convenient home testing service. GoodBody Clinics has got you covered, Regulated by the CQC and only exclusively utilise UKAS-accredited laboratories for our analysis.
              </p>
              <p className="text-sm lg:text-base text-[#081129]/70 leading-relaxed mb-3">
                Providing you with a comprehensive GP review of your results and featuring over 60 different blood and wellness tests for you to choose from. They offer a blend of clinical precision and convenient high-street accessibility.
              </p>
              <div className="flex-grow" />
              <Link
                to="/provider/goodbody-clinic"
                className="inline-block self-center bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap mb-6"
              >
                View Goodbody tests
              </Link>
            </div>
          </div>

          {/* Partner Video next to Goodbody */}
          <div className="hidden md:flex bg-[#081129] rounded-2xl overflow-hidden items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              aria-label="Featured partner of the month"
            >
              <source src="/videos/partner-video.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Bottom-Left: Find a Clinic Card */}
          <div className="bg-[#081129] rounded-2xl shadow-md p-5 lg:p-6 flex flex-col justify-center text-center items-center">
            <span className="inline-block bg-[#22c0d4]/15 text-[#22c0d4] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              Find Your Clinic
            </span>
            <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-3">
              Find a Clinic <span className="text-[#22c0d4]">Near You</span>
            </h3>
            <p className="text-sm lg:text-base text-white/70 leading-relaxed mb-6">
              Access a nationwide network of CQC-regulated clinics offering professional venous blood draws and health screenings. Walk in or book online.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center">
                <p className="font-heading text-lg lg:text-xl font-bold text-[#22c0d4]">200+</p>
                <p className="text-xs text-white/60">Clinic Locations</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-lg lg:text-xl font-bold text-[#22c0d4]">7</p>
                <p className="text-xs text-white/60">Partner Networks</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-lg lg:text-xl font-bold text-[#22c0d4]">UK-wide</p>
                <p className="text-xs text-white/60">Coverage</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                to="/find-clinic"
                className="bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
              >
                Find your nearest clinic
              </Link>
              <Link
                to="/find-clinic"
                className="bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
              >
                Browse all clinic locations
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs text-white/50">
              <span>✓ CQC Regulated</span>
              <span>✓ 200+ Locations</span>
              <span>✓ Walk-in Available</span>
            </div>
          </div>

          {/* Bottom-Right: Take Control CTA Card (moved from top-right) */}
          <div className="bg-[#081129] rounded-2xl shadow-md p-5 lg:p-6 flex flex-col justify-center text-center items-center">
            <span className="inline-block bg-[#22c0d4]/15 text-[#22c0d4] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              Start Your Journey Today
            </span>
            <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-3">
              Take Control of Your Health Today
            </h3>
            <p className="text-sm lg:text-base text-white/70 leading-relaxed mb-20">
              Compare trusted, accredited health tests from leading UK providers. Find the right test for your needs in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                to="/compare"
                className="bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
              >
                Compare tests
              </Link>
              <Link
                to="/assisted-test-finder"
                className="bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
              >
                Take the health quiz
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs text-white/50">
              <span>✓ UKAS Accredited Labs</span>
              <span>✓ CQC Regulated</span>
              <span>✓ Free to Compare</span>
            </div>
          </div>

          {/* STORED: Medichecks Feature Card — uncomment to restore
          <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col lg:flex-row">
            <div className="p-6 lg:p-8 flex flex-col justify-center lg:w-[55%]">
              <img
                src={PROVIDER_LOGOS["medichecks"]}
                alt="Medichecks logo"
                className="h-10 w-auto object-contain mb-4 self-start"
                loading="lazy"
              />
              <h3 className="font-heading text-xl lg:text-2xl font-bold text-[#081129] mb-3">
                Know More, Live Better
              </h3>
              <p className="text-sm lg:text-base text-[#081129]/70 leading-relaxed mb-5">
                Medichecks provide private blood tests and health checks designed for clarity, speed, and clinical accuracy. Choose from convenient at-home testing kits or attend a nationwide network of partner clinics. All samples are analysed by UKAS accredited laboratories, with results including a clear GP reviewed report.
              </p>
              <Link
                to="/provider/medichecks"
                className="inline-block self-start bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                View Medichecks tests
              </Link>
            </div>
            <div className="lg:w-[45%] min-h-[200px] lg:min-h-0 bg-[#081129] flex items-center justify-center">
              <video
                src={medichecksVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          */}

        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default PartnerShowcaseGrid;
