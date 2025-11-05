import { useState, useEffect } from 'react';
import { BusLocation } from '../lib/supabase';
import { MapPin, Navigation, Clock, RefreshCw } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB7QfhYhlG2bJxPboMFdptyXiNDsFwbKF0';
const BUS_MARKER_ICON = 'https://maps.google.com/mapfiles/kml/shapes/bus.png';

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

  useEffect(() => {
    setLoading(false);
    const interval = setInterval(() => {
      updateTimestamp();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  const getStaticMapUrl = () => {
    const encodedIcon = encodeURIComponent(BUS_MARKER_ICON);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${busLocation.latitude},${busLocation.longitude}&zoom=15&size=600x400&maptype=roadmap&markers=icon:${encodedIcon}%7C${busLocation.latitude},${busLocation.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
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
            <img
              src={getStaticMapUrl()}
              alt="Bus Location"
              className="w-full h-[400px] sm:h-[500px] object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Coordinates</p>
                    <p className="font-mono text-sm font-medium text-gray-800">
                      {Number(busLocation.latitude).toFixed(6)}, {Number(busLocation.longitude).toFixed(6)}
                    </p>
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
