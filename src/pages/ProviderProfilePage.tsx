import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, ExternalLink, Shield, Award, Clock, Users } from "lucide-react";
import { ProviderLogo } from "@/components/ProviderLogo";
import { detailedProviders } from "@/data/compare/detailedProviders";

const ProviderProfilePage = () => {
  const { providerId } = useParams();
  
  const provider = detailedProviders.find(p => p.id.toLowerCase() === providerId?.toLowerCase());
  
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
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ProviderLogo provider={provider.name} className="w-16 h-16" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{provider.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{ratingData.rating}</span>
                  <span className="text-gray-500">({ratingData.reviews} reviews)</span>
                </div>
                
                {provider.accreditation && (
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="w-3 h-3" />
                    Accredited
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 text-lg mb-6">{provider.description}</p>
              
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  Compare Tests
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.website && (
                  <div>
                    <p className="font-medium text-gray-900">Website</p>
                    <a 
                      href={`https://${provider.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {provider.website}
                    </a>
                  </div>
                )}
                
                {provider.phone && (
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{provider.phone}</p>
                  </div>
                )}
                
                {provider.email && (
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{provider.email}</p>
                  </div>
                )}
                
                {provider.clinics && (
                  <div>
                    <p className="font-medium text-gray-900">Locations</p>
                    <p className="text-gray-600">{provider.clinics}</p>
                  </div>
                )}
                
                {provider.locations && (
                  <div>
                    <p className="font-medium text-gray-900">Locations</p>
                    <p className="text-gray-600">{provider.locations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
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