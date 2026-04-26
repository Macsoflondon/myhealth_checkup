import { useEffect, useRef, useCallback, useState } from "react";

/**
 * PromoTicker — homepage promotional offers strip.
 *
 * Mechanically identical to TestCategoryTicker (rAF + JS-driven translate3d),
 * which is the proven-reliable engine on this page. The CSS-only marquee was
 * unreliable in the user's browser, so we clone the working approach.
 */

const promos = [
  { provider: "GoodBody", text: "5% off on all popular blood tests", color: "#0bb77e" },
  { provider: "Medichecks", text: "20% off all tests with code APRIL20", color: "#e70d68" },
  { provider: "Lola Health", text: "£20 off with code Mar20", color: "#fa757e" },
];

const SETS = 8;

const PromoTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const debug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("debugTickers");
  const [debugInfo, setDebugInfo] = useState({ setWidth: 0, translateX: 0 });

  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    let width = 0;
    for (let i = 0; i < promos.length && i < track.children.length; i++) {
      width += (track.children[i] as HTMLElement).getBoundingClientRect().width;
    }
    return width;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Intentionally do NOT bail on prefers-reduced-motion — this is brand
    // messaging and must always animate.
    const measure = () => {
      const w = measureSetWidth();
      if (w > 0) singleSetWidthRef.current = w;
    };

    measure();
    document.fonts?.ready?.then(measure);

    const ro = new ResizeObserver(() => measure());
    ro.observe(track);

    let animationId: number;
    let lastTime = 0;
    let lastDebugUpdate = 0;
    const pxPerMs = 0.04;

    const animate = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (document.hidden) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      if (singleSetWidthRef.current <= 0) {
        measure();
      }

      const clampedDelta = Math.min(delta, 50);
      positionRef.current -= pxPerMs * clampedDelta;

      const setWidth = singleSetWidthRef.current;
      if (setWidth > 0 && Math.abs(positionRef.current) >= setWidth) {
        positionRef.current += setWidth;
      }

      track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;

      if (debug && timestamp - lastDebugUpdate > 100) {
        lastDebugUpdate = timestamp;
        setDebugInfo({ setWidth, translateX: positionRef.current });
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      lastTime = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, [measureSetWidth, debug]);

  const items = Array.from({ length: SETS }, () => promos).flat();

  return (
    <section className="bg-brand-navy overflow-hidden select-none relative">
      {debug && (
        <div className="absolute top-1 right-1 z-50 bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded pointer-events-none">
          PromoTicker · setW: {debugInfo.setWidth.toFixed(0)}px · tx: {debugInfo.translateX.toFixed(0)}px
        </div>
      )}
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
            ref={trackRef}
            data-testid="promo-ticker-track"
            className="flex whitespace-nowrap leading-tight"
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          >
            {items.map((p, i) => (
              <span key={i} className="flex items-baseline shrink-0">
                <span
                  className="font-heading font-bold text-sm sm:text-lg md:text-xl tracking-wider sm:tracking-widest uppercase pl-2 pr-1.5 sm:pl-5 sm:pr-2"
                  style={{ color: p.color }}
                >
                  {p.provider}:
                </span>
                <span className="text-white font-body text-sm sm:text-lg md:text-xl pr-2 sm:pr-3">
                  {p.text}
                </span>
                <span
                  className="text-brand-pink text-lg sm:text-xl leading-none px-1.5 sm:px-3"
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
