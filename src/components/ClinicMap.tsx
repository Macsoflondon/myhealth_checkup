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
  return <section aria-label="Find a clinic" className="py-16 bg-gradient-to-b from-white to-muted bg-[#1a1b34]">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#22c0d4]">Find Your Nearest Test Location</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Default view shows locations from our local directory (A–Z). Enter a postcode to see nearest London Medical Laboratory clinics.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center bg-[#1a1b34]">
          <Input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="Enter your postcode (e.g., SW11 6QZ)" aria-label="Postcode" />
          <Button onClick={handleFind} disabled={loading}>
            {loading ? "Finding…" : "Find clinics"}
          </Button>
        </div>

        {error && <div className="text-sm text-destructive mb-4">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardContent className="p-0">
              <RMapContainer center={center} zoom={DEFAULT_ZOOM} scrollWheelZoom={false} touchZoom={true} className="h-[300px] md:h-[400px] lg:h-[520px] w-full">
                <RTileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FlyTo center={userCenter} />

                {userCenter && <Marker position={userCenter}>
                    <Popup>Your location</Popup>
                  </Marker>}

                {sortedItems.map((it, idx) => {
                const lat = typeof it.latitude === "number" ? it.latitude : typeof it.lat === "number" ? it.lat : undefined;
                const lon = typeof it.longitude === "number" ? it.longitude : typeof it.lng === "number" ? it.lng : typeof it.lon === "number" ? it.lon : undefined;
                if (typeof lat !== "number" || typeof lon !== "number") return null;
                return <Marker key={idx} position={[lat, lon]}>
                      <Popup>
                        <div className="font-semibold">{it.name || "Clinic"}</div>
                        <div className="text-sm text-muted-foreground">{it.full_address || it.address || ""}</div>
                        {typeof it.distance === "number" && <div className="mt-1 text-xs"><em>{mToKm(it.distance)} km away</em></div>}
                      </Popup>
                    </Marker>;
              })}
              </RMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2">
              <div className="flex items-center justify-between p-2">
                <div className="text-sm font-medium">Clinics</div>
                <Badge variant="secondary">{mode === "alpha" ? "A–Z" : "Nearest"}</Badge>
              </div>
              <Separator className="my-2" />
              <div className="max-h-[300px] md:max-h-[400px] lg:max-h-[520px] overflow-auto pr-1">
                {sortedItems.map((it, i) => <div key={i} className="p-3 rounded-lg border mb-2 hover:shadow-sm transition-shadow touch-manipulation">
                    <div className="font-medium text-sm md:text-base">{it.name || "Clinic"}</div>
                    <div className="text-xs md:text-sm text-muted-foreground break-words">{it.full_address || it.address || ""}</div>
                    <div className="text-xs text-muted-foreground">{it.postal_code || it.postcode || ""}</div>
                    {typeof it.distance === "number" && <div className="mt-1 inline-block text-xs text-foreground bg-muted px-2 py-0.5 rounded">
                        {mToKm(it.distance)} km away
                      </div>}
                    {it.access_note && <div className="mt-1 text-xs text-muted-foreground">{it.access_note}</div>}
                  </div>)}
                {sortedItems.length === 0 && <div className="text-sm text-muted-foreground p-3">No clinics to display.</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default ClinicMap;