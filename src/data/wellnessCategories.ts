import { Heart, Droplet, Activity, Zap, Apple, Bug, Users, Stethoscope, Shield, TestTube2, HeartPulse, Flame } from "lucide-react";

export interface WellnessCategory {
  id: string;
  name: string;
  colorClass: string;
  colorHex: string;
  icon: any;
  description: string;
  testCount: number;
  tests: string[];
}

export const wellnessCategories: WellnessCategory[] = [
  {
    id: "longevity-tests",
    name: "Longevity Tests",
    colorClass: "bg-emerald-500",
    colorHex: "#10B981",
    icon: HeartPulse,
    description: "Comprehensive health markers for longevity and preventive care",
    testCount: 3,
    tests: ["Full Blood Count Test", "Cardiac Risk Blood Test", "Thyroid Blood Test"]
  },
  {
    id: "iron-tests",
    name: "Iron Tests",
    colorClass: "bg-[#FA6980]",
    colorHex: "#FA6980",
    icon: Droplet,
    description: "Iron levels, ferritin, and anaemia screening",
    testCount: 2,
    tests: ["Anaemia Blood Test", "Full Blood Count Test"]
  },
  {
    id: "heart-health",
    name: "Heart Health Tests",
    colorClass: "bg-red-600",
    colorHex: "#DC2626",
    icon: Heart,
    description: "Cardiovascular risk assessment and heart health monitoring",
    testCount: 2,
    tests: ["Cardiac Risk Blood Test", "Full Blood Count Test"]
  },
  {
    id: "energy-tests",
    name: "Energy Tests",
    colorClass: "bg-amber-500",
    colorHex: "#F59E0B",
    icon: Zap,
    description: "Fatigue, tiredness, and energy level testing",
    testCount: 3,
    tests: ["Tiredness Blood Test", "Thyroid Blood Test", "Anaemia Blood Test"]
  },
  {
    id: "nutrition-tests",
    name: "Nutrition Tests",
    colorClass: "bg-lime-500",
    colorHex: "#84CC16",
    icon: Apple,
    description: "Vitamin levels and nutritional deficiency screening",
    testCount: 2,
    tests: ["Anaemia Blood Test", "Tiredness Blood Test"]
  },
  {
    id: "allergy-testing",
    name: "Allergy Tests",
    colorClass: "bg-orange-500",
    colorHex: "#F97316",
    icon: Shield,
    description: "Allergy screening and immune response testing",
    testCount: 1,
    tests: ["Full Blood Count Test"]
  },
  {
    id: "sexual-health",
    name: "Sexual Health Tests",
    colorClass: "bg-purple-500",
    colorHex: "#A855F7",
    icon: Users,
    description: "Comprehensive sexual health and hormone screening",
    testCount: 2,
    tests: ["Hepatitis Screening Blood Test", "Blood Group Blood Test"]
  },
  {
    id: "gp-monitoring",
    name: "GP Monitoring Tests",
    colorClass: "bg-[#22C0D4]",
    colorHex: "#22C0D4",
    icon: Stethoscope,
    description: "Routine health checks and general practitioner monitoring",
    testCount: 4,
    tests: ["Full Blood Count Test", "Thyroid Blood Test", "Liver Blood Test", "Kidney Blood Test"]
  },
  {
    id: "antibody-tests",
    name: "Antibody Tests",
    colorClass: "bg-pink-500",
    colorHex: "#EC4899",
    icon: TestTube2,
    description: "Antibody screening and autoimmune disease detection",
    testCount: 2,
    tests: ["Thyroid Function with Antibodies Test", "Autoimmune Disease Blood Test"]
  },
  {
    id: "infection-tests",
    name: "Infection Tests",
    colorClass: "bg-blue-400",
    colorHex: "#60A5FA",
    icon: Bug,
    description: "Infectious disease screening and pathogen detection",
    testCount: 2,
    tests: ["Hepatitis Screening Blood Test", "Helicobacter Pylori Blood Test"]
  },
  {
    id: "immunity-tests",
    name: "Immunity Tests",
    colorClass: "bg-yellow-500",
    colorHex: "#EAB308",
    icon: Shield,
    description: "Immune system function and defense assessment",
    testCount: 2,
    tests: ["Full Blood Count Test", "Autoimmune Disease Blood Test"]
  },
  {
    id: "autoimmunity-tests",
    name: "Autoimmunity Tests",
    colorClass: "bg-pink-600",
    colorHex: "#DB2777",
    icon: Flame,
    description: "Autoimmune condition screening and monitoring",
    testCount: 2,
    tests: ["Autoimmune Disease Blood Test", "Thyroid Function with Antibodies Test"]
  },
  {
    id: "liver-health",
    name: "Liver Health",
    colorClass: "bg-rose-500",
    colorHex: "#F43F5E",
    icon: Heart,
    description: "Liver function testing and hepatic health monitoring",
    testCount: 2,
    tests: ["Hepatitis Screening Blood Test", "Liver Blood Test"]
  },
  {
    id: "kidney-health",
    name: "Kidney Health",
    colorClass: "bg-cyan-500",
    colorHex: "#06B6D4",
    icon: Droplet,
    description: "Kidney function assessment and renal health screening",
    testCount: 1,
    tests: ["Kidney Blood Test"]
  }
];
