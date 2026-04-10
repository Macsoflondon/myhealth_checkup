import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TestTube2, 
  Clock, 
  MapPin,
  ExternalLink,
  Filter,
  Building2,
  Shield,
  Home,
  Smartphone,
  Heart,
  Microscope
} from "lucide-react";
import { PROVIDER_LOGOS, PROVIDER_WEBSITES, PROVIDER_TURNAROUND_TIMES, PROVIDER_COLLECTION_METHODS } from "@/constants/providers";

interface ProviderFeature {
  icon: React.ReactNode;
  label: string;
}

interface ProviderCatalogHeaderProps {
  providerId: string;
  providerName: string;
  tagline: string;
  testCount: number;
  isLoading?: boolean;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  features: ProviderFeature[];
}

const ProviderCatalogHeader = ({
  providerId,
  providerName,
  tagline,
  testCount,
  isLoading = false,
  categories,
  selectedCategory,
  onCategoryChange,
  features,
}: ProviderCatalogHeaderProps) => {
  const providerLogo = PROVIDER_LOGOS[providerId];
  const providerWebsite = PROVIDER_WEBSITES[providerId];
  const turnaroundTime = PROVIDER_TURNAROUND_TIMES[providerId] || "2-5 days";
  const collectionMethod = PROVIDER_COLLECTION_METHODS[providerId] || "Varies";

  return (
    <>
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center p-2">
              <img
                src={providerLogo}
                alt={`${providerName} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
                {providerName}
              </h1>
              <p className="text-white/70 mt-1">
                {tagline}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link to="/providers">
                ← All Providers
              </Link>
            </Button>
            <Button asChild variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <a 
                href={providerWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Visit Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <TestTube2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-white">
              {isLoading ? <Skeleton className="h-4 w-8 inline-block" /> : testCount} Tests
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
            <Clock className="h-5 w-5 text-secondary-foreground" />
            <span className="font-semibold text-white">{turnaroundTime} turnaround</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full">
            <MapPin className="h-5 w-5 text-accent-foreground" />
            <span className="font-semibold text-white">{collectionMethod}</span>
          </div>
        </div>

        {/* Feature Badges Row */}
        <div className="flex flex-wrap gap-6 mb-8 py-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-white/70">
              {feature.icon}
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <section className="mb-2">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-white/70" />
            <span className="font-medium text-white">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange("all")}
            >
              All Tests
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

// Pre-defined feature sets for each provider
export const PROVIDER_FEATURES: Record<string, ProviderFeature[]> = {
  'medichecks': [
    { icon: <Home className="h-4 w-4 text-secondary" />, label: "Home test kits" },
    { icon: <Building2 className="h-4 w-4 text-secondary" />, label: "Clinic appointments" },
    { icon: <Shield className="h-4 w-4 text-secondary" />, label: "UKAS Accredited" },
  ],
  'thriva': [
    { icon: <Home className="h-4 w-4 text-secondary" />, label: "Home test kits" },
    { icon: <Smartphone className="h-4 w-4 text-secondary" />, label: "App-based tracking" },
    { icon: <Shield className="h-4 w-4 text-secondary" />, label: "CQC Registered" },
  ],
  'randox': [
    { icon: <Building2 className="h-4 w-4 text-secondary" />, label: "Premium clinic locations" },
    { icon: <Microscope className="h-4 w-4 text-secondary" />, label: "Advanced diagnostics" },
    { icon: <Shield className="h-4 w-4 text-secondary" />, label: "ISO 15189 Accredited" },
  ],
  'london-medical-laboratory': [
    { icon: <Building2 className="h-4 w-4 text-secondary" />, label: "Clinic-based testing" },
    { icon: <MapPin className="h-4 w-4 text-secondary" />, label: "Locations across the UK" },
    { icon: <Shield className="h-4 w-4 text-secondary" />, label: "UKAS Accredited" },
  ],
  'lola-health': [
    { icon: <Home className="h-4 w-4 text-secondary" />, label: "Home test kits" },
    { icon: <Heart className="h-4 w-4 text-secondary" />, label: "Women's health focus" },
    { icon: <Shield className="h-4 w-4 text-secondary" />, label: "Expert support" },
  ],
  'goodbody-clinic': [
    { icon: <Building2 className="h-4 w-4 text-secondary" />, label: "Clinic-based testing" },
    { icon: <MapPin className="h-4 w-4 text-secondary" />, label: "Locations across the UK" },
    { icon: <Shield className="h-4 w-4 text-secondary" />, label: "CQC Registered" },
  ],
};

export default ProviderCatalogHeader;
