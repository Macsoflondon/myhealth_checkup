import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, ExternalLink, Shield, Award, Clock, Users, ArrowLeft, CheckCircle, TestTube, Building2 } from "lucide-react";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { buildProviderWebsiteUrl, externalLinkProps } from "@/utils/urlTracking";
import { getBranding } from "@/data/providerBranding";
import { getProviderRating } from "@/constants/providerRatings";

const PROVIDER_CATALOG_ROUTES: Record<string, string> = {
  'goodbody-clinic': '/providers/goodbody-clinic',
  'medichecks': '/providers/medichecks',
  'thriva': '/providers/thriva',
  'randox-health': '/providers/randox',
  'lola-health': '/providers/lola-health',
  'london-medical-laboratory': '/providers/london-medical-laboratory',
};

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

  const brand = getBranding(provider.name);

  const providerRatingData = getProviderRating(provider.name);
  const ratingData = { rating: providerRatingData.rating, reviews: providerRatingData.reviewsFormatted };
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
    "Fertility",
    "Cancer Screening"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{provider.name} - Blood Tests & Health Screening | myhealth checkup</title>
        <meta 
          name="description" 
          content={`Compare ${provider.name} blood tests and health screening. ${provider.accreditation ? provider.accreditation + '. ' : ''}Read reviews, view prices, and book online.`} 
        />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/provider/${provider.id}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": provider.name,
          "description": `Compare ${provider.name} blood tests and health screening.`,
          "url": `https://myhealthcheckup.co.uk/provider/${provider.id}`,
          ...(websiteUrl ? { "sameAs": websiteUrl } : {}),
          ...(provider.accreditation ? { "hasCredential": { "@type": "EducationalOccupationalCredential", "credentialCategory": provider.accreditation } } : {}),
          ...(providerRatingData.rating ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": providerRatingData.rating, "bestRating": 5, "ratingCount": providerRatingData.reviews } } : {}),
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myhealthcheckup.co.uk" },
              { "@type": "ListItem", "position": 2, "name": "Compare Tests", "item": "https://myhealthcheckup.co.uk/compare" },
              { "@type": "ListItem", "position": 3, "name": provider.name }
            ]
          }
        })}</script>
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-4 md:py-8">

        {/* Hero Section — branded gradient when available */}
        <div
          className="rounded-xl shadow-sm p-4 md:p-8 mb-6 md:mb-8 border"
          style={brand ? {
            background: `linear-gradient(135deg, ${brand.accent}, ${brand.primary})`,
          } : undefined}
        >
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: brand ? 'rgba(255,255,255,0.95)' : 'hsl(var(--primary) / 0.1)' }}
            >
              <ProviderLogo provider={provider.name} className="w-14 h-14 md:w-16 md:h-16" />
            </div>
            
            <div className="flex-1 w-full">
              <h1
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1"
                style={{ color: brand ? '#ffffff' : 'hsl(var(--foreground))' }}
              >
                {provider.name}
              </h1>
              {brand && (
                <p className="text-white/80 text-sm md:text-base italic mb-2">{brand.tagline}</p>
              )}
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-sm md:text-base" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>{ratingData.rating}</span>
                  <span className="text-sm md:text-base" style={{ color: brand ? 'rgba(255,255,255,0.7)' : 'hsl(var(--muted-foreground))' }}>({ratingData.reviews} reviews)</span>
                </div>
                
                {provider.accreditation && (
                  <Badge variant="secondary" className="gap-1 text-xs bg-green-100 text-green-800">
                    <Shield className="w-3 h-3" />
                    Accredited
                  </Badge>
                )}
              </div>
              
              <p className="text-base md:text-lg mb-6" style={{ color: brand ? 'rgba(255,255,255,0.9)' : 'hsl(var(--muted-foreground))' }}>{provider.description}</p>

              {/* Medichecks-specific expanded info */}
              {provider.id === 'medichecks' && (
                <div className="mt-4 mb-6 space-y-4 text-sm md:text-base" style={{ color: brand ? 'rgba(255,255,255,0.85)' : 'hsl(var(--muted-foreground))' }}>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>Unlock the Ultimate You</h3>
                    <p>Medichecks provide private blood tests and health checks designed for clarity, speed, and clinical accuracy.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>How It Works</h3>
                    <p>Choose from convenient at-home testing kits or attend a nationwide network of partner clinics. All samples are analysed by UKAS accredited laboratories, with services delivered through CQC regulated clinical partners.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>Your Results</h3>
                    <p>Results include a clear GP reviewed report, helping you understand your biomarkers and take informed next steps.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>Our Services</h3>
                    <p>Medichecks combine medical rigour with flexible access, offering a wide range of blood and wellness tests across hormones, nutrition, heart health, and preventative screening.</p>
                  </div>
                  <div className="pt-2">
                    <video
                      src="/videos/medichecks-promo.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full max-w-2xl rounded-xl object-contain max-h-[300px]"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                {websiteUrl && (
                  <Button
                    size="lg"
                    asChild
                    className="min-h-[48px] w-full sm:w-auto text-white inline-flex items-center"
                    style={brand ? { backgroundColor: brand.primary, color: '#fff' } : undefined}
                  >
                    <a href={websiteUrl} {...externalLinkProps} className="inline-flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <span>Visit Website</span>
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="min-h-[48px] w-full sm:w-auto inline-flex items-center"
                  style={brand ? { borderColor: '#fff', color: '#fff', backgroundColor: 'transparent' } : { borderColor: 'hsl(var(--secondary))', color: 'hsl(var(--secondary))' }}
                >
                  <Link to={PROVIDER_CATALOG_ROUTES[provider.id] || `/provider/${provider.id}/tests`} className="inline-flex items-center gap-2">
                    <TestTube className="w-4 h-4 flex-shrink-0" />
                    <span>Browse Available Tests</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Signals Banner — tinted with provider colour */}
        <div
          className="rounded-xl p-4 md:p-6 mb-6 md:mb-8 border"
          style={brand ? {
            backgroundColor: brand.primaryLight,
            borderColor: `${brand.primary}33`,
          } : {
            backgroundColor: 'hsl(var(--primary) / 0.05)',
            borderColor: 'hsl(var(--primary) / 0.2)',
          }}
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
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
                <Building2 className="w-5 h-5 flex-shrink-0" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
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
              <Clock className="w-5 h-5 flex-shrink-0" style={brand ? { color: brand.primary } : { color: 'hsl(var(--secondary))' }} />
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
                  <Phone className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
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
                      className="hover:underline text-sm md:text-base break-all touch-manipulation"
                      style={{ color: brand ? brand.primary : 'hsl(var(--primary))' }}
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
                  <TestTube className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
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
                        className="transition-colors cursor-pointer"
                        style={brand ? {
                          borderColor: brand.primary,
                          color: brand.primary,
                        } : undefined}
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
                  <Award className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
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
                  <Users className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
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

            {/* Key Features — tinted with provider accent */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose {provider.name}?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {provider.accreditation && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: brand ? brand.primaryLight : '#f0fdf4' }}
                    >
                      <Shield className="w-5 h-5 flex-shrink-0" style={{ color: brand ? brand.primary : '#16a34a' }} />
                      <span className="text-sm font-medium">Fully Accredited Labs</span>
                    </div>
                  )}
                  
                  {provider.clinics && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: brand ? brand.accentLight : '#eff6ff' }}
                    >
                      <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: brand ? brand.accent : '#2563eb' }} />
                      <span className="text-sm font-medium">Multiple Locations</span>
                    </div>
                  )}
                  
                  {provider.phone && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: brand ? brand.primaryLight : '#faf5ff' }}
                    >
                      <Phone className="w-5 h-5 flex-shrink-0" style={{ color: brand ? brand.primary : '#9333ea' }} />
                      <span className="text-sm font-medium">Phone Support</span>
                    </div>
                  )}
                  
                  {provider.email && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: brand ? brand.accentLight : '#fdf2f8' }}
                    >
                      <Mail className="w-5 h-5 flex-shrink-0" style={{ color: brand ? brand.accent : '#db2777' }} />
                      <span className="text-sm font-medium">Email Support</span>
                    </div>
                  )}
                  
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: brand ? brand.primaryLight : '#fff7ed' }}
                  >
                    <Award className="w-5 h-5 flex-shrink-0" style={{ color: brand ? brand.primary : '#ea580c' }} />
                    <span className="text-sm font-medium">Doctor Reviewed Results</span>
                  </div>
                  
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: brand ? brand.accentLight : '#f0fdfa' }}
                  >
                    <Clock className="w-5 h-5 flex-shrink-0" style={{ color: brand ? brand.accent : '#0d9488' }} />
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
