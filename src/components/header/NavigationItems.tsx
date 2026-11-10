export interface NavDropdownItem {
  name: string;
  path: string;
}

export interface PrimaryNavItem {
  name: string;
  path: string;
  hasDropdown: boolean;
  megaMenu?: boolean;
  dropdownItems?: NavDropdownItem[];
}

export const primaryNavigationItems: PrimaryNavItem[] = [
  {
    name: "Most popular tests",
    path: "/popular-tests",
    hasDropdown: false,
    megaMenu: false,
  },
  {
    name: "General Wellness",
    path: "/wellness",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "General health tests", path: "/wellness" },
      {
        name: "Heart health tests",
        path: "/wellness?subcategory=heart-health",
      },
      { name: "Cholesterol tests", path: "/wellness?subcategory=cholesterol" },
      { name: "Diabetes tests", path: "/wellness?subcategory=diabetes" },
      {
        name: "Iron and anaemia tests",
        path: "/wellness?subcategory=iron-anaemia",
      },
      { name: "Liver tests", path: "/wellness?subcategory=liver" },
      { name: "Kidney tests", path: "/wellness?subcategory=kidney" },
      {
        name: "Vitamins and nutrition tests",
        path: "/wellness?subcategory=vitamins",
      },
      { name: "Allergy tests", path: "/wellness?subcategory=allergy" },
      { name: "Thyroid tests", path: "/wellness?subcategory=thyroid" },
      { name: "View all wellness tests", path: "/wellness" },
    ],
  },
  {
    name: "Women's Health",
    path: "/tests/womens-health",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Women's health checks", path: "/tests/womens-health" },
      {
        name: "Female hormone tests",
        path: "/tests/womens-health?subcategory=hormones",
      },
      {
        name: "Female fertility tests",
        path: "/tests/womens-health?subcategory=fertility",
      },
      { name: "Menopause tests", path: "/tests/womens-health?subcategory=menopause" },
      { name: "PCOS tests", path: "/tests/womens-health?subcategory=pcos" },
      { name: "Thyroid tests", path: "/tests/womens-health?subcategory=thyroid" },
      { name: "View all women's tests", path: "/tests/womens-health" },
    ],
  },
  {
    name: "Men's Health",
    path: "/tests/mens-health",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Men's health checks", path: "/tests/mens-health" },
      { name: "Male hormone tests", path: "/tests/mens-health?subcategory=hormones" },
      {
        name: "Male fertility tests",
        path: "/tests/mens-health?subcategory=fertility",
      },
      {
        name: "Testosterone tests",
        path: "/tests/mens-health?subcategory=testosterone",
      },
      { name: "Prostate tests", path: "/tests/mens-health?subcategory=prostate" },
      { name: "View all men's tests", path: "/tests/mens-health" },
    ],
  },
  {
    name: "Sports & Fitness",
    path: "/sports-performance",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Sports performance tests", path: "/sports-performance" },
      {
        name: "Sports hormone tests",
        path: "/sports-performance?subcategory=hormones",
      },
      {
        name: "Testosterone tests",
        path: "/sports-performance?subcategory=testosterone",
      },
      {
        name: "Energy & fatigue tests",
        path: "/sports-performance?subcategory=energy",
      },
      { name: "Running tests", path: "/sports-performance?subcategory=running" },
      { name: "Cycling tests", path: "/sports-performance?subcategory=cycling" },
      { name: "Triathlon tests", path: "/sports-performance?subcategory=triathlon" },
      {
        name: "Strength & weightlifting tests",
        path: "/sports-performance?subcategory=strength",
      },
      { name: "View all sports tests", path: "/sports-performance" },
    ],
  },
  {
    name: "Fertility - Prenatal",
    path: "/fertility-tests",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Fertility tests", path: "/fertility-tests" },
      {
        name: "Female fertility tests",
        path: "/fertility-tests?subcategory=female-fertility",
      },
      {
        name: "Male fertility tests",
        path: "/fertility-tests?subcategory=male-fertility",
      },
      { name: "AMH fertility test", path: "/fertility-tests?subcategory=amh" },
      {
        name: "Prenatal / NIPT tests",
        path: "/fertility-tests?subcategory=prenatal",
      },
      {
        name: "Pregnancy tests",
        path: "/fertility-tests?subcategory=pregnancy",
      },
      { name: "View all fertility tests", path: "/fertility-tests" },
    ],
  },
  {
    name: "Cancer Screening",
    path: "/tests/cancer",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "Cancer screening tests", path: "/tests/cancer" },
      {
        name: "Bowel cancer screening",
        path: "/tests/cancer?subcategory=bowel",
      },
      {
        name: "Prostate cancer PSA",
        path: "/tests/cancer?subcategory=prostate",
      },
      {
        name: "Cervical cancer HPV",
        path: "/tests/cancer?subcategory=cervical",
      },
      { name: "Lung cancer screening", path: "/tests/cancer?subcategory=lung" },
      { name: "View all cancer tests", path: "/tests/cancer" },
    ],
  },
  {
    name: "At Home Test Kits",
    path: "/at-home-tests",
    hasDropdown: true,
    megaMenu: true,
    dropdownItems: [
      { name: "All at-home tests", path: "/at-home-tests" },
      { name: "Women's health at-home test kits", path: "/at-home-tests?subcategory=womens" },
      { name: "Men's health at-home test kits", path: "/at-home-tests?subcategory=mens" },
      {
        name: "General health at-home test kits",
        path: "/at-home-tests?subcategory=general",
      },
      {
        name: "Allergy home tests",
        path: "/at-home-tests?subcategory=allergy",
      },
      { name: "View all home tests", path: "/at-home-tests" },
    ],
  },
  { name: "How it works", path: "/how-it-works", hasDropdown: false },
];

export const moreNavigationSections = [
  {
    title: "About",
    items: [
      { name: "About us", path: "/about" },
      { name: "Frequently asked questions", path: "/faqs" },
      { name: "Reviews", path: "/reviews" },
    ],
  },
  {
    title: "Services",
    items: [
      { name: "Our providers", path: "/trusted-providers" },
      { name: "Assisted test finder", path: "/assisted-test-finder" },
    ],
  },
  {
    title: "Compare",
    items: [
      { name: "Compare tests", path: "/compare" },
      { name: "Compare providers", path: "/providers/compare" },
      { name: "Compare by goal", path: "/compare/goals" },
      { name: "Compare by symptom", path: "/compare/symptoms" },
    ],
  },
  {
    title: "Resources",
    items: [
      { name: "Health Resources Hub", path: "/health-blog" },
      {
        name: "Complete biomarker reference library",
        path: "/biomarker-database",
      },
    ],
  },
  {
    title: "Contact",
    items: [{ name: "Contact us", path: "/contact" }],
  },
];

export const moreNavigationItems = moreNavigationSections.flatMap(
  (section) => section.items,
);
export const navigationItems = primaryNavigationItems;
export { NavigationMenu as NavigationItems } from "./NavigationMenu";
