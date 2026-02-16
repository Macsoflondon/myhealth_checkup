const keywords = [
  "Blood Tests",
  "Cancer Screening",
  "Hormone Checks",
  "Vitamin Testing",
  "Heart Health",
  "Thyroid",
  "Full Body MOTs",
];

const BrandTicker = () => {
  const items = [...keywords, ...keywords];

  return (
    <section className="bg-[hsl(224,67%,10%)] overflow-hidden select-none">
      {/* Gradient divider: teal > pink > teal */}
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      <div className="py-3 sm:py-4">
        <div
          className="relative flex overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="animate-ticker flex shrink-0 whitespace-nowrap">
            {items.map((word, i) => (
              <span key={`a-${i}`} className="flex items-center">
                <span className="text-white font-heading font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase px-3 sm:px-5">
                  {word}
                </span>
                <span className="text-brand-turquoise text-lg">•</span>
              </span>
            ))}
          </div>
          <div className="animate-ticker flex shrink-0 whitespace-nowrap" aria-hidden="true">
            {items.map((word, i) => (
              <span key={`b-${i}`} className="flex items-center">
                <span className="text-white font-heading font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase px-3 sm:px-5">
                  {word}
                </span>
                <span className="text-brand-turquoise text-lg">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandTicker;
