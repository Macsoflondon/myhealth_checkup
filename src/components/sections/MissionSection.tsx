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
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left Column - Text Content (60%) */}
            <div className="lg:col-span-3">
              <div className="flex items-start gap-4">
                {/* Turquoise accent bar */}
                <div className="hidden sm:block w-1 bg-[#22c0d4] self-stretch min-h-[80px] rounded-full" />
                
                <div className="space-y-4 text-gray-600 font-sans text-sm sm:text-base md:text-lg leading-relaxed">
                  <p>
                    At myhealth <span className="text-[#22c0d4] font-medium">checkup</span>, we believe everyone deserves access to transparent, trustworthy health information.
                  </p>
                  <p>
                    Our mission is to empower you to take control of your health by making it simple to compare private health tests from accredited UK providers.
                  </p>
                  <p>
                    We only feature providers that meet rigorous quality standards, including UKAS accreditation and CQC regulation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Accreditation Cards (40%) */}
            <div className="lg:col-span-2">
              <div className="flex flex-row lg:flex-col gap-3 sm:gap-4">
                {accreditations.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex-1 lg:flex-none bg-[#e8f7f8] rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-transparent flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#22c0d4]" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading font-semibold text-[#22c0d4] text-sm sm:text-base">
                      {item.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
