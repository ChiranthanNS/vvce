import { useState, useEffect, useRef } from 'react';
import { BusLocation } from '../lib/supabase';
import { MapPin, Navigation, Clock, RefreshCw, Bus, AlertCircle, CloudRain, Timer, ArrowLeft } from 'lucide-react';

import AIChatbot from './AIChatbot';
import { APP_CONTEXT, getCurrentWeather } from '../lib/appContext';
import { busSchedules, getWeatherDelay, calculateArrivalTime } from '../lib/busSchedules';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB7QfhYhlG2bJxPboMFdptyXiNDsFwbKF0';
const BUS_MARKER_ICON = 'https://maps.google.com/mapfiles/kml/shapes/bus.png';
const CAMPUS_COORDINATES = { lat: 12.336565, lng: 76.618745 };
const CITY_BUS_STAND_COORDINATES = { lat: 12.3085653, lng: 76.6538304 };
const VBC_BUS_ORIGIN = { lat: 12.335278, lng: 76.618389 }; // 12°20'07.0"N 76°37'06.2"E
const VBC_BUS_DESTINATION = { lat: 12.342222, lng: 76.627278 }; // 12°20'32.0"N 76°37'38.2"E (approx)
const EXTRA_BUS_MARKER_COORDINATES = { lat: 12.316171, lng: 76.630502 };

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

interface BusTrackingPageProps {
  onBack: () => void;
}

export default function BusTrackingPage({ onBack }: BusTrackingPageProps) {
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
  const vbcMarkerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const vbcDirectionsRendererRef = useRef<any>(null);

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

        const vbcMarker = new window.google.maps.Marker({
          position: {
            lat: (VBC_BUS_ORIGIN.lat + VBC_BUS_DESTINATION.lat) / 2,
            lng: (VBC_BUS_ORIGIN.lng + VBC_BUS_DESTINATION.lng) / 2,
          },
          map: mapInstance,
          icon: {
            url: 'https://maps.google.com/mapfiles/kml/pal4/icon57.png',
            scaledSize: new window.google.maps.Size(40, 40),
          },
          title: 'VVCE-02(Arriving in 15 mins)',
        });

        new window.google.maps.Marker({
          position: EXTRA_BUS_MARKER_COORDINATES,
          map: mapInstance,
          icon: {
            url: BUS_MARKER_ICON,
            scaledSize: new window.google.maps.Size(42, 42),
          },
          title: 'Bus Location (Field Update)',
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

        const vbcDirectionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#3b82f6',
            strokeWeight: 4,
            strokeOpacity: 0.8,
          },
        });
        vbcDirectionsRenderer.setMap(mapInstance);

        mapInstanceRef.current = mapInstance;
        markerRef.current = marker;
        vbcMarkerRef.current = vbcMarker;
        directionsServiceRef.current = directionsService;
        directionsRendererRef.current = directionsRenderer;
        vbcDirectionsRendererRef.current = vbcDirectionsRenderer;

        requestRoute();
        requestVBCRoute();
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

  const requestVBCRoute = () => {
    if (!directionsServiceRef.current || !vbcDirectionsRendererRef.current) return;

    directionsServiceRef.current.route(
      {
        origin: VBC_BUS_ORIGIN,
        destination: VBC_BUS_DESTINATION,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: string) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          vbcDirectionsRendererRef.current.setDirections(result);
        } else {
          console.error('VBC directions request failed due to', status);
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
  const weather = getCurrentWeather();
  const weatherDelay = getWeatherDelay(weather);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Bus Tracking</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={refreshLocation}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <Bus className="w-5 h-5 text-yellow-700" />
          <span className="text-sm sm:text-base">
            <strong>VVCE-02</strong> bus will be delayed by <strong>5 minutes</strong> due to traffic. Thanks for your patience!
          </span>
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
              <h3 className="text-lg font-semibold text-gray-700">Next Arrival</h3>
              <Timer className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">VVCE-02 · 15 mins</p>
            <p className="text-sm text-gray-500">Currently en route to campus</p>
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

        {/* Weather Delay Alert */}
        {weatherDelay.delay > 0 && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="bg-orange-500 rounded-full p-2 mt-1">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-orange-800 mb-1">Weather Alert</h4>
                <p className="text-orange-700 text-sm">
                  {weatherDelay.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bus Schedules */}
        <div className="mt-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bus className="w-7 h-7 text-green-500" />
            Bus Schedules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {busSchedules.map((schedule) => (
              <div key={schedule.busNumber} className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{schedule.busNumber}</h4>
                    <p className="text-sm text-gray-600">{schedule.route}</p>
                  </div>
                  {weatherDelay.delay > 0 && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CloudRain className="w-3 h-3" />
                      +{weatherDelay.delay} min
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Departs:</span>
                    <span className="font-bold text-gray-800">{schedule.departureTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Arrives:</span>
                    <span className="font-bold text-gray-800">
                      {weatherDelay.delay > 0 ? (
                        <>
                          <span className="line-through text-gray-400">{schedule.arrivalTime}</span>
                          {' '}
                          <span className="text-orange-600">{calculateArrivalTime(schedule, weatherDelay.delay)}</span>
                        </>
                      ) : (
                        schedule.arrivalTime
                      )}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-600 mb-2 font-medium">Route Stops:</p>
                  <div className="flex flex-wrap gap-1">
                    {schedule.stops.map((stop, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
        
        {/* AI Chatbot */}
        <AIChatbot context={APP_CONTEXT} />
      </div>
    </div>
  );
}
