import TestPageTemplate from "@/components/TestPageTemplate";
import { TestPageData } from "@/types/TestPageTypes";
import { Heart, Clock, Shield } from "lucide-react";

const VitaminDTestPage = () => {
  const testData: TestPageData = {
    title: "Vitamin D Blood Test",
    description: "Check your vitamin D levels to assess bone health, immune function, and overall wellbeing. Essential for those with limited sun exposure or dietary intake.",
    category: "Vitamins",
    breadcrumbTitle: "Vitamin D Test",
    metaTitle: "Vitamin D Test - Compare UK Providers | MyHealth Checkup",
    metaDescription: "Compare Vitamin D Tests from top UK providers. Check your vitamin D levels for bone health, immune function and overall wellbeing.",
    
    biomarkerSections: [
      {
        title: "What We Measure",
        markers: [
          "25-Hydroxyvitamin D",
          "Total vitamin D status",
          "Deficiency assessment"
        ]
      },
      {
        title: "Health Benefits",
        markers: [
          "Bone health support",
          "Immune system function",
          "Muscle strength"
        ]
      }
    ],
    
    highlights: [
      {
        title: "Vitamin D Reference Ranges",
        items: [
          "Deficient: <30 nmol/L (<12 ng/mL)",
          "Insufficient: 30-50 nmol/L (12-20 ng/mL)",
          "Sufficient: 50-125 nmol/L (20-50 ng/mL)",
          "Optimal: 75-125 nmol/L (30-50 ng/mL)"
        ],
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-800 dark:text-blue-200"
      }
    ],
    
    featureBadges: [
      { icon: Shield, label: "UKAS Accredited" },
      { icon: Clock, label: "Fast Results" },
      { icon: Heart, label: "Easy Collection" }
    ],
    
    whyChooseTitle: "Why Test Vitamin D?",
    whyChooseItems: [
      "Many UK residents have insufficient vitamin D levels",
      "Essential for bone health and calcium absorption",
      "Supports immune system function",
      "May help with mood and energy levels",
      "Simple finger-prick test available"
    ],
    
    providers: [
      {
        name: "Thriva",
        price: 29,
        url: "https://thriva.co/products/vitamin-d-test",
        features: ["25-OH Vitamin D", "Finger-prick test", "App tracking"]
      },
      {
        name: "Medichecks", 
        price: 29,
        url: "https://medichecks.com/products/vitamin-d-blood-test",
        features: ["Vitamin D3 level", "3-4 day results", "Home collection"]
      },
      {
        name: "London Medical Laboratory",
        price: 39,
        url: "https://londonmedicallaboratory.com/product/vitamin-d-test",
        features: ["25-hydroxyvitamin D", "Same day results", "Clinic or home"]
      }
    ]
  };

  return <TestPageTemplate data={testData} />;
};

export default VitaminDTestPage;