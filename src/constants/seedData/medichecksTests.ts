/**
 * Seed data for Medichecks tests
 * This is fallback/example data - production data should come from the database
 */

export interface MedichecksTest {
  id: string;
  name: string;
  price: number;
  category: string;
  biomarkerCount: number;
  description: string;
  url: string;
}

// Note: This is seed/fallback data. Production data is fetched from Supabase.
export const medichecksTestsSeed: MedichecksTest[] = [
  {
    id: "mc-well-woman",
    name: "Well Woman Blood Test",
    price: 99,
    category: "women's health",
    biomarkerCount: 25,
    description: "Comprehensive health check for women covering key female health markers.",
    url: "https://medichecks.com/products/well-woman-blood-test"
  },
  {
    id: "mc-well-man",
    name: "Well Man Blood Test",
    price: 99,
    category: "men's health",
    biomarkerCount: 22,
    description: "Comprehensive health check for men covering key male health markers.",
    url: "https://medichecks.com/products/well-man-blood-test"
  },
];
