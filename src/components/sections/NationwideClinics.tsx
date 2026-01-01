import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapPin, Search, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useClinicsData } from "@/hooks/useClinicsData";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useUserLocation } from "@/hooks/useUserLocation";
import { filterAndSortClinics } from "@/utils/clinicFilters";
import { DISTANCE_CONFIG } from "@/constants/config";
import { SectionHeading } from "@/components/ui/section-heading";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// UK regions for area filter
const UK_REGIONS = [
  "All Areas",
  "London",
  "South East",
  "South West",
  "East",
  "Midlands",
  "North",
  "Scotland",
  "Wales",
  "Northern Ireland",
];

// Service types
const SERVICE_TYPES = [
  "All Services",
  "Venous Draw Blood Tests",
  "Finger Prick Tests",
  "At-Home Kits",
];

const NationwideClinics = () => {
  const navigate = useNavigate();
  const { clinics, loading } = useClinicsData();
  const { location, requestGeolocation } = useUserLocation();
  const { geocodePostcode, searching, error: geocodeError } = useGeocoding();
  
  const [postcode, setPostcode] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedService, setSelectedService] = useState("All Services");
  const [center, setCenter] = useState<[number, number]>(location);
  const [showAll, setShowAll] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Update center when location changes
  useEffect(() => {
    setCenter(location);
  }, [location]);

  // Request geolocation on mount
  useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  const handleSearch = async () => {
    if (!postcode.trim()) return;
    
    const result = await geocodePostcode(postcode);
    if (result) {
      setCenter([result.lat, result.lon]);
      setShowMap(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter clinics based on area
  const filteredByArea = selectedArea === "All Areas" 
    ? clinics 
    : clinics.filter(clinic => {
        const address = clinic.full_address?.toLowerCase() || "";
        const name = clinic.name?.toLowerCase() || "";
        const areaLower = selectedArea.toLowerCase();
        return address.includes(areaLower) || name.includes(areaLower);
      });

  // Filter and sort clinics by distance
  const filteredClinics = filterAndSortClinics(
    filteredByArea,
    center[0],
    center[1],
    DISTANCE_CONFIG.DEFAULT_RADIUS_MILES * 10, // Larger radius for initial view
    false
  );

  const displayedClinics = showAll ? filteredClinics : filteredClinics.slice(0, 9);

  return (
    <section className="w-full bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20">
        {/* Clinic Image */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src="/lovable-uploads/hero-image-1.png"
              alt="Modern clinic interior"
              className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto px-4">
          <SectionHeading 
            title="Our Clinic" 
            gradientText="Locations" 
          />
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 mt-4">
            We have hundreds of locations across the UK, providing convenient, 
            local appointments for customers just like you.
          </p>
          
          {/* Trust Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-md border border-border/50">
              <span className="text-sm font-medium text-muted-foreground">Rated</span>
              <span className="text-sm font-bold text-foreground">Excellent</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(4.8)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Services Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Services
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              {SERVICE_TYPES.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Area
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              {UK_REGIONS.map((area) => (
                <option key={area} value={area}>
                  {area}
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
            {geocodeError && (
              <p className="text-sm text-destructive mt-1">{geocodeError}</p>
            )}
          </div>
        </div>

        {/* Optional Map Toggle */}
        {showMap && (
          <div className="bg-card rounded-xl shadow-lg overflow-hidden mb-8 border border-border" style={{ height: "400px" }}>
            {!loading && (
              <MapContainer
                // @ts-ignore
                center={center}
                zoom={11}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  // @ts-ignore
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                  {filteredClinics.map((clinic) => (
                    <Marker
                      // @ts-ignore
                      key={clinic.id}
                      position={[clinic.latitude, clinic.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-foreground mb-1">{clinic.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{clinic.full_address}</p>
                          {clinic.distance && (
                            <p className="text-sm font-medium text-primary">
                              {clinic.distance.toFixed(1)} miles away
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              </MapContainer>
            )}
          </div>
        )}

        {/* Clinic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-200"
            >
              {/* Clinic Name */}
              <h3 className="font-heading font-bold text-foreground text-lg mb-2 leading-tight">
                {clinic.name}
              </h3>
              
              {/* Address */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {clinic.full_address || clinic.postal_code}
              </p>

              {/* Service Type with Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {clinic.access_note || "Venous Draw Blood Tests"}
                  </span>
                </div>
                
                <Button
                  onClick={() => navigate("/find-clinic")}
                  variant="outline"
                  size="sm"
                  className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background font-medium rounded-lg"
                >
                  View Clinic
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {filteredClinics.length > 9 && (
          <div className="mt-10 text-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              size="lg"
              className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-semibold px-8 rounded-lg"
            >
              {showAll ? "Show Less" : `View All ${filteredClinics.length} Clinics`}
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            onClick={() => navigate("/find-clinic")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg px-8"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Find Your Nearest Clinic
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NationwideClinics;
