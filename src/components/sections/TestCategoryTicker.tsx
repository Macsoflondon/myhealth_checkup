import { useMarqueeTicker } from "@/hooks/useMarqueeTicker";

const categories = [
  "Cancer Screening",
  "Heart Health",
  "Hormone Health",
  "Men's Health",
  "Women's Health & Fertility",
  "Diabetes & Blood Sugar",
  "Gut Health",
  "Vitamin & Nutrient Testing",
  "Comprehensive Blood Panels",
  "Thyroid Function",
  "Longevity Tests",
  "Fitness & Performance",
  "Iron & Anaemia",
];

const SETS = 8;

const TestCategoryTicker = () => {
  const trackRef = useMarqueeTicker(categories.length);
  const items = Array.from({ length: SETS }, () => categories).flat();

  return (
    <section className="bg-brand-navy overflow-hidden select-none relative">
      <div className="py-2.5 sm:py-3">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div
            ref={trackRef}
            className="flex whitespace-nowrap"
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          >
            {items.map((cat, i) => (
              <span key={i} className="flex items-center shrink-0">
                <span className="font-heading font-semibold text-xs sm:text-sm md:text-base tracking-wider uppercase px-3 sm:px-5 text-white">
                  {cat}
                </span>
                <span className="text-brand-pink text-lg px-1 sm:px-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default TestCategoryTicker;
