import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";

import goodbodyLogo from "@/assets/goodbody-logo-new.png";

const PartnerShowcaseGrid = () => {
  return (
    <section className="w-full py-8 sm:py-12 md:py-14 bg-[#081129]">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading title="Our Featured" gradientText="Partners" className="mb-1 sm:mb-2" titleClassName="text-white" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-center">

          {/* Top-Left: Goodbody Feature Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="p-5 lg:p-6 flex flex-col justify-center">
              <img
                src={goodbodyLogo}
                alt="GoodBody Clinic logo"
                className="h-[140px] w-auto object-contain -mb-4 self-start"
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
              <Link
                to="/provider/goodbody-clinic"
                className="inline-block self-start bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap"
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
    </section>
  );
};

export default PartnerShowcaseGrid;
