import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const promos = [
  { provider: "GoodBody", text: "5% off on all popular blood tests", color: "#0bb77e" },
  { provider: "Medichecks", text: "20% off all tests with code APRIL20", color: "#e70d68" },
  { provider: "Lola Health", text: "£20 off with code Mar20", color: "#fa757e" },
];

// Minimum clones needed to keep the strip visually full during wrap.
// Aligned with the working TestCategoryTicker pattern (4x is plenty).
const SETS = 4;

// Match the slower, steadier velocity used by the working brand trackers.
const PX_PER_MS = 0.05;

const PromoTracker = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const singleSetWidthRef = useRef(0);

  // Debug overlay is opt-in via ?debugTickers — never rendered in production UI.
  const debug = useMemo(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("debugTickers"),
    []
  );
  const [debugInfo, setDebugInfo] = useState({ setWidth: 0, translateX: 0 });

  const items = useMemo(
    () => Array.from({ length: SETS }, () => promos).flat(),
    []
  );

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

    // Respect reduced-motion users — hold the track in place.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const measure = () => {
      const width = measureSetWidth();
      if (width > 0) {
        singleSetWidthRef.current = width;
      }
    };

    measure();
    document.fonts?.ready?.then(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let animationId = 0;
    let lastTime = 0;
    let lastDebugUpdate = 0;

    const animate = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (document.hidden) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const setWidth = singleSetWidthRef.current;
      if (setWidth <= 0) {
        measure();
        animationId = requestAnimationFrame(animate);
        return;
      }

      const clampedDelta = Math.min(delta, 50);
      positionRef.current -= PX_PER_MS * clampedDelta;
      if (Math.abs(positionRef.current) >= setWidth) {
        positionRef.current += setWidth;
      }
      track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;

      if (debug && timestamp - lastDebugUpdate > 200) {
        lastDebugUpdate = timestamp;
        setDebugInfo({ setWidth, translateX: positionRef.current });
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const onResize = () => measure();
    const onVisibility = () => {
      lastTime = 0;
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, [debug, measureSetWidth]);

  return (
    <section className="bg-brand-navy overflow-hidden select-none relative">
      {/* Top gradient accent for clear separation from page below */}
      <div className="h-[2px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      {debug && (
        <div className="absolute top-1 right-1 z-50 bg-black/85 text-white text-[10px] font-mono px-2 py-1 rounded pointer-events-none">
          PromoTracker · setW: {debugInfo.setWidth.toFixed(0)}px · tx: {debugInfo.translateX.toFixed(0)}px
        </div>
      )}

      <div className="pt-4 pb-2 sm:pt-5 sm:pb-2.5 px-2 sm:px-4">
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
            className="flex whitespace-nowrap leading-tight"
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          >
            {items.map((promo, i) => (
              <span key={i} className="flex items-baseline shrink-0">
                <span
                  className="font-heading font-bold text-sm sm:text-lg md:text-xl tracking-wider sm:tracking-widest uppercase pl-2 pr-1.5 sm:pl-5 sm:pr-2"
                  style={{ color: promo.color }}
                >
                  {promo.provider}:
                </span>
                <span className="text-white font-body text-sm sm:text-lg md:text-xl pr-2 sm:pr-3">
                  {promo.text}
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

export default PromoTracker;
