import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths for Leaflet when bundling with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Navigation, Maximize2, Map as MapIcon, Satellite } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Merge default icon options once
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
const RMapContainer = MapContainer as any;
const RTileLayer = TileLayer as any;
interface ClinicItem {
  id?: string;
  name: string;
  full_address?: string;
  address?: string;
  postal_code?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  lon?: number;
  access_note?: string;
  distance?: number; // meters
}
const DEFAULT_LON = -0.1278; // London
const DEFAULT_LAT = 51.5074;
const DEFAULT_ZOOM = 11;
function mToKm(m?: number) {
  if (typeof m !== "number") return "";
  return (m / 1000).toFixed(2);
}
function FlyTo({
  center
}: {
  center: [number, number] | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12, {
        animate: true
      });
    }
  }, [center, map]);
  return null;
}
const ClinicMap: React.FC = () => {
  const [postcode, setPostcode] = useState("");
  const [items, setItems] = useState<ClinicItem[]>([]);
  const [userCenter, setUserCenter] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"alpha" | "distance">("alpha");
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const center = useMemo(() => userCenter || [DEFAULT_LAT, DEFAULT_LON] as [number, number], [userCenter]);

  // Load clinics (try Supabase first, fallback to local JSON)
  useEffect(() => {
    const loadDefault = async () => {
      try {
        setError(null);
        const {
          data,
          error
        } = await (supabase as any).from("clinics").select("name, full_address, postal_code, latitude, longitude, access_note").order("name", {
          ascending: true
        });
        if (error) throw error;
        if (data && data.length) {
          const normalized = data.map(x => ({
            name: x.name || "Clinic",
            full_address: x.full_address || "",
            postal_code: x.postal_code || "",
            latitude: typeof x.latitude === "number" ? x.latitude : x.latitude ? Number(x.latitude) : undefined,
            longitude: typeof x.longitude === "number" ? x.longitude : x.longitude ? Number(x.longitude) : undefined,
            access_note: x.access_note || ""
          }));
          setMode("alpha");
          setItems(normalized);
          return;
        }
      } catch (e: any) {
        // fall through to local JSON
      }

      // Fallback to bundled local JSON
      try {
        const res = await fetch("/clinics_master.json", {
          cache: "no-store"
        });
        if (!res.ok) throw new Error("Local JSON not found");
        const data: ClinicItem[] = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map(x => ({
          name: x.name || x.address || "Clinic",
          full_address: x.full_address || x.address || "",
          postal_code: x.postal_code || x.postcode || "",
          latitude: typeof x.latitude === "number" ? x.latitude : typeof x.lat === "number" ? x.lat : undefined,
          longitude: typeof x.longitude === "number" ? x.longitude : typeof x.lng === "number" ? x.lng : typeof x.lon === "number" ? x.lon : undefined,
          access_note: x.access_note || ""
        }));
        setMode("alpha");
        setItems(normalized);
      } catch (e: any) {
        setError(e?.message || "Could not load clinics");
      }
    };
    loadDefault();
  }, []);
  async function geocodePostcode(pc: string): Promise<{
    lat: number;
    lon: number;
  }> {
    const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
    const j = await r.json();
    if (j.status !== 200 || !j.result) throw new Error("Postcode not found");
    return {
      lat: j.result.latitude,
      lon: j.result.longitude
    };
  }
  async function fetchNearestViaProxy(lat: number, lon: number, maxPages = 3): Promise<ClinicItem[]> {
    const {
      data,
      error
    } = await supabase.functions.invoke("lml-nearest", {
      body: {
        lat,
        lon,
        maxPages
      }
    });
    if (error) throw new Error(error.message || "Failed to fetch clinics");
    const items = Array.isArray((data as any)?.items) ? (data as any).items : [];
    return items as ClinicItem[];
  }
  const handleFind = async () => {
    if (!postcode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const user = await geocodePostcode(postcode.trim());
      setUserCenter([user.lat, user.lon]);
      const nearby = await fetchNearestViaProxy(user.lat, user.lon, 3);
      const normalized = nearby.map(x => ({
        name: (x as any).name || "Clinic",
        full_address: (x as any).full_address || (x as any).address || "",
        postal_code: (x as any).postal_code || (x as any).postcode || "",
        latitude: typeof (x as any).latitude === "number" ? (x as any).latitude : typeof (x as any).lat === "number" ? (x as any).lat : undefined,
        longitude: typeof (x as any).longitude === "number" ? (x as any).longitude : typeof (x as any).lng === "number" ? (x as any).lng : typeof (x as any).lon === "number" ? (x as any).lon : undefined,
        access_note: (x as any).access_note || "",
        distance: (x as any).distance
      }));
      setMode("distance");
      setItems(normalized);
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserCenter([lat, lon]);
          const nearby = await fetchNearestViaProxy(lat, lon, 3);
          const normalized = nearby.map(x => ({
            name: (x as any).name || "Clinic",
            full_address: (x as any).full_address || (x as any).address || "",
            postal_code: (x as any).postal_code || (x as any).postcode || "",
            latitude: typeof (x as any).latitude === "number" ? (x as any).latitude : typeof (x as any).lat === "number" ? (x as any).lat : undefined,
            longitude: typeof (x as any).longitude === "number" ? (x as any).longitude : typeof (x as any).lng === "number" ? (x as any).lng : typeof (x as any).lon === "number" ? (x as any).lon : undefined,
            access_note: (x as any).access_note || "",
            distance: (x as any).distance
          }));
          setMode("distance");
          setItems(normalized);
        } catch (e: any) {
          setError(e?.message || "Failed to find nearby clinics.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to access your location.");
        setLoading(false);
      }
    );
  };
  const sortedItems = useMemo(() => {
    const arr = [...items];
    if (mode === "alpha") {
      arr.sort((a, b) => (a.name || "").localeCompare(b.name || "", "en", {
        sensitivity: "base"
      }));
    } else {
      arr.sort((a, b) => (a.distance ?? Number.POSITIVE_INFINITY) - (b.distance ?? Number.POSITIVE_INFINITY));
    }
    return arr;
  }, [items, mode]);
  const ClinicDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Find your nearest clinic</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1">
          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input 
                value={postcode} 
                onChange={e => setPostcode(e.target.value)} 
                placeholder="Enter postcode or address" 
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleFind()}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleFind} 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-6"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
              <Button 
                onClick={handleUseLocation} 
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Use my location
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-4">
            {/* Clinic List */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Clinics</h3>
                  <Badge variant="secondary">
                    {mode === "alpha" ? "A–Z" : "Nearest"}
                  </Badge>
                </div>
              </div>
              <div className="max-h-[400px] overflow-auto">
                {sortedItems.map((clinic, i) => (
                  <div key={i} className="p-4 border-b hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-primary mb-1">
                          {clinic.name || "Clinic"}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {clinic.full_address || clinic.address || ""}
                        </p>
                        {clinic.postal_code && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {clinic.postal_code}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs">
                          {typeof clinic.distance === "number" && (
                            <Badge variant="secondary" className="text-xs">
                              {mToKm(clinic.distance)} km away
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Appointment required
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {sortedItems.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No clinics to display
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-card rounded-lg border overflow-hidden relative">
              {/* Map Controls */}
              <div className="absolute top-3 left-3 z-[1000] flex gap-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm">
                  <Button
                    size="sm"
                    variant={mapType === "map" ? "default" : "ghost"}
                    onClick={() => setMapType("map")}
                    className="h-8 px-3 text-xs"
                  >
                    Map
                  </Button>
                  <Button
                    size="sm"
                    variant={mapType === "satellite" ? "default" : "ghost"}
                    onClick={() => setMapType("satellite")}
                    className="h-8 px-3 text-xs"
                  >
                    Satellite
                  </Button>
                </div>
              </div>

              <div className="absolute top-3 right-3 z-[1000]">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              <RMapContainer 
                center={center} 
                zoom={DEFAULT_ZOOM} 
                scrollWheelZoom={true} 
                className="h-[400px] w-full"
              >
                <RTileLayer 
                  attribution="&copy; OpenStreetMap contributors" 
                  url={mapType === "satellite" 
                    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                />
                <FlyTo center={userCenter} />

                {userCenter && (
                  <Marker position={userCenter}>
                    <Popup>
                      <div className="font-medium">You are here</div>
                    </Popup>
                  </Marker>
                )}

                {sortedItems.map((clinic, idx) => {
                  const lat = typeof clinic.latitude === "number" ? clinic.latitude : 
                            typeof clinic.lat === "number" ? clinic.lat : undefined;
                  const lon = typeof clinic.longitude === "number" ? clinic.longitude : 
                            typeof clinic.lng === "number" ? clinic.lng : 
                            typeof clinic.lon === "number" ? clinic.lon : undefined;
                  
                  if (typeof lat !== "number" || typeof lon !== "number") return null;
                  
                  return (
                    <Marker key={idx} position={[lat, lon]}>
                      <Popup>
                        <div className="min-w-[200px]">
                          <div className="font-semibold text-primary mb-1">
                            {clinic.name || "Clinic"}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {clinic.full_address || clinic.address || ""}
                          </div>
                          {typeof clinic.distance === "number" && (
                            <div className="text-xs text-muted-foreground">
                              {mToKm(clinic.distance)} km away
                            </div>
                          )}
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              Appointment required
                            </Badge>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </RMapContainer>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-md p-3 shadow-sm text-xs">
                <div className="font-medium mb-2">Key:</div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>You are here</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Appointment required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <section aria-label="Find a clinic" className="py-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">
            Find Your Nearest Test Location
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
            Select your chosen clinic when you checkout. Once we've processed your order, 
            we'll let you know how to book your visit.
          </p>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                <MapPin className="mr-2 h-5 w-5" />
                Find Clinics Near You
              </Button>
            </DialogTrigger>
            <ClinicDialog />
          </Dialog>
        </div>

        {/* Preview Map */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <RMapContainer 
                center={center} 
                zoom={6} 
                scrollWheelZoom={false} 
                className="h-[400px] w-full"
              >
                <RTileLayer 
                  attribution="&copy; OpenStreetMap contributors" 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />
                
                {sortedItems.slice(0, 10).map((clinic, idx) => {
                  const lat = typeof clinic.latitude === "number" ? clinic.latitude : 
                            typeof clinic.lat === "number" ? clinic.lat : undefined;
                  const lon = typeof clinic.longitude === "number" ? clinic.longitude : 
                            typeof clinic.lng === "number" ? clinic.lng : 
                            typeof clinic.lon === "number" ? clinic.lon : undefined;
                  
                  if (typeof lat !== "number" || typeof lon !== "number") return null;
                  
                  return (
                    <Marker key={idx} position={[lat, lon]}>
                      <Popup>
                        <div className="font-semibold">{clinic.name || "Clinic"}</div>
                        <div className="text-sm text-muted-foreground">
                          {clinic.full_address || clinic.address || ""}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </RMapContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default ClinicMap;