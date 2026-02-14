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
  const items = [...keywords, ...keywords, ...keywords];

  return (
    <section className="bg-[hsl(224,67%,10%)] py-3 sm:py-4 overflow-hidden select-none">
      <div
        className="relative flex"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex animate-ticker whitespace-nowrap">
          {items.map((word, i) => (
            <span key={i} className="flex items-center">
              <span className="text-white font-heading font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase px-3 sm:px-5">
                {word}
              </span>
              <span className="text-[hsl(187,72%,48%)] text-lg">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandTicker;
