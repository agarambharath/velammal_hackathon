import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SEARCH_RADIUS_M = 3000;

// Haversine distance formula (km)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getETA = (distance) => Math.ceil(distance / 1.4);

const getDistanceColor = (distance) => {
  if (distance <= 1) return { color: 'green', label: 'Very Close', icon: '🟢' };
  if (distance <= 2) return { color: 'yellow', label: 'Close', icon: '🟡' };
  return { color: 'red', label: 'Moderate', icon: '🔴' };
};

// Geocode from Nominatim (use valid User-Agent per usage policy)
const geocodeLocation = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'PinkRoute/1.0 (Menstrual Health App)',
    },
  });
  const data = await res.json();
  if (!data || data.length === 0) return null;
  const first = data[0];
  return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
};

// Fetch pharmacies from Overpass API
const fetchNearbyPharmacies = async (lat, lng) => {
  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  const query = `
[out:json];
(
  node["amenity"="pharmacy"](around:${SEARCH_RADIUS_M},${lat},${lng});
  node["shop"="chemist"](around:${SEARCH_RADIUS_M},${lat},${lng});
  node["shop"="pharmacy"](around:${SEARCH_RADIUS_M},${lat},${lng});
  way["amenity"="pharmacy"](around:${SEARCH_RADIUS_M},${lat},${lng});
  way["shop"="chemist"](around:${SEARCH_RADIUS_M},${lat},${lng});
  way["shop"="pharmacy"](around:${SEARCH_RADIUS_M},${lat},${lng});
);
out center;
  `.trim();

  const res = await fetch(overpassUrl, {
    method: 'POST',
    body: query,
  });
  const data = await res.json();
  const elements = data?.elements || [];

  const shops = [];
  const seen = new Set();

  elements.forEach((el) => {
    let shopLat, shopLng, name;
    if (el.type === 'node') {
      shopLat = el.lat;
      shopLng = el.lon;
    } else if (el.type === 'way' && el.center) {
      shopLat = el.center.lat;
      shopLng = el.center.lon;
    } else return;

    name = el.tags?.name || el.tags?.brand || 'Pharmacy';
    const key = `${shopLat.toFixed(5)}_${shopLng.toFixed(5)}`;
    if (seen.has(key)) return;
    seen.add(key);

    const distance = getDistance(lat, lng, shopLat, shopLng);
    if (distance > 3) return;

    shops.push({
      id: key,
      name,
      lat: shopLat,
      lng: shopLng,
      type: 'pharmacy',
      distance,
      address: el.tags?.['addr:street'] || el.tags?.['addr:full'] || '',
    });
  });

  return shops.sort((a, b) => a.distance - b.distance);
};

const Locator = () => {
  const [searchInput, setSearchInput] = useState('');
  const [centerCoords, setCenterCoords] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [noPharmaciesFound, setNoPharmaciesFound] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([13.1939, 80.2109], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }
  }, []);

  const updateMap = (lat, lng, shopList) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and circle
    markersRef.current.forEach((m) => {
      if (mapInstanceRef.current.hasLayer(m)) mapInstanceRef.current.removeLayer(m);
    });
    markersRef.current = [];
    if (circleRef.current && mapInstanceRef.current.hasLayer(circleRef.current)) {
      mapInstanceRef.current.removeLayer(circleRef.current);
    }

    // Center and zoom
    mapInstanceRef.current.setView([lat, lng], 14);

    // 3 km radius circle
    const circle = L.circle([lat, lng], {
      radius: SEARCH_RADIUS_M,
      color: '#ec4899',
      fillColor: '#fce7f3',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '6',
    }).addTo(mapInstanceRef.current);
    circleRef.current = circle;
    markersRef.current.push(circle);

    // Center marker
    const centerMarker = L.circleMarker([lat, lng], {
      radius: 10,
      fillColor: '#ec4899',
      color: '#fff',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(mapInstanceRef.current);
    centerMarker.bindPopup('<strong>📍 Search Location</strong>');
    markersRef.current.push(centerMarker);

    // Add shop markers
    const colorMap = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };
    shopList.forEach((shop) => {
      const distColor = getDistanceColor(shop.distance);
      const marker = L.circleMarker([shop.lat, shop.lng], {
        radius: 8,
        fillColor: colorMap[distColor.color],
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(mapInstanceRef.current);

      marker.bindPopup(
        `<strong>${shop.name}</strong><br/>
        <strong>Distance:</strong> ${shop.distance.toFixed(1)} km<br/>
        ${shop.address ? `<strong>Address:</strong> ${shop.address}<br/>` : ''}`
      );
      markersRef.current.push(marker);
    });
  };

  const searchLocation = async (query) => {
    if (!query?.trim()) {
      setError('Please enter a city, town, or area name.');
      return;
    }

    setLoading(true);
    setError(null);
    setNoPharmaciesFound(false);

    try {
      const coords = await geocodeLocation(query.trim());
      if (!coords) {
        setError(`Location "${query}" not found. Try a different search.`);
        setCenterCoords(null);
        setShops([]);
        setLoading(false);
        return;
      }

      setCenterCoords(coords);
      const pharmacyList = await fetchNearbyPharmacies(coords.lat, coords.lng);
      setShops(pharmacyList);

      if (pharmacyList.length === 0) {
        setNoPharmaciesFound(true);
      }

      updateMap(coords.lat, coords.lng, pharmacyList);
    } catch (err) {
      setError('Unable to fetch location. Please try again.');
      setCenterCoords(null);
      setShops([]);
    }
    setLoading(false);
  };

  const handleUseMyLocation = () => {
    setLoading(true);
    setError(null);
    setNoPharmaciesFound(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCenterCoords({ lat: latitude, lng: longitude });

        try {
          const pharmacyList = await fetchNearbyPharmacies(latitude, longitude);
          setShops(pharmacyList);

          if (pharmacyList.length === 0) {
            setNoPharmaciesFound(true);
          }

          updateMap(latitude, longitude, pharmacyList);
        } catch (err) {
          setError('Unable to fetch nearby pharmacies.');
        }
        setLoading(false);
      },
      () => {
        setError('Unable to detect your location. Please check permissions or enter a location manually.');
        setLoading(false);
      }
    );
  };

  // Apply filters (only distance filter for real OSM data)
  const filteredShops = shops.filter((s) => s.distance <= 3);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        📍 Smart Medical Pad Locator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Find pharmacies and medical shops within 3 km of any location worldwide
      </p>

      {/* Search Bar */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter any city, town, or area (e.g. Delhi, Sullurpeta, Visakhapatnam, Pedagadi...)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation(searchInput)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={() => searchLocation(searchInput)}
              disabled={loading}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
            >
              {loading ? '🔍...' : '🔍 Search'}
            </button>
            <button
              onClick={handleUseMyLocation}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50"
            >
              {loading ? '📍...' : '📍 My Location'}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
        {centerCoords && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            ✓ Location: {centerCoords.lat.toFixed(4)}, {centerCoords.lng.toFixed(4)} • {shops.length} pharmacies found
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Filters / Legend */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-24">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Distance Indicator</h3>
            <div className="space-y-2 text-sm">
              <div>🟢 0–1 km (Very Close)</div>
              <div>🟡 1–2 km (Close)</div>
              <div>🔴 2–3 km (Moderate)</div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Search any location worldwide. Data from OpenStreetMap.
              </p>
            </div>
          </div>
        </div>

        {/* Map and Results */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div ref={mapRef} className="h-96 rounded-t-xl"></div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Pharmacies Within 3 km ({filteredShops.length})
              </h3>

              {noPharmaciesFound && (
                <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-center">
                  <p className="font-medium">
                    No pharmacies found within 3 km.
                  </p>
                  <p className="text-sm mt-1">
                    Try increasing search radius or another area.
                  </p>
                </div>
              )}

              {filteredShops.length === 0 && !noPharmaciesFound ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Enter a location to search for nearby pharmacies</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredShops.map((shop) => {
                    const distColor = getDistanceColor(shop.distance);
                    const colorClasses = {
                      green: 'border-green-300 bg-green-50 dark:bg-green-900/20',
                      yellow: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
                      red: 'border-red-300 bg-red-50 dark:bg-red-900/20',
                    };
                    return (
                      <div
                        key={shop.id}
                        onClick={() => setSelectedShop(shop)}
                        className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg hover:scale-[1.02] transition ${colorClasses[distColor.color]}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white">{shop.name}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-2 text-gray-600 dark:text-gray-400">
                              <div>{distColor.icon} {distColor.label} • {shop.distance.toFixed(1)} km</div>
                              <div>⏱️ ETA: {getETA(shop.distance)} min</div>
                            </div>
                            {shop.address && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{shop.address}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Details Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedShop.name}</h2>
              <button onClick={() => setSelectedShop(null)} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                  Pharmacy
                </span>
              </div>

              <div className="bg-pink-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">📍 Location Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Latitude:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-white">{selectedShop.lat.toFixed(6)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Longitude:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-white">{selectedShop.lng.toFixed(6)}°</span>
                  </div>
                  {centerCoords && (
                    <div className="border-t border-pink-200 dark:border-gray-600 pt-2 mt-2 flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Search Center:</span>
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        {centerCoords.lat.toFixed(6)}°, {centerCoords.lng.toFixed(6)}°
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Distance</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-300">{selectedShop.distance.toFixed(1)} km</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">ETA</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{getETA(selectedShop.distance)} min</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button onClick={() => setSelectedShop(null)} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium">
                  Close
                </button>
                <button
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([selectedShop.lat, selectedShop.lng], 16);
                    }
                    setSelectedShop(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition font-medium"
                >
                  🗺️ Open Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locator;
