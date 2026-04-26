import { useEffect, useRef, useState, useMemo } from "react";

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

// Reserved strip height (matches the rendered text line-height + padding).
// Keeps layout stable on slow connections / before fonts and measurement settle.
const STRIP_MIN_HEIGHT_MOBILE = 44; // px
const STRIP_MIN_HEIGHT_DESKTOP = 56; // px

const PromoTracker = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const pausedRef = useRef(false);

  // True once we've measured a non-zero set width (or fonts are ready).
  // Until then we show a skeleton and keep the marquee invisible to avoid
  // first-paint flicker / layout jank.
  const [isReady, setIsReady] = useState(false);

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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Respect reduced-motion users — hold the track in place.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const measureSetWidth = () => {
      let w = 0;
      for (let i = 0; i < promos.length && i < track.children.length; i++) {
        w += (track.children[i] as HTMLElement).getBoundingClientRect().width;
      }
      return w;
    };

    const applyMeasure = () => {
      const w = measureSetWidth();
      if (w > 0) {
        const prev = singleSetWidthRef.current;
        singleSetWidthRef.current = w;
        // Rebase position when width changes so we never drift off-screen.
        if (prev > 0 && Math.abs(positionRef.current) >= w) {
          positionRef.current = positionRef.current % w;
        }
        // Mark ready once we have a valid measurement so the skeleton can fade.
        setIsReady(true);
      }
    };

    applyMeasure();
    document.fonts?.ready?.then(applyMeasure);

    // Failsafe: if measurement never returns >0 (e.g. hidden tab on first paint),
    // hide the skeleton after a short timeout so users aren't left with a placeholder.
    const readinessTimer = window.setTimeout(() => setIsReady(true), 1500);

    const ro = new ResizeObserver(() => applyMeasure());
    ro.observe(track);

    let animationId = 0;
    let lastTime = 0;
    let lastDebugUpdate = 0;

    const animate = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (document.hidden || pausedRef.current) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const setWidth = singleSetWidthRef.current;
      // Don't move until we have a stable measurement — prevents off-screen drift.
      if (setWidth <= 0) {
        applyMeasure();
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

    const onVisibility = () => {
      lastTime = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      window.clearTimeout(readinessTimer);
    };
  }, [debug]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

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
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
          onTouchCancel={resume}
          role="marquee"
          aria-label="Promotional offers from health test providers. Hover to pause."
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
