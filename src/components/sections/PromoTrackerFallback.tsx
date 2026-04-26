/**
 * Static, dependency-free fallback for PromoTracker.
 *
 * Rendered when the animated marquee crashes (e.g., ResizeObserver / RAF
 * issues in older browsers). Preserves the visual band on the homepage so
 * the layout below doesn't shift, but skips animation and refs entirely.
 */
const promos = [
  { provider: "GoodBody", text: "5% off on all popular blood tests", color: "#0bb77e" },
  { provider: "Medichecks", text: "20% off all tests with code APRIL20", color: "#e70d68" },
  { provider: "Lola Health", text: "£20 off with code Mar20", color: "#fa757e" },
];

const PromoTrackerFallback = () => {
  return (
    <section
      className="bg-brand-navy overflow-hidden select-none relative"
      aria-label="Promotional offers from health test providers"
    >
      <div className="h-[2px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      <div className="pt-4 pb-2 sm:pt-5 sm:pb-2.5 px-2 sm:px-4">
        <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 leading-tight">
          {promos.map((promo, i) => (
            <span key={i} className="flex items-baseline shrink-0">
              <span
                className="font-heading font-bold text-sm sm:text-lg md:text-xl tracking-wider sm:tracking-widest uppercase pr-2"
                style={{ color: promo.color }}
              >
                {promo.provider}:
              </span>
              <span className="text-white font-body text-sm sm:text-lg md:text-xl">
                {promo.text}
              </span>
              {i < promos.length - 1 && (
                <span
                  className="text-brand-pink text-lg sm:text-xl leading-none px-2 hidden sm:inline"
                  aria-hidden="true"
                >
                  •
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default PromoTrackerFallback;
