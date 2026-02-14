import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I compared five different thyroid panels in under two minutes. Prices, biomarkers, turnaround — all in one place. I wish I had found this sooner.",
    name: "Sarah T.",
    detail: "London",
    context: "Used: Blood Test Comparison",
    stars: 5,
  },
  {
    quote: "Knowing every provider listed uses UKAS-accredited labs made my decision straightforward. I did not have to second-guess the quality.",
    name: "James R.",
    detail: "Manchester",
    context: "Used: Cancer Screening Tests",
    stars: 5,
  },
  {
    quote: "The health quiz narrowed down exactly which blood test matched my concerns. No account required, no pressure — just clear information.",
    name: "Priya K.",
    detail: "Birmingham",
    context: "Used: Health Quiz",
    stars: 5,
  },
  {
    quote: "Other sites buried the total cost behind add-ons. Here, the pricing was upfront and honest. That transparency earned my trust.",
    name: "David M.",
    detail: "Edinburgh",
    context: "Used: Full Body MOT Comparison",
    stars: 5,
  },
  {
    quote: "As a first-timer, I had no idea where to start. The side-by-side comparison made it simple to understand what each test actually covers.",
    name: "Emma L.",
    detail: "Bristol",
    context: "Used: Hormone Panel Comparison",
    stars: 5,
  },
  {
    quote: "Completely free, no sign-up, and genuinely independent. I have recommended it to everyone in my family.",
    name: "Rachel H.",
    detail: "Cardiff",
    context: "Used: Vitamin Testing",
    stars: 5,
  },
];

const TestimonialCarousel = () => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4500, stopOnInteraction: false })]
  );

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-[hsl(224,67%,10%)]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-center mb-8 sm:mb-10">
          <span className="text-white">What Our </span>
          <span className="bg-gradient-to-r from-[hsl(187,72%,48%)] to-[hsl(335,89%,48%)] bg-clip-text text-transparent">
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
                <div className="bg-card rounded-2xl p-5 sm:p-6 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 fill-[hsl(45,100%,50%)] text-[hsl(45,100%,50%)]"
                      />
                    ))}
                  </div>
                  <p className="text-foreground font-sans text-sm sm:text-base leading-relaxed flex-1 mb-4">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="font-heading font-semibold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs">{t.detail}</p>
                    {t.context && (
                      <span className="inline-block mt-1.5 text-[10px] font-medium tracking-wide uppercase text-[hsl(187,72%,48%)] bg-[hsl(187,72%,48%)]/10 rounded-full px-2.5 py-0.5">
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
