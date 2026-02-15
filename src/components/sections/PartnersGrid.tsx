import { Link } from "react-router-dom";
import { providers } from "@/constants/providers";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";

const PartnersGrid = () => {
  const plugin = useRef(Autoplay({
    delay: 2000,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  }));

  // Duplicate providers for seamless infinite loop effect
  const duplicatedProviders = [...providers, ...providers];
  return <section className="py-8 sm:py-12 md:py-16 bg-[#081129]">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading 
          title="Our Trusted" 
          gradientText="Partners" 
          className="mb-8 sm:mb-10"
          titleClassName="text-white"
        />
        
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
                               border border-white/20 
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