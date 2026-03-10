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
    <section className="pt-0 pb-0 bg-white">
      {/* Navy banner heading with gradient dividers */}
      <div>
        {/* Top gradient divider */}
        <div className="h-0.5 sm:h-1 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
        
        <div className="bg-white py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="container mx-auto px-3 sm:px-4">
            <h2 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-heading font-semibold text-brand-navy whitespace-nowrap">
              Your health is your greatest asset!
            </h2>
          </div>
        </div>
        
        {/* Bottom gradient divider */}
        <div className="h-0.5 sm:h-1 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      </div>

    </section>
  );
};

export default MissionSection;
