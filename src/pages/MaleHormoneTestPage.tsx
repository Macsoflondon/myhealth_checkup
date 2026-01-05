import TestPageTemplate from "@/components/TestPageTemplate";
import { TestPageData } from "@/types/TestPageTypes";
import { Heart, Clock, Shield } from "lucide-react";

const MaleHormoneTestPage = () => {
  const testData: TestPageData = {
    title: "Male Hormone Test",
    description: "Measure testosterone, prolactin levels and other key male hormones to detect imbalances that may be impacting mood, libido, energy levels and overall wellbeing.",
    category: "Hormones",
    breadcrumbTitle: "Male Hormone Test",
    metaTitle: "Male Hormone Test - Compare UK Providers | MyHealth Checkup",
    metaDescription: "Compare Male Hormone Tests from top UK providers. Test testosterone, DHEA, cortisol and other key male hormones affecting energy, mood and performance.",
    
    biomarkerSections: [
      {
        title: "Primary Hormones",
        markers: [
          "Total Testosterone",
          "Free Testosterone",
          "DHEA Sulphate",
          "Cortisol"
        ]
      },
      {
        title: "Supporting Markers",
        markers: [
          "Sex Hormone Binding Globulin (SHBG)",
          "Luteinising Hormone (LH)",
          "Follicle Stimulating Hormone (FSH)",
          "Prolactin"
        ]
      }
    ],
    
    featureBadges: [
      { icon: Shield, label: "UKAS Accredited" },
      { icon: Clock, label: "Fast Results" },
      { icon: Heart, label: "Actionable Insights" }
    ],
    
    whyChooseTitle: "Why Test Male Hormones?",
    whyChooseItems: [
      "Identify causes of low energy and fatigue",
      "Assess factors affecting mood and motivation",
      "Understand impacts on physical performance",
      "Monitor testosterone levels as you age",
      "Guide lifestyle and treatment decisions"
    ],
    
    providers: [
      {
        name: "Randox Health",
        price: 33,
        url: "https://randoxhealth.com/en-GB/at-home/male-health",
        features: ["8 male hormones", "At-home collection", "Next day results"]
      },
      {
        name: "Medichecks", 
        price: 69,
        url: "https://medichecks.com/products/male-hormone-blood-test",
        features: ["Testosterone panel", "3-4 day results", "Finger-prick or venous"]
      },
      {
        name: "Thriva",
        price: 79,
        url: "https://thriva.co/products/testosterone-test",
        features: ["Comprehensive hormones", "App tracking", "Doctor review"]
      }
    ]
  };

  return <TestPageTemplate data={testData} />;
};

export default MaleHormoneTestPage;