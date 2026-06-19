import {
  Heart, Baby, Users, Activity, Shield, FlaskConical, Droplet, Brain,
  TrendingUp, Sparkles, Scale, Sun, Dna, Zap, Target, Microscope,
  Stethoscope, Apple, Flame, LucideIcon,
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
      { icon: Heart, title: "Hormone Balance", description: "Early detection of women's health conditions" },
      { icon: Baby, title: "Fertility Planning", description: "Comprehensive fertility and reproductive insights" },
      { icon: Users, title: "Lifelong Wellness", description: "Monitor and optimise health through every life stage" },
    ],
  },
  "mens-health": {
    title: "Men's Health Blood Tests",
    benefits: [
      { icon: Activity, title: "Performance & Energy", description: "Track testosterone, vitality and athletic markers" },
      { icon: Shield, title: "Prostate & Risk", description: "PSA and key screening for early detection" },
      { icon: Heart, title: "Cardiovascular Health", description: "Monitor heart, cholesterol and metabolic markers" },
    ],
  },
  hormones: {
    title: "Hormone Blood Tests",
    benefits: [
      { icon: Scale, title: "Understand Your Balance", description: "Identify hormonal imbalances affecting mood and energy" },
      { icon: TrendingUp, title: "Track Changes", description: "Monitor levels with age, lifestyle or treatment" },
      { icon: Sparkles, title: "Personalised Insights", description: "Actionable recommendations from your hormone profile" },
    ],
  },
  thyroid: {
    title: "Thyroid Blood Tests",
    benefits: [
      { icon: Activity, title: "Full Thyroid Picture", description: "TSH, T3, T4 and antibodies in a single panel" },
      { icon: Zap, title: "Energy & Metabolism", description: "Explain fatigue, weight or temperature changes" },
      { icon: TrendingUp, title: "Treatment Tracking", description: "Monitor thyroid function and medication response" },
    ],
  },
  "general-health": {
    title: "General Health Blood Tests",
    benefits: [
      { icon: Stethoscope, title: "Whole-Body Overview", description: "Liver, kidney, blood and metabolic markers in one test" },
      { icon: Shield, title: "Early Detection", description: "Spot issues before symptoms develop" },
      { icon: TrendingUp, title: "Yearly Baseline", description: "Build a year-on-year picture of your health" },
    ],
  },
  fertility: {
    title: "Fertility Blood Tests",
    benefits: [
      { icon: Baby, title: "Reproductive Insight", description: "Key hormones for conception planning" },
      { icon: Dna, title: "Ovarian Reserve", description: "AMH and related markers for egg reserve" },
      { icon: Target, title: "Inform Next Steps", description: "Decide on timing, treatment or specialist support" },
    ],
  },
  "heart-health": {
    title: "Heart Health Blood Tests",
    benefits: [
      { icon: Heart, title: "Cardiac Risk Profile", description: "Cholesterol, lipids and inflammation markers" },
      { icon: Activity, title: "Early Warning", description: "Detect issues before symptoms appear" },
      { icon: TrendingUp, title: "Track Improvements", description: "Measure lifestyle and treatment impact" },
    ],
  },
  diabetes: {
    title: "Diabetes Blood Tests",
    benefits: [
      { icon: Droplet, title: "Blood Sugar Control", description: "HbA1c and glucose for diabetes screening" },
      { icon: Shield, title: "Prevention Focus", description: "Catch prediabetes early" },
      { icon: TrendingUp, title: "Manage & Monitor", description: "Track control and treatment response" },
    ],
  },
  vitamins: {
    title: "Vitamin & Mineral Blood Tests",
    benefits: [
      { icon: Sun, title: "Spot Deficiencies", description: "Vitamin D, B12, iron and more" },
      { icon: Apple, title: "Optimise Nutrition", description: "Tailor diet and supplements to your levels" },
      { icon: Zap, title: "Restore Energy", description: "Address fatigue and immunity gaps" },
    ],
  },
  "cancer-screening": {
    title: "Cancer Screening Blood Tests",
    benefits: [
      { icon: Microscope, title: "Early Detection", description: "Biomarker screening for common cancers" },
      { icon: Shield, title: "Peace of Mind", description: "Proactive checks alongside NHS screening" },
      { icon: Target, title: "Targeted Markers", description: "Specific tumour and risk markers" },
    ],
  },
  menopause: {
    title: "Menopause Blood Tests",
    benefits: [
      { icon: Sparkles, title: "Hormone Clarity", description: "FSH, LH and oestrogen for menopausal status" },
      { icon: Flame, title: "Symptom Insight", description: "Understand hot flushes, sleep and mood changes" },
      { icon: Target, title: "Confident Decisions", description: "Inform HRT and lifestyle choices with data" },
    ],
  },
  "female-fertility": {
    title: "Female Fertility Blood Tests",
    benefits: [
      { icon: Dna, title: "Ovarian Reserve", description: "AMH and key reproductive hormones" },
      { icon: Baby, title: "Cycle Health", description: "Understand ovulation and cycle hormones" },
      { icon: Target, title: "Conception Planning", description: "Data to guide your fertility journey" },
    ],
  },
  "female-hormones": {
    title: "Female Hormone Blood Tests",
    benefits: [
      { icon: Scale, title: "Hormone Balance", description: "Oestrogen, progesterone and testosterone insights" },
      { icon: Heart, title: "Mood & Energy", description: "Link symptoms back to hormonal patterns" },
      { icon: TrendingUp, title: "Track Over Time", description: "Monitor cycles, perimenopause and treatment" },
    ],
  },
  pcos: {
    title: "PCOS Blood Tests",
    benefits: [
      { icon: Scale, title: "Hormonal Profile", description: "Testosterone, LH/FSH ratio and key markers" },
      { icon: Droplet, title: "Insulin & Metabolism", description: "Glucose and insulin resistance markers" },
      { icon: Target, title: "Manage Symptoms", description: "Inform treatment and lifestyle changes" },
    ],
  },
  "male-hormones": {
    title: "Male Hormone Blood Tests",
    benefits: [
      { icon: Activity, title: "Testosterone Levels", description: "Total and free testosterone with key partners" },
      { icon: Zap, title: "Energy & Drive", description: "Link mood, libido and performance to hormones" },
      { icon: TrendingUp, title: "Track & Optimise", description: "Monitor TRT or lifestyle changes" },
    ],
  },
  "male-fertility": {
    title: "Male Fertility Blood Tests",
    benefits: [
      { icon: Dna, title: "Reproductive Hormones", description: "Testosterone, FSH, LH and prolactin" },
      { icon: Microscope, title: "Sperm Health Context", description: "Markers that influence sperm quality" },
      { icon: Target, title: "Inform Next Steps", description: "Data to guide fertility planning" },
    ],
  },
  testosterone: {
    title: "Testosterone Blood Tests",
    benefits: [
      { icon: Activity, title: "Total & Free", description: "Full testosterone picture with SHBG" },
      { icon: Zap, title: "Vitality Markers", description: "Energy, mood and performance context" },
      { icon: TrendingUp, title: "TRT Monitoring", description: "Track therapy safely over time" },
    ],
  },
  prostate: {
    title: "Prostate Blood Tests",
    benefits: [
      { icon: Shield, title: "PSA Screening", description: "Early detection marker for prostate health" },
      { icon: Microscope, title: "Risk Insight", description: "Context for family history and age" },
      { icon: Target, title: "Specialist Referral", description: "Inform conversations with your GP" },
    ],
  },
  amh: {
    title: "AMH Blood Tests",
    benefits: [
      { icon: Dna, title: "Ovarian Reserve", description: "Anti-Müllerian Hormone for egg reserve" },
      { icon: Baby, title: "Fertility Planning", description: "Inform conception and IVF timing" },
      { icon: Target, title: "Personal Baseline", description: "Track changes over time" },
    ],
  },
};

const FALLBACK_BENEFITS: [CompareBenefit, CompareBenefit, CompareBenefit] = [
  { icon: Shield, title: "Trusted Providers", description: "UKAS-accredited labs and CQC-regulated clinics" },
  { icon: FlaskConical, title: "Transparent Pricing", description: "Clear, side-by-side test comparisons" },
  { icon: Zap, title: "Typical Fast Results", description: "Most results returned in a few working days" },
];

export function getCompareHeader(slug?: string | null): CompareHeader {
  if (!slug || slug === "all") {
    return { title: "Compare Private Blood Tests", benefits: FALLBACK_BENEFITS };
  }
  const hit = MAP[slug];
  if (hit) return hit;
  const display = getCategoryDisplayName(slug);
  return {
    title: `${display} Blood Tests`,
    benefits: FALLBACK_BENEFITS,
  };
}
