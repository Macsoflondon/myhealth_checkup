import { useEffect, useRef, useCallback, useState } from "react";



const promos = [
  { provider: "GoodBody", text: "5% off on all popular blood tests", color: "#0bb77e" },
  { provider: "Medichecks", text: "20% off all tests with code APRIL20", color: "#e70d68" },
  { provider: "Lola Health", text: "£20 off with code Mar20", color: "#fa757e" },
];

// Use enough sets so there's always content visible during reset
const SETS = 8;

const BrandTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const pauseTimeoutRef = useRef<number | null>(null);
  const queryDebug = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debugTickers");
  const [debugOn, setDebugOn] = useState(queryDebug);
  const [debugInfo, setDebugInfo] = useState({ setWidth: 0, translateX: 0, paused: false });

  // Failsafe: never let the ticker stay paused longer than this.
  const MAX_PAUSE_MS = 1500;

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (pauseTimeoutRef.current) window.clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = window.setTimeout(() => {
      pausedRef.current = false;
      pauseTimeoutRef.current = null;
    }, MAX_PAUSE_MS);
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    if (pauseTimeoutRef.current) {
      window.clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  }, []);

  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const promoCount = promos.length;
    let width = 0;
    for (let i = 0; i < promoCount && i < track.children.length; i++) {
      width += (track.children[i] as HTMLElement).getBoundingClientRect().width;
    }
    return width;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Respect users who prefer reduced motion — pause the marquee.
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const measure = () => {
      const w = measureSetWidth();
      if (w > 0) singleSetWidthRef.current = w;
    };

    measure();
    document.fonts?.ready?.then(measure);

    // Re-measure when the track resizes (handles late layout, font swaps, container changes)
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);

    let animationId: number;
    let lastTime = 0;
    let lastDebugUpdate = 0;
    const pxPerMs = 0.09;

    const animate = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      // Pause when tab hidden or user is hovering/touching the ticker
      if (document.hidden || pausedRef.current) {
        lastTime = timestamp;
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Re-measure if we still don't have a width yet
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

      // Throttle debug overlay to ~10fps to avoid render churn
      if (debugOn && timestamp - lastDebugUpdate > 100) {
        lastDebugUpdate = timestamp;
        setDebugInfo({ setWidth, translateX: positionRef.current, paused: pausedRef.current });
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      // Reset lastTime so resuming doesn't cause a jump
      lastTime = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, [measureSetWidth, debugOn]);

  const items = Array.from({ length: SETS }, () => promos).flat();

  return (
    <section className="bg-brand-navy overflow-hidden select-none relative">
      {/* Debug toggle — small, unobtrusive, top-right. Click to show/hide live state. */}
      <button
        type="button"
        onClick={() => setDebugOn((v) => !v)}
        className="absolute top-1 right-1 z-50 bg-black/60 hover:bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors"
        aria-label={debugOn ? "Hide ticker debug overlay" : "Show ticker debug overlay"}
        aria-pressed={debugOn}
      >
        {debugOn ? "✕ dbg" : "dbg"}
      </button>
      {debugOn && (
        <div className="absolute top-7 right-1 z-50 bg-black/85 text-white text-[10px] font-mono px-2 py-1 rounded pointer-events-none space-y-0.5">
          <div>BrandTicker</div>
          <div>setW: {debugInfo.setWidth.toFixed(0)}px</div>
          <div>tx: {debugInfo.translateX.toFixed(0)}px</div>
          <div>
            paused:{" "}
            <span className={debugInfo.paused ? "text-red-400" : "text-green-400"}>
              {debugInfo.paused ? "YES" : "no"}
            </span>
          </div>
        </div>
      )}
      <div className="pt-1.5 pb-1.5 sm:pt-2 sm:pb-2 px-2 sm:px-4">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
          onMouseEnter={pause}
          onMouseLeave={resume}
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
                  className="font-heading font-bold text-[11px] sm:text-sm md:text-base tracking-wider sm:tracking-widest uppercase pl-2 pr-1.5 sm:pl-5 sm:pr-2"
                  style={{ color: promo.color }}
                >
                  {promo.provider}:
                </span>
                <span className="text-white font-body text-[11px] sm:text-sm md:text-base pr-2 sm:pr-3">
                  {promo.text}
                </span>
                <span className="text-brand-pink text-base sm:text-lg leading-none px-1.5 sm:px-3" aria-hidden="true">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default BrandTicker;
