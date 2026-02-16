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
          {/* First copy */}
          <div
            className="flex shrink-0 whitespace-nowrap"
            style={{
              animation: "brand-ticker-scroll 35s linear infinite",
            }}
          >
            {items.map((word, i) => (
              <span key={`a-${i}`} className="flex items-center">
                <span className="text-white font-heading font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase px-3 sm:px-5">
                  {word}
                </span>
                <span className="text-brand-turquoise text-lg">•</span>
              </span>
            ))}
          </div>
          {/* Second copy for seamless loop */}
          <div
            className="flex shrink-0 whitespace-nowrap"
            aria-hidden="true"
            style={{
              animation: "brand-ticker-scroll 35s linear infinite",
            }}
          >
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

      {/* Inline keyframes to guarantee animation works */}
      <style>{`
        @keyframes brand-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
};

export default BrandTicker;
