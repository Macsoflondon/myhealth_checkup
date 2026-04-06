import { useState } from "react";
import { Link } from "react-router-dom";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";
import GoodbodyTestGallery from "@/components/sections/GoodbodyTestGallery";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PartnerShowcaseGrid = () => {
  const [medichecksAboutOpen, setMedichecksAboutOpen] = useState(false);

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
          <p className="text-white font-sans text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Handpicked providers delivering trusted, accredited health testing across the UK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* GoodBody Test Gallery */}
          <GoodbodyTestGallery />

          {/* Divider */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-brand-turquoise/30 to-transparent" />
          </div>

        </div>
      </div>

      {/* Start Your Journey Today — Full-width CTA */}
      <div className="w-full bg-white py-12 sm:py-16 border-y border-brand-turquoise/20 shadow-[0_0_30px_-5px_rgba(34,192,212,0.15)]">
        <div className="max-w-3xl mx-auto px-4 flex flex-col text-center items-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
            <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
              Start Your Journey Today
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 text-[#081129]">
            Take Control of Your Health Today
          </h2>
          <p className="text-base lg:text-lg text-[#081129]/70 leading-relaxed mb-8 max-w-md">
            Compare trusted, accredited health tests from leading UK providers. Find the right test for your needs
            in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 w-full max-w-lg">
            <Link
              to="/assisted-test-finder"
              className="bg-brand-turquoise hover:bg-brand-pink text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-full transition-colors duration-200 whitespace-nowrap text-center"
            >
              Find your test
            </Link>
            <Link
              to="/compare/symptoms"
              className="bg-brand-pink hover:bg-brand-turquoise text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-full transition-colors duration-200 whitespace-nowrap text-center"
            >
              Compare by symptom
            </Link>
            <Link
              to="/compare/goals"
              className="bg-brand-turquoise hover:bg-brand-pink text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-full transition-colors duration-200 whitespace-nowrap text-center"
            >
              Compare by goal
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs sm:text-sm text-[#081129]/60">
            <span>✓ UKAS Accredited Labs</span>
            <span>✓ CQC Regulated</span>
            <span>✓ Free to Compare</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">

          {/* Divider */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-brand-turquoise/30 to-transparent" />
          </div>

          {/* Row 2: Medichecks — Logo + About button + Video */}
          <div className="md:col-span-2 mt-6 mb-4">
            {/* Logo + About nav row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8 mb-4">
              <div className="shrink-0">
                <div className="bg-white rounded-lg p-2 sm:p-4 flex items-center justify-center">
                  <img
                    src="/lovable-uploads/provider-medichecks-new-v3.png"
                    alt="Medichecks logo"
                    className="h-48 sm:h-40 md:h-48 w-auto object-contain"
                  />
                </div>
              </div>

              <nav className="flex items-center gap-3 sm:gap-5 md:gap-7" aria-label="Medichecks actions">
                <button
                  onClick={() => setMedichecksAboutOpen(true)}
                  className="whitespace-nowrap text-xs sm:text-sm md:text-base font-sans transition-all duration-200 pb-1 text-white font-bold border-b-2 border-brand-turquoise flex items-center gap-1"
                >
                  <Info className="h-3.5 w-3.5" />
                  About
                </button>
              </nav>
            </div>

            {/* Video */}
            <div className="flex items-start justify-center pt-1">
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

            {/* CTA below video */}
            <div className="flex justify-center mt-6">
              <Link
                to="/providers/medichecks"
                className="inline-block bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              >
                View Medichecks profile
              </Link>
            </div>
          </div>

          {/* Medichecks About Modal */}
          <Dialog open={medichecksAboutOpen} onOpenChange={setMedichecksAboutOpen}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#f8f6f3] border-border">
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <img src="/lovable-uploads/provider-medichecks-new-v3.png" alt="Medichecks" className="h-12 w-auto object-contain" />
                  <div>
                    <DialogTitle className="text-2xl font-heading text-[#3d3529]">
                      Medichecks
                    </DialogTitle>
                    <DialogDescription className="text-[#6b6459]">
                      ​
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-8 text-[#4a443b] font-sans leading-relaxed">
                <section>
                  <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-2">Unlock the Ultimate You</h3>
                  <p>Medichecks provide private blood tests and health checks designed for clarity, speed, and clinical accuracy.</p>
                </section>

                <section>
                  <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-2">How It Works</h3>
                  <p>Choose from convenient at-home testing kits or attend a nationwide network of partner clinics. All samples are analysed by UKAS accredited laboratories, with services delivered through CQC regulated clinical partners.</p>
                </section>

                <section>
                  <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-2">Your Results</h3>
                  <p>Results include a clear GP reviewed report, helping you understand your biomarkers and take informed next steps.</p>
                </section>

                <section>
                  <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-2">Our Services</h3>
                  <p>Medichecks combine medical rigour with flexible access, offering a wide range of blood and wellness tests across hormones, nutrition, heart health, and preventative screening.</p>
                </section>

                {/* Video in modal */}
                <div className="relative rounded-xl w-full">
                  <video
                    src="/videos/medichecks-promo.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full object-contain rounded-xl max-h-[300px]"
                  />
                </div>

                <div className="flex justify-center">
                  <Link
                    to="/providers/medichecks"
                    className="inline-block bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
                    onClick={() => setMedichecksAboutOpen(false)}
                  >
                    View Medichecks profile
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
