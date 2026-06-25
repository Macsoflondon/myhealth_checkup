// Main navigation structure - primary items shown in toolbar
// NOTE: This file now exports data only. The actual NavigationMenu component is in NavigationMenu.tsx
export interface PrimaryNavItem {
  name: string;
  path: string;
  hasDropdown?: boolean;
  megaMenu?: boolean;
  dropdownItems?: Array<{ name: string; path: string }>;
}

export const primaryNavigationItems: PrimaryNavItem[] = [
  { name: "Most Popular Tests", path: "/popular-tests", hasDropdown: false, megaMenu: false },
  {
    name: "General Wellness",
    path: "/wellness",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "General Health Checks", path: "/wellness" },
      { name: "Heart Health Tests", path: "/compare?category=heart-health" },
      { name: "Cholesterol Tests", path: "/compare?category=heart-health" },
      { name: "Diabetes Tests", path: "/compare?category=diabetes" },
      { name: "Iron & Anaemia Tests", path: "/compare?category=blood-tests" },
      { name: "Liver Health Tests", path: "/compare?category=liver" },
      { name: "Kidney Tests", path: "/compare?category=kidney-health" },
      { name: "Vitamin & Nutrition Tests", path: "/compare?category=vitamins" },
      { name: "Allergy Tests", path: "/compare?category=allergy-testing" },
      { name: "Thyroid Tests", path: "/compare?category=thyroid" },
      { name: "View All Wellness Tests", path: "/wellness" },
    ],
  },
  {
    name: "Women's Health",
    path: "/womens-health",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Women's Health Checks", path: "/womens-health" },
      { name: "Female Hormone Tests", path: "/compare?category=female-hormones" },
      { name: "Female Fertility Tests", path: "/compare?category=female-fertility" },
      { name: "Menopause Tests", path: "/compare?category=menopause" },
      { name: "PCOS Tests", path: "/compare?category=pcos" },
      { name: "Thyroid Tests", path: "/compare?category=thyroid" },
      { name: "View All Women's Tests", path: "/womens-health" },
    ],
  },
  {
    name: "Men's Health",
    path: "/mens-health",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Men's Health Checks", path: "/mens-health" },
      { name: "Male Hormone Tests", path: "/compare?category=male-hormones" },
      { name: "Male Fertility Tests", path: "/compare?category=male-fertility" },
      { name: "Testosterone Tests", path: "/compare?category=testosterone" },
      { name: "Prostate Tests", path: "/compare?category=prostate" },
      { name: "View All Men's Tests", path: "/mens-health" },
    ],
  },
  {
    name: "Sports-Fitness Health",
    path: "/sports-performance",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Sports Performance Tests", path: "/sports-performance" },
      { name: "Sports Hormone Tests", path: "/compare?category=hormones" },
      { name: "Testosterone Tests", path: "/compare?category=testosterone" },
      { name: "Energy & Fatigue Tests", path: "/compare?category=general-health" },
      { name: "View All Sports Tests", path: "/sports-performance" },
    ],
  },
  {
    name: "Fertility - Prenatal",
    path: "/fertility-tests",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Fertility Tests", path: "/fertility-tests" },
      { name: "Female Fertility Tests", path: "/compare?category=female-fertility" },
      { name: "Male Fertility Tests", path: "/compare?category=male-fertility" },
      { name: "AMH Fertility Test", path: "/compare?category=amh" },
      { name: "Prenatal / NIPT Tests", path: "/fertility-tests" },
      { name: "Pregnancy Tests", path: "/fertility-tests" },
      { name: "View All Fertility Tests", path: "/fertility-tests" },
    ],
  },
  {
    name: "Cancer Screening",
    path: "/tests/cancer",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Cancer Screening Tests", path: "/tests/cancer" },
      { name: "Bowel Cancer Screening", path: "/tests/cancer?category=bowel" },
      { name: "Prostate Cancer PSA", path: "/tests/cancer?category=prostate" },
      { name: "Cervical Cancer HPV", path: "/tests/cancer?category=cervical" },
      { name: "Lung Cancer Screening", path: "/tests/cancer?category=lung" },
      { name: "View All Cancer Tests", path: "/tests/cancer" },
    ],
  },
  {
    name: "At Home Tests",
    path: "/at-home-tests",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "All At-Home Tests", path: "/at-home-tests" },
      { name: "Women's Home Tests", path: "/at-home-tests?category=womens" },
      { name: "Men's Home Tests", path: "/at-home-tests?category=mens" },
      { name: "General Health Home Tests", path: "/at-home-tests?category=general" },
      { name: "Allergy Home Tests", path: "/at-home-tests?category=allergy" },
      { name: "View All Home Tests", path: "/at-home-tests" },
    ],
  },
  { name: "How It Works", path: "/how-it-works" }
];

// Additional pages for the MORE dropdown - organized by user needs
export const moreNavigationSections = [
  {
    title: "About",
    items: [
      { name: "About Us", path: "/about" },
      { name: "Frequently Asked Questions", path: "/faqs" }
    ]

  },
  {
    title: "Services",
    items: [
      { name: "Our Providers", path: "/providers" },
      { name: "Assisted Test Finder", path: "/assisted-test-finder" }
    ]
  },
  {
    title: "Compare",
    items: [
      { name: "Compare Tests", path: "/compare" }
    ]
  },
  {
    title: "Resources",
    items: [
      { name: "Health Resources Hub", path: "/health-blog" },
      { name: "Biomarker Library", path: "/biomarker-database" }
    ]
  },
  {
    title: "Contact",
    items: [
      { name: "Contact Us", path: "/contact" }
    ]
  }
];

// Flattened list for backwards compatibility
export const moreNavigationItems = moreNavigationSections.flatMap(section => section.items);

export const navigationItems = primaryNavigationItems;

// Re-export the new NavigationMenu component for backwards compatibility
export { NavigationMenu as NavigationItems } from "./NavigationMenu";
