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
              className="bg-white rounded-xl p-3 sm:p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon 
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" 
                  style={{ color: item.color }}
                />
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-heading font-bold text-foreground text-xs sm:text-sm leading-tight">
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
