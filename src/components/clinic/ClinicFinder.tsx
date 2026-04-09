import { useState, useEffect, useMemo, useRef, useId } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

// Type casting for react-leaflet compatibility
const RMapContainer = MapContainer as any;
const RTileLayer = TileLayer as any;
const RMarker = Marker as any;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Navigation, Search, Filter, Loader2, X } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

// Fix Leaflet default icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

interface Clinic {
  id?: string;
  name: string;
  full_address: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  provider_id?: string;
  access_note?: string;
  distance?: number;
}

const DEFAULT_CENTER: [number, number] = [51.5074, -0.1278]; // London
const DEFAULT_ZOOM = 6;

// Haversine distance formula (returns miles)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Component to fly map to new location
function FlyToLocation({ center }: { center: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { duration: 1.5 });
    }
  }, [center, map]);
  
  return null;
}

const ClinicFinder = () => {
  const [postcode, setPostcode] = useState("");
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [radiusFilter, setRadiusFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [mapKey, setMapKey] = useState(() => Date.now()); // Unique key per mount cycle
  const mapInitialized = useRef(false);
  const mapContainerId = useId();
  const { toast } = useToast();

  // Load all clinics on mount
  useEffect(() => {
    loadClinics();
  }, []);

  // Apply filters when clinics, radius, or provider changes
  useEffect(() => {
    applyFilters();
  }, [clinics, radiusFilter, providerFilter, userLocation]);

  const loadClinics = async () => {
    setLoading(true);
    try {
      // Load from local JSON as primary source (complete dataset)
      const response = await fetch("/clinics_master.json");
      if (!response.ok) throw new Error("Failed to load clinics data");
      const jsonClinics = await response.json();

      // Normalize and filter out entries without coordinates
      const normalizedClinics: Clinic[] = jsonClinics
        .filter((c: any) => c.latitude && c.longitude)
        .map((clinic: any, index: number) => ({
          id: `clinic-${index}`,
          name: clinic.name,
          full_address: clinic.full_address || "",
          postal_code: clinic.postal_code || "",
          latitude: Number(clinic.latitude),
          longitude: Number(clinic.longitude),
          provider_id: clinic.provider_id || undefined,
          access_note: clinic.access_note || undefined,
        }));

      setClinics(normalizedClinics);
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
  };

  const applyFilters = () => {
    let filtered = [...clinics];

    // Calculate distances if user location is set
    if (userLocation) {
      filtered = filtered.map(clinic => ({
        ...clinic,
        distance: calculateDistance(
          userLocation[0],
          userLocation[1],
          clinic.latitude,
          clinic.longitude
        )
      }));

      // Filter by radius
      if (radiusFilter !== "all") {
        const maxDistance = parseInt(radiusFilter);
        filtered = filtered.filter(clinic => (clinic.distance || 999) <= maxDistance);
      }

      // Sort by distance
      filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    } else {
      // Sort alphabetically if no user location
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Filter by provider
    if (providerFilter !== "all") {
      filtered = filtered.filter(clinic => 
        clinic.provider_id?.toLowerCase().includes(providerFilter.toLowerCase())
      );
    }

    setFilteredClinics(filtered);
  };

  const geocodePostcode = async (pc: string): Promise<{ lat: number; lon: number }> => {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(pc.trim())}`
    );
    const data = await response.json();
    
    if (data.status !== 200 || !data.result) {
      throw new Error("Postcode not found");
    }
    
    return {
      lat: data.result.latitude,
      lon: data.result.longitude
    };
  };

  const handleSearch = async () => {
    if (!postcode.trim()) {
      toast({
        title: "Postcode Required",
        description: "Please enter a valid UK postcode.",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      const location = await geocodePostcode(postcode);
      setUserLocation([location.lat, location.lon]);
      
      toast({
        title: "Location Found",
        description: `Showing clinics near ${postcode.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Invalid Postcode",
        description: "Could not find this postcode. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setPostcode("");
    setUserLocation(null);
    setRadiusFilter("all");
    setProviderFilter("all");
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      setSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setSearching(false);
          toast({
            title: "Location Found",
            description: "Showing clinics near your current location",
          });
        },
        (error) => {
          setSearching(false);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please enter a postcode instead.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const mapCenter = userLocation || DEFAULT_CENTER;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="border-2 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#FA6980]" />
            Search for Clinics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Postcode Search */}
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter your postcode (e.g., SW11 6QZ)"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={searching || !postcode.trim()}
              className="bg-[#FA6980] hover:bg-[#E70D69] text-white"
            >
              {searching ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching</>
              ) : (
                <><Search className="w-4 h-4 mr-2" /> Search</>
              )}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={handleUseMyLocation}
              disabled={searching}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Use My Location
            </Button>
            
            {userLocation && (
              <Button 
                variant="outline" 
                onClick={handleClearSearch}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Search
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Distance Radius</label>
                <Select value={radiusFilter} onValueChange={setRadiusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clinics</SelectItem>
                    <SelectItem value="5">Within 5 miles</SelectItem>
                    <SelectItem value="10">Within 10 miles</SelectItem>
                    <SelectItem value="25">Within 25 miles</SelectItem>
                    <SelectItem value="50">Within 50 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Provider</label>
                <Select value={providerFilter} onValueChange={setProviderFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    <SelectItem value="medichecks">Medichecks</SelectItem>
                    <SelectItem value="thriva">Thriva</SelectItem>
                    <SelectItem value="goodbody">Goodbody</SelectItem>
                    <SelectItem value="randox">Randox</SelectItem>
                    <SelectItem value="lola">Lola Health</SelectItem>
                    <SelectItem value="london">London Medical Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="bg-[#22C0D4]/10 text-[#22C0D4]">
              {filteredClinics.length} {filteredClinics.length === 1 ? "clinic" : "clinics"} found
            </Badge>
            {userLocation && radiusFilter !== "all" && (
              <span>within {radiusFilter} miles</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
        {/* Map */}
        <Card className="border-2 border-muted overflow-hidden">
          <div className="h-[600px] w-full relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <Loader2 className="w-8 h-8 animate-spin text-[#FA6980]" />
              </div>
            ) : (
              <RMapContainer
                key={`clinic-map-${mapKey}`}
                id={`leaflet-map-${mapContainerId}-${mapKey}`}
                center={mapCenter}
                zoom={userLocation ? 12 : DEFAULT_ZOOM}
                className="h-full w-full"
                scrollWheelZoom={true}
                whenReady={() => { mapInitialized.current = true; }}
              >
                <RTileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyToLocation center={userLocation} />
                
                {/* User Location Marker */}
                {userLocation && (
                  <RMarker position={userLocation}>
                    <Popup>
                      <div className="font-semibold text-[#081129]">Your Location</div>
                    </Popup>
                  </RMarker>
                )}

                {/* Clinic Markers with Clustering */}
                <MarkerClusterGroup chunkedLoading>
                  {filteredClinics.map((clinic, index) => (
                    <RMarker
                      key={clinic.id || index}
                      position={[clinic.latitude, clinic.longitude]}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <h4 className="font-bold text-[#081129] mb-2">{clinic.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{clinic.full_address}</p>
                          {clinic.postal_code && (
                            <p className="text-sm font-medium mb-2">{clinic.postal_code}</p>
                          )}
                          {clinic.provider_id && (
                            <Badge variant="secondary" className="mb-2 capitalize">
                              {clinic.provider_id.replace(/-/g, " ")}
                            </Badge>
                          )}
                          {clinic.distance && (
                            <p className="text-xs text-muted-foreground">
                              {clinic.distance.toFixed(1)} miles away
                            </p>
                          )}
                          {clinic.access_note && (
                            <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                              {clinic.access_note}
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
        </Card>

        {/* Clinic List */}
        <Card className="border-2 border-muted">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg">Clinic List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[550px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FA6980] mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading clinics...</p>
                </div>
              ) : filteredClinics.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium mb-2">No clinics found</p>
                  <p className="text-sm">Try adjusting your search filters</p>
                </div>
              ) : (
                filteredClinics.map((clinic, index) => (
                  <div
                    key={clinic.id || index}
                    className="p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#FA6980] flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1">{clinic.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{clinic.full_address}</p>
                        {clinic.postal_code && (
                          <p className="text-sm font-medium mb-2">{clinic.postal_code}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {clinic.provider_id && (
                            <Badge variant="secondary" className="text-xs capitalize">
                              {clinic.provider_id.replace(/-/g, " ")}
                            </Badge>
                          )}
                          {clinic.distance && (
                            <Badge variant="outline" className="text-xs">
                              {clinic.distance.toFixed(1)} miles
                            </Badge>
                          )}
                        </div>
                        {clinic.access_note && (
                          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                            {clinic.access_note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicFinder;
