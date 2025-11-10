import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import "leaflet/dist/leaflet.css";

interface Clinic {
  id: string;
  name: string;
  full_address: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  provider_id: string;
  access_note?: string;
}

const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const NationwideClinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPostcode, setSearchPostcode] = useState("");
  const [radiusMiles, setRadiusMiles] = useState("25");
  const [mapCenter, setMapCenter] = useState<[number, number]>([54.5, -4]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch clinics from Supabase
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const { data, error } = await supabase
          .from("clinics")
          .select("*")
          .not("latitude", "is", null)
          .not("longitude", "is", null);

        if (error) throw error;
        setClinics(data || []);
      } catch (error) {
        console.error("Error fetching clinics:", error);
        toast({
          title: "Error loading clinics",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [toast]);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.log("Geolocation not available:", error);
        }
      );
    }
  }, []);

  const clinicCount = useMemo(() => clinics.length, [clinics]);

  const handleSearchPostcode = () => {
    if (!searchPostcode.trim()) {
      toast({
        title: "Please enter a postcode",
        variant: "destructive",
      });
      return;
    }
    // In a real implementation, you would geocode the postcode
    toast({
      title: "Searching...",
      description: `Looking for clinics near ${searchPostcode}`,
    });
  };

  return (
    <section className="w-full bg-[#081129] py-8 sm:py-12 relative">
      {/* Soft top fade overlay */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#081129]/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Nationwide Clinics
          </h2>
          <p className="text-base sm:text-lg text-white/80">
            Find trusted blood test clinics near you
          </p>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-md">
            <span className="text-[#22c0d4] font-bold text-sm sm:text-base block">
              7 Trusted Providers
            </span>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-md">
            <span className="text-[#e70d69] font-bold text-sm sm:text-base block">
              200+ Available Tests
            </span>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-md">
            <span className="text-[#22c0d4] font-bold text-sm sm:text-base block">
              {clinicCount}+ Nationwide Clinics
            </span>
          </div>
        </div>

        {/* Search Controls */}
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Enter postcode"
                value={searchPostcode}
                onChange={(e) => setSearchPostcode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchPostcode()}
                className="pl-10 text-[#081129] border-2 border-gray-200 focus:border-[#22c0d4]"
              />
            </div>
            
            <div className="flex gap-3 items-center">
              <Filter className="text-gray-400 w-5 h-5" />
              <Select value={radiusMiles} onValueChange={setRadiusMiles}>
                <SelectTrigger className="w-[140px] border-2 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 miles</SelectItem>
                  <SelectItem value="10">10 miles</SelectItem>
                  <SelectItem value="25">25 miles</SelectItem>
                  <SelectItem value="50">50 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearchPostcode}
              className="bg-[#22c0d4] hover:bg-[#1aa8ba] text-white"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="rounded-xl overflow-hidden shadow-2xl mb-6 h-[400px] sm:h-[500px] md:h-[600px]">
          {!loading && (
            <MapContainer
              // @ts-ignore - react-leaflet type issues
              center={mapCenter}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                // @ts-ignore - react-leaflet type issues
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapCenterUpdater center={mapCenter} />
              <MarkerClusterGroup>
                {clinics.map((clinic) => (
                  <Marker
                    key={clinic.id}
                    // @ts-ignore - react-leaflet type issues
                    position={[clinic.latitude, clinic.longitude]}
                  >
                    <Popup>
                      <div className="text-[#081129] p-2">
                        <h3 className="font-bold text-base mb-1">{clinic.name}</h3>
                        <p className="text-sm mb-1">{clinic.full_address}</p>
                        <p className="text-sm font-medium mb-1">
                          Postcode: {clinic.postal_code}
                        </p>
                        {clinic.access_note && (
                          <p className="text-xs text-gray-600 italic">
                            {clinic.access_note}
                          </p>
                        )}
                        <p className="text-xs text-[#22c0d4] font-medium mt-2">
                          Provider: {clinic.provider_id}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}
          {loading && (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <p className="text-[#081129]">Loading clinics...</p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate("/find-clinic")}
            size="lg"
            className="bg-[#22c0d4] hover:bg-[#1aa8ba] text-white px-8 py-6 text-base sm:text-lg font-medium rounded-xl w-full sm:w-auto"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Find a clinic near you
          </Button>
          <Button
            onClick={() => navigate("/trusted-providers")}
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-[#081129] px-8 py-6 text-base sm:text-lg font-medium rounded-xl w-full sm:w-auto"
          >
            View providers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NationwideClinics;
