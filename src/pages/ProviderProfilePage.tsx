import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, ExternalLink, Shield, Award, Clock, Users, CheckCircle, Building2 } from "lucide-react";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { buildProviderWebsiteUrl, externalLinkProps } from "@/utils/urlTracking";
import { getBranding } from "@/data/providerBranding";
import { getProviderRating } from "@/constants/providerRatings";
import { ProviderTestsGrid } from "@/components/providers/ProviderTestsGrid";


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
      <MainLayout>
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <PageHeading 
              title="Provider" 
              accent="Not Found" 
            />
            <p className="text-muted-foreground mb-6 mt-4">The provider you're looking for doesn't exist.</p>
            <Button asChild variant="skeuomorphic">
              <Link to="/compare">Browse All Tests</Link>
            </Button>
          </div>
        </main>
      </MainLayout>
    );
  }

  const brand = getBranding(provider.name);

  const providerRatingData = getProviderRating(provider.name);
  const ratingData = { rating: providerRatingData.rating, reviews: providerRatingData.reviewsFormatted };
  const websiteUrl = provider.website ? buildProviderWebsiteUrl(provider.website, provider.id) : null;

  return (
    <MainLayout>
      <Helmet>
        <title>{`${provider.name} Reviews & Tests | myhealth checkup`}</title>
        <meta
          name="description"
          content={`${provider.name} private health tests reviewed and compared.${
            providerRatingData.rating
              ? ` Rated ${providerRatingData.rating}/5 from ${providerRatingData.reviews.toLocaleString()} reviews.`
              : ""
          } Browse the full test range, prices, accreditations and turnaround times.`.slice(0, 158)}
        />
        <link rel="canonical" href={`https://myhealthcheckup.co.uk/provider/${provider.id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="myhealth checkup" />
        <meta property="og:title" content={`${provider.name} Reviews & Tests | myhealth checkup`} />
        <meta property="og:description" content={`${provider.name} private health tests reviewed and compared. Browse the full test range, prices and accreditations.`} />
        <meta property="og:url" content={`https://myhealthcheckup.co.uk/provider/${provider.id}`} />
        <meta property="og:locale" content="en_GB" />
      </Helmet>

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
                {(provider as { cqcRegistrationNumber?: string }).cqcRegistrationNumber && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs bg-blue-100 text-blue-800 font-mono"
                    title="CQC registration number — verifiable on the Care Quality Commission public register"
                  >
                    <Shield className="w-3 h-3" />
                    CQC: {(provider as { cqcRegistrationNumber?: string }).cqcRegistrationNumber}
                  </Badge>
                )}
              </div>
              
              <p className="text-base md:text-lg mb-6" style={{ color: brand ? 'rgba(255,255,255,0.9)' : 'hsl(var(--muted-foreground))' }}>{provider.description}</p>
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
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Lab Accredited</p>
                  <p className="text-xs text-muted-foreground">{provider.accreditation || 'UKAS ISO 15189'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <Building2 className="w-5 h-5 flex-shrink-0" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
                <div>
                  <p className="text-sm font-medium">CQC Regulated</p>
                  <p className="text-xs text-muted-foreground">{provider.clinics || 'Registered clinics'}</p>
                </div>
              </div>
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
          <div className="lg:col-span-1 flex flex-col gap-4">
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
                    <a href={websiteUrl || provider.website} {...externalLinkProps} className="hover:underline text-sm md:text-base break-all touch-manipulation text-green-800">{provider.website.replace('https://', '').replace('http://', '')}</a>
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
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="flex flex-col flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={brand ? { color: brand.primary } : { color: 'hsl(var(--primary))' }} />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {provider.tests && (<div><p className="font-medium text-foreground">Available Tests</p><p className="text-muted-foreground">{provider.tests}</p></div>)}
                {provider.sampleCollection && (<div><p className="font-medium text-foreground">Sample Collection</p><p className="text-muted-foreground">{provider.sampleCollection}</p></div>)}
                {provider.turnaroundTime && (<div><p className="font-medium text-foreground">Results Turnaround</p><p className="text-muted-foreground">{provider.turnaroundTime}</p></div>)}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <ProviderTestsGrid providerSlug={provider.id} providerDisplayName={provider.name} />
        </div>
      </main>

      <div className="mt-8 mb-12 px-4 sm:px-10">
        <div style={{ background: "linear-gradient(135deg, #e70d69, #22c0d4, #e70d69)", padding: "3px", borderRadius: "16px" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8" style={{ background: "#0a1120", padding: "32px 36px", borderRadius: "13px" }}>
            <div className="text-center sm:text-left">
              <p style={{ color: "#22c0d4", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>Not Sure Where to Start?</p>
              <h2 style={{ color: "#ffffff", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, margin: 0 }}>Find the Right Health Test for You</h2>
            </div>
            <Link to="/find-test" className="inline-block whitespace-nowrap text-center" style={{ background: "linear-gradient(135deg, #e70d69 0%, #ff4d6d 100%)", color: "#ffffff", border: "none", padding: "16px 36px", fontSize: "16px", fontWeight: 600, borderRadius: "10px", cursor: "pointer", transition: "transform 0.2s ease", textDecoration: "none" }}>Start Your Quiz →</Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default ProviderProfilePage;
