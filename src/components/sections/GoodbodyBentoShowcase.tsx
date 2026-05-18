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

const KitTile = ({ src, alt, label, href }: { src: string; alt: string; label: string; href: string }) => (
  <Link
    to={href}
    aria-label={`${label} — view test information`}
    className="group rounded-2xl overflow-hidden bg-white shadow-md p-3 h-full w-full flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-brand-turquoise focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise"
  >
    <div className="flex-1 w-full flex items-center justify-center min-h-0">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="max-w-[80%] max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <span className="mt-1 text-[#081129] font-semibold text-[11px] sm:text-xs text-center leading-tight line-clamp-2 px-1">
      {label}
    </span>
  </Link>
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
          <KitTile src={KIT.advancedWellMan} alt="Advanced Well Man Blood Test" label="Advanced Well Man" href="/tests/mens-health" />
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
          <KitTile src={KIT.premiumComplete} alt="Premium Complete Blood Test" label="Premium Complete" href="/test/general-health" />
        </div>

        {/* Row: kit + 2 callouts + kit */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.earlyCancer} alt="Early Cancer Screening Test" label="Early Cancer Screening" href="/tests/cancer" />
        </div>
        <div className="col-span-2 sm:col-span-2 row-span-2 flex flex-col gap-3 sm:gap-4">
          <CalloutCard>
            <strong>Goodbody Clinics</strong> deliver high-quality private health checks that are accessible and affordable.
          </CalloutCard>
          <CalloutCard>
            Clinical-grade accuracy meets high-street convenience, with over <strong>60 blood and wellness tests</strong> to choose from.
          </CalloutCard>
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.femaleHormone} alt="Female Hormone & Fertility Test" label="Female Hormone & Fertility" href="/test/female-hormones" />
        </div>

        {/* Row: kit + 2 callouts + cholesterol (replaces EpiSwitch) */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.thyroid} alt="Thyroid Blood Test" />
        </div>
        <div className="col-span-2 sm:col-span-2 row-span-2 flex flex-col gap-3 sm:gap-4">
          <CalloutCard>
            Every test is processed in <strong>UKAS-accredited laboratories</strong> and reviewed by a GP for results you can trust.
          </CalloutCard>
          <CalloutCard>
            <strong>Goodbody Clinics</strong> make proactive health simple, reliable, and within reach.
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
