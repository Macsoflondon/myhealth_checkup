/**
 * Seed data for London Medical Laboratory tests
 * This is fallback/example data - production data should come from the database
 */

export interface LondonLabTest {
  id: string;
  name: string;
  price: number;
  url: string;
  category: string;
  biomarkerCount: number;
  description: string;
}

// Note: This is seed/fallback data. Production data is fetched from Supabase.
export const londonLabTestsSeed: LondonLabTest[] = [
  {
    id: "lml-general-health",
    name: "General Health Screen",
    price: 89,
    url: "https://www.londonmedicallaboratory.com/",
    category: "General Health",
    biomarkerCount: 12,
    description: "Comprehensive health screening covering essential health markers."
  },
  {
    id: "lml-vitamin-profile",
    name: "Vitamin Profile",
    price: 129,
    url: "https://www.londonmedicallaboratory.com/",
    category: "Vitamins",
    biomarkerCount: 8,
    description: "Complete vitamin status assessment including key vitamins."
  },
];
