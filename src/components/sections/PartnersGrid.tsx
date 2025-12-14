import { Link } from "react-router-dom";
import { providers } from "@/data/compare/providers";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
const PartnersGrid = () => {
  const plugin = useRef(Autoplay({
    delay: 2000,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  }));

  // Duplicate providers for seamless infinite loop effect
  const duplicatedProviders = [...providers, ...providers];
  return <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xs font-heading font-semibold text-foreground uppercase tracking-wider mb-8 sm:mb-10 sm:text-4xl">
          Our Trusted Partners
        </h2>
        
        <Carousel opts={{
        align: "start",
        loop: true
      }} plugins={[plugin.current]} className="w-full max-w-5xl mx-auto">
          <CarouselContent className="-ml-4">
            {duplicatedProviders.map((provider, index) => <CarouselItem key={`${provider.id}-${index}`} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link to={`/provider/${provider.id}`} className="group bg-background rounded-xl p-6 sm:p-8 flex items-center justify-center 
                             w-full h-32 sm:h-40 
                             border border-border/50 
                             transition-all duration-300 ease-out
                             hover:shadow-lg hover:shadow-primary/10 
                             hover:-translate-y-1 hover:scale-105
                             hover:border-primary/30">
                  <img src={provider.logo} alt={`${provider.name} logo`} className="max-h-[90px] sm:max-h-[120px] w-auto object-contain 
                               transition-all duration-300
                               group-hover:scale-110" loading="lazy" />
                </Link>
              </CarouselItem>)}
          </CarouselContent>
        </Carousel>
      </div>
    </section>;
};
export default PartnersGrid;