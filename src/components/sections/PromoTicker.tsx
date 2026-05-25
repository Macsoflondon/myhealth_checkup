import { useMarqueeTicker } from "@/hooks/useMarqueeTicker";

/**
 * PromoTicker — homepage promotional offers strip.
 * Uses the shared useMarqueeTicker hook (rAF + JS-driven translate3d), which
 * pauses when offscreen and on tab hide for mobile battery efficiency.
 */

const promos = [
  { provider: "GoodBody", text: "5% off on all popular blood tests", color: "#0bb77e" },
  { provider: "MEDICHECKS", text: "20% off all tests with code APRIL20", color: "#e70d68" },
  { provider: "Lola Health", text: "£20 off - use code MAY20", color: "#fa757e" },
];

const SETS = 8;

const PromoTicker = () => {
  const trackRef = useMarqueeTicker(promos.length);
  const items = Array.from({ length: SETS }, () => promos).flat();

  return (
    <section className="bg-brand-navy overflow-hidden select-none relative">

      <div className="font-body sm:text-lg md:text-xl leading-none font-semibold text-xl text-white bg-[#08122b]">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          }}
          aria-label="Promotional offers from health test providers"
        >
          <div
            ref={trackRef}
            data-testid="promo-ticker-track"
            className="flex whitespace-nowrap leading-tight"
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          >
            {items.map((p, i) => (
              <span key={i} className="flex items-center shrink-0 gap-1.5 sm:gap-2.5 px-2 sm:px-5 bg-[#08122b]">
                <span
                  className="font-heading text-[11px] xs:text-xs sm:text-lg md:text-xl tracking-wide uppercase leading-none font-extrabold"
                  style={{ color: p.color }}
                >
                  {p.provider}:
                </span>
                <span className="font-body sm:text-lg md:text-xl leading-none font-semibold text-xl text-white bg-[#08122b]">
                  {p.text}
                </span>
                <span
                  className="text-brand-pink text-base sm:text-xl leading-none pl-0.5 sm:pl-2"
                  aria-hidden="true"
                >
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default PromoTicker;
