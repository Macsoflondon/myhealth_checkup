import TestPageTemplate from "@/components/tests/TestPageTemplate";
import { TestPageData } from "@/types/TestPageTypes";
import { Heart, Clock, Shield } from "lucide-react";

const FemaleHormonesTestPage = () => {
  const testData: TestPageData = {
    title: "Female hormone test",
    description:
      "Comprehensive female hormone panel measuring oestrogen, progesterone, FSH, LH and other key hormones affecting menstrual cycles, fertility, menopause and overall wellbeing.",
    category: "Hormones",
    breadcrumbTitle: "Female hormone test",
    metaTitle: "Female hormone test: compare UK providers | myhealth checkup",
    metaDescription:
      "Compare Female Hormone Tests from top UK providers. Test oestrogen, progesterone, FSH, LH and other hormones affecting fertility, cycles and menopause.",

    biomarkerSections: [
      {
        title: "Primary hormones",
        markers: [
          "Oestradiol (E2)",
          "Progesterone",
          "Follicle Stimulating Hormone (FSH)",
          "Luteinising Hormone (LH)",
        ],
      },
      {
        title: "Supporting markers",
        markers: [
          "Prolactin",
          "Testosterone",
          "Sex Hormone Binding Globulin (SHBG)",
          "Anti-Müllerian Hormone (AMH)",
        ],
      },
    ],

    featureBadges: [
      { icon: Shield, label: "UKAS accredited" },
      { icon: Clock, label: "Fast results" },
      { icon: Heart, label: "Actionable insights" },
    ],

    whyChooseTitle: "Why Test Female Hormones?",
    whyChooseItems: [
      "Understand irregular or absent periods",
      "Assess fertility and ovarian reserve",
      "Monitor perimenopause or menopause symptoms",
      "Identify causes of mood changes and fatigue",
      "Guide treatment decisions with your GP",
    ],

    panel: "female-hormones",
  };

  return <TestPageTemplate data={testData} />;
};

export default FemaleHormonesTestPage;
