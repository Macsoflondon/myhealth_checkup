import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, ExternalLink, Shield, Award, Clock, Users, CheckCircle, TestTube, Building2 } from "lucide-react";
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
              <ProviderLogo provider={provider.name} className="w-[4.5rem] h-[4.5rem] md:w-20 md:h-20 object-contain" />
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
              
              {(() => {
                const structuredContent: Record<string, { mission: string; whoWeAre: string; services: string }> = {
                  'goodbody-clinic': {
                    mission: "You know your body better than anyone. When something doesn't feel right or you simply want to stay ahead of potential health issues, waiting months for answers isn't good enough. Goodbody Clinic exists to give you fast, reliable health insights without the long NHS waiting times.",
                    whoWeAre: "Goodbody Clinic is a trusted private health testing provider, helping thousands of people across the UK to monitor, check, and improve their health. We offer testing at our clinic in Bath, through over 250 partner clinics nationwide, or in the comfort of your own home. Rated Excellent on Trustpilot with over 3,400 reviews.",
                    services: "We offer one of the most comprehensive ranges of private health tests available in the UK. From Advanced Well Man and Well Woman blood tests (covering 48–51 biomarkers) to the Premium Complete Blood Test analysing 62 key biomarkers. For cancer screening, our TruCheck™ Early Cancer Screening blood test can detect markers for over 70 types of solid cancer tumours.",
                  },
                  'medichecks': {
                    mission: "Medichecks believe everyone deserves access to clear, reliable health information. Their mission is to make private blood testing simple, affordable, and clinically accurate — empowering you to understand your body and take proactive steps.",
                    whoWeAre: "Established in 2002, Medichecks is the UK's leading provider of at-home blood testing, offering over 300 tests across general health, hormones, vitamins, thyroid, sports performance, and more. All samples are analysed by UKAS-accredited laboratories. Rated 4.7/5 on Feefo with over 16,600 reviews.",
                    services: "From convenient finger-prick home kits to venous blood draws at nationwide partner clinics or home nurse visits. Every result includes a bespoke GP-reviewed report with personalised insights, delivered through the MyMedichecks online dashboard.",
                  },
                  'thriva': {
                    mission: "Thriva exists to put health tracking in your hands. By making regular blood testing as routine as checking your phone, they help you spot changes early and stay on top of what matters.",
                    whoWeAre: "Thriva is a subscription-based health testing platform offering convenient at-home finger-prick kits with doctor-reviewed results. All samples are processed in UKAS-accredited partner laboratories. Rated 4.4/5 on Trustpilot with over 2,800 reviews.",
                    services: "Choose from a range of health tests covering heart health, liver function, diabetes risk, vitamins, and hormones. Results are delivered via the Thriva app with personalised insights and biomarker tracking over time. Subscription plans available for regular monitoring.",
                  },
                  'randox-health': {
                    mission: "Randox Health is driven by a single goal: preventing disease before it starts. Using world-leading diagnostic technology, they deliver some of the most comprehensive health checks available in the UK.",
                    whoWeAre: "Part of Randox Laboratories, a global diagnostics leader with over 40 years of innovation. Randox Health operates state-of-the-art clinics in London, Liverpool, and Belfast, offering in-depth health assessments with UKAS-accredited and FDA-approved testing. Rated 4.6/5 on Trustpilot with over 26,100 reviews.",
                    services: "Comprehensive health packages including full-body checks, cancer risk screening, genetic testing, and cardiovascular assessments. All tests are conducted at modern clinic facilities with professional consultation and personalised health recommendations included.",
                  },
                  'lola-health': {
                    mission: "Lola Health was built on a simple idea: professional blood testing should come to you. No finger-pricks, no clinics, no compromise — just accurate results from the comfort of your home.",
                    whoWeAre: "Lola Health is a modern health testing platform offering at-home phlebotomy — a trained professional visits your home to take a venous blood sample. All tests are processed in NHS-accredited (ISO 15189) laboratories and reviewed by qualified doctors. Rated 4.7/5 on Trustpilot with over 140 reviews.",
                    services: "Over 40 blood tests available, from comprehensive panels like Core Health 45 and Peak Insights to individual biomarkers starting from £11.88. Results are delivered via the Lola Health app with doctor-reviewed insights and health trend tracking.",
                  },
                  'london-medical-laboratory': {
                    mission: "London Medical Laboratory is committed to delivering fast, accurate diagnostic testing with clinical-grade precision. Their goal is to make professional laboratory services accessible to everyone, not just those with a GP referral.",
                    whoWeAre: "A UKAS-accredited (ISO 15189) laboratory offering over 100 blood tests with some of the fastest turnaround times in the UK — many results within 24 hours. Professional clinic-based venous blood collection with partner locations across the country. Rated 4.5/5 on Trustpilot with over 3,250 reviews.",
                    services: "Comprehensive test menu including health MOTs, hormone profiles, vitamin panels, allergy testing, and fertility assessments. All samples are processed in their own accredited laboratory with expert analysis and results delivered via online portal or email.",
                  },
                };

                const content = structuredContent[provider.id];

                if (content) {
                  return (
                    <div className="space-y-4 mb-6 text-sm md:text-base" style={{ color: brand ? 'rgba(255,255,255,0.85)' : 'hsl(var(--muted-foreground))' }}>
                      <h2 className="font-bold text-xl mb-2" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>
                        What sets us apart
                      </h2>
                      <div>
                        <h3 className="font-bold text-lg mb-1" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>Our Mission</h3>
                        <p>{content.mission}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>Who We Are</h3>
                        <p>{content.whoWeAre}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>Our Services</h3>
                        <p>{content.services}</p>
                      </div>
                      {provider.id === 'medichecks' && (
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
                      )}
                    </div>
                  );
                }

                return (
                  <p className="text-base md:text-lg mb-6" style={{ color: brand ? 'rgba(255,255,255,0.9)' : 'hsl(var(--muted-foreground))' }}>{provider.description}</p>
                );
              })()}
              
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
                  <p className="text-sm font-medium">CQC Regulated</p>
                  <p className="text-xs text-muted-foreground">Registered clinics</p>
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
          {/* Left column — narrow */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Contact Information */}
            <Card className="flex flex-col flex-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
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
              </CardContent>
            </Card>

            {/* Test Categories */}
            <Card className="flex flex-col flex-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TestTube className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
                  Test Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
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

          {/* Right column — wide */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Service Information */}
            <Card className="flex flex-col flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
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
            <Card className="flex flex-col flex-1">
              <CardHeader>
                <CardTitle>Why Choose {provider.name}?</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid md:grid-cols-2 gap-4">
                  {provider.accreditation && (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                      <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
                      <span className="text-sm font-medium">Fully Accredited Labs</span>
                    </div>
                  )}
                  
                  {provider.clinics && (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                      <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
                      <span className="text-sm font-medium">Multiple Locations</span>
                    </div>
                  )}
                  
                  {provider.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                      <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
                      <span className="text-sm font-medium">Phone Support</span>
                    </div>
                  )}
                  
                  {provider.email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                      <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
                      <span className="text-sm font-medium">Email Support</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                    <Award className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
                    <span className="text-sm font-medium">Doctor Reviewed Results</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                    <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
                    <span className="text-sm font-medium">Fast Turnaround</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Quiz CTA Banner */}
      <div className="mt-8 mb-12 px-4 sm:px-10">
        <div
          style={{
            background: "linear-gradient(135deg, #e70d69, #22c0d4, #e70d69)",
            padding: "3px",
            borderRadius: "16px",
          }}
        >
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8"
            style={{
              background: "#0a1120",
              padding: "32px 36px",
              borderRadius: "13px",
            }}
          >
            <div className="text-center sm:text-left">
              <p
                style={{
                  color: "#22c0d4",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Not Sure Where to Start?
              </p>
              <h2
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(22px, 3vw, 28px)",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Find the Right Health Test for You
              </h2>
            </div>
            <Link
              to="/find-test"
              className="inline-block whitespace-nowrap text-center"
              style={{
                background: "linear-gradient(135deg, #e70d69 0%, #ff4d6d 100%)",
                color: "#ffffff",
                border: "none",
                padding: "16px 36px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
              }
            >
              Start Your Quiz →
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProviderProfilePage;
