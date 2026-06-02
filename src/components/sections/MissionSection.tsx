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
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
        
        <div className="bg-brand-navy py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="container mx-auto px-3 sm:px-4 text-2xl">
            <h2 className="text-center text-base sm:text-lg font-heading font-bold whitespace-nowrap xl:text-4xl lg:text-7xl md:text-5xl">
              <span className="text-white">Your </span>
              <span className="text-brand-turquoise">health</span>
              <span className="text-white"> is your greatest </span>
              <span className="text-brand-pink">asset</span>
              <span className="text-white">!</span>
            </h2>
          </div>
        </div>
        
        {/* Bottom gradient divider */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      </div>

    </section>
  );
};

export default MissionSection;
