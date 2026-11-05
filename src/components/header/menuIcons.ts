import {
  Star,
  Heart,
  UserCheck,
  User,
  Dumbbell,
  Baby,
  ShieldCheck,
  Home,
  Info,
  Phone,
  Users,
  Search,
  BarChart2,
  BookOpen,
  Library,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MENU_PINK = "#e70d69";
export const MENU_TURQUOISE = "#22c0d4";

export type MenuIconEntry = { Icon: LucideIcon; color: string };

/** Category pills (toolbar strip + drawer Test categories section). */
export const CATEGORY_MENU_ICONS: Record<string, MenuIconEntry> = {
  "Most popular tests": { Icon: Star, color: MENU_PINK },
  "General Wellness": { Icon: Heart, color: MENU_TURQUOISE },
  "Women's Health": { Icon: UserCheck, color: "#7C3AED" },
  "Men's Health": { Icon: User, color: "#3a5f85" },
  "Sports & Fitness": { Icon: Dumbbell, color: "#2563EB" },
  "Fertility - Prenatal": { Icon: Baby, color: "#C026D3" },
  "Cancer Screening": { Icon: ShieldCheck, color: "#0ea5e9" },
  "At Home Test Kits": { Icon: Home, color: "#C2410C" },
};

export type CanonicalCategoryName = keyof typeof CATEGORY_MENU_ICONS;

const CATEGORY_PARENT_ALIASES: Record<string, CanonicalCategoryName> = {
  "most-popular": "Most popular tests",
  "most-popular-tests": "Most popular tests",
  popular: "Most popular tests",
  "popular-tests": "Most popular tests",
  wellness: "General Wellness",
  "general-health": "General Wellness",
  "general-wellness": "General Wellness",
  hormones: "General Wellness",
  thyroid: "General Wellness",
  heart: "General Wellness",
  "heart-health": "General Wellness",
  cholesterol: "General Wellness",
  diabetes: "General Wellness",
  "iron-anaemia": "General Wellness",
  iron: "General Wellness",
  liver: "General Wellness",
  "liver-health": "General Wellness",
  kidney: "General Wellness",
  "kidney-health": "General Wellness",
  vitamins: "General Wellness",
  "vitamins-minerals": "General Wellness",
  allergy: "General Wellness",
  "allergy-testing": "General Wellness",
  gut: "General Wellness",
  "gut-health": "General Wellness",
  longevity: "General Wellness",
  "energy-fatigue": "General Wellness",
  "gp-monitoring": "General Wellness",
  antibody: "General Wellness",
  infection: "General Wellness",
  immunity: "General Wellness",
  autoimmunity: "General Wellness",
  "womens-health": "Women's Health",
  "womens-health-checks": "Women's Health",
  menopause: "Women's Health",
  pcos: "Women's Health",
  "female-hormones": "Women's Health",
  "female-hormone-tests": "Women's Health",
  "mens-health": "Men's Health",
  "mens-health-checks": "Men's Health",
  "male-hormones": "Men's Health",
  "male-hormone-tests": "Men's Health",
  testosterone: "Men's Health",
  prostate: "Men's Health",
  "sports-fitness": "Sports & Fitness",
  "sports-fitness-health": "Sports & Fitness",
  "sports-performance": "Sports & Fitness",
  "sports-performance-tests": "Sports & Fitness",
  fertility: "Fertility - Prenatal",
  "fertility-prenatal": "Fertility - Prenatal",
  "fertility-tests": "Fertility - Prenatal",
  "female-fertility": "Fertility - Prenatal",
  "female-fertility-tests": "Fertility - Prenatal",
  "male-fertility": "Fertility - Prenatal",
  "male-fertility-tests": "Fertility - Prenatal",
  amh: "Fertility - Prenatal",
  prenatal: "Fertility - Prenatal",
  "prenatal-paternity-tests": "Fertility - Prenatal",
  pregnancy: "Fertility - Prenatal",
  nipt: "Fertility - Prenatal",
  "nipt-tests": "Fertility - Prenatal",
  cancer: "Cancer Screening",
  "cancer-screening": "Cancer Screening",
  "cancer-screening-tests": "Cancer Screening",
  bowel: "Cancer Screening",
  cervical: "Cancer Screening",
  lung: "Cancer Screening",
  "at-home": "At Home Test Kits",
  "at-home-tests": "At Home Test Kits",
  "at-home-test-kits": "At Home Test Kits",
  "home-tests": "At Home Test Kits",
  "home-test-kits": "At Home Test Kits",
};

const categoryKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const resolveCategoryMenuName = (
  category?: string | null,
): CanonicalCategoryName => {
  if (!category) return "General Wellness";

  const exact = Object.keys(CATEGORY_MENU_ICONS).find(
    (name) => categoryKey(name) === categoryKey(category),
  );
  if (exact) return exact;

  return CATEGORY_PARENT_ALIASES[categoryKey(category)] ?? "General Wellness";
};

export const categoryMenuIconFor = (category?: string | null): MenuIconEntry =>
  CATEGORY_MENU_ICONS[resolveCategoryMenuName(category)];

/**
 * Text-safe (≥4.5:1 on white) variants for accents too light to use as text.
 * Icons, tints and borders keep the original CATEGORY_MENU_ICONS hex.
 */
const TEXT_SAFE_BY_HEX: Record<string, string> = {
  "#22c0d4": "#0e7490",
  "#0ea5e9": "#0369a1",
};

/** Map any accent hex to its text-safe variant (pass-through when already safe). */
export const textSafeAccent = (hex: string): string =>
  TEXT_SAFE_BY_HEX[hex.toLowerCase()] ?? hex;

/** Colour to use when rendering a category label as text in its accent. */
export const categoryTextColor = (category?: string | null): string =>
  textSafeAccent(categoryMenuIconFor(category).color);

/** Sections inside the More menu / mobile drawer (About, Services, …). */
export const MORE_SECTION_ICONS: Record<string, MenuIconEntry> = {
  "About us": { Icon: Info, color: MENU_TURQUOISE },
  "Frequently asked questions": { Icon: BookOpen, color: "#6366f1" },
  "Our providers": { Icon: Users, color: MENU_PINK },
  "Assisted test finder": { Icon: Search, color: "#16a34a" },
  "Compare tests": { Icon: BarChart2, color: "#f59e0b" },
  "Health Resources Hub": { Icon: BookOpen, color: "#0ea5e9" },
  "Complete biomarker reference library": { Icon: Library, color: "#8b5cf6" },
  "Contact us": { Icon: Phone, color: MENU_PINK },
};

/** Resolve an icon for any menu item name — categories first, then sections. */
export const menuIconFor = (name: string): MenuIconEntry =>
  CATEGORY_MENU_ICONS[name] ??
  MORE_SECTION_ICONS[name] ?? { Icon: Info, color: MENU_TURQUOISE };
