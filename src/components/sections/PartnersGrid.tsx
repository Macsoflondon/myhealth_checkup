import { Link } from "react-router-dom";
import { providers } from "@/constants/providers";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";


const PartnersGrid = () => {
  const plugin = useRef(Autoplay({
    delay: 2000,
    playOnInit: true,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  }));

  // Duplicate providers for seamless infinite loop effect
  const duplicatedProviders = [...providers, ...providers];
  return <section className="py-8 sm:py-12 md:py-16 bg-[#081129] relative overflow-hidden">
      {/* Decorative half-circles */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-turquoise/5 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-pink/5 rounded-full -translate-x-1/3 translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-turquoise/5 rounded-full translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/3 left-0 w-44 h-44 bg-brand-pink/5 rounded-full -translate-x-1/2" />
      <div className="absolute top-0 left-1/3 w-36 h-36 bg-brand-turquoise/5 rounded-full -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-center mb-8 sm:mb-10 text-brand-turquoise">
          Our Trusted Partners
        </h2>
        
        <Carousel opts={{
        align: "start",
        loop: true
      }} plugins={[plugin.current]} className="w-full max-w-5xl mx-auto">
          <CarouselContent className="-ml-4">
            {duplicatedProviders.map((provider, index) => {
              const isGoodbody = provider.id === 'goodbody-clinic';
              return (
                <CarouselItem key={`${provider.id}-${index}`} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Link to={`/provider/${provider.id}`} className="group bg-white rounded-xl p-6 sm:p-8 flex items-center justify-center 
                               w-full h-32 sm:h-40 
                               border-2 border-[#22c0d4] 
                               transition-all duration-300 ease-out
                               hover:shadow-lg hover:shadow-[#22c0d4]/20 
                               hover:-translate-y-1 hover:scale-105
                               hover:border-[#22c0d4]/30">
                    <img 
                      src={provider.logo} 
                      alt={`${provider.name} logo`} 
                      className={`w-auto object-contain transition-all duration-300 group-hover:scale-110 ${
                        isGoodbody ? 'max-h-[130px] sm:max-h-[160px]' : 'max-h-[90px] sm:max-h-[120px]'
                      }`} 
                      loading="lazy" 
                    />
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>;
};
export default PartnersGrid;