import { useRef, useEffect } from "react";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

export const FeaturedPublications = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const publications = [
    { name: "Bloomberg", url: "https://www.bloomberg.com", logo: "/images/logos/bloomberg.png" },
    { name: "The Guardian", url: "https://www.theguardian.com", logo: "/images/logos/the-guardian.png" },
    { name: "Cosmopolitan", url: "https://www.cosmopolitan.com", logo: "/images/logos/cosmopolitan.png" },
    { name: "TechCrunch", url: "https://www.techcrunch.com", logo: "/images/logos/techcrunch.png" },
    { name: "The Mirror", url: "https://www.mirror.co.uk", logo: "/images/logos/mirror.png" },
    { name: "Metro", url: "https://metro.co.uk", logo: "/images/logos/metro.png" },
    { name: "Daily Mail", url: "https://www.dailymail.co.uk", logo: "/images/logos/daily-mail.png" },
    { name: "Daily Express", url: "https://www.express.co.uk", logo: "/images/logos/daily-express.png" },
    { name: "London Daily News", url: "https://www.londondaily.news", logo: "/images/logos/london-daily-news.png" },
    { name: "The Independent", url: "https://www.independent.co.uk", logo: "/images/logos/the-independent.png" },
    { name: "BBC", url: "https://www.bbc.co.uk", logo: "/images/logos/bbc.png" },
    { name: "The Sunday Times", url: "https://www.thetimes.co.uk", logo: "/images/logos/sunday-times.png" },
    { name: "Marketing Week", url: "https://www.marketingweek.com", logo: "/images/logos/marketing-week.png" },
    { name: "woman&home", url: "https://www.womanandhome.com", logo: "/images/logos/woman-and-home.png" },
    { name: "Men's Health", url: "https://www.menshealth.com", logo: "/images/logos/mens-health.png" },
    { name: "VOGUE", url: "https://www.vogue.co.uk", logo: "/images/logos/vogue.png" },
    { name: "Healthista", url: "https://www.healthista.com", logo: "/images/logos/healthista.png" }
  ];

  // Quadruple for seamless loop
  const items = [...publications, ...publications, ...publications, ...publications];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.4;

    const animate = () => {
      position -= speed;
      const firstChild = track.firstElementChild as HTMLElement | null;
      if (firstChild && Math.abs(position) >= firstChild.offsetWidth * publications.length) {
        position += firstChild.offsetWidth * publications.length;
      }
      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [publications.length]);

  return (
    <section className="bg-brand-navy relative overflow-hidden">
      <NavyDecorativeCircles />

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
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-center mb-8 md:mb-10">
            <span className="text-white">Our Partners Have </span>
            <span className="text-white">
              Featured In
            </span>
          </h2>
          
          {/* Smooth continuous scroll */}
          <div
            className="relative overflow-hidden max-w-5xl mx-auto"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
              {items.map((publication, index) => (
                <div key={`${publication.name}-${index}`} className="shrink-0 px-2 sm:px-3" style={{ width: "220px" }}>
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-24 sm:h-28 rounded-xl border border-brand-turquoise/30 bg-white/5 backdrop-blur-sm hover:border-brand-pink/50 hover:bg-white/10 transition-all duration-300 group px-4"
                  >
                    {publication.logo ? (
                      <img
                        src={publication.logo}
                        alt={`${publication.name} logo`}
                        className="h-8 sm:h-10 md:h-12 w-auto max-w-[170px] object-contain"
                        style={{ filter: "brightness(0) invert(1)" }}
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-brand-turquoise uppercase tracking-[0.25em] group-hover:text-brand-pink transition-colors duration-300 text-center leading-tight whitespace-normal">
                        {publication.name}
                      </span>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="h-[3px] bg-gradient-to-r from-brand-pink via-brand-turquoise to-brand-pink" />
    </section>
  );
};