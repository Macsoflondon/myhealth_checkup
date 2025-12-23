export interface TestProvider {
  name: string;
  price: number;
  url: string;
  features: string[];
  turnaround?: string;
  biomarkers?: number;
  bookingUrl?: string;
}

export interface TestBiomarkerSection {
  title: string;
  markers: string[];
}

export interface TestHighlight {
  title: string;
  items: string[];
  bgColor?: string;
  textColor?: string;
}

export interface TestFeatureBadge {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface TestPageData {
  // Meta information
  title: string;
  description: string;
  category: string;
  breadcrumbTitle: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  
  // Content
  biomarkerSections: TestBiomarkerSection[];
  highlights?: TestHighlight[];
  whyChooseItems: string[];
  whyChooseTitle?: string;
  featureBadges: TestFeatureBadge[];
  
  // Providers
  providers: TestProvider[];
}