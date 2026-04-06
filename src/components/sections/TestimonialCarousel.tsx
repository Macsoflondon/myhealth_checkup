import { useRef, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

const testimonials = [
  {
    quote: "I compared five different thyroid panels in under two minutes. Prices, biomarkers, turnaround — all in one place. I wish I had found this sooner.",
    name: "Sarah T.",
    detail: "London",
    context: "Blood Test Comparison",
    stars: 5,
  },
  {
    quote: "Knowing every provider listed uses UKAS-accredited labs made my decision straightforward. I did not have to second-guess the quality.",
    name: "Tiago L.",
    detail: "Blood Tests Comparison",
    context: "Cancer Screening Tests",
    stars: 5,
  },
  {
    quote: "The health quiz narrowed down exactly which blood test matched my concerns. No account required, no pressure — just clear information.",
    name: "Priya K.",
    detail: "Birmingham",
    context: "Health Quiz",
    stars: 5,
  },
  {
    quote: "Other sites buried the total cost behind add-ons. Here, the pricing was upfront and honest. That transparency earned my trust.",
    name: "David M.",
    detail: "Edinburgh",
    context: "Full Body MOT Comparison",
    stars: 5,
  },
  {
    quote: "As a first-timer, I had no idea where to start. The side-by-side comparison made it simple to understand what each test actually covers.",
    name: "Emma L.",
    detail: "Bristol",
    context: "Hormone Panel Comparison",
    stars: 5,
  },
  {
    quote: "Completely free, no sign-up, and genuinely independent. I have recommended it to everyone in my family.",
    name: "Rachel H.",
    detail: "Cardiff",
    context: "Vitamin Testing",
    stars: 5,
  },
];

const CARD_WIDTH = 340;

const TestimonialCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  // Quadruple for seamless loop
  const items = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.35;
    const setWidth = CARD_WIDTH * testimonials.length;

    const animate = () => {
      position -= speed;
      if (Math.abs(position) >= setWidth) {
        position += setWidth;
      }
      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-brand-navy relative overflow-hidden">
      <NavyDecorativeCircles />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative">
        {/* Section label */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
            Testimonials
          </span>
          <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
        </div>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-center mb-10 sm:mb-12">
          <span className="text-white">What Our </span>
          <span className="text-white">
            Users Say
          </span>
        </h2>

        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
          }}
        >
          <div ref={trackRef} className="flex will-change-transform">
            {items.map((t, i) => (
              <div
                key={i}
                className="shrink-0 px-3"
                style={{ width: `${CARD_WIDTH}px` }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-6 h-full flex flex-col hover:border-brand-turquoise/30 transition-all duration-300">
                  {/* Quote icon */}
                  <Quote className="w-6 h-6 text-brand-pink/40 mb-3" />
                  
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  
                  <p className="text-white/80 font-sans text-sm sm:text-base leading-relaxed flex-1 mb-4 whitespace-normal">
                    "{t.quote}"
                  </p>
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="font-heading font-semibold text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-white/50 text-xs">{t.detail}</p>
                    {t.context && (
                      <span className="inline-block mt-1.5 text-[10px] font-medium tracking-wide uppercase text-brand-turquoise bg-brand-turquoise/10 rounded-full px-2.5 py-0.5">
                        {t.context}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;