import { Shield, FileCheck, Award } from "lucide-react";

const MissionSection = () => {
  const accreditations = [
    {
      icon: Shield,
      title: "UKAS Accredited Labs",
    },
    {
      icon: FileCheck,
      title: "CQC Regulated Providers",
    },
    {
      icon: Award,
      title: "ISO 15189 Certified",
    }
  ];

  return (
    <section className="pt-0 pb-6 sm:pb-8 md:pb-10 lg:pb-14 bg-white">
      {/* Navy banner heading with gradient dividers */}
      <div className="mb-5 sm:mb-6 md:mb-8 lg:mb-12">
        {/* Top gradient divider */}
        <div className="h-0.5 sm:h-1 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
        
        <div className="bg-brand-navy py-3 sm:py-4 md:py-6 lg:py-8">
          <div className="container mx-auto px-3 sm:px-4">
            <h2 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-heading font-bold">
              <span className="text-white">Your </span>
              <span className="text-brand-turquoise">health</span>
              <span className="text-white"> is your greatest </span>
              <span className="text-brand-pink">asset</span>
              <span className="text-white">!</span>
            </h2>
          </div>
        </div>
        
        {/* Bottom gradient divider */}
        <div className="h-0.5 sm:h-1 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      </div>

      {/* Centred accreditation cards */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-row gap-2 sm:gap-3 md:gap-4">
            {accreditations.map((item, index) => (
              <div 
                key={index} 
                className="flex-1 bg-[#e8f7f8] rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 lg:p-5 flex items-center gap-2 sm:gap-3 md:gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-transparent flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-brand-pink" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-semibold text-brand-pink text-[10px] xs:text-xs sm:text-sm md:text-base leading-tight">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
