const kit1 = "/images/tests/advanced-well-man.webp";
const kit2 = "/images/tests/premium-complete-blood-test.webp";
const kit3 = "/images/tests/advanced-well-woman.webp";
const kit4 = "/images/tests/early-cancer-screening.webp";
const kit5 = "/images/tests/sports-fitness-blood-test.webp";
const kit6 = "/images/tests/female-hormone-fertility.webp";

const GOODBODY_LOGO = "/lovable-uploads/provider-goodbody-new-v4.png";

const GoodbodyFeaturePartnerBento = () => {
  return (
    <div className="md:col-span-2">
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] sm:auto-rows-[170px] md:auto-rows-[190px] gap-3 md:gap-4">
        {/* Logo + tagline — large card */}
        <div className="col-span-2 row-span-2 bg-white rounded-2xl p-6 md:p-10 flex flex-col justify-center items-start shadow-sm">
          <img
            src={GOODBODY_LOGO}
            alt="GOODBODY"
            loading="lazy"
            className="h-14 md:h-20 w-auto object-contain mb-3"
          />
          <p className="text-xl md:text-2xl lg:text-3xl font-heading text-[#22c0d4] italic">
            Know more. Live better.
          </p>
        </div>

        {/* Kit 1 */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <img src={kit1} alt="Advanced Well Man test kit" loading="lazy" className="w-full h-full object-contain" />
        </div>

        {/* Kit 2 — tall */}
        <div className="col-span-1 row-span-2 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <img src={kit2} alt="Premium Complete blood test kit" loading="lazy" className="w-full h-full object-contain" />
        </div>

        {/* Kit 3 */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <img src={kit3} alt="Advanced Well Woman test kit" loading="lazy" className="w-full h-full object-contain" />
        </div>

        {/* Kit 4 — tall */}
        <div className="col-span-1 row-span-2 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <img src={kit4} alt="Early Cancer Screening kit" loading="lazy" className="w-full h-full object-contain" />
        </div>

        {/* Text card 1 */}
        <div className="col-span-2 row-span-1 bg-white rounded-2xl p-5 md:p-6 flex items-center shadow-sm">
          <p className="text-sm md:text-base text-[#081129] leading-relaxed font-sans">
            <span className="font-bold">Goodbody Clinic</span> provides comprehensive private health checks at affordable prices, with over <span className="font-bold">200 nationwide locations</span> or convenient home testing.
          </p>
        </div>

        {/* Kit 5 */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <img src={kit5} alt="Sports & Fitness test kit" loading="lazy" className="w-full h-full object-contain" />
        </div>

        {/* Text card 2 */}
        <div className="col-span-2 row-span-1 bg-white rounded-2xl p-5 md:p-6 flex items-center shadow-sm">
          <p className="text-sm md:text-base text-[#081129] leading-relaxed font-sans">
            Goodbody Clinic is <span className="font-bold">CQC regulated</span> and exclusively uses <span className="font-bold">UKAS-accredited laboratory</span> analysis, with a comprehensive GP review of your results.
          </p>
        </div>

        {/* Kit 6 */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <img src={kit6} alt="Female Hormone & Fertility kit" loading="lazy" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default GoodbodyFeaturePartnerBento;
