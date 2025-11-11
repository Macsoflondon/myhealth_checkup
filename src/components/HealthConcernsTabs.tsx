import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Battery, Brain, Apple, Users, Baby, Flame, Sparkles } from "lucide-react";

const HealthConcernsTabs = () => {
  const navigate = useNavigate();

  const concerns = [
    {
      id: "fatigue",
      label: "Chronic Fatigue",
      icon: Battery,
      image: "/lovable-uploads/hero-image-2.png",
      title: "Feel Energised Again",
      description: "Persistent fatigue is often rooted in nutrient deficiencies, thyroid imbalances, or hormonal issues. Our comprehensive testing identifies the root cause, helping you restore sustained energy levels.",
      bullets: [
        "Thyroid function tests to detect metabolic issues",
        "Iron and B12 testing for deficiency detection",
        "Comprehensive hormone panels"
      ],
      route: "/wellness"
    },
    {
      id: "heart",
      label: "Heart Health",
      icon: Heart,
      image: "/lovable-uploads/hero-image-3.png",
      title: "Protect Your Heart",
      description: "Heart disease is the UK's leading cause of death, but many risks are preventable. Early detection of cholesterol imbalances, inflammation markers, and blood pressure issues can save lives.",
      bullets: [
        "Full lipid profile including LDL and HDL",
        "Inflammation markers (CRP, homocysteine)",
        "Blood glucose and HbA1c for diabetes risk"
      ],
      route: "/test/heart-health"
    },
    {
      id: "hormones",
      label: "Hormone Imbalances",
      icon: Sparkles,
      image: "/lovable-uploads/hero-image-4.png",
      title: "Restore Hormonal Balance",
      description: "Hormonal imbalances affect energy, mood, weight, fertility, and overall wellbeing. Our testing identifies specific hormone issues so you can get targeted treatment.",
      bullets: [
        "Testosterone, oestrogen, and progesterone testing",
        "Thyroid function (TSH, T3, T4)",
        "Cortisol for stress hormone assessment"
      ],
      route: "/hormones"
    },
    {
      id: "gut",
      label: "Digestive Issues",
      icon: Apple,
      image: "/lovable-uploads/hero-image-1.png",
      title: "Heal Your Gut",
      description: "Bloating, IBS, food sensitivities, and poor digestion often stem from gut microbiome imbalances, infections, or inflammation. Get to the root cause with comprehensive testing.",
      bullets: [
        "Food intolerance and allergy testing",
        "H. pylori and parasite detection",
        "Inflammatory bowel markers"
      ],
      route: "/gut-health"
    },
    {
      id: "fertility",
      label: "Fertility & Pregnancy",
      icon: Baby,
      image: "/lovable-uploads/hero-image-2.png",
      title: "Support Your Journey",
      description: "Whether you're planning for pregnancy or optimising fertility, hormone testing provides crucial insights into reproductive health and potential issues.",
      bullets: [
        "FSH, LH, and AMH fertility hormones",
        "Prolactin and PCOS screening",
        "Prenatal nutrient status (folate, vitamin D)"
      ],
      route: "/fertility"
    },
    {
      id: "menopause",
      label: "Menopause",
      icon: Flame,
      image: "/lovable-uploads/hero-image-3.png",
      title: "Navigate Menopause Confidently",
      description: "Hot flashes, mood changes, sleep disruption, and weight gain are common but manageable. Testing helps identify hormone levels and guide effective treatment.",
      bullets: [
        "FSH and oestradiol for menopausal status",
        "Thyroid function (often affected during menopause)",
        "Bone health markers for osteoporosis risk"
      ],
      route: "/womens-health"
    },
    {
      id: "mens",
      label: "Men's Health",
      icon: Users,
      image: "/lovable-uploads/hero-image-4.png",
      title: "Optimise Male Health",
      description: "From testosterone levels to prostate health, men face unique health challenges. Our testing provides the insights needed for optimal performance and longevity.",
      bullets: [
        "Total and free testosterone",
        "PSA for prostate health screening",
        "Full hormone panel including DHEA"
      ],
      route: "/mens-health"
    },
    {
      id: "prevention",
      label: "Prevention & Longevity",
      icon: Sparkles,
      image: "/lovable-uploads/hero-image-1.png",
      title: "Invest in Your Future",
      description: "Catch health issues early before symptoms appear. Regular comprehensive screening helps you stay ahead and optimise for longevity.",
      bullets: [
        "Full metabolic and organ function panels",
        "Cancer markers (PSA, CA-125, CEA)",
        "Cardiovascular risk assessment"
      ],
      route: "/wellness"
    }
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#081129] mb-4">
            <span className="text-[#e70d69]">Comprehensive Care</span> for Your Top Concerns
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-based testing for the health issues that matter most to you
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fatigue" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent mb-8 h-auto">
            {concerns.map((concern) => {
              const Icon = concern.icon;
              return (
                <TabsTrigger
                  key={concern.id}
                  value={concern.id}
                  className="px-4 py-2 text-sm sm:text-base data-[state=active]:bg-[#e70d69] data-[state=active]:text-white bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-all duration-200"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {concern.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {concerns.map((concern) => (
            <TabsContent key={concern.id} value={concern.id} className="mt-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className="order-2 md:order-1">
                  <img
                    src={concern.image}
                    alt={concern.title}
                    className="rounded-2xl shadow-xl w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="order-1 md:order-2 space-y-6">
                  <h3 className="text-3xl sm:text-4xl font-bold text-[#081129]">
                    {concern.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {concern.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#081129] text-lg">What We Test:</h4>
                    <ul className="space-y-2">
                      {concern.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-[#22c0d4] mt-1">✓</span>
                          <span className="text-gray-700">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => navigate(concern.route)}
                    size="lg"
                    className="bg-[#e70d69] hover:bg-[#c00959] text-white px-8 py-6 text-lg rounded-xl"
                  >
                    Explore Tests
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default HealthConcernsTabs;
