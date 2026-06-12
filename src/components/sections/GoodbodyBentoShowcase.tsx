import { Link } from "react-router-dom";
import { analytics } from "@/lib/analytics";
import generalHealthAsset from "@/assets/goodbody/general-health-fingerprint.png.asset.json";
import cholesterolFpAsset from "@/assets/goodbody/cholesterol-fingerprint.png.asset.json";
import wellManFpAsset from "@/assets/goodbody/essential-well-man-fingerprint.png.asset.json";
import wellWomanFpAsset from "@/assets/goodbody/essential-well-woman-fingerprint.png.asset.json";

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
  advancedWellWoman: "/images/tests/advanced-well-woman.webp",
  testosterone: "/images/tests/testosterone-blood-test.webp",
  cardiacRisk: "/images/tests/cardiac-risk-blood-test.webp",
  fullBloodCount: "/images/tests/full-blood-count-blood-test.webp",
  kidney: "/images/tests/kidney-blood-test.webp",
  erectileDysfunction: "/images/tests/male-hormone-fertility-blood-test.webp",
  generalHealthFp: generalHealthAsset.url,
  cholesterolFp: cholesterolFpAsset.url,
  wellManFp: wellManFpAsset.url,
  wellWomanFp: wellWomanFpAsset.url,
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

const GoodbodyBentoShowcase = () => {
  return (
    <div className="md:col-span-2 mt-6 mb-4">
      {/* Mobile layout (<sm) */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {/* Row 1: Logo spans 2 cols */}
        <div className="col-span-2 aspect-[2/1] rounded-2xl bg-white shadow-md flex items-center justify-center p-6">
          <img
            src={GOODBODY_LOGO}
            alt="GOODBODY"
            loading="lazy"
            className="max-h-full max-w-full w-auto h-auto object-contain"
          />
        </div>

        {/* Row 2: original + new fingerprint */}
        <div className="aspect-square">
          <KitTile src={KIT.advancedWellMan} alt="Advanced Well Man Blood Test" label="Advanced Well Man" href="/tests/mens-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.generalHealthFp} alt="General Health Fingerprint Blood Test" label="General Health" href="/test/general-health" />
        </div>

        {/* Row 3: original + new fingerprint */}
        <div className="aspect-square">
          <KitTile src={KIT.premiumComplete} alt="Premium Complete Blood Test" label="Premium Complete" href="/test/general-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.wellManFp} alt="Essential Well Man Fingerprint Test" label="Essential Well Man" href="/tests/mens-health" />
        </div>

        {/* Row 4: text + CTA, footprint of 2x2 kit tiles */}
        <div className="col-span-2 min-h-[20rem] rounded-2xl bg-white shadow-md p-5 flex flex-col text-center text-[#081129] font-sans">
          <div className="flex-1 flex flex-col justify-center space-y-3">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              <strong className="text-[#47a970]">Goodbody Clinics</strong> delivers <strong className="text-[#47a970]">high-quality private blood tests</strong> and <strong className="text-[#47a970]">cancer screening</strong>{"\n"}accessible, affordable and convenient.
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              <strong className="text-[#47a970]">Clinical-grade accuracy</strong> with high-street accessibility, empowering confident{"\u00A0"}{"\n"}health decisions.
            </p>
            <p className="text-sm leading-relaxed">
              Over <strong className="text-[#47a970]">60 blood and wellness tests</strong>, processed in <strong className="text-[#47a970]">UKAS-accredited laboratories</strong> and reviewed by a GP.
            </p>
          </div>
          <Link
            to="/provider/goodbody"
            className="mt-4 w-full bg-brand-turquoise hover:bg-brand-pink text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-sm"
          >
            View Goodbody Profile
          </Link>
        </div>

        {/* Row 5: original + new fingerprint */}
        <div className="aspect-square">
          <KitTile src={KIT.earlyCancer} alt="Early Cancer Screening Test" label="Early Cancer Screening" href="/tests/cancer" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.wellWomanFp} alt="Essential Well Woman Fingerprint Test" label="Essential Well Woman" href="/tests/womens-health" />
        </div>

        {/* Row 6: originals */}
        <div className="aspect-square">
          <KitTile src={KIT.femaleHormone} alt="Female Hormone & Fertility Test" label="Female Hormone & Fertility" href="/test/female-hormones" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.thyroid} alt="Thyroid Blood Test" label="Thyroid Blood Test" href="/thyroid" />
        </div>

        {/* Row 7: original + new fingerprint */}
        <div className="aspect-square">
          <KitTile src={KIT.cholesterol} alt="Cholesterol Blood Test" label="Cholesterol Blood Test" href="/test/lipid-profile" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.cholesterolFp} alt="Cholesterol Fingerprint Blood Test" label="Cholesterol Fingerprint" href="/test/lipid-profile" />
        </div>
      </div>

      {/* Desktop/tablet layout (sm+) — 6 col grid, logo 2-wide flat at top, callout spans 2x2 */}
      <div className="hidden sm:grid sm:grid-cols-6 gap-3 sm:gap-4">
        {/* Row 1: kit | kit | LOGO (2 wide, flat) | kit | kit */}
        <div className="aspect-square">
          <KitTile src={KIT.fullBloodCount} alt="Full Blood Count Test" label="Full Blood Count" href="/test/general-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.advancedWellMan} alt="Advanced Well Man Blood Test" label="Advanced Well Man" href="/tests/mens-health" />
        </div>
        <div className="aspect-[2/1] rounded-2xl bg-white shadow-md flex items-center justify-center p-4 sm:p-6 col-span-2">
          <img
            src={GOODBODY_LOGO}
            alt="GOODBODY"
            loading="lazy"
            className="max-h-full max-w-full w-auto h-auto object-contain"
          />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.generalHealthFp} alt="General Health Fingerprint Blood Test" label="General Health" href="/test/general-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.cardiacRisk} alt="Cardiac Risk Blood Test" label="Cardiac Risk" href="/test/general-health" />
        </div>

        {/* Row 2: kit | kit | CALLOUT (2x2) | kit | kit */}
        <div className="aspect-square">
          <KitTile src={KIT.testosterone} alt="Testosterone Blood Test" label="Testosterone" href="/tests/mens-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.premiumComplete} alt="Premium Complete Blood Test" label="Premium Complete" href="/test/general-health" />
        </div>
        <div className="col-span-2 row-span-2 rounded-2xl bg-white shadow-md p-6 sm:p-8 flex flex-col justify-center text-center text-[#081129] font-sans">
          <p className="text-sm sm:text-base leading-relaxed mb-3">
            <strong className="text-[#47a970]">Goodbody Clinics</strong> delivers <strong className="text-[#47a970]">high-quality private blood tests</strong> and <strong className="text-[#47a970]">cancer screening</strong> that are accessible, affordable, and convenient.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mb-3">
            With <strong className="text-[#47a970]">clinical-grade accuracy</strong> and high-street accessibility, we empower people to take control of their health with confidence.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            Choose from over <strong className="text-[#47a970]">60 blood and wellness tests</strong>, each processed in <strong className="text-[#47a970]">UKAS-accredited laboratories</strong> and reviewed by a GP. Proactive health, made simple, reliable, and within reach.
          </p>
          <div className="flex justify-center mt-5">
            <Link
              to="/provider/goodbody"
              className="bg-brand-turquoise hover:bg-brand-pink text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 text-sm"
            >
              View Goodbody Profile
            </Link>
          </div>
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.wellManFp} alt="Essential Well Man Fingerprint Test" label="Essential Well Man" href="/tests/mens-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.advancedWellWoman} alt="Advanced Well Woman Blood Test" label="Advanced Well Woman" href="/tests/womens-health" />
        </div>

        {/* Row 3: kit | kit | (callout continues) | kit | kit */}
        <div className="aspect-square">
          <KitTile src={KIT.iron} alt="Iron Blood Test" label="Iron" href="/test/general-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.earlyCancer} alt="Early Cancer Screening Test" label="Early Cancer Screening" href="/tests/cancer" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.femaleHormone} alt="Female Hormone & Fertility Test" label="Female Hormone & Fertility" href="/test/female-hormones" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.vitamins} alt="Vitamins Blood Test" label="Vitamins" href="/test/general-health" />
        </div>

        {/* Row 4: 6 kits across */}
        <div className="aspect-square">
          <KitTile src={KIT.kidney} alt="Kidney Blood Test" label="Kidney" href="/test/general-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.thyroid} alt="Thyroid Blood Test" label="Thyroid Blood Test" href="/thyroid" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.wellWomanFp} alt="Essential Well Woman Fingerprint Test" label="Essential Well Woman" href="/tests/womens-health" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.cholesterol} alt="Cholesterol Blood Test" label="Cholesterol Blood Test" href="/test/lipid-profile" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.cholesterolFp} alt="Cholesterol Fingerprint Blood Test" label="Cholesterol Fingerprint" href="/test/lipid-profile" />
        </div>
        <div className="aspect-square">
          <KitTile src={KIT.sportsFitness} alt="Sports & Fitness Blood Test" label="Sports & Fitness" href="/test/general-health" />
        </div>
      </div>
    </div>
  );
};


export default GoodbodyBentoShowcase;
