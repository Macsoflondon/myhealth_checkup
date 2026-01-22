import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const FeaturedPublications = () => {
  const plugin = useRef(
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
    <section className="py-16 md:py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wider mb-12 md:mb-16">
          Our Partners Have Featured In
        </h3>
        
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[plugin.current]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {groupedPublications.map((group, index) => (
              <CarouselItem key={index} className="basis-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                  {group.map((publication) => (
                    <div 
                      key={publication.name} 
                      className="flex items-center justify-center"
                    >
                      <a 
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-400 text-center transition-all duration-800 hover:scale-105 hover:text-[#e70d69] cursor-pointer block"
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
    </section>
  );
};
