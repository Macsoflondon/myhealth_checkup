import { useMarqueeTicker } from "@/hooks/useMarqueeTicker";

/**
 * PromoTicker — homepage promotional offers strip.
 * Uses the shared useMarqueeTicker hook (rAF + JS-driven translate3d), which
 * pauses when offscreen and on tab hide for mobile battery efficiency.
 */

const promos = [
  { provider: "GOODBODY", text: "GOODBODY5", color: "#0bb77e" },
  { provider: "MEDICHECKS", text: "APRIL20", color: "#e70d68" },
  { provider: "LOLA HEALTH", text: "Mar20", color: "#fa757e" },
];

const SETS = 8;

const PromoTicker = () => {
  const trackRef = useMarqueeTicker(promos.length);
  const items = Array.from({ length: SETS }, () => promos).flat();

  return (
    <section className="bg-brand-navy overflow-hidden select-none relative">

      <div className="pt-3 pb-1.5 sm:pt-5 sm:pb-2.5">
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
              <span key={i} className="flex items-center shrink-0 gap-1.5 sm:gap-2.5 px-2 sm:px-5">
                <span
                  className="font-heading font-bold text-[11px] xs:text-xs sm:text-lg md:text-xl tracking-wide uppercase leading-none"
                  style={{ color: p.color }}
                >
                  {p.provider}:
                </span>
                <span className="text-white font-body font-normal text-[11px] xs:text-xs sm:text-lg md:text-xl leading-none">
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

      <div className="h-[3px] bg-brand-turquoise" />
    </section>
  );
};

export default PromoTicker;
