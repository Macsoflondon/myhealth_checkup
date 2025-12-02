import { Link } from "react-router-dom";
import { providers } from "@/data/compare/providers";

const PartnersGrid = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Our Trusted Partners
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 max-w-5xl mx-auto items-center">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              to={`/provider/${provider.id}`}
              className="bg-gray-50 rounded-xl p-4 flex items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all group h-20"
            >
              <img
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="max-h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;
