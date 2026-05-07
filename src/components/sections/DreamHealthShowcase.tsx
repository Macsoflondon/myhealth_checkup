import { useNavigate } from "react-router-dom";
import heroHomeKit from "@/assets/hero/hero-home-kit.webp";
import healthResults from "@/assets/health-results.jpg";
import bloodTestKit from "@/assets/blood-test-kit.jpg";
import kitTurquoise from "@/assets/kits/kit-turquoise.jpg";
import kitPink from "@/assets/kits/kit-pink.jpg";
import kitNavy from "@/assets/kits/kit-navy.jpg";
import kitWhite from "@/assets/kits/kit-white.jpg";
import kitBlack from "@/assets/kits/kit-black.jpg";
import kitCoral from "@/assets/kits/kit-coral.jpg";
import heroCompare from "@/assets/hero/hero-compare-decide.webp";

const tiles = [
  { src: kitTurquoise, alt: "At-home blood test kit" },
  { src: kitPink, alt: "Women's health test kit" },
  { src: kitNavy, alt: "Wellness test kit" },
  { src: bloodTestKit, alt: "Finger-prick test kit" },
  { src: kitWhite, alt: "DNA and blood test kit" },
  { src: kitBlack, alt: "Premium hormone test kit" },
  { src: kitCoral, alt: "Women's health home kit" },
  { src: heroHomeKit, alt: "Home test kit on table" },
];

const popularKits = [
  {
    img: kitTurquoise,
    name: "Essential Health Check",
    description: "Core wellness markers covering energy, immunity and metabolism.",
    price: "£49",
    provider: "Medichecks",
  },
  {
    img: kitPink,
    name: "Advanced Well Woman",
    description: "Hormones, thyroid and iron in one female-focused panel.",
    price: "£119",
    provider: "Thriva",
  },
  {
    img: kitNavy,
    name: "Ultimate Performance",
    description: "Comprehensive panel for active adults and longevity goals.",
    price: "£179",
    provider: "Randox",
  },
  {
    img: kitBlack,
    name: "Male Hormone Profile",
    description: "Testosterone, SHBG and key male health biomarkers.",
    price: "£89",
    provider: "Forth",
  },
  {
    img: kitWhite,
    name: "Vitamin & Minerals",
    description: "Vitamin D, B12, ferritin and folate in one finger-prick test.",
    price: "£59",
    provider: "Numan",
  },
  {
    img: kitCoral,
    name: "Fertility & Hormones",
    description: "Female fertility hormones with personalised insights.",
    price: "£99",
    provider: "Hertility",
  },
];

const DreamHealthShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Filmstrip of tiles */}
      <div className="relative">
        <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 overflow-x-auto scrollbar-hide snap-x">
          {tiles.map((t, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[42vw] sm:w-[26vw] md:w-[19vw] lg:w-[17vw] aspect-square rounded-2xl overflow-hidden shadow-md snap-start"
            >
              <img
                src={t.src}
                alt={t.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Headline + subtitle + CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center mt-10 sm:mt-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-[#081129] leading-[1.05]">
          Your health. On the perfect plan.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#22c0d4] font-medium max-w-2xl mx-auto">
          myhealth checkup is the super simple way to find a test, match a provider, and get it done.
        </p>

        <div className="mt-7 flex justify-center">
          <button
            onClick={() => navigate("/assisted-test-finder")}
            className="bg-[#081129] text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base shadow-lg hover:bg-[#0f1d44] transition-colors"
          >
            Start your health journey
          </button>
        </div>

        {/* Mini cards */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
          {miniCards.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white border border-black/5 shadow-sm rounded-2xl p-2 pr-5 min-w-[210px]"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                <img src={c.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#081129] leading-tight">{c.title}</p>
                <p className="text-xs text-[#081129]/50 leading-tight mt-0.5">{c.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DreamHealthShowcase;
