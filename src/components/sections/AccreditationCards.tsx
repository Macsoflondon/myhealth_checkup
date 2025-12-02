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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {accreditations.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon 
                  className="w-8 h-8" 
                  style={{ color: item.color }}
                />
              </div>
              <h3 className="font-semibold text-[hsl(var(--navy))] text-lg">
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
