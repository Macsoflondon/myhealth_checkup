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
  { name: "General Wellness", path: "/wellness", hasDropdown: true, megaMenu: true },
  { name: "Women's Health", path: "/womens-health", hasDropdown: true, megaMenu: true },
  {
    name: "Men's Health",
    path: "/mens-health",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Men's Health Checks", path: "/mens-health" },
      { name: "Male Hormone Tests", path: "/mens-health?category=hormones" },
      { name: "Male Fertility Tests", path: "/mens-health?category=fertility" },
      { name: "Testosterone Tests", path: "/mens-health?category=testosterone" },
      { name: "Prostate Tests", path: "/mens-health?category=prostate" },
      { name: "View All Men's Tests", path: "/mens-health" },
    ],
  },
  { name: "Sports-Fitness Health", path: "/sports-performance", hasDropdown: true, megaMenu: true },
  { name: "Fertility - Prenatal", path: "/fertility-tests", hasDropdown: true, megaMenu: true },
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
