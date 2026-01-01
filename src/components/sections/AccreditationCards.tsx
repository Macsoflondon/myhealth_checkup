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
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto">
          {accreditations.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-5 sm:p-6 flex items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon 
                  className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300" 
                  style={{ color: item.color }}
                />
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-heading font-bold text-foreground text-sm sm:text-base md:text-lg leading-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-sans text-xs sm:text-sm mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditationCards;
