import { Link } from "react-router-dom";
import goodbodyVideo from "@/assets/goodbody-animation.mp4";
import medichecksVideo from "@/assets/medichecks-animation.mp4";
import { PROVIDER_LOGOS } from "@/constants/providers";

const PartnerShowcaseGrid = () => {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-[#f0fafb]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">

          {/* Top-Left: Goodbody Feature Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col lg:flex-row">
            <div className="p-6 lg:p-8 flex flex-col justify-center lg:w-[55%]">
              <img
                src={PROVIDER_LOGOS["goodbody-clinic"]}
                alt="GoodBody Clinic logo"
                className="h-10 w-auto object-contain mb-4 self-start"
                loading="lazy"
              />
              <h3 className="font-heading text-xl lg:text-2xl font-bold text-[#081129] mb-3">
                Know more. Live Better.
              </h3>
              <p className="text-sm lg:text-base text-[#081129]/70 leading-relaxed mb-5">
                Goodbody Clinics provide comprehensive private health checks at affordable prices. Visit one of over 200 nationwide locations, or opt for their convenient home testing service. CQC regulated, with exclusively UKAS-accredited laboratories. Featuring over 60 different blood and wellness tests with a comprehensive GP review of your results.
              </p>
              <Link
                to="/provider/goodbody-clinic"
                className="inline-block self-start bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                View Goodbody tests
              </Link>
            </div>
            <div className="lg:w-[45%] flex items-center justify-center p-4 lg:p-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-auto rounded-xl lg:rounded-none lg:rounded-r-2xl"
                aria-label="GoodBody Clinic promotional animation"
              >
                <source src={goodbodyVideo} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Top-Right: Take Control CTA Card */}
          <div className="bg-[#081129] rounded-2xl shadow-md py-3 px-6 lg:py-4 lg:px-8 flex flex-col items-center justify-center text-center">
            <h3 className="font-heading text-lg lg:text-xl font-bold text-white mb-2">
              Take Control of Your Health
            </h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              Compare accredited health tests from trusted UK providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
              <Link
                to="/compare"
                className="bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold text-xs px-5 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
              >
                Compare tests
              </Link>
              <Link
                to="/assisted-test-finder"
                className="bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold text-xs px-5 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap text-center"
              >
                Take the health quiz
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-3 justify-center text-[10px] text-white/40">
              <span>✓ UKAS Accredited</span>
              <span>✓ CQC Regulated</span>
              <span>✓ Free to Compare</span>
            </div>
          </div>

          {/* Bottom-Left: Find a Clinic Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 flex flex-col justify-center text-center md:text-left">
            <h3 className="font-heading text-xl lg:text-2xl font-bold text-[#081129] mb-3">
              Find a Clinic <span className="text-[#22c0d4]">Near You</span>
            </h3>
            <p className="text-sm lg:text-base text-[#081129]/70 leading-relaxed mb-5">
              Access a nationwide network of CQC-regulated clinics offering professional venous blood draws and health screenings. Walk in or book online.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center">
                <p className="font-heading text-lg lg:text-xl font-bold text-[#22c0d4]">200+</p>
                <p className="text-xs text-[#081129]/60">Clinic Locations</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-lg lg:text-xl font-bold text-[#22c0d4]">7</p>
                <p className="text-xs text-[#081129]/60">Partner Networks</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-lg lg:text-xl font-bold text-[#22c0d4]">UK-wide</p>
                <p className="text-xs text-[#081129]/60">Coverage</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
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
          </div>

          {/* Bottom-Right: Medichecks Feature Card */}
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
            <div className="lg:w-[45%] flex items-center justify-center p-4 lg:p-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-auto rounded-xl lg:rounded-none lg:rounded-r-2xl"
                aria-label="Medichecks promotional animation"
              >
                <source src={medichecksVideo} type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PartnerShowcaseGrid;
