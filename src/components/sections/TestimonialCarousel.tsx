import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Finally, a site that lets me compare tests without having to visit ten different provider websites. Saved me hours.",
    name: "Sarah T.",
    detail: "London",
    stars: 5,
  },
  {
    quote: "I was overwhelmed by choices for a thyroid test. This platform laid out prices, biomarkers, and turnaround times side by side. Brilliant.",
    name: "James R.",
    detail: "Manchester",
    stars: 5,
  },
  {
    quote: "Completely free and no sign-up required — that's what convinced me it was genuinely independent.",
    name: "Priya K.",
    detail: "Birmingham",
    stars: 5,
  },
  {
    quote: "I appreciated that every provider listed is UKAS accredited. It gave me real confidence in my choice.",
    name: "David M.",
    detail: "Edinburgh",
    stars: 5,
  },
  {
    quote: "The health quiz pointed me to exactly the right blood test for my symptoms. I booked the same day.",
    name: "Emma L.",
    detail: "Bristol",
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
