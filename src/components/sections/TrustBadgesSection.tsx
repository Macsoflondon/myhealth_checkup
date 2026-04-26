import { CheckCircle, Shield, Award, Lock } from "lucide-react";
const TrustBadgesSection = () => {
  const badges = [{
    icon: Shield,
     title: "CQC Regulated",
    description: "All clinics are CQC regulated"
  }, {
    icon: Award,
    title: "UKAS Accredited",
    description: "Laboratory testing excellence"
  }, {
    icon: Lock,
    title: "GDPR Compliant",
    description: "Your data is secure"
  }, {
    icon: CheckCircle,
    title: "Secure Platform",
    description: "ISO certified processes"
  }];
  return <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--navy))] mb-3 text-[#081129]">
            Trusted Health Comparison Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            We only feature UKAS-accredited laboratories, CQC-regulated clinics, and ISO 15189-certified facilities to ensure you receive the highest quality care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {badges.map((badge, index) => <div key={index} className="glass-card flex flex-col items-center text-center p-6 rounded-lg transition-colors hover:scale-105">
              <div className="w-12 h-12 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center mb-3">
                <badge.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[hsl(var(--navy))] mb-2 text-[#081129]">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {badge.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default TrustBadgesSection;