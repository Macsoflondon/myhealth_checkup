import { Shield, FileCheck, Award } from "lucide-react";

const AccreditationCards = () => {
  const accreditations = [
    {
      icon: Shield,
      title: "UKAS Accredited",
      subtitle: "Labs",
      color: "hsl(var(--primary))"
    },
    {
      icon: FileCheck,
      title: "CQC Regulated",
      subtitle: "Providers",
      color: "hsl(var(--secondary))"
    },
    {
      icon: Award,
      title: "ISO 15189",
      subtitle: "Certified",
      color: "hsl(var(--primary))"
    }
  ];

  return (
    <section className="py-10 sm:py-14 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-5 md:gap-8 max-w-4xl mx-auto">
          {accreditations.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon 
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-transform duration-300" 
                  style={{ color: item.color }}
                />
              </div>
              <h3 className="font-heading font-bold text-[hsl(var(--navy))] text-xs sm:text-base md:text-lg leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-500 text-[10px] sm:text-sm mt-0.5">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditationCards;
