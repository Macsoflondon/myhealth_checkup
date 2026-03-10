import { useState } from "react";
import { HoverExpand_001 } from "@/components/ui/expand-on-hover";
import { cn } from "@/lib/utils";

const TABS = ["General Health", "Hormone & Fertility", "Cancer Screening"] as const;
type Tab = typeof TABS[number];

const GENERAL_HEALTH_TESTS = [
  { src: "/images/tests/advanced-well-man.png", alt: "Advanced Well Man Blood Test", code: "Advanced Well Man", objectFit: "contain" },
  { src: "/images/tests/general-health-blood-test.png", alt: "General Health Blood Test", code: "General Health", objectFit: "contain" },
  { src: "/images/tests/premium-complete-blood-test.png", alt: "Premium Complete Blood Test", code: "Premium Complete", objectFit: "contain" },
  { src: "/images/tests/complete-allergy-blood-test.png", alt: "Complete Allergy Blood Test", code: "Complete Allergy", objectFit: "contain" },
  { src: "/images/tests/kidney-blood-test.png", alt: "Kidney Blood Test", code: "Kidney", objectFit: "contain" },
  { src: "/images/tests/nad-plus-blood-test.png", alt: "NAD+ Blood Test", code: "NAD+", objectFit: "contain" },
  { src: "/images/tests/cholesterol-blood-test.png", alt: "Cholesterol Blood Test", code: "Cholesterol", objectFit: "contain" },
  { src: "/images/tests/full-blood-count-blood-test.png", alt: "Full Blood Count Blood Test", code: "Full Blood Count", objectFit: "contain" },
  { src: "/images/tests/liver-blood-test.png", alt: "Liver Blood Test", code: "Liver", objectFit: "contain" },
  { src: "/images/tests/vitamins-blood-test.png", alt: "Vitamins Blood Test", code: "Vitamins", objectFit: "contain" },
  { src: "/images/tests/sports-fitness-blood-test.png", alt: "Sports & Fitness Blood Test", code: "Sports & Fitness", objectFit: "contain" },
  { src: "/images/tests/advanced-well-woman.png", alt: "Advanced Well Woman Blood Test", code: "Advanced Well Woman", objectFit: "contain" },
  { src: "/images/tests/coeliac-screen-blood-test.png", alt: "Coeliac Screen Blood Test", code: "Coeliac Screen", objectFit: "contain" },
  { src: "/images/tests/cardiac-risk-blood-test.png", alt: "Cardiac Risk Blood Test", code: "Cardiac Risk", objectFit: "contain" },
  { src: "/images/tests/anaemia-blood-test.png", alt: "Anaemia Blood Test", code: "Anaemia", objectFit: "contain" },
  { src: "/images/tests/weight-loss-blood-test.png", alt: "Weight Loss Blood Test", code: "Weight Loss", objectFit: "contain" },
  { src: "/images/tests/trace-metal-blood-test.png", alt: "Trace Metal Blood Test", code: "Trace Metal", objectFit: "contain" },
  { src: "/images/tests/autoimmune-disease-blood-test.png", alt: "Autoimmune Disease Blood Test", code: "Autoimmune Disease", objectFit: "contain" },
  { src: "/images/tests/helicobacter-pylori-blood-test.png", alt: "Helicobacter Pylori Blood Test", code: "Helicobacter Pylori", objectFit: "contain" },
  { src: "/images/tests/blood-group-blood-test.png", alt: "Blood Group Blood Test", code: "Blood Group", objectFit: "contain" },
];

const HORMONE_FERTILITY_TESTS = [
  { src: "/images/tests/female-hormone-fertility.png", alt: "Female Hormone & Fertility Test", code: "Female Hormone & Fertility", objectFit: "contain" },
  { src: "/images/tests/testosterone-blood-test.png", alt: "Testosterone Blood Test", code: "Testosterone", objectFit: "contain" },
  { src: "/images/tests/thyroid-function-blood-test.png", alt: "Thyroid Function Blood Test", code: "Thyroid Function", objectFit: "contain" },
  { src: "/images/tests/pregnancy-blood-test.png", alt: "Pregnancy Blood Test", code: "Pregnancy", objectFit: "contain" },
  { src: "/images/tests/male-hormone-fertility-blood-test.png", alt: "Male Hormone & Fertility Blood Test", code: "Male Hormone & Fertility", objectFit: "contain" },
  { src: "/images/tests/anti-mullerian-hormone-blood-test.png", alt: "Anti-Mullerian Hormone Blood Test", code: "Anti-Mullerian Hormone", objectFit: "contain" },
  { src: "/images/tests/cortisol-stress-blood-test.png", alt: "Cortisol Stress Blood Test", code: "Cortisol Stress", objectFit: "contain" },
  { src: "/images/tests/prenatalsafe-3-nipt.png", alt: "PrenatalSAFE 3 NIPT Blood Test", code: "PrenatalSAFE 3 NIPT", objectFit: "contain" },
  { src: "/images/tests/thyroid-blood-test.png", alt: "Thyroid Blood Test", code: "Thyroid", objectFit: "contain" },
  { src: "/images/tests/prenatalsafe-5-nipt.png", alt: "PrenatalSAFE 5 NIPT Blood Test", code: "PrenatalSAFE 5 NIPT", objectFit: "contain" },
  { src: "/images/tests/prenatalsafe-karyo-plus-nipt.png", alt: "PrenatalSAFE Karyo Plus NIPT Blood Test", code: "PrenatalSAFE Karyo Plus", objectFit: "contain" },
  { src: "/images/tests/prenatalsafe-complete-plus-nipt.png", alt: "PrenatalSAFE Complete Plus NIPT Blood Test", code: "PrenatalSAFE Complete Plus", objectFit: "contain" },
];

const CANCER_SCREENING_TESTS = [
  { src: "/images/tests/early-cancer-screening.png", alt: "Early Cancer Screening Test", code: "TruCheck™ Early Cancer Screening", objectFit: "contain" },
  { src: "/images/tests/episwitch-pse.png", alt: "EpiSwitch PSE Prostate Test", code: "EpiSwitch® PSE Prostate", objectFit: "contain" },
  { src: "/images/tests/guardant-reveal.png", alt: "Guardant Reveal MRD & Therapy Response Monitoring", code: "Guardant Reveal™", objectFit: "contain" },
  { src: "/images/tests/lung-cancer-screening.png", alt: "Lung Cancer Screening Blood Test", code: "Lung Cancer Screening", objectFit: "contain" },
  { src: "/images/tests/guardant-360-cdx.png", alt: "Guardant 360 CDx Blood Collection Kit", code: "Guardant360® CDx", objectFit: "contain" },
  { src: "/images/tests/hpv-cervical-cancer-screening.png", alt: "HPV Cervical Cancer Screening", code: "HPV Cervical Cancer Screening", objectFit: "contain" },
  { src: "/images/tests/prostate-psa-blood-test.png", alt: "Prostate PSA Blood Test", code: "Prostate PSA", objectFit: "contain" },
  { src: "/images/tests/bowel-cancer-stool-test.png", alt: "Bowel Cancer Stool Test", code: "Bowel Cancer Stool Test", objectFit: "contain" },
];

const GoodbodyTestGallery = () => {
  const [activeTab, setActiveTab] = useState<Tab>("General Health");

  const getTestsForTab = () => {
    switch (activeTab) {
      case "General Health": return GENERAL_HEALTH_TESTS;
      case "Hormone & Fertility": return HORMONE_FERTILITY_TESTS;
      case "Cancer Screening": return CANCER_SCREENING_TESTS;
      default: return [];
    }
  };

  return (
    <div className="md:col-span-2 mt-6 mb-4">
      {/* Tab Navigation */}
      <nav className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-2" aria-label="Goodbody test categories">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "text-xs sm:text-sm md:text-base font-sans transition-all duration-200 pb-1",
              activeTab === tab
                ? "text-white font-bold border-b-2 border-brand-turquoise"
                : "text-white/50 hover:text-white/80"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Gallery */}
      <div className="flex items-start justify-center pt-1">
        <HoverExpand_001 images={getTestsForTab()} />
      </div>
    </div>
  );
};

export default GoodbodyTestGallery;
