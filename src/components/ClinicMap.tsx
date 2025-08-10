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

// Merge default icon options once
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
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

function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12, { animate: true });
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("LML_TOKEN"));
  const [showAdvanced, setShowAdvanced] = useState(false);

  const center = useMemo(() => userCenter || [DEFAULT_LAT, DEFAULT_LON] as [number, number], [userCenter]);

  // Load local clinics on mount
  useEffect(() => {
    const loadLocal = async () => {
      try {
        setError(null);
        const res = await fetch("/clinics_master.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Local JSON not found`);
        const data: ClinicItem[] = await res.json();
        // normalize
        const normalized = (Array.isArray(data) ? data : []).map((x) => ({
          name: x.name || x.address || "Clinic",
          full_address: x.full_address || x.address || "",
          postal_code: x.postal_code || x.postcode || "",
          latitude: typeof x.latitude === "number" ? x.latitude : (typeof x.lat === "number" ? x.lat : undefined),
          longitude: typeof x.longitude === "number" ? x.longitude : (typeof x.lng === "number" ? x.lng : (typeof x.lon === "number" ? x.lon : undefined)),
          access_note: x.access_note || "",
        }));
        setMode("alpha");
        setItems(normalized);
      } catch (e: any) {
        setError(e?.message || "Could not load local clinics");
      }
    };
    loadLocal();
  }, []);

  async function geocodePostcode(pc: string): Promise<{ lat: number; lon: number }> {
    const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
    const j = await r.json();
    if (j.status !== 200 || !j.result) throw new Error("Postcode not found");
    return { lat: j.result.latitude, lon: j.result.longitude };
  }

  async function fetchNearest(lat: number, lon: number, page = 1) {
    const LML_ENDPOINT = "https://api.londonmedicallaboratory.com/api/test_location/nearest";
    if (!token) return { items: [] as ClinicItem[] };
    const url = `${LML_ENDPOINT}/${lat}/${lon}?page=${page}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
    });
    if (!res.ok) throw new Error(`LML API error: ${res.status}`);
    return res.json();
  }

  async function fetchAllPages(lat: number, lon: number, maxPages = 3) {
    if (!token) return [] as ClinicItem[];
    let all: ClinicItem[] = [];
    for (let p = 1; p <= maxPages; p++) {
      try {
        const data = await fetchNearest(lat, lon, p);
        const arr = Array.isArray(data.items) ? data.items : [];
        all = all.concat(arr);
        if (arr.length < 20) break;
      } catch (e) {
        if (p === 1) throw e;
        break;
      }
    }
    // dedupe
    const seen = new Set<string>();
    const dedup: ClinicItem[] = [];
    for (const it of all) {
      const key = (it as any).id || `${(it.name || "").toLowerCase()}|${(it.postal_code || "").toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        dedup.push(it);
      }
    }
    return dedup;
  }

  const handleFind = async () => {
    if (!postcode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const user = await geocodePostcode(postcode.trim());
      setUserCenter([user.lat, user.lon]);

      if (token) {
        const nearby = await fetchAllPages(user.lat, user.lon, 3);
        // normalize
        const normalized = nearby.map((x) => ({
          name: (x as any).name || "Clinic",
          full_address: (x as any).full_address || (x as any).address || "",
          postal_code: (x as any).postal_code || (x as any).postcode || "",
          latitude: typeof (x as any).latitude === "number" ? (x as any).latitude : (typeof (x as any).lat === "number" ? (x as any).lat : undefined),
          longitude: typeof (x as any).longitude === "number" ? (x as any).longitude : (typeof (x as any).lng === "number" ? (x as any).lng : (typeof (x as any).lon === "number" ? (x as any).lon : undefined)),
          access_note: (x as any).access_note || "",
          distance: (x as any).distance,
        }));
        setMode("distance");
        setItems(normalized);
      } else {
        // If no token, keep existing local items but re-center map
        setMode("alpha");
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sortedItems = useMemo(() => {
    const arr = [...items];
    if (mode === "alpha") {
      arr.sort((a, b) => (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" }));
    } else {
      arr.sort((a, b) => (a.distance ?? Number.POSITIVE_INFINITY) - (b.distance ?? Number.POSITIVE_INFINITY));
    }
    return arr;
  }, [items, mode]);

  return (
    <section aria-label="Find a clinic" className="py-16 bg-gradient-to-b from-white to-muted">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Find Your Nearest Test Location</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Default view shows locations from our local directory (A–Z). Enter a postcode to see nearest London Medical Laboratory clinics.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
          <Input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter your postcode (e.g., SW11 6QZ)"
            aria-label="Postcode"
          />
          <Button onClick={handleFind} disabled={loading}>
            {loading ? "Finding…" : "Find clinics"}
          </Button>
        </div>

        <div className="mb-2 text-right">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground underline"
            onClick={() => setShowAdvanced((s) => !s)}
          >
            {showAdvanced ? "Hide" : "Show"} advanced (LML API token)
          </button>
        </div>

        {showAdvanced && (
          <Card className="mb-6">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="text-sm text-muted-foreground">
                To fetch nearest London Medical Laboratory locations by postcode, add your Bearer token here. It will be saved in your browser only.
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  value={token ?? ""}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="LML Bearer token"
                  className="w-full sm:w-80"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (token && token.trim()) localStorage.setItem("LML_TOKEN", token.trim());
                    else localStorage.removeItem("LML_TOKEN");
                  }}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="text-sm text-destructive mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardContent className="p-0">
              <RMapContainer
                center={center}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom={false}
                className="h-[520px] w-full"
              >
                <RTileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyTo center={userCenter} />

                {userCenter && (
                  <Marker position={userCenter}>
                    <Popup>Your location</Popup>
                  </Marker>
                )}

                {sortedItems.map((it, idx) => {
                  const lat = typeof it.latitude === "number" ? it.latitude : (typeof it.lat === "number" ? it.lat : undefined);
                  const lon = typeof it.longitude === "number" ? it.longitude : (typeof it.lng === "number" ? it.lng : (typeof it.lon === "number" ? it.lon : undefined));
                  if (typeof lat !== "number" || typeof lon !== "number") return null;
                  return (
                    <Marker key={idx} position={[lat, lon]}>
                      <Popup>
                        <div className="font-semibold">{it.name || "Clinic"}</div>
                        <div className="text-sm text-muted-foreground">{it.full_address || it.address || ""}</div>
                        {typeof it.distance === "number" && (
                          <div className="mt-1 text-xs"><em>{mToKm(it.distance)} km away</em></div>
                        )}
                      </Popup>
                    </Marker>
                  );
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
              <div className="max-h-[520px] overflow-auto pr-1">
                {sortedItems.map((it, i) => (
                  <div key={i} className="p-3 rounded-lg border mb-2 hover:shadow-sm transition-shadow">
                    <div className="font-medium">{it.name || "Clinic"}</div>
                    <div className="text-sm text-muted-foreground">{it.full_address || it.address || ""}</div>
                    <div className="text-xs text-muted-foreground">{it.postal_code || it.postcode || ""}</div>
                    {typeof it.distance === "number" && (
                      <div className="mt-1 inline-block text-xs text-foreground bg-muted px-2 py-0.5 rounded">
                        {mToKm(it.distance)} km away
                      </div>
                    )}
                    {it.access_note && (
                      <div className="mt-1 text-xs text-muted-foreground">{it.access_note}</div>
                    )}
                  </div>
                ))}
                {sortedItems.length === 0 && (
                  <div className="text-sm text-muted-foreground p-3">No clinics to display.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ClinicMap;
