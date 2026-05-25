import { useMarqueeTicker } from "@/hooks/useMarqueeTicker";

const promos = [
  { text: "20% OFF ALL TESTS", code: "SUMMER20" },
  { text: "FREE UK DELIVERY", code: "ON ORDERS OVER £50" },
  { text: "20% OFF ALL TESTS", code: "SUMMER20" },
  { text: "NEW CUSTOMER OFFER", code: "WELCOME10" },
];

const SETS = 8;

const FloatingPromoCarousel = () => {
  const trackRef = useMarqueeTicker(promos.length);
  const items = Array.from({ length: SETS }, () => promos).flat();

  return (
    <div className="sticky top-0 z-[60] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise text-white shadow-md overflow-hidden select-none">
      <div
        className="relative overflow-hidden py-2"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
        aria-label="Site-wide promotional offers"
      >
        <div
          ref={trackRef}
          className="flex whitespace-nowrap leading-none"
          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        >
          {items.map((p, i) => (
            <span key={i} className="flex items-center shrink-0 gap-2 sm:gap-3 px-4 sm:px-8">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase">
                {p.text}
              </span>
              <span className="font-body font-semibold text-xs sm:text-sm md:text-base opacity-90">
                — use code {p.code}
              </span>
              <span className="text-white/70 text-base px-1" aria-hidden="true">★</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingPromoCarousel;
