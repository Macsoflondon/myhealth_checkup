import { useEffect, useRef, useCallback } from "react";

const categories = [
  "Cancer Screening",
  "Heart Health",
  "Hormone Health",
  "Men's Health",
  "Women's Health & Fertility",
  "Diabetes & Blood Sugar",
  "Gut Health",
  "Vitamin & Nutrient Testing",
  "Comprehensive Blood Panels",
  "Thyroid Function",
  "Longevity Tests",
  "Fitness & Performance",
  "Iron & Anaemia",
];

const SETS = 8;

const TestCategoryTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const singleSetWidthRef = useRef(0);

  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    let width = 0;
    for (let i = 0; i < categories.length && i < track.children.length; i++) {
      width += (track.children[i] as HTMLElement).getBoundingClientRect().width;
    }
    return width;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

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
  }, [measureSetWidth]);

  const items = Array.from({ length: SETS }, () => categories).flat();

  return (
    <section className="bg-brand-navy overflow-hidden select-none">
      <div className="py-2.5 sm:py-3">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div
            ref={trackRef}
            className="flex whitespace-nowrap"
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          >
            {items.map((cat, i) => (
              <span key={i} className="flex items-center shrink-0">
                <span className="font-heading font-semibold text-xs sm:text-sm md:text-base tracking-wider uppercase px-3 sm:px-5 text-white">
                  {cat}
                </span>
                <span className="text-brand-pink text-lg px-1 sm:px-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default TestCategoryTicker;
