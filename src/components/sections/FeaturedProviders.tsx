import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Link } from "react-router-dom";
import { SaveProviderButton } from "@/components/common/SaveProviderButton";
import { useSavedProviders } from "@/hooks/useSavedProviders";
import { SectionHeading } from "@/components/ui/section-heading";
import { getBranding } from "@/data/providerBranding";

const FeaturedProviders = () => {
  const { isProviderSaved, toggleSaveProvider } = useSavedProviders();

  const featuredProviderData = [{
    id: "medichecks",
    name: "Medichecks",
    rating: 4.7,
    reviews: "16,600+",
    description: "Award-winning health screening service offering comprehensive health MOTs and specialised testing with doctor reviews",
    location: "UK Wide",
    tags: ["Health MOTs", "Specialist Testing", "Doctor Reviews", "UKAS Accredited"],
    website: "medichecks.com"
  }, {
    id: "goodbody",
    name: "GOODBODY",
    rating: 4.7,
    reviews: "3,150+",
    description: "Provides comprehensive wellness profiles with GP follow-ups across 140+ clinics nationwide",
    location: "UK Wide",
    tags: ["GP Follow-ups", "Wellness Profiles", "CQC Registered", "Nationwide"],
    website: "health.goodbodyclinic.com"
  }, {
    id: "thriva",
    name: "Thriva",
    rating: 4.4,
    reviews: "2,800+",
    description: "Subscription-based home testing with digital dashboard and GP advice for ongoing health monitoring",
    location: "UK Wide",
    tags: ["Home Testing", "Digital Dashboard", "GP Advice", "Subscription"],
    website: "thriva.co"
  }, {
    id: "randox",
    name: "Randox Health",
    rating: 4.6,
    reviews: "26,100+",
    description: "Global diagnostics company offering comprehensive health checks with UKAS accredited and FDA approved testing",
    location: "UK Wide",
    tags: ["FDA Approved", "UKAS Accredited", "Health Checks", "Global Company"],
    website: "randoxhealth.com"
  }, {
    id: "london-medical-laboratory",
    name: "London Medical Laboratory",
    rating: 4.5,
    reviews: "3,250+",
    description: "Professional medical laboratory services with comprehensive testing capabilities and UKAS accreditation",
    location: "UK Wide",
    tags: ["UKAS Accredited", "Professional Lab", "Comprehensive Testing", "ISO 15189"],
    website: "londonmedicallaboratory.com"
  }, {
    id: "lola-health",
    name: "Lola Health",
    rating: 4.5,
    reviews: "143",
    description: "Modern health testing platform focused on women's health and wellness with innovative approaches",
    location: "UK Wide",
    tags: ["Women's Health", "Modern Platform", "Wellness Focus", "Innovative"],
    website: "referrals.lolahealth.com/myhealthcheckup"
  }];

  return (
    <section id="providers" className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SectionHeading 
            title="Featured" 
            gradientText="Partners" 
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Accredited health testing providers with proven track records
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProviderData.map(provider => {
            const brand = getBranding(provider.name);
            return (
              <Card
                key={provider.id}
                className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-gray-200 overflow-hidden"
                style={{ borderTop: brand ? `4px solid ${brand.primary}` : undefined }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-3">
                      <ProviderLogo provider={provider.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-semibold text-[hsl(var(--navy))] mb-2">{provider.name}</h3>
                        <SaveProviderButton
                          isSaved={isProviderSaved(provider.id)}
                          onToggle={() => toggleSaveProvider(provider.id, provider.name)}
                        />
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                        <span className="font-semibold text-gray-900">{provider.rating}</span>
                        <span className="text-sm text-gray-500">({provider.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-5">
                    {provider.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-5">
                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{provider.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {provider.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="text-xs hover:opacity-80"
                        style={brand ? {
                          backgroundColor: brand.primaryLight,
                          color: brand.primary,
                        } : undefined}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-row gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1 text-white"
                      style={brand ? {
                        backgroundColor: brand.primary,
                      } : undefined}
                      asChild
                    >
                      <Link to={`/provider/${provider.id.toLowerCase()}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;
