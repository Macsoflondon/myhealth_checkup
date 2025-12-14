import { Link } from "react-router-dom";
import { providers } from "@/data/compare/providers";

const PartnersGrid = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xs sm:text-sm font-heading font-semibold text-foreground uppercase tracking-wider mb-8 sm:mb-10">
          Our Trusted Partners
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 max-w-5xl mx-auto items-center justify-items-center">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              to={`/provider/${provider.id}`}
              className="group bg-background rounded-xl p-4 sm:p-5 flex items-center justify-center 
                         w-full h-20 sm:h-24 
                         border border-border/50 
                         transition-all duration-300 ease-out
                         hover:shadow-lg hover:shadow-primary/10 
                         hover:-translate-y-1 hover:scale-105
                         hover:border-primary/30"
            >
              <img
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="max-h-10 sm:max-h-12 w-auto object-contain 
                           grayscale opacity-70 
                           group-hover:grayscale-0 group-hover:opacity-100 
                           transition-all duration-300"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;
