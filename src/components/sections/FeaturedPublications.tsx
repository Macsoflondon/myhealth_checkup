import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

export const FeaturedPublications = () => {
  const publications = [
    { name: "Bloomberg", url: "https://www.bloomberg.com", logo: "/images/logos/bloomberg.png" },
    { name: "The Guardian", url: "https://www.theguardian.com", logo: "/images/logos/the-guardian.png" },
    { name: "Cosmopolitan", url: "https://www.cosmopolitan.com", logo: "/images/logos/cosmopolitan.png" },
    { name: "TechCrunch", url: "https://www.techcrunch.com", logo: "/images/logos/techcrunch.png" },
    { name: "The Mirror", url: "https://www.mirror.co.uk", logo: "/images/logos/mirror.webp" },
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
    { name: "Healthista", url: "https://www.healthista.com", logo: "/images/logos/healthista.png" },
  ];

  // Bento span pattern by index. Mobile-safe spans use only col-span-2.
  // Larger spans (row-span-2, col-span-2 row-span-2) are gated to md+.
  const spans: Record<number, string> = {
    0: "col-span-2 md:col-span-2",
    3: "md:row-span-2",
    6: "col-span-2 md:col-span-2 md:row-span-2",
    10: "md:col-span-2",
    13: "md:row-span-2",
  };

  return (
    <section className="bg-brand-navy relative overflow-hidden">
      <NavyDecorativeCircles />

      {/* Top gradient line */}
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section label */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
            <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
              As Seen In
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-center text-white mb-8 md:mb-12">
            Our Partners Have Featured In
          </h2>

          {/* Bento grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[110px] md:auto-rows-[130px] gap-3 md:gap-4">
            {publications.map((pub, i) => (
              <a
                key={pub.name}
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${pub.name} — opens in new tab`}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`group relative flex items-center justify-center rounded-2xl md:rounded-3xl bg-[#0f1a3d] ring-1 ring-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-500 ease-out hover:ring-brand-turquoise/40 hover:-translate-y-0.5 hover:bg-[#13225a] animate-fade-in ${spans[i] ?? ""}`}
              >
                {/* Subtle inner highlight */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />

                <img
                  src={pub.logo}
                  alt={`${pub.name} logo`}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 max-h-10 md:max-h-14 lg:max-h-16 max-w-[75%] w-auto object-contain brightness-0 invert opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};
