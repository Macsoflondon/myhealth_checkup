import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapPin, Navigation, Shield, Clock, Award, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/sections/PageBanner";
import { SectionHeading } from "@/components/ui/section-heading";
import ClinicMap from "@/components/clinic/ClinicMap";
import ClinicCard from "@/components/clinic/ClinicCard";
import { useProviderTestCounts, getTestCountForProvider } from "@/hooks/useProviderTestCounts";
import { useToast } from "@/hooks/use-toast";

interface Clinic {
  id: string;
  name: string;
  full_address: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  provider_id?: string;
  access_note?: string;
  distance?: number;
}

const DEFAULT_CENTER: [number, number] = [54.0, -2.0]; // UK center

const PROVIDERS = [
  { value: "all", label: "All Providers" },
  { value: "medichecks", label: "Medichecks" },
  { value: "goodbody", label: "Goodbody Clinic" },
  { value: "randox", label: "Randox Health" },
  { value: "thriva", label: "Thriva" },
  { value: "lola-health", label: "Lola Health" },
  { value: "london-medical-laboratory", label: "London Medical Laboratory" },
];

const RADIUS_OPTIONS = [
  { value: "all", label: "All Distances" },
  { value: "5", label: "Within 5 miles" },
  { value: "10", label: "Within 10 miles" },
  { value: "25", label: "Within 25 miles" },
  { value: "50", label: "Within 50 miles" },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const benefits = [
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description: "200+ clinic locations across the UK from trusted providers",
  },
  {
    icon: Shield,
    title: "UKAS Accredited",
    description: "All clinics partner with UKAS-accredited laboratories",
  },
  {
    icon: Clock,
    title: "Convenient Hours",
    description: "Flexible appointment times including evenings and weekends",
  },
  {
    icon: Award,
    title: "Professional Service",
    description: "Trained phlebotomists and modern clinical facilities",
  },
];

const FindClinicPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: testCounts = {} } = useProviderTestCounts();
  const { toast } = useToast();

  const initialPostcode = searchParams.get("postcode") || "";
  const initialProvider = searchParams.get("provider") || "all";

  const [postcode, setPostcode] = useState(initialPostcode);
  const [selectedProvider, setSelectedProvider] = useState(initialProvider);
  const [radiusFilter, setRadiusFilter] = useState("all");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Load clinics from master JSON (370+ accurate geocoded locations)
  useEffect(() => {
    async function loadClinics() {
      setLoading(true);
      try {
        const response = await fetch("/clinics_master.json");
        if (!response.ok) throw new Error("Failed to load clinics data");
        const jsonClinics = await response.json();

        const normalised: Clinic[] = jsonClinics
          .filter((c: any) => c.latitude && c.longitude)
          .map((clinic: any, index: number) => ({
            id: clinic.id || `clinic-${index}`,
            name: clinic.name,
            full_address: clinic.full_address || "",
            postal_code: clinic.postal_code || "",
            latitude: Number(clinic.latitude),
            longitude: Number(clinic.longitude),
            provider_id: clinic.provider_id || undefined,
            access_note: clinic.access_note || undefined,
          }));

        setClinics(normalised);
      } catch (error) {
        console.error("Error loading clinics:", error);
        toast({
          title: "Error Loading Clinics",
          description: "Could not load clinic data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadClinics();
  }, []);

  // Geocode initial postcode from URL
  useEffect(() => {
    if (initialPostcode) {
      geocodePostcode(initialPostcode);
    }
  }, []);

  const updateUrlParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams, { replace: true });
  };

  const geocodePostcode = async (pc: string) => {
    setSearching(true);
    try {
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(pc.trim())}`
      );
      const data = await response.json();
      if (data.status !== 200 || !data.result) throw new Error("Postcode not found");
      setUserLocation([data.result.latitude, data.result.longitude]);
      toast({ title: "Location Found", description: `Showing clinics near ${pc.toUpperCase()}` });
    } catch {
      toast({
        title: "Invalid Postcode",
        description: "Could not find this postcode. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = () => {
    if (!postcode.trim()) return;
    geocodePostcode(postcode);
    updateUrlParams({ postcode: postcode.trim() });
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      setSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setSearching(false);
          toast({ title: "Location Found", description: "Showing clinics near your current location" });
        },
        () => {
          setSearching(false);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please enter a postcode instead.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleClearSearch = () => {
    setPostcode("");
    setUserLocation(null);
    setRadiusFilter("all");
    setSelectedProvider("all");
    updateUrlParams({ postcode: "", provider: "" });
  };

  // Filtered and sorted clinics
  const filteredClinics = useMemo(() => {
    let result = [...clinics];

    // Filter by provider
    if (selectedProvider !== "all") {
      result = result.filter((c) => c.provider_id?.toLowerCase().includes(selectedProvider));
    }

    // Add distance if we have user location
    if (userLocation) {
      result = result.map((c) => ({
        ...c,
        distance: calculateDistance(userLocation[0], userLocation[1], c.latitude, c.longitude),
      }));

      // Filter by radius
      if (radiusFilter !== "all") {
        const max = parseInt(radiusFilter);
        result = result.filter((c) => (c.distance || 999) <= max);
      }

      // Sort by distance
      result.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [clinics, selectedProvider, radiusFilter, userLocation]);

  const displayedClinics = showAll ? filteredClinics : filteredClinics.slice(0, 12);
  const mapCenter = userLocation || DEFAULT_CENTER;

  return (
    <>
      <Helmet>
        <title>Find a Blood Test Clinic Near You | myhealth checkup</title>
        <meta
          name="description"
          content="Find UKAS-accredited blood test clinics near you. Search by postcode, filter by distance and provider. 200+ locations nationwide from trusted UK providers."
        />
        <meta
          name="keywords"
          content="blood test clinic, phlebotomy clinic, private blood test location, UKAS clinic, health test centre near me, UK blood test"
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/find-clinic" />
        <meta property="og:title" content="Find a Blood Test Clinic Near You | myhealth checkup" />
        <meta property="og:description" content="Find UKAS-accredited blood test clinics near you. 200+ locations nationwide from trusted UK providers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/find-clinic" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find a Blood Test Clinic Near You" />
        <meta name="twitter:description" content="Search UKAS-accredited blood test clinics by postcode. 200+ locations nationwide." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            name: "myhealth checkup - Clinic Finder",
            description: "Find UKAS-accredited blood test clinics across the UK",
            url: "https://myhealthcheckup.co.uk/find-clinic",
            areaServed: { "@type": "Country", name: "United Kingdom" },
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Banner */}
        <PageBanner
          title="Find Your Nearest Clinic"
          subtitle="Search over 200 UKAS-accredited blood test clinic locations across the UK. Enter your postcode to find convenient testing facilities near you."
        >
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-bold text-brand-pink">7</span>
              <span className="text-white ml-2">Trusted Providers</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-bold text-brand-turquoise">200+</span>
              <span className="text-white ml-2">Clinic Locations</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-bold text-brand-pink">UKAS</span>
              <span className="text-white ml-2">Accredited Labs</span>
            </div>
          </div>
        </PageBanner>

        {/* Benefits Row */}
        <section className="py-4 sm:py-5 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-pink/10 flex items-center justify-center mx-auto mb-2">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-brand-pink" />
                      </div>
                      <h3 className="font-heading font-bold text-sm sm:text-base mb-1 leading-tight">{benefit.title}</h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Postcode Search */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Search by Postcode</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. SW11 6QZ"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pr-20 h-12 rounded-lg border-border"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!postcode.trim() || searching}
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-brand-turquoise hover:bg-brand-pink text-white rounded-md transition-colors"
                  >
                    {searching ? "..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Provider Filter */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    setSelectedProvider(e.target.value);
                    updateUrlParams({ provider: e.target.value });
                  }}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-turquoise/20 focus:border-brand-turquoise transition-colors"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Radius Filter */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Distance</label>
                <select
                  value={radiusFilter}
                  onChange={(e) => setRadiusFilter(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-turquoise/20 focus:border-brand-turquoise transition-colors"
                >
                  {RADIUS_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-end gap-2">
                <Button
                  onClick={handleUseMyLocation}
                  variant="outline"
                  className="border-brand-navy/20 h-12"
                  disabled={searching}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Use My Location
                </Button>
                {(postcode || selectedProvider !== "all" || radiusFilter !== "all") && (
                  <Button onClick={handleClearSearch} variant="ghost" size="sm">
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground mb-4">
              Showing {displayedClinics.length} of {filteredClinics.length} clinics
            </div>

            {/* Map */}
            <ClinicMap
              clinics={filteredClinics}
              center={mapCenter}
              userLocation={userLocation}
              loading={loading}
            />
          </div>
        </section>

        {/* Clinic Cards Grid */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeading title="Clinic" gradientText="Locations" className="mb-8" />

            {displayedClinics.length === 0 && !loading ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No clinics found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or searching a different area.</p>
                <Button onClick={handleClearSearch} variant="outline">Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedClinics.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    testCount={getTestCountForProvider(testCounts, clinic.provider_id || null)}
                  />
                ))}
              </div>
            )}

            {filteredClinics.length > 12 && (
              <div className="mt-10 text-center">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  size="lg"
                  className="bg-brand-turquoise hover:bg-brand-pink text-white px-8 rounded-xl transition-colors duration-300"
                >
                  {showAll ? "Show Less" : `View All ${filteredClinics.length} Clinics`}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* About Our Clinic Network */}
        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-muted">
                <CardContent className="p-5 sm:p-8">
                  <h2 className="text-2xl font-heading font-bold mb-4 text-brand-navy">
                    About Our Clinic Network
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      All clinics in our network partner with UKAS-accredited laboratories, ensuring
                      the highest standards of testing accuracy and reliability. Our clinic finder
                      helps you locate convenient testing facilities across the UK.
                    </p>
                    <p>
                      <strong className="text-foreground">Sample Collection Methods:</strong> Most
                      clinics offer venous blood draw services performed by qualified phlebotomists.
                      Some providers also offer finger-prick tests for specific panels.
                    </p>
                    <p>
                      <strong className="text-foreground">Booking Process:</strong> Once you've
                      selected a test from our comparison tool, you'll be directed to the provider's
                      website to book your appointment. You can then choose your preferred clinic
                      location during the booking process.
                    </p>
                    <p className="text-sm border-t pt-4 mt-4">
                      <strong className="text-foreground">Disclaimer:</strong> This platform provides
                      general health information. It is not medical advice or a substitute for
                      consultation with a qualified healthcare professional. All tests are delivered,
                      processed, and reported by the provider you select.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Provider Logos */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <SectionHeading title="Partnered Testing" gradientText="Providers" className="mb-6" />
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our clinic network includes locations from seven trusted UK private health testing providers
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
                {[
                  { name: "Medichecks", logo: "/lovable-uploads/provider-medichecks-new-v3.png" },
                  { name: "Thriva", logo: "/lovable-uploads/provider-thriva.png" },
                  { name: "Goodbody", logo: "/lovable-uploads/provider-goodbody-new-v4.png" },
                  { name: "Randox", logo: "/lovable-uploads/provider-randox.png" },
                  { name: "Lola Health", logo: "/lovable-uploads/provider-lola-health.png" },
                  { name: "London Medical Lab", logo: "/lovable-uploads/provider-london-medical.png" },
                ].map((provider, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <img
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default FindClinicPage;
