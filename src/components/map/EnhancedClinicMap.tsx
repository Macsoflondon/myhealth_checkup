import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useClinics, type Clinic } from '@/hooks/useClinics';
import { useDebounce } from '@/hooks/useDebounce';
import { ProviderMarker } from './ProviderMarker';

// Fix default icon paths for Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// Cast components to avoid TypeScript issues
const RMapContainer = MapContainer as any;
const RTileLayer = TileLayer as any;

const DEFAULT_CENTER: [number, number] = [51.5074, -0.1278]; // London
const DEFAULT_ZOOM = 11;

// Map fly-to component
function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (center) {
      map.setView(center, 12, { animate: true });
    }
  }, [center, map]);
  
  return null;
}

// Loading skeleton for clinic list
function ClinicListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-3 rounded-lg border">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export const EnhancedClinicMap: React.FC = () => {
  const [postcode, setPostcode] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<'alpha' | 'distance'>('alpha');
  const [nearbyResults, setNearbyResults] = useState<Clinic[]>([]);

  const { clinics, loading, error } = useClinics();
  const debouncedPostcode = useDebounce(postcode.trim(), 300);

  // Geocode postcode function
  const geocodePostcode = useCallback(async (pc: string): Promise<{ lat: number; lon: number }> => {
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
    const data = await response.json();
    
    if (data.status !== 200 || !data.result) {
      throw new Error('Postcode not found');
    }
    
    return {
      lat: data.result.latitude,
      lon: data.result.longitude
    };
  }, []);

  // Fetch nearby clinics from LML API
  const fetchNearbyClinics = useCallback(async (lat: number, lon: number): Promise<Clinic[]> => {
    const { data, error } = await supabase.functions.invoke('lml-nearest', {
      body: { lat, lon, maxPages: 3 }
    });
    
    if (error) throw new Error(error.message || 'Failed to fetch nearby clinics');
    
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.map((item: any) => ({
      name: item.name || 'Clinic',
      full_address: item.full_address || item.address || '',
      postal_code: item.postal_code || item.postcode || '',
      latitude: typeof item.latitude === 'number' ? item.latitude : 
               typeof item.lat === 'number' ? item.lat : undefined,
      longitude: typeof item.longitude === 'number' ? item.longitude : 
                typeof item.lng === 'number' ? item.lng : 
                typeof item.lon === 'number' ? item.lon : undefined,
      provider_id: 'london-medical-laboratory',
      access_note: item.access_note || '',
      distance: item.distance
    }));
  }, []);

  // Handle postcode search
  const handleSearch = useCallback(async () => {
    if (!debouncedPostcode) return;
    
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      const coords = await geocodePostcode(debouncedPostcode);
      setUserLocation([coords.lat, coords.lon]);
      
      const nearby = await fetchNearbyClinics(coords.lat, coords.lon);
      setNearbyResults(nearby);
      setSortMode('distance');
    } catch (err: any) {
      setSearchError(err.message || 'Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  }, [debouncedPostcode, geocodePostcode, fetchNearbyClinics]);

  // Auto-search when debounced postcode changes
  React.useEffect(() => {
    if (debouncedPostcode.length >= 5) {
      handleSearch();
    }
  }, [debouncedPostcode, handleSearch]);

  // Combined and sorted clinic list
  const displayClinics = useMemo(() => {
    const allClinics = sortMode === 'distance' && nearbyResults.length > 0 
      ? nearbyResults 
      : clinics;
    
    return [...allClinics].sort((a, b) => {
      if (sortMode === 'distance') {
        return (a.distance ?? Infinity) - (b.distance ?? Infinity);
      }
      return (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' });
    });
  }, [clinics, nearbyResults, sortMode]);

  const mapCenter = userLocation || DEFAULT_CENTER;

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardContent className="p-0">
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <ClinicListSkeleton />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Clinic Data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Find a clinic" className="py-16 bg-[#1a1b34] -mt-[2cm]">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#22c0d4] mb-4">
            Find Your Nearest Test Location
          </h1>
          <p className="text-[#e70d69] max-w-2xl mx-auto font-semibold text-lg">
            Enter your postcode to find the nearest testing locations, or browse all available clinics below.
          </p>
        </div>

        <div className="mb-6 max-w-md mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Enter postcode (e.g., SW11 6QZ)"
                className="pl-10"
                aria-label="Postcode search"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={searchLoading || !debouncedPostcode}
              className="bg-[#e70d69] hover:bg-[#e70d69]/90"
            >
              {searchLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Find
                </>
              )}
            </Button>
          </div>
          {searchError && (
            <p className="text-sm text-red-400 mt-2 text-center">{searchError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardContent className="p-0">
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                <RMapContainer
                  center={mapCenter}
                  zoom={DEFAULT_ZOOM}
                  scrollWheelZoom={false}
                  touchZoom={true}
                  className="h-[400px] md:h-[500px] w-full"
                >
                  <RTileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FlyTo center={userLocation} />
                  
                  {/* User location marker */}
                  {userLocation && (
                    <Marker position={userLocation}>
                      <Popup>
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-primary" />
                          <span className="font-medium">Your location</span>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* Clinic markers with provider logos */}
                  {displayClinics.map((clinic, idx) => {
                    const lat = clinic.latitude;
                    const lon = clinic.longitude;
                    
                    if (typeof lat !== 'number' || typeof lon !== 'number') return null;
                    
                    return (
                      <ProviderMarker
                        key={`${clinic.id || idx}-${lat}-${lon}`}
                        position={[lat, lon]}
                        providerId={clinic.provider_id}
                        name={clinic.name}
                        address={clinic.full_address || ''}
                        distance={clinic.distance}
                        accessNote={clinic.access_note}
                      />
                    );
                  })}
                </RMapContainer>
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Clinics</span>
                </div>
                <Badge variant="secondary">
                  {sortMode === 'alpha' ? 'A–Z' : 'Nearest First'}
                </Badge>
              </div>
              <Separator className="mb-4" />
              
              <div className="max-h-[400px] md:max-h-[500px] overflow-auto space-y-3">
                {displayClinics.map((clinic, idx) => (
                  <Card key={`${clinic.id || idx}-${clinic.name}`} className="p-3 hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm leading-tight">{clinic.name}</h3>
                        {clinic.provider_id && clinic.provider_id !== 'unknown' && (
                          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                            {clinic.provider_id.replace('-', ' ')}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground break-words">
                        {clinic.full_address}
                      </p>
                      
                      {clinic.postal_code && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {clinic.postal_code}
                        </p>
                      )}
                      
                      {typeof clinic.distance === 'number' && (
                        <div className="flex items-center gap-1">
                          <Navigation className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary">
                            {(clinic.distance / 1000).toFixed(2)} km away
                          </span>
                        </div>
                      )}
                      
                      {clinic.access_note && (
                        <div className="border-t pt-2">
                          <p className="text-xs text-muted-foreground">
                            <strong>Services:</strong> {clinic.access_note}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                
                {displayClinics.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No clinics found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try searching with a different postcode
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};