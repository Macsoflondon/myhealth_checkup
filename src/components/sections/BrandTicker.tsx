import { useEffect, useRef } from "react";

const promos = [
  { provider: "GoodBody", text: "March into Wellness – exclusive 5% off on everything" },
  { provider: "Medichecks", text: "20% off women's tests with code SHH20" },
  { provider: "Lola Health", text: "£20 off with code Mar20" },
];

const BrandTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5; // pixels per frame

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

  const items = [...keywords, ...keywords, ...keywords, ...keywords];

  return (
    <section className="bg-[hsl(224,67%,10%)] overflow-hidden select-none">
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      <div className="py-3 sm:py-4">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
            {items.map((word, i) => (
              <span key={i} className="flex items-center shrink-0">
                <span className="text-white font-heading font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase px-3 sm:px-5">
                  {word}
                </span>
                <span className="text-brand-turquoise text-lg">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandTicker;
