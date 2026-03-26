import TestPageTemplate from "@/components/tests/TestPageTemplate";
import { TestPageData } from "@/types/TestPageTypes";
import { Heart, Clock, Shield } from "lucide-react";

const IronProfileTestPage = () => {
  const testData: TestPageData = {
    title: "Iron Profile Test",
    description: "Comprehensive iron status testing to check for iron deficiency, anaemia, or iron overload. Essential for energy levels and overall health assessment.",
    category: "Blood Tests",
    breadcrumbTitle: "Iron Profile Test",
    metaTitle: "Iron Profile Test - Compare UK Providers | MyHealth Checkup",
    metaDescription: "Compare Iron Profile Tests from top UK providers. Check for iron deficiency, anaemia and iron overload with comprehensive iron status testing.",
    
    biomarkerSections: [
      {
        title: "Iron Markers",
        markers: [
          "Serum Iron",
          "Ferritin (iron stores)",
          "Total Iron Binding Capacity (TIBC)",
          "Transferrin Saturation"
        ]
      },
      {
        title: "Related Tests",
        markers: [
          "Haemoglobin levels",
          "Red blood cell count",
          "Mean cell volume (MCV)",
          "Vitamin B12 & Folate"
        ]
      }
    ],
    
    highlights: [
      {
        title: "Signs of Iron Deficiency",
        items: [
          "Fatigue and weakness",
          "Pale skin, nails or inner eyelids",
          "Shortness of breath",
          "Cold hands and feet",
          "Restless leg syndrome"
        ],
        bgColor: "bg-red-50 dark:bg-red-900/20",
        textColor: "text-red-800 dark:text-red-200"
      }
    ],
    
    featureBadges: [
      { icon: Shield, label: "UKAS Accredited" },
      { icon: Clock, label: "Fast Results" },
      { icon: Heart, label: "Energy Insights" }
    ],
    
    whyChooseTitle: "Why Test Iron Levels?",
    whyChooseItems: [
      "Iron deficiency is one of the most common nutritional deficiencies",
      "Essential for oxygen transport and energy production",
      "Women are at higher risk due to menstruation",
      "Vegetarians and vegans may have lower iron levels",
      "Can identify both deficiency and excess iron"
    ],
    
    providers: [
      {
        name: "Medichecks",
        price: 39,
        url: "https://medichecks.com/products/iron-status-blood-test",
        features: ["Full iron panel", "3-4 day results", "Finger-prick option"]
      },
      {
        name: "Thriva", 
        price: 49,
        url: "https://thriva.co/products/iron-test",
        features: ["Iron status markers", "App tracking", "Doctor review"]
      },
      {
        name: "London Medical Laboratory",
        price: 45,
        url: "https://londonmedicallaboratory.com/product/iron-profile-test",
        features: ["Comprehensive iron", "Same day results", "Home or clinic"]
      }
    ]
  };

  return <TestPageTemplate data={testData} />;
};

export default IronProfileTestPage;