import { useEffect, useRef, useCallback } from "react";

const promos = [
  { provider: "GoodBody", text: "5% off on all popular blood tests", color: "#0bb77e" },
  { provider: "Medichecks", text: "20% off selected women's tests with code SHH20", color: "#e70d68" },
  { provider: "Lola Health", text: "£20 off with code Mar20", color: "#fa757e" },
];

// Use enough sets so there's always content visible during reset
const SETS = 8;

const BrandTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const singleSetWidthRef = useRef(0);

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

    const measure = () => {
      singleSetWidthRef.current = measureSetWidth();
    };

    measure();
    document.fonts?.ready?.then(measure);

    let animationId: number;
    let lastTime = 0;
    // pixels per millisecond for frame-rate independent movement
    const pxPerMs = 0.04;

    const animate = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      // Cap delta to avoid jumps on tab refocus
      const clampedDelta = Math.min(delta, 50);
      positionRef.current -= pxPerMs * clampedDelta;

      const setWidth = singleSetWidthRef.current;
      if (setWidth > 0 && Math.abs(positionRef.current) >= setWidth) {
        positionRef.current += setWidth;
      }

      // Use translate3d for GPU compositing — no layout/paint, just composite
      track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [measureSetWidth]);

  const items = Array.from({ length: SETS }, () => promos).flat();

  return (
    <section className="bg-brand-navy overflow-hidden select-none">
      <div className="pt-1.5 pb-1.5 sm:pt-2 sm:pb-2">
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
            {items.map((promo, i) => (
              <span key={i} className="flex items-center shrink-0">
                <span className="font-heading font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase px-3 sm:px-5" style={{ color: promo.color }}>
                  {promo.provider}:
                </span>
                <span className="text-white font-body text-xs sm:text-sm md:text-base px-1">
                  {promo.text}
                </span>
                <span className="text-brand-pink text-lg px-3 sm:px-5">•</span>
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
