import { Link } from "react-router-dom";
import { providers } from "@/data/compare/providers";
import { PartnerLogo } from "@/components/common/ResponsiveImage";

// Additional healthcare partners to display
const additionalPartners = [
  { id: "bupa", name: "Bupa", logo: null },
  { id: "spire", name: "Spire", logo: null },
  { id: "nuffield", name: "Nuffield Health", logo: null },
  { id: "letsgetchecked", name: "LetsGetChecked", logo: null },
];

const PartnersGrid = () => {
  // Combine existing providers with additional partners
  const allPartners = [...providers, ...additionalPartners];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xs sm:text-sm font-heading font-semibold text-[#081129] uppercase tracking-wider mb-6 sm:mb-8">
          Our Trusted Partners
        </h2>
        
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4 max-w-5xl mx-auto items-center">
          {allPartners.map((partner) => (
            <Link
              key={partner.id}
              to={partner.logo ? `/provider/${partner.id}` : "#"}
              className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all group h-12 sm:h-16 md:h-20 border border-gray-100"
            >
              {partner.logo ? (
                <PartnerLogo
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-6 sm:max-h-8 md:max-h-10 w-auto grayscale group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#081129] flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-xs sm:text-sm md:text-base">
                    {partner.name.charAt(0)}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;
