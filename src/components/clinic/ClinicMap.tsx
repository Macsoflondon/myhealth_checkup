import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MapErrorBoundary from "./MapErrorBoundary";

// Type casting for react-leaflet compatibility
const RMapContainer = MapContainer as any;
const RTileLayer = TileLayer as any;
const RMarker = Marker as any;

// Fix Leaflet default icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FlyToLocation({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

interface ClinicMapProps {
  clinics: Array<{
    id: string;
    name: string;
    full_address?: string | null;
    latitude: number;
    longitude: number;
    provider_id?: string | null;
    distance?: number;
    access_note?: string | null;
  }>;
  center: [number, number];
  userLocation: [number, number] | null;
  loading: boolean;
  zoom?: number;
}

const ClinicMap = ({ clinics, center, userLocation, loading, zoom = 6 }: ClinicMapProps) => {
  const [mapReady, setMapReady] = useState(false);
  const [mapKey] = useState(() => Date.now());
  const mapInitialized = useRef(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMapReady(true));
    return () => {
      cancelAnimationFrame(timer);
      setMapReady(false);
    };
  }, []);

  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border h-[500px]">
      {loading || !mapReady ? (
        <div className="h-full w-full flex items-center justify-center bg-muted/50">
          <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
        </div>
      ) : (
        <MapErrorBoundary>
          <RMapContainer
            key={`clinic-map-${mapKey}`}
            center={center}
            zoom={userLocation ? 12 : zoom}
            className="h-full w-full"
            scrollWheelZoom={true}
            whenReady={() => {
              mapInitialized.current = true;
            }}
          >
            <RTileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToLocation center={userLocation} />

            {userLocation && (
              <RMarker position={userLocation}>
                <Popup>
                  <div className="font-semibold text-brand-navy">Your Location</div>
                </Popup>
              </RMarker>
            )}

            <MarkerClusterGroup chunkedLoading>
              {clinics.map((clinic, index) => (
                <RMarker
                  key={clinic.id || index}
                  position={[clinic.latitude, clinic.longitude]}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h4 className="font-bold text-brand-navy mb-2">{clinic.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {clinic.full_address}
                      </p>
                      {clinic.provider_id && (
                        <Badge variant="secondary" className="mb-2 capitalize">
                          {clinic.provider_id.replace(/-/g, " ")}
                        </Badge>
                      )}
                      {clinic.distance != null && (
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
        </MapErrorBoundary>
      )}
    </div>
  );
};

export default ClinicMap;
