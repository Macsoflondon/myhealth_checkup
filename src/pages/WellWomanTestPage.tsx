import TestPageTemplate from "@/components/tests/TestPageTemplate";
import { TestPageData } from "@/types/TestPageTypes";
import { Heart, Clock, Shield } from "lucide-react";

const WellWomanTestPage = () => {
  const testData: TestPageData = {
    title: "Well Woman Blood Test",
    description: "Comprehensive female health screening including hormone analysis, fertility markers, general health indicators and nutritional status tailored specifically for women.",
    category: "Women's Health",
    breadcrumbTitle: "Well Woman Test",
    metaTitle: "Well Woman Blood Test - Compare UK Providers | MyHealth Checkup",
    metaDescription: "Compare Well Woman Tests from top UK providers. Comprehensive female health screening including hormones, fertility, and general health markers.",
    
    biomarkerSections: [
      {
        title: "Female Hormones",
        markers: [
          "Oestradiol (Estrogen)",
          "Progesterone",
          "Testosterone",
          "Luteinising Hormone (LH)",
          "Follicle Stimulating Hormone (FSH)"
        ]
      },
      {
        title: "General Health",
        markers: [
          "Full Blood Count",
          "Iron Status & Ferritin",
          "Thyroid Function (TSH, T3, T4)",
          "Cholesterol Profile",
          "Diabetes Screening (HbA1c)"
        ]
      }
    ],
    
    highlights: [
      {
        title: "Key Areas Covered",
        items: [
          "Menstrual cycle health and regularity",
          "Fertility and reproductive health",
          "Menopause transition markers",
          "Energy levels and fatigue assessment",
          "Bone health and osteoporosis risk"
        ],
        bgColor: "bg-primary/10",
        textColor: "text-primary"
      }
    ],
    
    featureBadges: [
      { icon: Shield, label: "UKAS Accredited" },
      { icon: Clock, label: "Fast Results" },
      { icon: Heart, label: "Female Focus" }
    ],
    
    whyChooseTitle: "Why Choose Well Woman Testing?",
    whyChooseItems: [
      "Tailored specifically for women's unique health needs",
      "Comprehensive hormone analysis for all life stages",
      "Early detection of common female health issues",
      "Monitor fertility and reproductive health",
      "Track menopause transition and symptoms"
    ],
    
    providers: [
      {
        name: "Medichecks",
        price: 159,
        url: "https://medichecks.com/products/well-woman-advanced-blood-test",
        features: ["47 biomarkers", "3-4 day results", "Hormone analysis"]
      },
      {
        name: "Thriva",
        price: 149,
        url: "https://thriva.co/products/womens-health-test",
        features: ["Female health focus", "App tracking", "Doctor review"]
      },
      {
        name: "London Medical Laboratory",
        price: 169,
        url: "https://londonmedicallaboratory.com/product-category/female-health",
        features: ["Comprehensive panel", "Same day results", "Hormone insights"]
      }
    ]
  };

  return <TestPageTemplate data={testData} />;
};
export default WellWomanTestPage;