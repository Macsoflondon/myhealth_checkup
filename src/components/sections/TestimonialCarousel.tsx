import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote } from "lucide-react";

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
    name: "James R.",
    detail: "Manchester",
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

const TestimonialCarousel = () => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4500, stopOnInteraction: false })]
  );

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-brand-navy relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-turquoise/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 right-0 w-56 h-56 bg-brand-turquoise/5 rounded-full translate-x-1/2" />
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-brand-pink/5 rounded-full -translate-y-1/3" />
      <div className="absolute bottom-1/4 left-[15%] w-44 h-44 bg-brand-turquoise/5 rounded-full" />
      <div className="absolute top-[40%] left-0 w-36 h-36 bg-brand-pink/5 rounded-full -translate-x-1/2" />
      <div className="absolute top-[15%] left-[35%] w-52 h-52 bg-brand-turquoise/[0.04] rounded-full" />
      <div className="absolute bottom-[10%] right-[25%] w-48 h-48 bg-brand-pink/[0.03] rounded-full" />
      <div className="absolute top-[60%] left-[50%] w-56 h-56 bg-brand-turquoise/[0.03] rounded-full" />
      <div className="absolute top-0 left-[45%] w-44 h-44 bg-brand-pink/[0.04] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-[45%] w-60 h-60 bg-brand-turquoise/[0.04] rounded-full translate-y-1/3" />
      <div className="absolute top-[30%] right-[10%] w-40 h-40 bg-brand-pink/[0.03] rounded-full" />
      
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
          <span className="bg-gradient-to-r from-brand-turquoise to-brand-pink bg-clip-text text-transparent">
            Users Say
          </span>
        </h2>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
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
                  
                  <p className="text-white/80 font-sans text-sm sm:text-base leading-relaxed flex-1 mb-4">
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