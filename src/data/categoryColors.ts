// Unified color system for test categories across all providers
// This ensures consistent colors for each category across the entire platform

export interface CategoryColor {
  id: string;
  name: string;
  primary: string;
  light: string;
  text: string;
  icon: string;
  border: string;
  pinColor: string;
}

export const HormonesCategoryColor: CategoryColor = {
  id: 'hormones',
  name: 'Hormones',
  primary: '#FFFFFF',          // Card background
  light: '#F8FAFC',            // Hover or subtle highlight background
  text: '#111827',             // Main text on light backgrounds
  icon: '#1A1B34',             // Icons, CTA outline, header stripe
  border: '#E5E7EB',           // Card border and dividers
  pinColor: '#1A1B34'         // Map pin
};

export const categoryColors: CategoryColor[] = [
  {
    id: "heart-health",
    name: "Heart Health / Cardiac",
    primary: "bg-red-600",
    light: "bg-red-100",
    text: "text-red-600", 
    icon: "text-white",
    border: "border-red-200",
    pinColor: "#dc2626" // red-600
  },
  {
    id: "cancer-screening", 
    name: "Cancer Screening",
    primary: "bg-purple-600",
    light: "bg-purple-100", 
    text: "text-purple-600",
    icon: "text-white",
    border: "border-purple-200",
    pinColor: "#9333ea" // purple-600
  },
  {
    id: "hormones",
    name: "Hormone Health",
    primary: "bg-indigo-600",
    light: "bg-indigo-100",
    text: "text-indigo-600", 
    icon: "text-white",
    border: "border-indigo-200",
    pinColor: "#4f46e5" // indigo-600
  },
  {
    id: "mens-health",
    name: "Men's Health", 
    primary: "bg-blue-600",
    light: "bg-blue-100",
    text: "text-blue-600",
    icon: "text-white", 
    border: "border-blue-200",
    pinColor: "#2563eb" // blue-600
  },
  {
    id: "womens-health",
    name: "Women's Health & Fertility",
    primary: "bg-pink-600",
    light: "bg-pink-100",
    text: "text-pink-600",
    icon: "text-white",
    border: "border-pink-200", 
    pinColor: "#db2777" // pink-600
  },
  {
    id: "diabetes",
    name: "Diabetes & Blood Sugar",
    primary: "bg-orange-600", 
    light: "bg-orange-100",
    text: "text-orange-600",
    icon: "text-white",
    border: "border-orange-200",
    pinColor: "#ea580c" // orange-600
  },
  {
    id: "vitamins",
    name: "Vitamin & Nutrition Testing",
    primary: "bg-green-600",
    light: "bg-green-100", 
    text: "text-green-600",
    icon: "text-white",
    border: "border-green-200",
    pinColor: "#16a34a" // green-600
  },
  {
    id: "blood-tests", 
    name: "Comprehensive Blood Panels",
    primary: "bg-yellow-500",
    light: "bg-teal-100",
    text: "text-teal-600",
    icon: "text-white",
    border: "border-teal-200",
    pinColor: "#0d9488" // teal-600
  },
  {
    id: "thyroid",
    name: "Thyroid Tests",
    primary: "bg-cyan-600",
    light: "bg-cyan-100", 
    text: "text-cyan-600",
    icon: "text-white",
    border: "border-cyan-200",
    pinColor: "#0891b2" // cyan-600
  },
  {
    id: "liver-health",
    name: "Liver Health",
    primary: "bg-amber-600",
    light: "bg-amber-100",
    text: "text-amber-600", 
    icon: "text-white",
    border: "border-amber-200",
    pinColor: "#d97706" // amber-600
  },
  {
    id: "kidney-health",
    name: "Kidney Health", 
    primary: "bg-lime-600",
    light: "bg-lime-100",
    text: "text-lime-600",
    icon: "text-white",
    border: "border-lime-200",
    pinColor: "#65a30d" // lime-600
  },
  {
    id: "fertility",
    name: "Fertility Testing",
    primary: "bg-rose-600",
    light: "bg-rose-100",
    text: "text-rose-600",
    icon: "text-white", 
    border: "border-rose-200",
    pinColor: "#e11d48" // rose-600
  },
  {
    id: "allergy-testing",
    name: "Allergy Testing",
    primary: "bg-yellow-600",
    light: "bg-yellow-100",
    text: "text-yellow-600",
    icon: "text-white",
    border: "border-yellow-200", 
    pinColor: "#ca8a04" // yellow-600
  },
  {
    id: "general-health",
    name: "General Health",
    primary: "bg-slate-600", 
    light: "bg-slate-100",
    text: "text-slate-600",
    icon: "text-white",
    border: "border-slate-200",
    pinColor: "#475569" // slate-600
  },
  {
    id: "sexual-health",
    name: "Sexual Health",
    primary: "bg-emerald-600",
    light: "bg-emerald-100",
    text: "text-emerald-600",
    icon: "text-white",
    border: "border-emerald-200",
    pinColor: "#059669" // emerald-600
  }
];

// Helper functions to get colors by category ID
export const getCategoryColor = (categoryId: string): CategoryColor | null => {
  return categoryColors.find(color => color.id === categoryId) || null;
};

export const getCategoryPinColor = (categoryId: string): string => {
  const color = getCategoryColor(categoryId);
  return color ? color.pinColor : "#6b7280"; // default gray-500
};

export const getCategoryCSSClasses = (categoryId: string) => {
  const color = getCategoryColor(categoryId);
  if (!color) {
    return {
      primary: "bg-gray-600",
      light: "bg-gray-100", 
      text: "text-gray-600",
      icon: "text-white",
      border: "border-gray-200"
    };
  }
  
  return {
    primary: color.primary,
    light: color.light,
    text: color.text, 
    icon: color.icon,
    border: color.border
  };
};

// Export for dropdown menu usage
export const getCategoryDropdownStyle = (categoryId: string) => {
  const color = getCategoryColor(categoryId);
  if (!color) return { backgroundColor: "#6b7280" }; // gray-500
  
  return {
    backgroundColor: color.pinColor
  };
};