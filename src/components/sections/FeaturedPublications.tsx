import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

export const FeaturedPublications = () => {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 5000,
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

  // Group publications into sets of 4 for 2x2 display per slide
  const groupedPublications = [];
  for (let i = 0; i < publications.length; i += 4) {
    groupedPublications.push(publications.slice(i, i + 4));
  }

  return (
    <section className="bg-brand-navy">
      {/* Top gradient divider */}
      <div className="h-1 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      
      <div className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-xl md:text-2xl font-semibold text-white/60 uppercase tracking-wider mb-6 md:mb-8">
            Our Partners Have Featured In
          </h3>
          
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplayPlugin.current, Fade()]}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {groupedPublications.map((group, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5">
                    {group.map((publication) => (
                      <div 
                        key={publication.name} 
                        className="flex items-center justify-center"
                      >
                        <a 
                          href={publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white/40 text-center transition-all duration-800 hover:scale-105 hover:text-brand-pink cursor-pointer block"
                        >
                          {publication.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      
      {/* Bottom gradient divider */}
      <div className="h-1 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};
