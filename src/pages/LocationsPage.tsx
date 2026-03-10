import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

// Type casting for react-leaflet compatibility
const RMapContainer = MapContainer as any;
const RTileLayer = TileLayer as any;
const RMarker = Marker as any;
import { MapPin, Search, Droplets, Navigation, Phone, Clock, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { ProviderLogo } from "@/components/ProviderLogo";
import { useClinicsData } from "@/hooks/useClinicsData";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useProviderTestCounts, getTestCountForProvider } from "@/hooks/useProviderTestCounts";
import { filterAndSortClinics } from "@/utils/clinicFilters";
import { DISTANCE_CONFIG } from "@/constants/config";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import HeroSection from "@/components/sections/HeroSection";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// UK regions for area filter
const UK_REGIONS = [
  { value: "all", label: "All Areas" },
  { value: "london", label: "London" },
  { value: "south-east", label: "South East" },
  { value: "south-west", label: "South West" },
  { value: "east", label: "East" },
  { value: "midlands", label: "Midlands & North" },
  { value: "scotland", label: "Scotland" },
  { value: "wales", label: "Wales" },
  { value: "northern-ireland", label: "Northern Ireland" },
];

// Service types
const SERVICE_TYPES = [
  { value: "all", label: "All Services" },
  { value: "venous", label: "Venous Draw Blood Tests" },
  { value: "finger-prick", label: "Finger Prick Tests" },
  { value: "at-home", label: "At-Home Kits" },
];

// Provider filter options
const PROVIDERS = [
  { value: "all", label: "All Providers" },
  { value: "medichecks", label: "Medichecks" },
  { value: "goodbody", label: "Goodbody Clinic" },
  { value: "randox", label: "Randox Health" },
  { value: "thriva", label: "Thriva" },
  { value: "lola-health", label: "Lola Health" },
  { value: "london-medical-laboratory", label: "London Medical Laboratory" },
];

const LocationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { clinics, loading } = useClinicsData();
  const { location, requestGeolocation } = useUserLocation();
  const { geocodePostcode, searching, error: geocodeError } = useGeocoding();
  const { data: testCounts = {} } = useProviderTestCounts();

  // Get initial state from URL params
  const initialPostcode = searchParams.get("postcode") || "";
  const initialArea = searchParams.get("area") || "all";
  const initialService = searchParams.get("service") || "all";
  const initialProvider = searchParams.get("provider") || "all";

  const [postcode, setPostcode] = useState(initialPostcode);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedProvider, setSelectedProvider] = useState(initialProvider);
  const [center, setCenter] = useState<[number, number]>(location);
  const [showAll, setShowAll] = useState(false);
  const [mapZoom, setMapZoom] = useState(6);

  // Update URL when filters change
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

  // Update center when location changes
  useEffect(() => {
    if (!initialPostcode) {
      setCenter(location);
    }
  }, [location, initialPostcode]);

  // Geocode initial postcode from URL
  useEffect(() => {
    if (initialPostcode) {
      geocodePostcode(initialPostcode).then((result) => {
        if (result) {
          setCenter([result.lat, result.lon]);
          setMapZoom(11);
        }
      });
    }
  }, []);

  const handleSearch = async () => {
    if (!postcode.trim()) return;

    const result = await geocodePostcode(postcode);
    if (result) {
      setCenter([result.lat, result.lon]);
      setMapZoom(11);
      updateUrlParams({ postcode: postcode.trim() });
    }
  };

  const handleClearSearch = () => {
    setPostcode("");
    setMapZoom(6);
    updateUrlParams({ postcode: "" });
    requestGeolocation();
  };

  const handleUseMyLocation = () => {
    requestGeolocation();
    setMapZoom(11);
    updateUrlParams({ postcode: "" });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    updateUrlParams({ area: value });
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    updateUrlParams({ service: value });
  };

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value);
    updateUrlParams({ provider: value });
  };

  // Filter clinics
  let filteredClinics = clinics;

  // Filter by area
  if (selectedArea !== "all") {
    filteredClinics = filteredClinics.filter((clinic) => {
      const address = clinic.full_address?.toLowerCase() || "";
      const name = clinic.name?.toLowerCase() || "";
      const areaLabel = UK_REGIONS.find((r) => r.value === selectedArea)?.label.toLowerCase() || "";
      return address.includes(areaLabel) || name.includes(areaLabel);
    });
  }

  // Filter by provider
  if (selectedProvider !== "all") {
    filteredClinics = filteredClinics.filter((clinic) => {
      const providerId = clinic.provider_id?.toLowerCase() || "";
      return providerId.includes(selectedProvider);
    });
  }

  // Add distance and sort
  const sortedClinics = filterAndSortClinics(
    filteredClinics,
    center[0],
    center[1],
    DISTANCE_CONFIG.DEFAULT_RADIUS_MILES * 20,
    false
  );

  const displayedClinics = showAll ? sortedClinics : sortedClinics.slice(0, 12);
  const totalCount = sortedClinics.length;

  return (
    <>
      <Helmet>
        <title>Clinic Locations | Find Blood Test Clinics Near You | myhealth checkup</title>
        <meta
          name="description"
          content="Find trusted blood test clinic locations across the UK. Search by postcode, filter by area or provider, and book your appointment today."
        />
      </Helmet>

      <UKASBanner />
      <Header />

      <main className="min-h-screen bg-background">
        <HeroSection
          title="Our Clinic Locations"
          subtitle="We have hundreds of locations across the UK, providing convenient, local appointments for customers just like you."
        >
          {/* Trust Badge */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-sm font-medium text-white/80">Rated</span>
              <span className="text-sm font-bold text-white">Excellent</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-[#00b67a]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-white/70">(4.8)</span>
            </div>
          </div>
        </HeroSection>

        {/* Map Section */}
        <div className="bg-muted/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div
              className="bg-card rounded-xl shadow-lg overflow-hidden border border-border"
              style={{ height: "400px" }}
            >
              {!loading && (
                <RMapContainer
                  key={`locations-map-${center[0]}-${center[1]}`}
                  center={center}
                  zoom={mapZoom}
                  style={{ height: "100%", width: "100%" }}
                >
                  <RTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MarkerClusterGroup>
                    {sortedClinics.map((clinic) => (
                      <RMarker
                        key={clinic.id}
                        position={[clinic.latitude, clinic.longitude]}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-foreground mb-1">{clinic.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {clinic.full_address}
                            </p>
                            {clinic.distance && (
                              <p className="text-sm font-medium text-primary">
                                {clinic.distance.toFixed(1)} miles away
                              </p>
                            )}
                          </div>
                        </Popup>
                      </RMarker>
                    ))}
                  </MarkerClusterGroup>
                </RMapContainer>
              )}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Services Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Services</label>
              <select
                value={selectedService}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                {SERVICE_TYPES.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Area</label>
              <select
                value={selectedArea}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                {UK_REGIONS.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Provider Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                {PROVIDERS.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Postcode Search */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Search by Postcode
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20 h-12 rounded-lg border-border"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!postcode.trim() || searching}
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
                >
                  {searching ? "..." : "Search"}
                </Button>
              </div>
              {geocodeError && <p className="text-sm text-destructive mt-1">{geocodeError}</p>}
            </div>
          </div>

          {/* Location Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              onClick={handleUseMyLocation}
              variant="outline"
              className="border-foreground/20"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Use My Location
            </Button>
            {(postcode || selectedArea !== "all" || selectedProvider !== "all") && (
              <Button
                onClick={() => {
                  handleClearSearch();
                  setSelectedArea("all");
                  setSelectedProvider("all");
                  updateUrlParams({ area: "", provider: "", postcode: "" });
                }}
                variant="ghost"
              >
                Clear All Filters
              </Button>
            )}
            <div className="ml-auto text-sm text-muted-foreground self-center">
              Showing {displayedClinics.length} of {totalCount} clinics
            </div>
          </div>

          {/* Clinic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-200"
              >
                {/* Provider Logo */}
                {clinic.provider_id && (
                  <div className="mb-3">
                    <ProviderLogo
                      provider={clinic.provider_id}
                      className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
                    />
                  </div>
                )}

                {/* Clinic Name */}
                <h3 className="font-heading font-bold text-foreground text-lg mb-2 leading-tight">
                  {clinic.name}
                </h3>

                {/* Address */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {clinic.full_address || clinic.postal_code}
                </p>

                {/* Distance and Test Count Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {clinic.distance && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {clinic.distance.toFixed(1)} miles
                    </span>
                  )}
                  {(() => {
                    const testCount = getTestCountForProvider(testCounts, clinic.provider_id);
                    return testCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                        <FlaskConical className="w-3 h-3" />
                        {testCount} tests
                      </span>
                    ) : null;
                  })()}
                </div>

                {/* Service Type with Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {clinic.access_note || "Blood Tests"}
                    </span>
                  </div>

                  <Link to={`/locations/${clinic.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background font-medium rounded-lg"
                    >
                      View Clinic
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {displayedClinics.length === 0 && !loading && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                No clinics found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or searching a different area.
              </p>
              <Button
                onClick={() => {
                  handleClearSearch();
                  setSelectedArea("all");
                  setSelectedProvider("all");
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Show More Button */}
          {totalCount > 12 && (
            <div className="mt-10 text-center">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                size="lg"
                className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-semibold px-8 rounded-lg"
              >
                {showAll ? "Show Less" : `View All ${totalCount} Clinics`}
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default LocationsPage;
