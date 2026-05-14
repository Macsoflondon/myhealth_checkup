import { Link } from "react-router-dom";

const GOODBODY_LOGO = "/lovable-uploads/provider-goodbody-logo-new.webp";

const KIT = {
  advancedWellMan: "/images/tests/advanced-well-man.webp",
  premiumComplete: "/images/tests/premium-complete-blood-test.webp",
  earlyCancer: "/images/tests/early-cancer-screening.webp",
  thyroid: "/images/tests/thyroid-blood-test.webp",
  cholesterol: "/images/tests/cholesterol-blood-test.webp",
  generalHealth: "/images/tests/general-health-blood-test.webp",
};

const KitTile = ({ src, alt }: { src: string; alt: string }) => (
  <div className="rounded-2xl overflow-hidden bg-white shadow-md flex items-center justify-center p-2 aspect-square">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-[88%] h-[88%] object-contain object-top -translate-y-1 transition-transform duration-300 hover:scale-105"
    />
  </div>
);

const CalloutCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-white shadow-md p-5 sm:p-6 text-[#081129] font-sans text-sm sm:text-base leading-relaxed">
    {children}
  </div>
);

const GoodbodyBentoShowcase = () => {
  return (
    <div className="md:col-span-2 mt-6 mb-8 overflow-hidden">
      <div className="grid grid-cols-4 sm:grid-cols-6 auto-rows-[88px] sm:auto-rows-[108px] gap-3 sm:gap-3.5">
        {/* Row 1: blue kit | LOGO (spans 4 rows) | blue kit */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.advancedWellMan} alt="Advanced Well Man Blood Test" />
        </div>
        <div className="col-span-2 sm:col-span-2 row-span-4 rounded-2xl bg-white shadow-md flex flex-col items-center justify-center p-4 sm:p-5 overflow-hidden">
          <img
            src={GOODBODY_LOGO}
            alt="GOODBODY"
            loading="lazy"
            className="w-full max-w-[560px] h-auto max-h-[90%] object-contain"
          />
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.generalHealth} alt="General Health Blood Test" />
        </div>

        {/* Row 2: green kit | (logo cont.) | green kit */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.earlyCancer} alt="Early Cancer Screening Test" />
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.cholesterol} alt="Cholesterol Blood Test" />
        </div>

        {/* Row 3: red kit | callouts | red kit */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.thyroid} alt="Thyroid Blood Test" />
        </div>
        <div className="col-span-2 sm:col-span-2 row-span-2 flex flex-col gap-3 sm:gap-4">
          <CalloutCard>
            <strong>Goodbody Clinics</strong> are <strong>CQC Regulated</strong> and exclusively use <strong>UKAS-accredited laboratory analysis</strong>, with over <strong>200 nationwide locations</strong> and a convenient home testing service.
          </CalloutCard>
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.premiumComplete} alt="Premium Complete Blood Test" />
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-8 pb-[10px]">
        <Link
          to="/provider/goodbody"
          className="bg-brand-turquoise hover:bg-brand-pink text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
        >
          View Goodbody Profile
        </Link>
      </div>
    </div>
  );
};

export default GoodbodyBentoShowcase;
