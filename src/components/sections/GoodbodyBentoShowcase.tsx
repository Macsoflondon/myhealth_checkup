import { Link } from "react-router-dom";
import { analytics } from "@/lib/analytics";

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
    onClick={() =>
      analytics.kitTileClick({
        tile_id: href,
        tile_label: label,
        destination: href,
        surface: "goodbody_bento",
      })
    }
    className="group rounded-2xl overflow-hidden bg-white shadow-md p-3 h-full w-full flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-brand-turquoise focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise"
  >
    <div className="flex-1 w-full flex items-center justify-center min-h-0">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
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

        {/* Row: kit + unified callout (spans 4 rows) + kit */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.earlyCancer} alt="Early Cancer Screening Test" label="Early Cancer Screening" href="/tests/cancer" />
        </div>
        <div className="col-span-2 sm:col-span-2 row-span-4 rounded-2xl bg-white shadow-md p-6 sm:p-8 flex flex-col justify-center text-center text-[#081129] font-sans">
          <h3 className="font-heading font-bold text-lg sm:text-xl mb-4 text-[#081129]">
            ​
          </h3>
          <p className="text-sm sm:text-base leading-relaxed mb-3">
            <strong className="text-[#47a970]">Goodbody Clinics</strong> delivers <strong className="text-[#47a970]">high-quality private blood tests</strong> and <strong className="text-[#47a970]">cancer screening</strong> that are accessible, affordable, and convenient.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mb-3">
            With <strong className="text-[#47a970]">clinical-grade accuracy</strong> and high-street accessibility, we empower people to take control of their health with confidence.
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-[#47a970] to-[#e70d69] mx-auto my-3" />
          <p className="text-sm sm:text-base leading-relaxed">
            Choose from over <strong className="text-[#47a970]">60 blood and wellness tests</strong>, each processed in <strong className="text-[#47a970]">UKAS-accredited laboratories</strong> and reviewed by a GP. Proactive health, made simple, reliable, and within reach.
          </p>
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.femaleHormone} alt="Female Hormone & Fertility Test" label="Female Hormone & Fertility" href="/test/female-hormones" />
        </div>

        {/* Row: kit + (callout continues) + kit */}
        <div className="col-span-2 sm:col-span-2 row-span-2">
          <KitTile src={KIT.thyroid} alt="Thyroid Blood Test" label="Thyroid Blood Test" href="/thyroid" />
        </div>
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <KitTile src={KIT.cholesterol} alt="Cholesterol Blood Test" label="Cholesterol Blood Test" href="/test/lipid-profile" />
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
