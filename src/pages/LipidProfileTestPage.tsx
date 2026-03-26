import TestPageTemplate from "@/components/tests/TestPageTemplate";
import { TestPageData } from "@/types/TestPageTypes";
import { Heart, Clock, Shield } from "lucide-react";

const LipidProfileTestPage = () => {
  const testData: TestPageData = {
    title: "Lipid Profile Test",
    description: "Comprehensive cholesterol testing to assess your cardiovascular risk and heart health. Essential for monitoring and preventing heart disease.",
    category: "Heart Health",
    breadcrumbTitle: "Lipid Profile Test",
    metaTitle: "Lipid Profile Test - Compare UK Providers | MyHealth Checkup",
    metaDescription: "Compare Lipid Profile Tests from top UK providers. Check cholesterol levels, heart disease risk and cardiovascular health.",
    
    biomarkerSections: [
      {
        title: "Cholesterol Markers",
        markers: [
          "Total Cholesterol",
          "LDL Cholesterol (bad)",
          "HDL Cholesterol (good)",
          "Triglycerides"
        ]
      },
      {
        title: "Risk Assessment",
        markers: [
          "Cholesterol ratios",
          "Cardiovascular risk scoring",
          "Heart disease indicators",
          "Treatment recommendations"
        ]
      }
    ],
    
    highlights: [
      {
        title: "Optimal Cholesterol Levels",
        items: [
          "Total Cholesterol: <5.0 mmol/L (<193 mg/dL)",
          "LDL Cholesterol: <3.0 mmol/L (<116 mg/dL)",
          "HDL Cholesterol: >1.0 mmol/L (>39 mg/dL) men, >1.2 mmol/L (>46 mg/dL) women",
          "Triglycerides: <1.7 mmol/L (<150 mg/dL)"
        ],
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        textColor: "text-amber-800 dark:text-amber-200"
      }
    ],
    
    featureBadges: [
      { icon: Shield, label: "UKAS Accredited" },
      { icon: Clock, label: "Fast Results" },
      { icon: Heart, label: "Heart Health" }
    ],
    
    whyChooseTitle: "Why Test Cholesterol Levels?",
    whyChooseItems: [
      "High cholesterol is a major risk factor for heart disease",
      "Often has no symptoms until it's too late",
      "Family history of heart disease increases risk",
      "Diet and lifestyle changes can improve levels",
      "Regular monitoring is recommended for adults"
    ],
    
    providers: [
      {
        name: "Medichecks",
        price: 49,
        url: "https://medichecks.com/products/cholesterol-blood-test",
        features: ["Full lipid panel", "3-4 day results", "Home collection"]
      },
      {
        name: "Thriva", 
        price: 59,
        url: "https://thriva.co/products/cholesterol-test",
        features: ["Heart health insights", "App tracking", "Doctor review"]
      },
      {
        name: "London Medical Laboratory",
        price: 55,
        url: "https://londonmedicallaboratory.com/product/lipid-profile-test",
        features: ["Comprehensive lipids", "Same day results", "Clinic or home"]
      }
    ]
  };

  return <TestPageTemplate data={testData} />;
};

export default LipidProfileTestPage;