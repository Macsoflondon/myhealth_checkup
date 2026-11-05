import {
  Heart,
  Baby,
  Users,
  Activity,
  Shield,
  FlaskConical,
  Droplet,
  Brain,
  TrendingUp,
  Sparkles,
  Scale,
  Sun,
  Dna,
  Zap,
  Target,
  Microscope,
  Stethoscope,
  Apple,
  Flame,
  LucideIcon,
} from "lucide-react";
import { getCategoryDisplayName } from "@/utils/categoryTaglines";

export interface CompareBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface CompareHeader {
  title: string;
  benefits: [CompareBenefit, CompareBenefit, CompareBenefit];
}

const MAP: Record<string, CompareHeader> = {
  "womens-health": {
    title: "Women's Health Blood Tests",
    benefits: [
      {
        icon: Heart,
        title: "Hormone Balance",
        description: "Early detection of women's health conditions",
      },
      {
        icon: Baby,
        title: "Fertility planning",
        description: "Comprehensive fertility and reproductive insights",
      },
      {
        icon: Users,
        title: "Lifelong wellness",
        description: "Monitor and optimise health through every life stage",
      },
    ],
  },
  "mens-health": {
    title: "Men's Health Blood Tests",
    benefits: [
      {
        icon: Activity,
        title: "Performance & energy",
        description: "Track testosterone, vitality and athletic markers",
      },
      {
        icon: Shield,
        title: "Prostate & risk",
        description: "PSA and key screening for early detection",
      },
      {
        icon: Heart,
        title: "Cardiovascular Health",
        description: "Monitor heart, cholesterol and metabolic markers",
      },
    ],
  },
  hormones: {
    title: "Hormone blood tests",
    benefits: [
      {
        icon: Scale,
        title: "Understand your balance",
        description: "Identify hormonal imbalances affecting mood and energy",
      },
      {
        icon: TrendingUp,
        title: "Track changes",
        description: "Monitor levels with age, lifestyle or treatment",
      },
      {
        icon: Sparkles,
        title: "Personalised insights",
        description: "Actionable recommendations from your hormone profile",
      },
    ],
  },
  thyroid: {
    title: "Thyroid blood tests",
    benefits: [
      {
        icon: Activity,
        title: "Full thyroid picture",
        description: "TSH, T3, T4 and antibodies in a single panel",
      },
      {
        icon: Zap,
        title: "Energy & metabolism",
        description: "Explain fatigue, weight or temperature changes",
      },
      {
        icon: TrendingUp,
        title: "Treatment tracking",
        description: "Monitor thyroid function and medication response",
      },
    ],
  },
  "general-health": {
    title: "General health blood tests",
    benefits: [
      {
        icon: Stethoscope,
        title: "Whole-body overview",
        description: "Liver, kidney, blood and metabolic markers in one test",
      },
      {
        icon: Shield,
        title: "Early detection",
        description: "Spot issues before symptoms develop",
      },
      {
        icon: TrendingUp,
        title: "Yearly baseline",
        description: "Build a year-on-year picture of your health",
      },
    ],
  },
  fertility: {
    title: "Fertility blood tests",
    benefits: [
      {
        icon: Baby,
        title: "Reproductive insight",
        description: "Key hormones for conception planning",
      },
      {
        icon: Dna,
        title: "Ovarian reserve",
        description: "AMH and related markers for egg reserve",
      },
      {
        icon: Target,
        title: "Inform next steps",
        description: "Decide on timing, treatment or specialist support",
      },
    ],
  },
  "heart-health": {
    title: "Heart health blood tests",
    benefits: [
      {
        icon: Heart,
        title: "Cardiac risk profile",
        description: "Cholesterol, lipids and inflammation markers",
      },
      {
        icon: Activity,
        title: "Early warning",
        description: "Detect issues before symptoms appear",
      },
      {
        icon: TrendingUp,
        title: "Track improvements",
        description: "Measure lifestyle and treatment impact",
      },
    ],
  },
  diabetes: {
    title: "Diabetes blood tests",
    benefits: [
      {
        icon: Droplet,
        title: "Blood sugar control",
        description: "HbA1c and glucose for diabetes screening",
      },
      {
        icon: Shield,
        title: "Prevention focus",
        description: "Catch prediabetes early",
      },
      {
        icon: TrendingUp,
        title: "Manage & monitor",
        description: "Track control and treatment response",
      },
    ],
  },
  vitamins: {
    title: "Vitamin & mineral blood tests",
    benefits: [
      {
        icon: Sun,
        title: "Spot deficiencies",
        description: "Vitamin D, B12, iron and more",
      },
      {
        icon: Apple,
        title: "Optimise nutrition",
        description: "Tailor diet and supplements to your levels",
      },
      {
        icon: Zap,
        title: "Restore energy",
        description: "Address fatigue and immunity gaps",
      },
    ],
  },
  "cancer-screening": {
    title: "Cancer screening blood tests",
    benefits: [
      {
        icon: Microscope,
        title: "Early detection",
        description: "Biomarker screening for common cancers",
      },
      {
        icon: Shield,
        title: "Peace of mind",
        description: "Proactive checks alongside NHS screening",
      },
      {
        icon: Target,
        title: "Targeted markers",
        description: "Specific tumour and risk markers",
      },
    ],
  },
  menopause: {
    title: "Menopause blood tests",
    benefits: [
      {
        icon: Sparkles,
        title: "Hormone clarity",
        description: "FSH, LH and oestrogen for menopausal status",
      },
      {
        icon: Flame,
        title: "Symptom insight",
        description: "Understand hot flushes, sleep and mood changes",
      },
      {
        icon: Target,
        title: "Confident decisions",
        description: "Inform HRT and lifestyle choices with data",
      },
    ],
  },
  "female-fertility": {
    title: "Female fertility blood tests",
    benefits: [
      {
        icon: Dna,
        title: "Ovarian reserve",
        description: "AMH and key reproductive hormones",
      },
      {
        icon: Baby,
        title: "Cycle health",
        description: "Understand ovulation and cycle hormones",
      },
      {
        icon: Target,
        title: "Conception planning",
        description: "Data to guide your fertility journey",
      },
    ],
  },
  "female-hormones": {
    title: "Female hormone blood tests",
    benefits: [
      {
        icon: Scale,
        title: "Hormone Balance",
        description: "Oestrogen, progesterone and testosterone insights",
      },
      {
        icon: Heart,
        title: "Mood & energy",
        description: "Link symptoms back to hormonal patterns",
      },
      {
        icon: TrendingUp,
        title: "Track over time",
        description: "Monitor cycles, perimenopause and treatment",
      },
    ],
  },
  pcos: {
    title: "PCOS blood tests",
    benefits: [
      {
        icon: Scale,
        title: "Hormonal profile",
        description: "Testosterone, LH/FSH ratio and key markers",
      },
      {
        icon: Droplet,
        title: "Insulin & metabolism",
        description: "Glucose and insulin resistance markers",
      },
      {
        icon: Target,
        title: "Manage symptoms",
        description: "Inform treatment and lifestyle changes",
      },
    ],
  },
  "male-hormones": {
    title: "Male hormone blood tests",
    benefits: [
      {
        icon: Activity,
        title: "Testosterone levels",
        description: "Total and free testosterone with key partners",
      },
      {
        icon: Zap,
        title: "Energy & drive",
        description: "Link mood, libido and performance to hormones",
      },
      {
        icon: TrendingUp,
        title: "Track & optimise",
        description: "Monitor TRT or lifestyle changes",
      },
    ],
  },
  "male-fertility": {
    title: "Male fertility blood tests",
    benefits: [
      {
        icon: Dna,
        title: "Reproductive Hormones",
        description: "Testosterone, FSH, LH and prolactin",
      },
      {
        icon: Microscope,
        title: "Sperm health context",
        description: "Markers that influence sperm quality",
      },
      {
        icon: Target,
        title: "Inform next steps",
        description: "Data to guide fertility planning",
      },
    ],
  },
  testosterone: {
    title: "Testosterone blood tests",
    benefits: [
      {
        icon: Activity,
        title: "Total & free",
        description: "Full testosterone picture with SHBG",
      },
      {
        icon: Zap,
        title: "Vitality markers",
        description: "Energy, mood and performance context",
      },
      {
        icon: TrendingUp,
        title: "TRT monitoring",
        description: "Track therapy safely over time",
      },
    ],
  },
  prostate: {
    title: "Prostate blood tests",
    benefits: [
      {
        icon: Shield,
        title: "PSA screening",
        description: "Early detection marker for prostate health",
      },
      {
        icon: Microscope,
        title: "Risk insight",
        description: "Context for family history and age",
      },
      {
        icon: Target,
        title: "Specialist referral",
        description: "Inform conversations with your GP",
      },
    ],
  },
  amh: {
    title: "AMH blood tests",
    benefits: [
      {
        icon: Dna,
        title: "Ovarian reserve",
        description: "Anti-Müllerian Hormone for egg reserve",
      },
      {
        icon: Baby,
        title: "Fertility planning",
        description: "Inform conception and IVF timing",
      },
      {
        icon: Target,
        title: "Personal baseline",
        description: "Track changes over time",
      },
    ],
  },
};

const FALLBACK_BENEFITS: [CompareBenefit, CompareBenefit, CompareBenefit] = [
  {
    icon: Shield,
    title: "Trusted providers",
    description: "UKAS-accredited labs and CQC-regulated clinics",
  },
  {
    icon: FlaskConical,
    title: "Transparent pricing",
    description: "Clear, side-by-side test comparisons",
  },
  {
    icon: Zap,
    title: "Typical fast results",
    description: "Most results returned in a few working days",
  },
];

export function getCompareHeader(slug?: string | null): CompareHeader {
  if (!slug || slug === "all") {
    return {
      title: "Compare private blood tests",
      benefits: FALLBACK_BENEFITS,
    };
  }
  const hit = MAP[slug];
  if (hit) return hit;
  const display = getCategoryDisplayName(slug);
  return {
    title: `${display} Blood Tests`,
    benefits: FALLBACK_BENEFITS,
  };
}
