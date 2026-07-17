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

interface TestCategoryTickerProps {
  /**
   * "section" — default full-width navy strip used between page sections.
   * "inline" — transparent background, navy text, tighter padding for use
   *            inside the pearl hero footer.
   */
  variant?: "section" | "inline";
  className?: string;
}

const TestCategoryTicker = ({ variant = "section", className = "" }: TestCategoryTickerProps) => {
  const trackRef = useMarqueeTicker(categories.length, 0.03);
  const items = Array.from({ length: SETS }, () => categories).flat();

  const isInline = variant === "inline";

  const wrapperClass = isInline
    ? `overflow-hidden select-none relative ${className}`
    : `bg-brand-navy overflow-hidden select-none relative ${className}`;

  const innerPad = isInline ? "py-1.5 sm:py-2" : "py-2.5 sm:py-3";


  const textClass = isInline
    ? "font-heading font-semibold text-xs sm:text-sm md:text-base tracking-wider uppercase px-3 sm:px-5 text-white"
    : "font-heading font-semibold text-xs sm:text-sm md:text-base tracking-wider uppercase px-3 sm:px-5 text-white";

  return (
    <section className={wrapperClass} aria-label="Health test categories">
      <div className={innerPad}>
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
                <span className={textClass}>{cat}</span>
                <span className="text-brand-pink text-lg px-1 sm:px-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestCategoryTicker;
