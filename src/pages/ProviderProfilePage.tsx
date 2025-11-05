import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, ExternalLink, Shield, Award, Clock, Users, ArrowLeft } from "lucide-react";
import { ProviderLogo } from "@/components/ProviderLogo";
import { detailedProviders } from "@/data/compare/detailedProviders";

const ProviderProfilePage = () => {
  const { providerId } = useParams();
  
  // Match provider by exact ID first, then by partial match (e.g., 'randox' matches 'randox-health')
  const provider = detailedProviders.find(p => {
    const lowerId = p.id.toLowerCase();
    const lowerProviderId = providerId?.toLowerCase() || '';
    return lowerId === lowerProviderId || lowerId.startsWith(lowerProviderId + '-');
  });
  
  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Provider Not Found</h1>
            <p className="text-gray-600">The provider you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getProviderRating = (name: string) => {
    const ratings: Record<string, { rating: number; reviews: string }> = {
      "Medichecks": { rating: 4.7, reviews: "3,521" },
      "Goodbody Clinic": { rating: 4.6, reviews: "1,240" },
      "Thriva": { rating: 4.5, reviews: "2,156" },
      "Randox Health": { rating: 4.8, reviews: "1,847" },
      "London Medical Laboratory": { rating: 4.4, reviews: "892" },
      "Lola Health": { rating: 4.3, reviews: "567" },
      "Tuli Health": { rating: 4.5, reviews: "1,123" }
    };
    return ratings[name] || { rating: 4.5, reviews: "500+" };
  };

  const ratingData = getProviderRating(provider.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Back Button */}
        <div className="mb-4 md:mb-6">
          <Button variant="outline" asChild className="gap-2 min-h-[44px] touch-manipulation border-[#22c0d4] text-[#22c0d4] hover:bg-[#22c0d4] hover:text-white">
            <Link to="/#providers">
              <ArrowLeft className="w-4 h-4" />
              Back to All Providers
            </Link>
          </Button>
        </div>
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ProviderLogo provider={provider.name} className="w-14 h-14 md:w-16 md:h-16" />
            </div>
            
            <div className="flex-1 w-full">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{provider.name}</h1>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900 text-sm md:text-base">{ratingData.rating}</span>
                  <span className="text-gray-500 text-sm md:text-base">({ratingData.reviews} reviews)</span>
                </div>
                
                {provider.accreditation && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Shield className="w-3 h-3" />
                    Accredited
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 text-base md:text-lg mb-6">{provider.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="min-h-[48px] w-full sm:w-auto bg-[#22c0d4] hover:bg-[#22c0d4]/90 text-white">
                  <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="min-h-[48px] w-full sm:w-auto border-[#22c0d4] text-[#22c0d4] hover:bg-[#22c0d4] hover:text-white">
                  <Link to={`/provider/${providerId}/tests`}>
                    Browse Available Tests
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.website && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-gray-900 text-sm md:text-base mb-1">Website</p>
                    <a 
                      href={`https://${provider.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm md:text-base break-all touch-manipulation"
                    >
                      {provider.website}
                    </a>
                  </div>
                )}
                
                {provider.phone && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-gray-900 text-sm md:text-base mb-1">Phone</p>
                    <a href={`tel:${provider.phone}`} className="text-gray-600 text-sm md:text-base hover:underline touch-manipulation">{provider.phone}</a>
                  </div>
                )}
                
                {provider.email && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-gray-900 text-sm md:text-base mb-1">Email</p>
                    <a href={`mailto:${provider.email}`} className="text-gray-600 text-sm md:text-base break-all hover:underline touch-manipulation">{provider.email}</a>
                  </div>
                )}
                
                {provider.clinics && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-gray-900 text-sm md:text-base mb-1">Locations</p>
                    <p className="text-gray-600 text-sm md:text-base">{provider.clinics}</p>
                  </div>
                )}
                
                {provider.locations && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-gray-900 text-sm md:text-base mb-1">Locations</p>
                    <p className="text-gray-600 text-sm md:text-base">{provider.locations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            {/* Accreditations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Accreditations & Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.accreditation && (
                  <div>
                    <p className="font-medium text-gray-900">Provider Accreditation</p>
                    <p className="text-gray-600">{provider.accreditation}</p>
                  </div>
                )}
                
                {provider.labAccreditation && (
                  <div>
                    <p className="font-medium text-gray-900">Laboratory Accreditation</p>
                    <p className="text-gray-600">{provider.labAccreditation}</p>
                  </div>
                )}
                
                {provider.partnerLabs && (
                  <div>
                    <p className="font-medium text-gray-900">Partner Laboratories</p>
                    <p className="text-gray-600">{provider.partnerLabs}</p>
                  </div>
                )}
                
                {provider.parentCompany && (
                  <div>
                    <p className="font-medium text-gray-900">Parent Company</p>
                    <p className="text-gray-600">{provider.parentCompany}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.tests && (
                  <div>
                    <p className="font-medium text-gray-900">Available Tests</p>
                    <p className="text-gray-600">{provider.tests}</p>
                  </div>
                )}
                
                {provider.appointments && (
                  <div>
                    <p className="font-medium text-gray-900">Appointment Capacity</p>
                    <p className="text-gray-600">{provider.appointments}</p>
                  </div>
                )}
                
                {provider.partnerRegulation && (
                  <div>
                    <p className="font-medium text-gray-900">Partner Regulation</p>
                    <p className="text-gray-600">{provider.partnerRegulation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {provider.accreditation && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Fully Accredited</span>
                    </div>
                  )}
                  
                  {provider.clinics && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Multiple Locations</span>
                    </div>
                  )}
                  
                  {provider.phone && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">Phone Support</span>
                    </div>
                  )}
                  
                  {provider.labAccreditation && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Award className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium">Quality Labs</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProviderProfilePage;