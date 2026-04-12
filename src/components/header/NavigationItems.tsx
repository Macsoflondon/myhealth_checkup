// Main navigation structure - primary items shown in toolbar
// NOTE: This file now exports data only. The actual NavigationMenu component is in NavigationMenu.tsx
export const primaryNavigationItems = [
  { name: "Most Popular Tests", path: "/popular-tests", hasDropdown: false, megaMenu: false },
  { name: "General Wellness", path: "/wellness", hasDropdown: true, megaMenu: true },
  { name: "Women's Health", path: "/womens-health", hasDropdown: true, megaMenu: true },
  { name: "Men's Health", path: "/mens-health", hasDropdown: true, megaMenu: true },
  { name: "Sports-Fitness Health", path: "/sports-performance", hasDropdown: true, megaMenu: true },
  { name: "Fertility", path: "/fertility-tests", hasDropdown: true, megaMenu: true },
  { name: "Cancer Screening", path: "/tests/cancer", hasDropdown: true, megaMenu: true },
  { name: "At Home Tests", path: "/at-home-tests", hasDropdown: true, megaMenu: true },
  { name: "How It Works", path: "/how-it-works" }
];

// Additional pages for the MORE dropdown - organized by user needs
export const moreNavigationSections = [
  {
    title: "About",
    items: [
      { name: "About Us", path: "/about" },
      { name: "How It Works", path: "/how-it-works" },
      { name: "Frequently Asked Questions", path: "/faqs" }
    ]
  },
  {
    title: "Services",
    items: [
      { name: "Our Providers", path: "/providers" },
      { name: "Clinic Locations", path: "/locations" },
      { name: "Find a Clinic", path: "/find-clinic" },
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
