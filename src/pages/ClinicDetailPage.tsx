import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  ChevronLeft,
  Droplets,
  Navigation,
  Calendar,
  CheckCircle2,
  Loader2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { useClinicsData } from "@/hooks/useClinicsData";
import { useClinicTests } from "@/hooks/useClinicTests";
import { providers } from "@/constants/providers";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Sample opening hours (would come from database in production)
const OPENING_HOURS = [
  { day: "Monday", hours: "08:00 - 18:00" },
  { day: "Tuesday", hours: "08:00 - 18:00" },
  { day: "Wednesday", hours: "08:00 - 18:00" },
  { day: "Thursday", hours: "08:00 - 18:00" },
  { day: "Friday", hours: "08:00 - 18:00" },
  { day: "Saturday", hours: "09:00 - 14:00" },
  { day: "Sunday", hours: "Closed" },
];

const ClinicDetailPage = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const { clinics, loading } = useClinicsData();
  const [clinic, setClinic] = useState<any>(null);
  const [showAllTests, setShowAllTests] = useState(false);

  useEffect(() => {
    if (clinics.length > 0 && clinicId) {
      const foundClinic = clinics.find((c) => c.id === clinicId);
      setClinic(foundClinic);
    }
  }, [clinics, clinicId]);

  const getProviderInfo = (providerId: string | null) => {
    if (!providerId) return null;
    return providers.find((p) => 
      providerId.toLowerCase().includes(p.id.toLowerCase()) ||
      p.id.toLowerCase().includes(providerId.toLowerCase())
    );
  };

  const providerInfo = clinic ? getProviderInfo(clinic.provider_id) : null;
  
  // Fetch tests available at this clinic based on provider
  const { data: clinicTests = [], isLoading: testsLoading } = useClinicTests(clinic?.provider_id);
  
  // Group tests by category
  const testsByCategory = clinicTests.reduce((acc, test) => {
    const category = test.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(test);
    return acc;
  }, {} as Record<string, typeof clinicTests>);
  
  const displayedTests = showAllTests ? clinicTests : clinicTests.slice(0, 12);

  const handleGetDirections = () => {
    if (clinic?.latitude && clinic?.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading clinic details...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!clinic) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Clinic Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The clinic you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/find-clinic">
              <Button>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Clinic Finder
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{clinic.name} | Blood Test Clinic | myhealth checkup</title>
        <meta
          name="description"
          content={`Book a blood test appointment at ${clinic.name}. ${clinic.full_address}. View opening hours, available tests, and directions.`}
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <Link
              to="/find-clinic"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Clinic Finder
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-muted/30 to-background py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Clinic Info */}
              <div>
                {/* Provider Logo */}
                {providerInfo && (
                  <div className="mb-4">
                    <ProviderLogo
                      provider={providerInfo.name}
                      className="h-10 w-auto"
                    />
                  </div>
                )}

                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {clinic.name}
                </h1>

                <div className="flex items-start gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{clinic.full_address || clinic.postal_code}</span>
                </div>

                {clinic.access_note && (
                  <div className="flex items-start gap-2 text-muted-foreground mb-6">
                    <Droplets className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span>{clinic.access_note}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {providerInfo && (
                    <a
                      href={providerInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </a>
                  )}
                  <Button variant="outline" onClick={handleGetDirections}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>

                {/* Accreditation Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    UKAS Accredited
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                    CQC Regulated
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                    ISO 15189
                  </Badge>
                </div>
              </div>

              {/* Map */}
              <div className="h-64 sm:h-80 lg:h-full min-h-[300px] rounded-xl overflow-hidden border border-border shadow-lg">
                {clinic.latitude && clinic.longitude && (
                  <MapContainer
                    // @ts-ignore
                    center={[clinic.latitude, clinic.longitude]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      // @ts-ignore
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      // @ts-ignore
                      position={[clinic.latitude, clinic.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{clinic.name}</h3>
                          <p className="text-sm">{clinic.full_address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Opening Hours */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Opening Hours
                </h2>
              </div>
              <div className="space-y-2">
                {OPENING_HOURS.map((item) => (
                  <div key={item.day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.day}</span>
                    <span
                      className={
                        item.hours === "Closed"
                          ? "text-destructive"
                          : "text-foreground font-medium"
                      }
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Tests */}
            <div className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Available Tests
                  </h2>
                  {clinicTests.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {clinicTests.length} tests
                    </Badge>
                  )}
                </div>
                {providerInfo && (
                  <Link 
                    to={`/provider/${providerInfo.id}/tests`}
                    className="text-sm text-primary hover:underline hidden sm:inline-flex items-center gap-1"
                  >
                    View full catalogue
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
              
              {testsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading available tests...</span>
                </div>
              ) : clinicTests.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayedTests.map((test) => (
                      <div
                        key={test.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {test.test_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {test.price && (
                              <span className="text-xs font-semibold text-primary">
                                £{test.price.toFixed(2)}
                              </span>
                            )}
                            {test.category && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                <Tag className="w-2.5 h-2.5 mr-1" />
                                {test.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {test.url && (
                          <a
                            href={test.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {clinicTests.length > 12 && (
                    <div className="mt-4 text-center">
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowAllTests(!showAllTests)}
                        className="text-primary"
                      >
                        {showAllTests 
                          ? "Show fewer tests" 
                          : `Show all ${clinicTests.length} tests`
                        }
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Droplets className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    Test information not available for this clinic.
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Please contact the provider for available tests.
                  </p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
                <Link to="/compare">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Compare all tests
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                {providerInfo && (
                  <Link to={`/provider/${providerInfo.id}/tests`} className="sm:hidden">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      View full catalogue
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking CTA */}
        <div className="bg-primary/5 border-y border-primary/10 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to book your appointment?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Choose from a wide range of blood tests at {clinic.name}. Our professional
              phlebotomists ensure a comfortable and efficient experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {providerInfo && (
                <a
                  href={providerInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Now at {providerInfo.name}
                  </Button>
                </a>
              )}
              <Link to="/compare">
                <Button size="lg" variant="outline">
                  Browse All Tests
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">
              Need Help?
            </h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about booking an appointment or need assistance, our
              support team is here to help.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Link to="/faqs">
                <Button variant="ghost">View FAQs</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ClinicDetailPage;
