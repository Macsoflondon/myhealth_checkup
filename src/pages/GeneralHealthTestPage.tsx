import TestPageTemplate from "@/components/TestPageTemplate";
import { TestPageData } from "@/types/TestPageTypes";
import { Heart, Clock, Shield } from "lucide-react";

const GeneralHealthTestPage = () => {
  const testData: TestPageData = {
    title: "General Health Test",
    description: "Get a comprehensive overview of your health with testing for cholesterol levels, liver function, iron levels, diabetes risk and more essential health markers.",
    category: "General Health",
    breadcrumbTitle: "General Health Test",
    metaTitle: "General Health Test - Compare UK Providers | MyHealth Checkup",
    metaDescription: "Compare General Health Tests from top UK providers. Get comprehensive health screening with cholesterol, liver function, diabetes risk and more.",
    
    biomarkerSections: [
      {
        title: "Blood Health",
        markers: [
          "Full Blood Count (FBC)",
          "Iron Status", 
          "Vitamin B12 & Folate"
        ]
      },
      {
        title: "Metabolic Health",
        markers: [
          "Cholesterol Profile",
          "Diabetes Screening (HbA1c)",
          "Liver Function Tests"
        ]
      }
    ],
    
    featureBadges: [
      { icon: Shield, label: "UKAS Accredited" },
      { icon: Clock, label: "Fast Results" },
      { icon: Heart, label: "Health Insights" }
    ],
    
    whyChooseTitle: "Why Choose a General Health Test?",
    whyChooseItems: [
      "Early detection of potential health issues",
      "Establish baseline health measurements", 
      "Monitor progress of lifestyle changes",
      "Peace of mind about your health status",
      "No GP referral required"
    ],
    
    providers: [
      {
        name: "Medichecks",
        price: 75,
        url: "https://medichecks.com/products/general-health-blood-test",
        features: ["24 biomarkers", "3-4 day results", "Venous collection"]
      },
      {
        name: "Randox Health", 
        price: 75,
        url: "https://randoxhealth.com/en-GB/at-home/general-health",
        features: ["24 data points", "Next day results", "At-home kit"]
      },
      {
        name: "London Medical Laboratory",
        price: 89,
        url: "https://londonmedicallaboratory.com/product-category/general-health",
        features: ["Comprehensive panel", "Same day results", "Home or clinic"]
      }
    ]
  };

  return <TestPageTemplate data={testData} />;
};

export default GeneralHealthTestPage;