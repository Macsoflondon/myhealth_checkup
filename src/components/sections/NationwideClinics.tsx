import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapPin, Search, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useClinicsData } from "@/hooks/useClinicsData";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useUserLocation } from "@/hooks/useUserLocation";
import { filterAndSortClinics } from "@/utils/clinicFilters";
import { DISTANCE_CONFIG } from "@/constants/config";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const NationwideClinics = () => {
  const navigate = useNavigate();
  const { clinics, loading } = useClinicsData();
  const { location, requestGeolocation } = useUserLocation();
  const { geocodePostcode, searching, error: geocodeError } = useGeocoding();
  
  const [postcode, setPostcode] = useState("");
  const [radius, setRadius] = useState<number>(DISTANCE_CONFIG.DEFAULT_RADIUS_MILES);
  const [atHomeOnly, setAtHomeOnly] = useState(false);
  const [center, setCenter] = useState<[number, number]>(location);
  const [showAll, setShowAll] = useState(false);

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
    }
  };

  const handleClearSearch = () => {
    setPostcode("");
    setShowAll(false);
    requestGeolocation();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter and sort clinics
  const filteredClinics = filterAndSortClinics(
    clinics,
    center[0],
    center[1],
    radius,
    atHomeOnly
  );

  const displayedClinics = showAll ? filteredClinics : filteredClinics.slice(0, 12);

  const badges = [
    { label: "Trusted Providers", value: "7", color: "bg-[#22c0d4]" },
    { label: "Available Tests", value: "200+", color: "bg-[#e70d69]" },
    { label: "Nationwide Clinics", value: filteredClinics.length.toString(), color: "bg-[#081129]" },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#081129] mb-3">
            Nationwide Clinics
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Find trusted blood test clinics near you
          </p>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`${badge.color} text-white rounded-xl p-4 text-center shadow-lg`}
            >
              <div className="text-3xl font-bold mb-1">{badge.value}</div>
              <div className="text-sm font-medium">{badge.label}</div>
            </div>
          ))}
        </div>

        {/* Search Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[#081129] mb-2">
                Postcode
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Enter postcode (e.g., SW1A 1AA)"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-24"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Button
                    onClick={handleSearch}
                    disabled={!postcode.trim() || searching}
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#e70d69] hover:bg-[#e70d69]/90 text-white"
                  >
                    {searching ? "Searching..." : "Search"}
                  </Button>
                </div>
                {postcode && (
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    size="default"
                    className="border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white"
                  >
                    Clear
                  </Button>
                )}
              </div>
              {geocodeError && (
                <p className="text-sm text-red-600 mt-1">{geocodeError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#081129] mb-2">
                Radius (miles)
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                {DISTANCE_CONFIG.RADIUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} miles
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={requestGeolocation}
                variant="outline"
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Use My Location
              </Button>
            </div>
          </div>

          {/* At-home kits filter toggle */}
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
            <Switch
              id="at-home-kits"
              checked={atHomeOnly}
              onCheckedChange={setAtHomeOnly}
            />
            <Label htmlFor="at-home-kits" className="text-sm font-medium text-[#081129] cursor-pointer">
              At-home kits only
            </Label>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8" style={{ height: "500px" }}>
          {!loading && (
            <MapContainer
              // @ts-ignore
              center={center}
              zoom={10}
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
                        <h3 className="font-bold text-[#081129] mb-1">{clinic.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{clinic.full_address}</p>
                        <p className="text-sm text-gray-600 mb-1">{clinic.postal_code}</p>
                        {clinic.distance && (
                          <p className="text-sm font-medium text-[#22c0d4] mb-1">
                            {clinic.distance.toFixed(1)} miles away
                          </p>
                        )}
                        {clinic.provider_id && (
                          <p className="text-sm font-medium text-[#22c0d4]">
                            Provider: {clinic.provider_id}
                          </p>
                        )}
                        {clinic.access_note && (
                          <p className="text-xs text-gray-500 mt-2">
                            {clinic.access_note}
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

        {/* Clinic List */}
        {filteredClinics.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#081129] mb-6">
              {filteredClinics.length} Clinic{filteredClinics.length !== 1 ? "s" : ""} Found
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-[#081129] text-lg leading-tight pr-2">
                      {clinic.name}
                    </h4>
                    {clinic.distance && (
                      <span className="flex-shrink-0 bg-[#22c0d4] text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {clinic.distance.toFixed(1)} mi
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {clinic.full_address}
                    </p>
                    <p className="text-sm font-medium text-[#081129]">
                      {clinic.postal_code}
                    </p>
                  </div>

                  {clinic.provider_id && (
                    <div className="mb-3">
                      <span className="inline-block bg-[#e70d69] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {clinic.provider_id}
                      </span>
                    </div>
                  )}

                  {clinic.access_note && (
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                      {clinic.access_note}
                    </p>
                  )}

                  <Button
                    onClick={() => navigate("/find-clinic")}
                    size="sm"
                    className="w-full bg-[#081129] hover:bg-[#081129]/90 text-white"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            {/* Show All / Show Less Button */}
            {filteredClinics.length > 12 && (
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold px-8"
                >
                  {showAll ? "Show Less" : `Show All ${filteredClinics.length} Clinics`}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/find-clinic")}
            className="bg-[#e70d69] hover:bg-[#e70d69]/90 text-white font-semibold rounded-xl shadow-lg"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Find a Clinic Near You
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/trusted-providers")}
            variant="outline"
            className="border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold rounded-xl"
          >
            View Providers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NationwideClinics;
