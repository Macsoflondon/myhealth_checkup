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
  <div className="rounded-2xl overflow-hidden bg-white shadow-md p-3 h-full w-full flex flex-col items-center justify-center">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 hover:scale-105"
    />
  </div>
);

const CalloutCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-white shadow-md p-5 sm:p-6 text-[#081129] font-sans text-sm leading-relaxed pt-[10px] sm:text-base">
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
            <strong>Goodbody Clinics</strong> deliver high-quality private health
            checks that are both accessible and affordable.
          </CalloutCard>
          <CalloutCard>
            Combining clinical-grade accuracy with the ease of high-street
            locations, they offer a wide range of over <strong>60 blood and wellness
            tests</strong> tailored to your needs. Every test is processed in
            UKAS-accredited laboratories and reviewed by a GP, ensuring results
            you can trust.
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
            Every test is processed in <strong>UKAS-accredited laboratories</strong> and reviewed by a GP, ensuring results you can trust.
            {"\n"}
            <strong>Regulated by the CQC</strong> and available at over <strong>200 locations nationwide</strong> or from the comfort of your home.
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
