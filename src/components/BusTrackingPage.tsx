import { useState, useEffect, useRef } from 'react';
import { BusLocation } from '../lib/supabase';
import { MapPin, Navigation, Clock, RefreshCw } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB7QfhYhlG2bJxPboMFdptyXiNDsFwbKF0';
const BUS_MARKER_ICON = 'https://maps.google.com/mapfiles/kml/shapes/bus.png';
const CAMPUS_COORDINATES = { lat: 12.336565, lng: 76.618745 };
const CITY_BUS_STAND_COORDINATES = { lat: 12.3085653, lng: 76.6538304 };

declare global {
  interface Window {
    google: any;
  }
}

let googleMapsLoader: Promise<void> | null = null;

function loadGoogleMapsScript() {
  if (googleMapsLoader) return googleMapsLoader;

  googleMapsLoader = new Promise<void>((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', (event) => reject(event), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (event) => reject(event);
    document.body.appendChild(script);
  });

  return googleMapsLoader;
}

export default function BusTrackingPage() {
  const [busLocation, setBusLocation] = useState<BusLocation>({
    id: '1',
    bus_number: 'VVCE-01',
    route_name: 'Campus to City',
    latitude: 12.335280,
    longitude: 76.618382,
    last_updated: new Date().toISOString(),
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [routeSummary, setRouteSummary] = useState({ distance: '', duration: '' });
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  useEffect(() => {
    setLoading(false);
    const interval = setInterval(() => {
      updateTimestamp();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    loadGoogleMapsScript()
      .then(() => {
        if (!isMounted || !mapRef.current) return;

        const center = {
          lat: Number(busLocation.latitude),
          lng: Number(busLocation.longitude),
        };

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          disableDefaultUI: false,
        });

        const marker = new window.google.maps.Marker({
          position: center,
          map: mapInstance,
          icon: {
            url: BUS_MARKER_ICON,
            scaledSize: new window.google.maps.Size(48, 48),
          },
          title: 'Bus Location',
        });

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#10b981',
            strokeWeight: 5,
          },
        });
        directionsRenderer.setMap(mapInstance);

        mapInstanceRef.current = mapInstance;
        markerRef.current = marker;
        directionsServiceRef.current = directionsService;
        directionsRendererRef.current = directionsRenderer;

        requestRoute();
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const requestRoute = () => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    directionsServiceRef.current.route(
      {
        origin: CAMPUS_COORDINATES,
        destination: CITY_BUS_STAND_COORDINATES,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: string) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current.setDirections(result);

          const leg = result.routes?.[0]?.legs?.[0];
          if (leg) {
            setRouteSummary({
              distance: leg.distance?.text ?? '',
              duration: leg.duration?.text ?? '',
            });
          }
        } else {
          console.error('Directions request failed due to', status);
        }
      }
    );
  };

  useEffect(() => {
    const center = {
      lat: Number(busLocation.latitude),
      lng: Number(busLocation.longitude),
    };

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
    }

    if (markerRef.current) {
      markerRef.current.setPosition(center);
    }
  }, [busLocation]);

  const updateTimestamp = () => {
    setBusLocation({
      ...busLocation,
      last_updated: new Date().toISOString()
    });
    setLastUpdate(new Date());
  };

  const refreshLocation = () => {
    updateTimestamp();
  };

  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps?q=${busLocation.latitude},${busLocation.longitude}&z=15`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-green-600">Loading bus location...</div>
      </div>
    );
  }

  const timeSinceUpdate = Math.floor((Date.now() - new Date(lastUpdate).getTime()) / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Bus Tracking</h2>
          <button
            onClick={refreshLocation}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Bus Number</h3>
              <Navigation className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{busLocation.bus_number}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Route</h3>
              <MapPin className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">{busLocation.route_name}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Last Update</h3>
              <Clock className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">
              {timeSinceUpdate < 60 ? `${timeSinceUpdate}s ago` : `${Math.floor(timeSinceUpdate / 60)}m ago`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Live Location</h3>
                <p className="text-sm opacity-90">Real-time bus tracking</p>
              </div>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div ref={mapRef} className="w-full h-[400px] sm:h-[500px]" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Coordinates</p>
                    <p className="font-mono text-sm font-medium text-gray-800">
                      {Number(busLocation.latitude).toFixed(6)}, {Number(busLocation.longitude).toFixed(6)}
                    </p>
                    {routeSummary.distance && routeSummary.duration && (
                      <p className="text-xs text-gray-500">
                        Route to City Bus Stand: {routeSummary.distance} · {routeSummary.duration} (driving)
                      </p>
                    )}
                  </div>
                  <a
                    href={getGoogleMapsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-green-500 rounded-full p-2 mt-1">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Live Tracking</h4>
              <p className="text-gray-700 text-sm">
                The bus location updates automatically every few seconds. The green marker on the map shows the current position of the bus.
                Click "Open in Google Maps" to get directions or see the full map view.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
