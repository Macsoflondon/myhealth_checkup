import TestPageTemplate from "@/components/tests/TestPageTemplate";
import { TestPageData } from "@/types/TestPageTypes";
import { Heart, Clock, Shield } from "lucide-react";

const FemaleHormonesTestPage = () => {
  const testData: TestPageData = {
    title: "Female Hormone Test",
    description: "Comprehensive female hormone panel measuring oestrogen, progesterone, FSH, LH and other key hormones affecting menstrual cycles, fertility, menopause and overall wellbeing.",
    category: "Hormones",
    breadcrumbTitle: "Female Hormone Test",
    metaTitle: "Female Hormone Test - Compare UK Providers | MyHealth Checkup",
    metaDescription: "Compare Female Hormone Tests from top UK providers. Test oestrogen, progesterone, FSH, LH and other hormones affecting fertility, cycles and menopause.",
    
    biomarkerSections: [
      {
        title: "Primary Hormones",
        markers: [
          "Oestradiol (E2)",
          "Progesterone",
          "Follicle Stimulating Hormone (FSH)",
          "Luteinising Hormone (LH)"
        ]
      },
      {
        title: "Supporting Markers",
        markers: [
          "Prolactin",
          "Testosterone",
          "Sex Hormone Binding Globulin (SHBG)",
          "Anti-Müllerian Hormone (AMH)"
        ]
      }
    ],
    
    featureBadges: [
      { icon: Shield, label: "UKAS Accredited" },
      { icon: Clock, label: "Fast Results" },
      { icon: Heart, label: "Actionable Insights" }
    ],
    
    whyChooseTitle: "Why Test Female Hormones?",
    whyChooseItems: [
      "Understand irregular or absent periods",
      "Assess fertility and ovarian reserve",
      "Monitor perimenopause or menopause symptoms",
      "Identify causes of mood changes and fatigue",
      "Guide treatment decisions with your GP"
    ],
    
    providers: [
      {
        name: "Randox Health",
        price: 43,
        url: "https://randoxhealth.com/en-GB/product/female/clinic/female-hormone-test",
        features: ["In-clinic visit", "Same-day results", "UKAS accredited"],
        turnaround: "Same day",
        biomarkers: 4
      },
      {
        name: "Medichecks",
        price: 79,
        url: "https://www.medichecks.com/products/female-hormone-check-blood-test",
        features: ["4 key hormones", "Home collection kit", "Doctor report"],
        turnaround: "3-4 days",
        biomarkers: 4
      },
      {
        name: "Thriva",
        price: 99,
        url: "https://thriva.co/shop/womens-health-test-packages/womens-hormones-blood-test-insights",
        features: ["Home finger-prick test", "GP-written report", "Nurse visit +£60"],
        turnaround: "2-3 days",
        biomarkers: 5
      },
      {
        name: "London Medical Laboratory",
        price: 99,
        url: "https://www.londonmedicallaboratory.com/product/fertility-hormones-profile",
        features: ["5 fertility hormones", "Home or clinic", "Next-day results"],
        turnaround: "1-2 days",
        biomarkers: 5
      },
      {
        name: "Medichecks Advanced",
        price: 99,
        url: "https://www.medichecks.com/products/female-hormone-check-advanced-blood-test",
        features: ["Extended panel", "Includes AMH", "Doctor review"],
        turnaround: "3-4 days",
        biomarkers: 8
      },
      {
        name: "Goodbody Clinic",
        price: 119,
        url: "https://health.goodbodyclinic.com/product/female-hormone-fertility-blood-test/",
        features: ["Complete hormone panel", "Fertility markers", "2-3 day results"],
        turnaround: "2-3 days",
        biomarkers: 6
      },
      {
        name: "Lola Health",
        price: 140,
        url: "https://lolahealth.co/products/female-active-boost",
        features: ["39 biomarkers", "At-home phlebotomy", "Doctor review included"],
        turnaround: "2 days",
        biomarkers: 39
      }
    ]
  };

  return <TestPageTemplate data={testData} />;
};

export default FemaleHormonesTestPage;
