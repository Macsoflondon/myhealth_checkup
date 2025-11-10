import { MessageCircle, UserCheck, Award, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ExpertSupportProps {
  className?: string;
}


const ExpertSupport = ({ className }: ExpertSupportProps) => {
  const navigate = useNavigate();
  const supportFeatures = [{
    icon: UserCheck,
    title: "Expert Guidance Included",
    description: "Many tests include GP consultation recommendations. Get professional interpretation of your results, not just numbers.",
    color: "text-[#22c0d4]",
    bgColor: "bg-[#22c0d4]/10"
  }, {
    icon: Award,
    title: "UKAS-Accredited Labs",
    description: "All testing performed by UK-accredited laboratories to the highest ISO 15189 medical standards.",
    color: "text-[#e70d69]",
    bgColor: "bg-[#e70d69]/10"
  }, {
    icon: MessageCircle,
    title: "Ongoing Support",
    description: "Questions about your results? Our customer support team is here to help guide you through your health journey.",
    color: "text-[#22c0d4]",
    bgColor: "bg-[#22c0d4]/10"
  }, {
    icon: HeartHandshake,
    title: "Your Health Partner",
    description: "We're with you for the long term. Track results over time, compare trends, and optimise your health continuously.",
    color: "text-[#e70d69]",
    bgColor: "bg-[#e70d69]/10"
  }];
  return <section className={cn("w-full bg-gradient-to-b from-[#081129] to-[#0a1836] py-12 sm:py-16 md:py-20", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            You're Never Alone on Your <span className="text-[#22c0d4]">Health Journey</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Expert support, when and where you need it
          </p>
        </div>

        {/* Support Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {supportFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 group hover:scale-105">
                <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>;
        })}
        </div>

        {/* CTA Section */}
        

        {/* Trust Indicators */}
        
      </div>
    </section>;
};
export default ExpertSupport;