import { Link } from "react-router-dom";

const PartnersGrid = () => {
  const partners = [
    { id: "medichecks", name: "Medichecks", initial: "M" },
    { id: "thriva", name: "Thriva", initial: "T" },
    { id: "goodbody-clinic", name: "Goodbody Clinic", initial: "G" },
    { id: "randox", name: "Randox", initial: "R" },
    { id: "lola-health", name: "Lola Health", initial: "L" },
    { id: "tuli-health", name: "Tuli Health", initial: "T" },
    { id: "london-medical-laboratory", name: "London Medical Laboratory", initial: "L" },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Our Trusted Partners
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {partners.map((partner) => (
            <Link
              key={partner.id}
              to={`/provider/${partner.id}`}
              className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 group-hover:bg-[hsl(var(--primary))] group-hover:text-white transition-colors">
                {partner.initial}
              </div>
              <span className="text-sm font-medium text-[hsl(var(--navy))]">
                {partner.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;
