import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapPin, Search, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Clinic {
  id: string;
  name: string;
  full_address: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  access_note?: string;
  provider_id?: string;
}

interface ClinicWithDistance extends Clinic {
  distance?: number;
}

const NationwideClinics = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [postcode, setPostcode] = useState("");
  const [radius, setRadius] = useState(25);
  const [atHomeOnly, setAtHomeOnly] = useState(false);
  const [center, setCenter] = useState<[number, number]>([51.5074, -0.1278]); // London default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClinics();
    requestGeolocation();
  }, []);

  const requestGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
        },
        (error) => {
          console.log("Geolocation not available:", error);
        }
      );
    }
  };

  const loadClinics = async () => {
    try {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (error) throw error;
      setClinics(data || []);
    } catch (error) {
      console.error("Error loading clinics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter clinics based on at-home kits toggle and add distance calculations
  const filteredClinics: ClinicWithDistance[] = (atHomeOnly
    ? clinics.filter((clinic) => {
        const providerId = clinic.provider_id?.toLowerCase() || "";
        const accessNote = clinic.access_note?.toLowerCase() || "";
        return (
          providerId.includes("thriva") ||
          providerId.includes("medichecks") ||
          providerId.includes("randox") ||
          accessNote.includes("home") ||
          accessNote.includes("kit")
        );
      })
    : clinics
  ).map((clinic) => ({
    ...clinic,
    distance: calculateDistance(center[0], center[1], clinic.latitude, clinic.longitude),
  })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

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
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter postcode..."
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
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
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
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
                        {clinic.provider_id && (
                          <p className="text-sm font-medium text-[#22c0d4]">
                            Provider ID: {clinic.provider_id}
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
              {filteredClinics.slice(0, 12).map((clinic) => (
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
                    onClick={() => navigate("/clinics")}
                    size="sm"
                    className="w-full bg-[#081129] hover:bg-[#081129]/90 text-white"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/clinics")}
            className="bg-[#e70d69] hover:bg-[#e70d69]/90 text-white font-semibold rounded-xl shadow-lg"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Find a Clinic Near You
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/providers")}
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
