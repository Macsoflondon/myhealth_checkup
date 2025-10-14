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
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { providers } from "@/data/compare/providers";

// Merge default icon options once
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const RMapContainer = MapContainer as any;
const RTileLayer = TileLayer as any;
const RMarker = Marker as any;

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

// Helper function to extract provider name from clinic name and get logo
function getProviderLogo(clinicName: string): string | null {
  const lowerName = clinicName.toLowerCase();
  
  // Match clinic name to provider
  if (lowerName.includes("medichecks")) {
    return providers.find(p => p.id === "medichecks")?.logo || null;
  }
  if (lowerName.includes("thriva")) {
    return providers.find(p => p.id === "thriva")?.logo || null;
  }
  if (lowerName.includes("randox")) {
    return providers.find(p => p.id === "randox")?.logo || null;
  }
  if (lowerName.includes("london medical laboratory") || lowerName.includes("lml")) {
    return providers.find(p => p.id === "london-medical-laboratory")?.logo || null;
  }
  if (lowerName.includes("lola health") || lowerName.includes("lola")) {
    return providers.find(p => p.id === "lola-health")?.logo || null;
  }
  if (lowerName.includes("goodbody")) {
    return providers.find(p => p.id === "goodbody-clinic")?.logo || null;
  }
  if (lowerName.includes("tuli health") || lowerName.includes("tuli")) {
    return providers.find(p => p.id === "tuli-health")?.logo || null;
  }
  if (lowerName.includes("superdrug")) {
    return providers.find(p => p.id === "superdrug")?.logo || null;
  }
  if (lowerName.includes("ultrasound direct")) {
    return providers.find(p => p.id === "ultrasound-direct")?.logo || null;
  }
  if (lowerName.includes("hospital") || lowerName.includes("infirmary")) {
    return providers.find(p => p.id === "nhs-hospitals")?.logo || null;
  }
  
  // Default to independent clinics
  return providers.find(p => p.id === "independent")?.logo || null;
}

// Create custom icon for provider markers
function createProviderIcon(clinicName: string) {
  const logoUrl = getProviderLogo(clinicName);
  
  if (logoUrl) {
    return L.divIcon({
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          border: 3px solid #FA6980;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          overflow: hidden;
        ">
          <img 
            src="${logoUrl}" 
            alt="Provider logo"
            style="
              width: 28px;
              height: 28px;
              object-fit: contain;
            "
          />
        </div>
      `,
      className: 'custom-provider-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  }
  
  // Fallback to default icon
  return new L.Icon.Default();
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

  return (
    <section aria-label="Find a clinic" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Nearest Test Location
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Default view shows locations from our local directory (A–Z). Enter a postcode to see 
            nearest London Medical Laboratory clinics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <Input 
              value={postcode} 
              onChange={e => setPostcode(e.target.value)} 
              placeholder="Enter your postcode (e.g., SW11 6QZ)" 
              className="flex-1 h-12 text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleFind()}
            />
            <Button 
              onClick={handleFind} 
              disabled={loading}
              className="bg-[#081129] hover:bg-[#081129]/90 text-white px-8 h-12 text-base font-medium"
            >
              {loading ? "Searching..." : "Find clinics"}
            </Button>
          </div>
          {error && (
            <div className="text-sm text-red-600 mt-2">
              {error}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
          {/* Map */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <RMapContainer 
              center={center} 
              zoom={DEFAULT_ZOOM} 
              scrollWheelZoom={true} 
              className="h-[500px] w-full"
            >
              <RTileLayer 
                attribution="&copy; OpenStreetMap contributors" 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyTo center={userCenter} />

              {userCenter && (
                <RMarker position={userCenter}>
                  <Popup>
                    <div className="font-medium">You are here</div>
                  </Popup>
                </RMarker>
              )}

              {sortedItems.map((clinic, idx) => {
                const lat = typeof clinic.latitude === "number" ? clinic.latitude : 
                          typeof clinic.lat === "number" ? clinic.lat : undefined;
                const lon = typeof clinic.longitude === "number" ? clinic.longitude : 
                          typeof clinic.lng === "number" ? clinic.lng : 
                          typeof clinic.lon === "number" ? clinic.lon : undefined;
                
                if (typeof lat !== "number" || typeof lon !== "number") return null;
                
                const customIcon = createProviderIcon(clinic.name || "");
                
                return (
                  <RMarker key={idx} position={[lat, lon]} icon={customIcon}>
                    <Popup>
                      <div className="min-w-[200px]">
                        <div className="font-semibold text-[#081129] mb-1">
                          {clinic.name || "Clinic"}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {clinic.full_address || clinic.address || ""}
                        </div>
                        {clinic.postal_code && (
                          <div className="text-sm text-gray-600 mb-2">
                            {clinic.postal_code}
                          </div>
                        )}
                        {typeof clinic.distance === "number" && (
                          <div className="text-xs text-gray-500">
                            {mToKm(clinic.distance)} km away
                          </div>
                        )}
                        {clinic.access_note && (
                          <div className="text-xs text-gray-500 mt-1">
                            {clinic.access_note}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </RMarker>
                );
              })}
            </RMapContainer>
          </div>

          {/* Clinic List */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Clinics</h3>
                <Badge 
                  variant="secondary" 
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium"
                >
                  {mode === "alpha" ? "A–Z" : "Nearest"}
                </Badge>
              </div>
            </div>
            <div className="max-h-[450px] overflow-auto">
              {sortedItems.map((clinic, i) => (
                <div key={i} className="p-4 border-b hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <MapPin className="h-4 w-4 text-[#081129]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {clinic.name || "Clinic"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {clinic.full_address || clinic.address || ""}
                      </p>
                      {clinic.postal_code && (
                        <p className="text-sm text-gray-600 mb-2">
                          {clinic.postal_code}
                        </p>
                      )}
                      {clinic.access_note && (
                        <p className="text-xs text-gray-500">
                          {clinic.access_note}
                        </p>
                      )}
                      {typeof clinic.distance === "number" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {mToKm(clinic.distance)} km away
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {sortedItems.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No clinics to display
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicMap;