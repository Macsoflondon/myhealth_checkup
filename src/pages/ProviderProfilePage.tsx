import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, ExternalLink, Shield, Award, Clock, Users, ArrowLeft, CheckCircle, TestTube, Building2 } from "lucide-react";
import { ProviderLogo } from "@/components/ProviderLogo";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { buildProviderWebsiteUrl, externalLinkProps } from "@/utils/urlTracking";

const ProviderProfilePage = () => {
  const { providerId } = useParams();
  
  // Match provider by exact ID first, then by partial match
  const provider = detailedProviders.find(p => {
    const lowerId = p.id.toLowerCase();
    const lowerProviderId = providerId?.toLowerCase() || '';
    return lowerId === lowerProviderId || lowerId.startsWith(lowerProviderId + '-');
  });
  
  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <PageHeading 
              title="Provider" 
              accent="Not Found" 
            />
            <p className="text-muted-foreground mb-6 mt-4">The provider you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/compare">Browse All Tests</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getProviderRating = (name: string) => {
    const ratings: Record<string, { rating: number; reviews: string }> = {
      "Medichecks": { rating: 4.7, reviews: "3,521" },
      "GoodBody Clinic": { rating: 4.6, reviews: "1,240" },
      "Thriva": { rating: 4.5, reviews: "2,156" },
      "Randox Health": { rating: 4.8, reviews: "1,847" },
      "London Medical Laboratory": { rating: 4.4, reviews: "892" },
      "Lola Health": { rating: 4.3, reviews: "567" },
      "Tuli Health": { rating: 4.5, reviews: "1,123" },
      "The Doctors Laboratory": { rating: 4.8, reviews: "2,234" }
    };
    return ratings[name] || { rating: 4.5, reviews: "500+" };
  };

  const ratingData = getProviderRating(provider.name);
  const websiteUrl = provider.website ? buildProviderWebsiteUrl(provider.website, provider.id) : null;

  // Test categories offered by this provider
  const testCategories = [
    "General Health",
    "Hormones",
    "Vitamins & Minerals",
    "Thyroid",
    "Heart Health",
    "Diabetes",
    "Sexual Health",
    "Fertility"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{provider.name} - Blood Tests & Health Screening | myhealth checkup</title>
        <meta 
          name="description" 
          content={`Compare ${provider.name} blood tests and health screening. ${provider.accreditation ? provider.accreditation + '. ' : ''}Read reviews, view prices, and book online.`} 
        />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/provider/${providerId}`} />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Back Button */}
        <div className="mb-4 md:mb-6">
          <Button variant="outline" asChild className="gap-2 min-h-[44px] touch-manipulation border-secondary text-secondary hover:bg-secondary hover:text-white">
            <Link to="/compare">
              <ArrowLeft className="w-4 h-4" />
              Back to Compare Tests
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="bg-card rounded-xl shadow-sm p-4 md:p-8 mb-6 md:mb-8 border">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <ProviderLogo provider={provider.name} className="w-14 h-14 md:w-16 md:h-16" />
            </div>
            
            <div className="flex-1 w-full">
              <PageHeading 
                title={provider.name} 
                centered={false}
                className="text-2xl md:text-3xl lg:text-4xl mb-2"
              />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-foreground text-sm md:text-base">{ratingData.rating}</span>
                  <span className="text-muted-foreground text-sm md:text-base">({ratingData.reviews} reviews)</span>
                </div>
                
                {provider.accreditation && (
                  <Badge variant="secondary" className="gap-1 text-xs bg-green-100 text-green-800">
                    <Shield className="w-3 h-3" />
                    Accredited
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground text-base md:text-lg mb-6">{provider.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {websiteUrl && (
                  <Button size="lg" asChild className="min-h-[48px] w-full sm:w-auto bg-primary hover:bg-primary/90">
                    <a href={websiteUrl} {...externalLinkProps}>
                      Visit Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="lg" asChild className="min-h-[48px] w-full sm:w-auto border-secondary text-secondary hover:bg-secondary hover:text-white">
                  <Link to={`/provider/${providerId}/tests`}>
                    <TestTube className="w-4 h-4 mr-2" />
                    Browse Available Tests
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Signals Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Trust & Accreditation
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {provider.accreditation && (
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Lab Accredited</p>
                  <p className="text-xs text-muted-foreground">UKAS ISO 15189</p>
                </div>
              </div>
            )}
            {provider.clinics && (
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">CQC Registered</p>
                  <p className="text-xs text-muted-foreground">Regulated clinics</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
              <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{ratingData.rating}/5 Rating</p>
                <p className="text-xs text-muted-foreground">{ratingData.reviews} reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
              <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{provider.turnaroundTime || '2-5 days'}</p>
                <p className="text-xs text-muted-foreground">Results turnaround</p>
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
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.website && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-foreground text-sm md:text-base mb-1">Website</p>
                    <a 
                      href={websiteUrl || provider.website} 
                      {...externalLinkProps}
                      className="text-primary hover:underline text-sm md:text-base break-all touch-manipulation"
                    >
                      {provider.website.replace('https://', '').replace('http://', '')}
                    </a>
                  </div>
                )}
                
                {provider.phone && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-foreground text-sm md:text-base mb-1">Phone</p>
                    <a href={`tel:${provider.phone}`} className="text-muted-foreground text-sm md:text-base hover:text-primary touch-manipulation">{provider.phone}</a>
                  </div>
                )}
                
                {provider.email && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-foreground text-sm md:text-base mb-1">Email</p>
                    <a href={`mailto:${provider.email}`} className="text-muted-foreground text-sm md:text-base break-all hover:text-primary touch-manipulation">{provider.email}</a>
                  </div>
                )}
                
                {provider.clinics && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-foreground text-sm md:text-base mb-1">Clinic Locations</p>
                    <p className="text-muted-foreground text-sm md:text-base">{provider.clinics}</p>
                  </div>
                )}
                
                {provider.locations && (
                  <div className="min-h-[44px] flex flex-col justify-center">
                    <p className="font-medium text-foreground text-sm md:text-base mb-1">Locations</p>
                    <p className="text-muted-foreground text-sm md:text-base">{provider.locations}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Categories */}
            <Card className="mt-4">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TestTube className="w-5 h-5 text-primary" />
                  Test Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {testCategories.map(category => (
                    <Link
                      key={category}
                      to={`/compare?category=${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="inline-block"
                    >
                      <Badge 
                        variant="outline" 
                        className="hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      >
                        {category}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Accreditations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Accreditations & Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.accreditation && (
                  <div>
                    <p className="font-medium text-foreground">Provider Accreditation</p>
                    <p className="text-muted-foreground">{provider.accreditation}</p>
                  </div>
                )}
                
                {provider.labAccreditation && (
                  <div>
                    <p className="font-medium text-foreground">Laboratory Accreditation</p>
                    <p className="text-muted-foreground">{provider.labAccreditation}</p>
                  </div>
                )}
                
                {provider.partnerLabs && (
                  <div>
                    <p className="font-medium text-foreground">Partner Laboratories</p>
                    <p className="text-muted-foreground">{provider.partnerLabs}</p>
                  </div>
                )}
                
                {provider.parentCompany && (
                  <div>
                    <p className="font-medium text-foreground">Parent Company</p>
                    <p className="text-muted-foreground">{provider.parentCompany}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.tests && (
                  <div>
                    <p className="font-medium text-foreground">Available Tests</p>
                    <p className="text-muted-foreground">{provider.tests}</p>
                  </div>
                )}

                {provider.sampleCollection && (
                  <div>
                    <p className="font-medium text-foreground">Sample Collection</p>
                    <p className="text-muted-foreground">{provider.sampleCollection}</p>
                  </div>
                )}

                {provider.turnaroundTime && (
                  <div>
                    <p className="font-medium text-foreground">Results Turnaround</p>
                    <p className="text-muted-foreground">{provider.turnaroundTime}</p>
                  </div>
                )}
                
                {provider.appointments && (
                  <div>
                    <p className="font-medium text-foreground">Appointment Capacity</p>
                    <p className="text-muted-foreground">{provider.appointments}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose {provider.name}?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {provider.accreditation && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium">Fully Accredited Labs</span>
                    </div>
                  )}
                  
                  {provider.clinics && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium">Multiple Locations</span>
                    </div>
                  )}
                  
                  {provider.phone && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Phone className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm font-medium">Phone Support</span>
                    </div>
                  )}
                  
                  {provider.email && (
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                      <Mail className="w-5 h-5 text-pink-600 flex-shrink-0" />
                      <span className="text-sm font-medium">Email Support</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Award className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <span className="text-sm font-medium">Doctor Reviewed Results</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                    <Clock className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span className="text-sm font-medium">Fast Turnaround</span>
                  </div>
                </div>

                {provider.keyDifferentiators && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">What sets them apart:</strong> {provider.keyDifferentiators}
                    </p>
                  </div>
                )}
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
