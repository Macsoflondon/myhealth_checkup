import { useEffect, useRef } from "react";

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
  "Iron & Anaemia",
];

const TestCategoryTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.4;

    const animate = () => {
      position -= speed;
      const firstChild = track.firstElementChild as HTMLElement | null;
      if (firstChild && Math.abs(position) >= firstChild.offsetWidth) {
        position += firstChild.offsetWidth;
      }
      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const items = [...categories, ...categories, ...categories, ...categories, ...categories, ...categories];

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
          <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
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
