import { Link } from "react-router-dom";
import { providers } from "@/data/compare/providers";
import { PartnerLogo } from "@/components/common/ResponsiveImage";

const PartnersGrid = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-center text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 sm:mb-8">
          Our Trusted Partners
        </h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 md:gap-6 max-w-5xl mx-auto items-center">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              to={`/provider/${provider.id}`}
              className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-4 flex items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all group h-14 sm:h-20"
            >
              <PartnerLogo
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="max-h-8 sm:max-h-12 w-auto grayscale group-hover:grayscale-0"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;
