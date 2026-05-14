import { Link } from "react-router-dom";

const GOODBODY_LOGO = "/lovable-uploads/provider-goodbody-logo-new.webp";

const KIT = {
  advancedWellMan: "/images/tests/advanced-well-man.webp",
  premiumComplete: "/images/tests/premium-complete-blood-test.webp",
  earlyCancer: "/images/tests/early-cancer-screening.webp",
  femaleHormone: "/images/tests/female-hormone-fertility.webp",
  thyroid: "/images/tests/thyroid-blood-test.webp",
  vitamins: "/images/tests/vitamins-blood-test.webp",
  cholesterol: "/images/tests/cholesterol-blood-test.webp",
  sportsFitness: "/images/tests/sports-fitness-blood-test.webp",
};

const KitTile = ({ src, alt }: { src: string; alt: string }) => (
  <div className="rounded-2xl overflow-hidden bg-white shadow-md p-3 aspect-square flex-col flex items-center justify-start">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-[85%] h-[85%] object-contain transition-transform duration-300 hover:scale-105"
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
    <div className="md:col-span-2 mt-6 mb-4">
      <div className="grid grid-cols-4 sm:grid-cols-6 auto-rows-[88px] sm:auto-rows-[112px] gap-3 sm:gap-4">
        {/* Top row: Advanced Well Man | Logo (center) | Premium Complete (right) */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.advancedWellMan} alt="Advanced Well Man Blood Test" />
        </div>
        <div className="col-span-2 sm:col-span-2 row-span-2 rounded-2xl bg-white shadow-md flex flex-col items-center justify-center p-6 sm:p-8">
          <img
            src={GOODBODY_LOGO}
            alt="GOODBODY"
            loading="lazy"
            className="h-48 sm:h-64 md:h-80 w-auto object-contain"
          />
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.premiumComplete} alt="Premium Complete Blood Test" />
        </div>

        {/* Row: kit + 2 callouts + kit */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.earlyCancer} alt="Early Cancer Screening Test" />
        </div>
        <div className="col-span-2 sm:col-span-2 row-span-2 flex flex-col gap-3 sm:gap-4">
          <CalloutCard>
            <strong>Goodbody Clinics</strong> provide comprehensive private health
            checks at affordable prices.
          </CalloutCard>
          <CalloutCard>
            Visit one of over <strong>200 nationwide locations</strong>, or opt
            for their convenient home testing service. Goodbody Clinics have you
            covered.
          </CalloutCard>
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.femaleHormone} alt="Female Hormone & Fertility Test" />
        </div>

        {/* Row: kit + 2 callouts + cholesterol (replaces EpiSwitch) */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.thyroid} alt="Thyroid Blood Test" />
        </div>
        <div className="col-span-2 sm:col-span-2 row-span-2 flex flex-col gap-3 sm:gap-4">
          <CalloutCard>
            Goodbody Clinics are <strong>regulated by the CQC</strong> and
            exclusively use <strong>UKAS-accredited laboratory analysis</strong>,
            providing you with a comprehensive GP review of your results.
          </CalloutCard>
          <CalloutCard>
            They offer a blend of clinical precision and convenient high-street
            accessibility, featuring over <strong>60 different blood and
            wellness tests</strong> for you to choose from.
          </CalloutCard>
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.cholesterol} alt="Cholesterol Blood Test" />
        </div>

        {/* Bottom strip: Vitamins | (blank for CTA) | Sports & Fitness */}
        <div className="col-span-2 sm:col-span-2">
          <KitTile src={KIT.vitamins} alt="Vitamins Blood Test" />
        </div>
        <div className="col-span-2 sm:col-span-2" aria-hidden="true" />
        <div className="col-span-4 sm:col-span-2">
          <KitTile src={KIT.sportsFitness} alt="Sports & Fitness Blood Test" />
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
