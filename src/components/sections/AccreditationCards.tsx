import { Shield, FileCheck, Award } from "lucide-react";

const AccreditationCards = () => {
  const accreditations = [
    {
      icon: Shield,
      title: "UKAS Accredited Labs",
      color: "hsl(var(--primary))"
    },
    {
      icon: FileCheck,
      title: "CQC Regulated Providers",
      color: "hsl(var(--primary))"
    },
    {
      icon: Award,
      title: "ISO 15189 Certified",
      color: "hsl(var(--primary))"
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
          {accreditations.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div 
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-4 rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon 
                  className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" 
                  style={{ color: item.color }}
                />
              </div>
              <h3 className="font-semibold text-[hsl(var(--navy))] text-[10px] sm:text-sm md:text-lg leading-tight">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditationCards;
