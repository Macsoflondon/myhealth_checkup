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
  <div className="rounded-2xl overflow-hidden bg-white shadow-md flex items-center justify-center p-3 aspect-square">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
    />
  </div>
);

const CalloutCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-white shadow-md p-5 sm:p-6 text-[#081129] font-sans text-sm sm:text-base leading-relaxed aspect-square flex items-center">
    {children}
  </div>
);

const GoodbodyBentoShowcase = () => {
  return (
    <div className="md:col-span-2 mt-6 mb-8">
      <div className="grid grid-cols-3 gap-6 sm:gap-8">
        {/* Row 1 */}
        <KitTile src={KIT.advancedWellMan} alt="Advanced Well Man Blood Test" />
        <CalloutCard>
          <span><strong>Goodbody Clinics</strong> are <strong>CQC Regulated</strong> and use <strong>UKAS-accredited laboratory analysis</strong>.</span>
        </CalloutCard>
        <KitTile src={KIT.generalHealth} alt="General Health Blood Test" />

        {/* Row 2 — logo same size as kits */}
        <KitTile src={KIT.earlyCancer} alt="Early Cancer Screening Test" />
        <div className="rounded-2xl bg-white shadow-md flex items-center justify-center p-5 aspect-square overflow-hidden">
          <img
            src={GOODBODY_LOGO}
            alt="GOODBODY"
            loading="lazy"
            className="w-full h-auto max-h-full object-contain"
          />
        </div>
        <KitTile src={KIT.cholesterol} alt="Cholesterol Blood Test" />

        {/* Row 3 */}
        <KitTile src={KIT.thyroid} alt="Thyroid Blood Test" />
        <CalloutCard>
          <span>Choose from over <strong>200 nationwide locations</strong> or a convenient <strong>home testing service</strong>.</span>
        </CalloutCard>
        <KitTile src={KIT.premiumComplete} alt="Premium Complete Blood Test" />
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
