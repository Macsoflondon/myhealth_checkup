import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const FeaturedPublications = () => {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  );

  const publications = [
    { name: "Bloomberg", url: "https://www.bloomberg.com" },
    { name: "The Guardian", url: "https://www.theguardian.com" },
    { name: "Cosmopolitan", url: "https://www.cosmopolitan.com" },
    { name: "TechCrunch", url: "https://www.techcrunch.com" },
    { name: "The Mirror", url: "https://www.mirror.co.uk" },
    { name: "Metro", url: "https://metro.co.uk" },
    { name: "Daily Mail", url: "https://www.dailymail.co.uk" },
    { name: "Daily Express", url: "https://www.express.co.uk" },
    { name: "London Daily News", url: "https://www.londondaily.news" },
    { name: "The Independent", url: "https://www.independent.co.uk" },
    { name: "BBC", url: "https://www.bbc.co.uk" },
    { name: "The Mail on Sunday", url: "https://www.mailonsunday.co.uk" },
    { name: "Healthista", url: "https://www.healthista.com" },
    { name: "woman&home", url: "https://www.womanandhome.com" },
    { name: "Men's Health", url: "https://www.menshealth.com" },
    { name: "VOGUE", url: "https://www.vogue.co.uk" }
  ];

  return (
    <section className="bg-brand-navy relative overflow-hidden">
      {/* Decorative half-circles */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-pink/5 rounded-full -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-0 right-0 w-56 h-56 bg-brand-turquoise/5 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-1/2 left-0 w-32 h-32 bg-brand-turquoise/5 rounded-full -translate-x-1/2" />
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-brand-pink/5 rounded-full" />
      <div className="absolute bottom-1/3 right-0 w-48 h-48 bg-brand-turquoise/5 rounded-full translate-x-1/3" />

      {/* Decorative gradient line */}
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      
      <div className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section label */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
            <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
              As Seen In
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          </div>
          
          <h3 className="text-center text-lg sm:text-xl md:text-2xl font-heading font-bold text-white mb-8 md:mb-10">
            Our Partners Have Featured In
          </h3>
          
          {/* Scrolling ticker style */}
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplayPlugin.current]}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {publications.map((publication) => (
                <CarouselItem key={publication.name} className="basis-1/2 sm:basis-1/3 md:basis-1/4 pl-4">
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-20 sm:h-24 rounded-xl border border-brand-turquoise/30 bg-white/5 backdrop-blur-sm hover:border-brand-pink/50 hover:bg-white/10 transition-all duration-300 group px-3"
                  >
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-brand-turquoise uppercase tracking-[0.25em] group-hover:text-brand-pink transition-colors duration-300 text-center leading-tight">
                      {publication.name}
                    </span>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="h-[3px] bg-gradient-to-r from-brand-pink via-brand-turquoise to-brand-pink" />
    </section>
  );
};