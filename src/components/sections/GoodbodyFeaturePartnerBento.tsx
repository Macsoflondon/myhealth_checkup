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

        {/* Coast image */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
          <img src={coastImg} alt="Coastal cliffs" loading="lazy" className="w-full h-full object-cover" />
        </div>

        {/* Wave image */}
        <div className="col-span-1 row-span-2 rounded-2xl overflow-hidden">
          <img src={waveImg} alt="Turquoise wave" loading="lazy" className="w-full h-full object-cover" />
        </div>

        {/* Sunrise image */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
          <img src={sunriseImg} alt="Beach sunrise" loading="lazy" className="w-full h-full object-cover" />
        </div>

        {/* Portrait */}
        <div className="col-span-1 row-span-2 rounded-2xl overflow-hidden">
          <img src={portraitImg} alt="Healthy lifestyle portrait" loading="lazy" className="w-full h-full object-cover" />
        </div>

        {/* Text card 1 */}
        <div className="col-span-2 row-span-1 bg-white rounded-2xl p-5 md:p-6 flex items-center shadow-sm">
          <p className="text-sm md:text-base text-[#081129] leading-relaxed font-sans">
            <span className="font-bold">Goodbody Clinic</span> provides comprehensive private health checks at affordable prices, with over <span className="font-bold">200 nationwide locations</span> or convenient home testing.
          </p>
        </div>

        {/* Coast small */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
          <img src={coastImg} alt="Coastal scene" loading="lazy" className="w-full h-full object-cover" />
        </div>

        {/* Text card 2 */}
        <div className="col-span-2 row-span-1 bg-white rounded-2xl p-5 md:p-6 flex items-center shadow-sm">
          <p className="text-sm md:text-base text-[#081129] leading-relaxed font-sans">
            Goodbody Clinic is <span className="font-bold">CQC regulated</span> and exclusively uses <span className="font-bold">UKAS-accredited laboratory</span> analysis, with a comprehensive GP review of your results.
          </p>
        </div>

        {/* Sunrise small */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
          <img src={sunriseImg} alt="Sunrise" loading="lazy" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default GoodbodyFeaturePartnerBento;
