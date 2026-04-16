import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import MapErrorBoundary from "@/components/clinic/MapErrorBoundary";

const RMapContainer = MapContainer as any;
const RTileLayer = TileLayer as any;
const RMarker = Marker as any;
const RTooltip = Tooltip as any;

const REGIONS: { name: string; lat: number; lng: number; slug: string }[] = [
  { name: "London", lat: 51.5074, lng: -0.1278, slug: "london" },
  { name: "Manchester", lat: 53.4808, lng: -2.2426, slug: "manchester" },
  { name: "Birmingham", lat: 52.4862, lng: -1.8904, slug: "birmingham" },
  { name: "Leeds", lat: 53.8008, lng: -1.5491, slug: "leeds" },
  { name: "Liverpool", lat: 53.4084, lng: -2.9916, slug: "liverpool" },
  { name: "Bristol", lat: 51.4545, lng: -2.5879, slug: "bristol" },
  { name: "Newcastle", lat: 54.9783, lng: -1.6178, slug: "newcastle" },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883, slug: "edinburgh" },
  { name: "Glasgow", lat: 55.8642, lng: -4.2518, slug: "glasgow" },
  { name: "Cardiff", lat: 51.4816, lng: -3.1791, slug: "cardiff" },
  { name: "Belfast", lat: 54.5973, lng: -5.9301, slug: "belfast" },
  { name: "Southampton", lat: 50.9097, lng: -1.4044, slug: "southampton" },
];

const pinIcon = L.divIcon({
  html: '<div class="uk-region-pin"></div>',
  className: "uk-region-pin-wrapper",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const UKRegionMap = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [mapKey] = useState(() => Date.now());

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(id);
      setReady(false);
    };
  }, []);

  return (
    <>
      <style>{`
        .uk-region-pin-wrapper { background: transparent !important; border: none !important; }
        .uk-region-pin {
          width: 14px; height: 14px; border-radius: 9999px;
          background: #22c0d4; border: 2px solid #ffffff;
          box-shadow: 0 0 0 2px rgba(34,192,212,0.35), 0 2px 6px rgba(0,0,0,0.4);
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
          cursor: pointer;
        }
        .uk-region-pin:hover {
          transform: scale(1.5);
          background: #e70d69;
          box-shadow: 0 0 0 4px rgba(231,13,105,0.35), 0 2px 8px rgba(0,0,0,0.5);
        }
        .leaflet-container { background: #081129 !important; }
        .leaflet-tooltip.uk-region-tooltip {
          background: #081129; color: #ffffff; border: 1px solid #22c0d4;
          font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .leaflet-tooltip.uk-region-tooltip::before { display: none; }
      `}</style>
      <div className="w-full h-[260px] sm:h-[320px] rounded-xl overflow-hidden border border-brand-turquoise/30 mb-5">
        {!ready ? (
          <div className="h-full w-full flex items-center justify-center bg-[#081129]">
            <Loader2 className="w-7 h-7 animate-spin text-brand-turquoise" />
          </div>
        ) : (
          <MapErrorBoundary>
            <RMapContainer
              key={`uk-region-map-${mapKey}`}
              center={[54.5, -3.5]}
              zoom={5}
              scrollWheelZoom={false}
              className="h-full w-full"
              attributionControl={false}
            >
              <RTileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap &copy; CARTO'
              />
              {REGIONS.map((r) => (
                <RMarker
                  key={r.slug}
                  position={[r.lat, r.lng]}
                  icon={pinIcon}
                  eventHandlers={{
                    click: () => navigate(`/find-clinic?region=${r.slug}`),
                  }}
                >
                  <RTooltip
                    direction="top"
                    offset={[0, -8]}
                    opacity={1}
                    className="uk-region-tooltip"
                  >
                    {r.name}
                  </RTooltip>
                </RMarker>
              ))}
            </RMapContainer>
          </MapErrorBoundary>
        )}
      </div>
    </>
  );
};

export default UKRegionMap;
