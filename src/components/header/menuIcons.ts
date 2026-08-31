import { Star, Heart, UserCheck, User, Dumbbell, Baby, ShieldCheck, Home, Info, Phone, Users, Search, BarChart2, BookOpen, Library } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MENU_PINK = "#e70d69";
export const MENU_TURQUOISE = "#22c0d4";

export type MenuIconEntry = { Icon: LucideIcon; color: string };

/** Category pills (toolbar strip + drawer Test Categories section). */
export const CATEGORY_MENU_ICONS: Record<string, MenuIconEntry> = {
  "Most Popular Tests": { Icon: Star, color: MENU_PINK },
  "General Wellness": { Icon: Heart, color: MENU_TURQUOISE },
  "Women's Health": { Icon: UserCheck, color: MENU_PINK },
  "Men's Health": { Icon: User, color: "#3a5f85" },
  "Sports & Fitness": { Icon: Dumbbell, color: "#16a34a" },
  "Fertility - Prenatal": { Icon: Baby, color: "#e70d69" },
  "Cancer Screening": { Icon: ShieldCheck, color: "#0ea5e9" },
  "At Home Test Kits": { Icon: Home, color: "#f59e0b" },
};

/** Sections inside the More menu / mobile drawer (About, Services, …). */
export const MORE_SECTION_ICONS: Record<string, MenuIconEntry> = {
  "About Us": { Icon: Info, color: MENU_TURQUOISE },
  "Frequently Asked Questions": { Icon: BookOpen, color: "#6366f1" },
  "Our Providers": { Icon: Users, color: MENU_PINK },
  "Assisted Test Finder": { Icon: Search, color: "#16a34a" },
  "Compare Tests": { Icon: BarChart2, color: "#f59e0b" },
  "Health Resources Hub": { Icon: BookOpen, color: "#0ea5e9" },
  "Complete Biomarker Reference Library": { Icon: Library, color: "#8b5cf6" },
  "Contact Us": { Icon: Phone, color: MENU_PINK },
};

/** Resolve an icon for any menu item name — categories first, then sections. */
export const menuIconFor = (name: string): MenuIconEntry =>
  CATEGORY_MENU_ICONS[name] ?? MORE_SECTION_ICONS[name] ?? { Icon: Info, color: MENU_TURQUOISE };
