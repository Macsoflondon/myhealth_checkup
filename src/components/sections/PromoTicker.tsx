import { useMarqueeTicker } from "@/hooks/useMarqueeTicker";

/**
 * PromoTicker — homepage promotional offers strip.
 * Uses the shared useMarqueeTicker hook (rAF + JS-driven translate3d), which
 * pauses when offscreen and on tab hide for mobile battery efficiency.
 */

const promos = [
  { provider: "GoodBody", text: "5% off on all popular blood tests", color: "#0bb77e" },
  { provider: "MEDICHECKS", text: "20% off all tests with code APRIL20", color: "#e70d68" },
  { provider: "Lola Health", text: "£20 off with code Mar20", color: "#fa757e" },
];

const SETS = 8;

const PromoTicker = () => {
  const trackRef = useMarqueeTicker(promos.length);
  const items = Array.from({ length: SETS }, () => promos).flat();

  return (
    <section className="bg-brand-navy overflow-hidden select-none relative">
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      <div className="pt-4 pb-2 sm:pt-5 sm:pb-2.5">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
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
              <span key={i} className="flex items-center shrink-0 gap-2 sm:gap-2.5 px-3 sm:px-5">
                <span
                  className="font-heading font-bold text-sm sm:text-lg md:text-xl tracking-wide uppercase leading-none"
                  style={{ color: p.color }}
                >
                  {p.provider}:
                </span>
                <span className="text-white font-body font-normal text-sm sm:text-lg md:text-xl leading-none">
                  {p.text}
                </span>
                <span
                  className="text-brand-pink text-lg sm:text-xl leading-none pl-1 sm:pl-2"
                  aria-hidden="true"
                >
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default PromoTicker;
