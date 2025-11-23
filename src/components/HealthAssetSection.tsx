import { Shield, Award, Clock, Users } from "lucide-react";

const HealthAssetSection = () => {
  const features = [
    {
      icon: Shield,
      title: "UKAS Accredited",
      description: "All laboratories meet the highest UK standards"
    },
    {
      icon: Award,
      title: "CQC Registered",
      description: "Clinics regulated by Care Quality Commission"
    },
    {
      icon: Clock,
      title: "Fast Results",
      description: "Receive your results within 24-48 hours"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "GP consultation available with every test"
    }
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#081129] mb-4">
            Your Health is Your <span className="text-[#e70d69]">Greatest Asset</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-elegant italic leading-relaxed">
            Take control of your health with confidence. Compare private blood tests, health screenings, 
            and wellness services from the UK's most trusted providers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="glass-card flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 bg-[#22c0d4] rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-heading font-bold text-[#081129] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HealthAssetSection;
