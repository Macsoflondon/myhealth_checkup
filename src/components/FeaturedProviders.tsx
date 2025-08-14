import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { ProviderLogo } from "@/components/ProviderLogo";
const FeaturedProviders = () => {
  const providers = [{
    name: "Tuli Health",
    rating: 4.5,
    reviews: "100+",
    description: "Offers seamless booking via pharmacy network for in-person blood draws or sample kit collection. Designed for...",
    location: "Nationwide UK via high-street pharmacies (partner labs accredited UKAS)",
    tags: ["Wellness Testing", "Health Monitoring", "Budget Options", "+1 more"]
  }, {
    name: "Essential Blood Tests",
    rating: 4.5,
    reviews: "1876",
    description: "Affordable and accessible blood testing across the UK with focus on common health conditions and wellness monitoring.",
    location: "UK Wide",
    tags: ["Wellness Testing", "Health Monitoring", "Budget Options", "+1 more"]
  }, {
    name: "NHS Private Health",
    rating: 4.6,
    reviews: "2156",
    description: "Private health testing through NHS facilities offering the reliability of NHS standards with private service...",
    location: "Multiple NHS Sites",
    tags: ["NHS Quality", "Multiple Locations", "GP Integration", "+1 more"]
  }, {
    name: "Medichecks",
    rating: 4.7,
    reviews: "3521",
    description: "Award-winning health screening service offering comprehensive health MOTs and specialised testing with doctor...",
    location: "UK Wide",
    tags: ["Health MOTs", "Specialist Testing", "Doctor Reviews", "+1 more"]
  }, {
    name: "Blue Horizon Blood Tests",
    rating: 4.8,
    reviews: "2847",
    description: "Leading UK provider of private blood tests with over 30 years of experience. Offers comprehensive testing with home visit...",
    location: "London & Nationwide",
    tags: ["Home Visits", "Clinic Tests", "At-Home Kits", "+1 more"]
  }, {
    name: "Harley Street Health Centre",
    rating: 4.9,
    reviews: "892",
    description: "Prestigious Harley Street clinic offering comprehensive health assessments and specialised testing with consultant...",
    location: "Harley Street, London",
    tags: ["Executive Health", "Consultant Reviews", "Comprehensive Screening", "+1 more"]
  }];
  return <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted UK Providers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accredited health testing providers with proven track records
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider, index) => <Card key={index} className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6">
                 <div className="flex items-start gap-4 mb-4 my-0">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                     <ProviderLogo provider={provider.name} className="w-8 h-8" />
                   </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{provider.name}</h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{provider.rating}</span>
                      <span className="text-sm text-gray-500">({provider.reviews}) reviews</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {provider.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{provider.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-6">
                  {provider.tags.map((tag, tagIndex) => <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>)}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    Visit Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default FeaturedProviders;