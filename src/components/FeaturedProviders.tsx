import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { ProviderLogo } from "@/components/ProviderLogo";
import { Link } from "react-router-dom";
import { detailedProviders } from "@/data/compare/detailedProviders";
const FeaturedProviders = () => {
  const featuredProviderData = [{
    id: "Medichecks",
    name: "Medichecks",
    rating: 4.7,
    reviews: "3,521",
    description: "Award-winning health screening service offering comprehensive health MOTs and specialised testing with doctor reviews",
    location: "UK Wide",
    tags: ["Health MOTs", "Specialist Testing", "Doctor Reviews", "UKAS Accredited"],
    website: "medichecks.com"
  }, {
    id: "Goodbody",
    name: "Goodbody Clinic",
    rating: 4.6,
    reviews: "1,240",
    description: "Provides comprehensive wellness profiles with GP follow-ups across 140+ clinics nationwide",
    location: "140+ clinics nationwide",
    tags: ["GP Follow-ups", "Wellness Profiles", "CQC Registered", "Nationwide"],
    website: "health.goodbodyclinic.com"
  }, {
    id: "Thriva",
    name: "Thriva",
    rating: 4.5,
    reviews: "2,156",
    description: "Subscription-based home testing with digital dashboard and GP advice for ongoing health monitoring",
    location: "Home Testing UK Wide",
    tags: ["Home Testing", "Digital Dashboard", "GP Advice", "Subscription"],
    website: "thriva.co"
  }, {
    id: "Randox",
    name: "Randox Health",
    rating: 4.8,
    reviews: "1,847",
    description: "Global diagnostics company offering comprehensive health checks with UKAS accredited and FDA approved testing",
    location: "London, Liverpool, Belfast",
    tags: ["FDA Approved", "UKAS Accredited", "Health Checks", "Global Company"],
    website: "randoxhealth.com"
  }, {
    id: "LondonMedicalLab",
    name: "London Medical Laboratory",
    rating: 4.4,
    reviews: "892",
    description: "Professional medical laboratory services with comprehensive testing capabilities and UKAS accreditation",
    location: "London & Partners",
    tags: ["UKAS Accredited", "Professional Lab", "Comprehensive Testing", "ISO 15189"],
    website: "londonmedicallaboratory.com"
  }, {
    id: "Lola",
    name: "Lola Health",
    rating: 4.3,
    reviews: "567",
    description: "Modern health testing platform focused on women's health and wellness with innovative approaches",
    location: "UK Wide",
    tags: ["Women's Health", "Modern Platform", "Wellness Focus", "Innovative"],
    website: "lolahealth.com"
  }, {
    id: "Tuli",
    name: "Tuli Health",
    rating: 4.5,
    reviews: "1,123",
    description: "Phlebotomy network enabling blood collection at 300+ local pharmacies with CQC registered service",
    location: "300+ local pharmacies",
    tags: ["Pharmacy Network", "CQC Registered", "Local Collection", "Convenient"],
    website: "tuli.health"
  }];
  return <section className="py-16 bg-[hsl(var(--section-dark))]" id="providers">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#22c0d4] text-center">
            Trusted UK Providers
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-[#e70d69] font-normal text-center">
            Accredited health testing providers with proven track records
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredProviderData.map(provider => <Card key={provider.id} className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4 mb-4 my-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <ProviderLogo provider={provider.name} className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 truncate">{provider.name}</h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                      <span className="font-medium text-gray-900 text-sm md:text-base">{provider.rating}</span>
                      <span className="text-xs md:text-sm text-gray-500 truncate">({provider.reviews}) reviews</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-3">
                  {provider.description}
                </p>

                <div className="flex items-start text-xs md:text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2 break-words">{provider.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-6">
                  {provider.tags.map((tag, tagIndex) => <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>)}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="flex-1 min-h-[40px]" style={{ backgroundColor: '#e70d69', borderColor: '#e70d69', color: 'white' }} asChild>
                    <Link to={`/provider/${provider.id.toLowerCase()}`}>
                      View Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-shrink-0 min-h-[40px]" asChild>
                    <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default FeaturedProviders;