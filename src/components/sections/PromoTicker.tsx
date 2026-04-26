/**
 * PromoTicker — homepage promotional offers strip.
 *
 * Pure-CSS marquee. The promo set is rendered twice back-to-back inside a flex
 * track; the track is animated with `transform: translateX(-50%)` over 30s,
 * linear, infinite. Because both halves are identical, the wrap is invisible.
 *
 * No refs, no rAF, no ResizeObserver, no measurement, no internal state — the
 * animation runs entirely on the browser compositor and cannot get "stuck".
 */

const promos = [
  { provider: "GoodBody", text: "5% off on all popular blood tests", color: "#0bb77e" },
  { provider: "Medichecks", text: "20% off all tests with code APRIL20", color: "#e70d68" },
  { provider: "Lola Health", text: "£20 off with code Mar20", color: "#fa757e" },
];

const PromoItem = ({
  provider,
  text,
  color,
}: {
  provider: string;
  text: string;
  color: string;
}) => (
  <span className="flex items-baseline shrink-0">
    <span
      className="font-heading font-bold text-sm sm:text-lg md:text-xl tracking-wider sm:tracking-widest uppercase pl-2 pr-1.5 sm:pl-5 sm:pr-2"
      style={{ color }}
    >
      {provider}:
    </span>
    <span className="text-white font-body text-sm sm:text-lg md:text-xl pr-2 sm:pr-3">
      {text}
    </span>
    <span
      className="text-brand-pink text-lg sm:text-xl leading-none px-1.5 sm:px-3"
      aria-hidden="true"
    >
      •
    </span>
  </span>
);

const PromoTicker = () => {
  return (
    <section className="bg-brand-navy overflow-hidden select-none relative">
      {/* Inline keyframes — guaranteed to ship even if Tailwind utility is purged or
          a global prefers-reduced-motion rule kills the animate-* classes. */}
      <style>{`
        @keyframes promo-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
      {/* Top gradient accent */}
      <div className="h-[2px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      <div className="pt-4 pb-2 sm:pt-5 sm:pb-2.5">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
          aria-label="Promotional offers from health test providers"
        >
          <div
            data-testid="promo-ticker-track"
            className="flex w-max whitespace-nowrap leading-tight"
            style={{
              animation: "promo-marquee 30s linear infinite",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            {/* First copy */}
            {promos.map((p, i) => (
              <PromoItem key={`a-${i}`} {...p} />
            ))}
            {/* Second copy — identical, makes the -50% wrap seamless */}
            {promos.map((p, i) => (
              <PromoItem key={`b-${i}`} {...p} />
            ))}
          </div>
        </div>
      </div>

      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default PromoTicker;
