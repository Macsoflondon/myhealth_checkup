/**
 * Seed data for test providers
 * This is fallback/example data - production data should come from the database
 */

export interface GoodbodyTest {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  biomarkerCount: number;
  turnaroundDays: number;
  sampleType: string;
  fastingRequired: boolean;
  keyBiomarkers: string[];
  url: string;
}

// Note: This is seed/fallback data. Production data is fetched from Supabase.
export const goodbodyTestsSeed: GoodbodyTest[] = [
  {
    id: "gb-cancer-screening-male",
    name: "Male Cancer Marker Blood Test",
    slug: "male-cancer-screening",
    price: 299,
    description: "Comprehensive cancer marker screening for men including PSA and CEA.",
    category: "cancer screening",
    biomarkerCount: 6,
    turnaroundDays: 3,
    sampleType: "blood",
    fastingRequired: false,
    keyBiomarkers: ["PSA", "CEA", "AFP", "CA19-9"],
    url: "https://goodbody.co.uk/products/male-cancer-marker"
  },
  {
    id: "gb-cancer-screening-female",
    name: "Female Cancer Marker Blood Test",
    slug: "female-cancer-screening",
    price: 299,
    description: "Comprehensive cancer marker screening for women including CA-125 and CEA.",
    category: "cancer screening",
    biomarkerCount: 6,
    turnaroundDays: 3,
    sampleType: "blood",
    fastingRequired: false,
    keyBiomarkers: ["CA-125", "CEA", "AFP", "CA15-3"],
    url: "https://goodbody.co.uk/products/female-cancer-marker"
  },
];
