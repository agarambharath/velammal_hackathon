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

// Helper to generate random coordinates within city bounds
const generateRandomShops = (centerLat, centerLng, count = 8) => {
  const shops = [];
  const shopNames = [
    'Health Plus Pharmacy', 'Care Medical Store', 'Women Health Center', 
    'Community Health', 'Medical Aid Center', 'Universal Pharmacy', 
    'Prime Medical', 'Health Care Hub', 'Wellness Center', 'Clinic Plus'
  ];
  const types = ['pharmacy', 'hospital', 'community'];
  
  for (let i = 0; i < count; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.05; // ~5km radius
    const offsetLng = (Math.random() - 0.5) * 0.05;
    shops.push({
      id: i + 1,
      name: `${shopNames[Math.floor(Math.random() * shopNames.length)]} - ${i + 1}`,
      lat: centerLat + offsetLat,
      lng: centerLng + offsetLng,
      type: types[Math.floor(Math.random() * types.length)],
      stock: Math.random() > 0.3 ? 'available' : 'limited',
      verified: Math.floor(Math.random() * 20) + 5,
      safety: (Math.random() * 0.5 + 4.2).toFixed(1)
    });
  }
  return shops;
};

// Medical shops database by city
const medicalShopsDatabase = {
  'delhi': generateRandomShops(28.6139, 77.2090, 8),
  'mumbai': generateRandomShops(19.0760, 72.8777, 8),
  'bangalore': generateRandomShops(12.9716, 77.5946, 8),
  'chennai': generateRandomShops(13.1939, 80.2109, 8),
  'hyderabad': generateRandomShops(17.3850, 78.4867, 8),
  'kolkata': generateRandomShops(22.5726, 88.3639, 8),
  'pune': generateRandomShops(18.5204, 73.8567, 8),
  'jaipur': generateRandomShops(26.9124, 75.7873, 8),
  'lucknow': generateRandomShops(26.8467, 80.9462, 8),
  'ahmedabad': generateRandomShops(23.0225, 72.5714, 8),
  'visakhapatnam': generateRandomShops(17.6869, 83.2185, 8),
  'surat': generateRandomShops(21.1717, 72.8311, 8),
  'indore': generateRandomShops(22.7196, 75.8577, 8),
  'nagpur': generateRandomShops(21.1458, 79.0882, 8),
  'chandigarh': generateRandomShops(30.7333, 76.7794, 8),
  'kochi': generateRandomShops(9.9312, 76.2673, 8),
  'coimbatore': generateRandomShops(11.0066, 76.9052, 8),
  'bhopal': generateRandomShops(23.1815, 79.9864, 8),
  'thachoor': generateRandomShops(13.2041, 80.0893, 8),
};

const cityCoordinates = {
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'chennai': { lat: 13.1939, lng: 80.2109 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'visakhapatnam': { lat: 17.6869, lng: 83.2185 },
  'surat': { lat: 21.1717, lng: 72.8311 },
  'indore': { lat: 22.7196, lng: 75.8577 },
  'nagpur': { lat: 21.1458, lng: 79.0882 },
  'chandigarh': { lat: 30.7333, lng: 76.7794 },
  'kochi': { lat: 9.9312, lng: 76.2673 },
  'coimbatore': { lat: 11.0066, lng: 76.9052 },
  'bhopal': { lat: 23.1815, lng: 79.9864 },
  'thachoor': { lat: 13.2041, lng: 80.0893 },
};

// Haversine distance formula
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

const Locator = () => {
  const [searchInput, setSearchInput] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [filters, setFilters] = useState({ type: 'all', verified: false, inStock: false });

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

  // Load shops for Chennai on mount
  useEffect(() => {
    loadShopsForCity('chennai');
  }, []);

  const loadShopsForCity = (city) => {
    const cityKey = city.toLowerCase().trim();
    if (medicalShopsDatabase[cityKey] && cityCoordinates[cityKey]) {
      const locations = medicalShopsDatabase[cityKey];
      const coords = cityCoordinates[cityKey];
      
      setUserLocation({ latitude: coords.lat, longitude: coords.lng });
      
      // Calculate distances from city center
      const shopsWithDistance = locations.map(shop => ({
        ...shop,
        distance: getDistance(coords.lat, coords.lng, shop.lat, shop.lng),
      })).sort((a, b) => a.distance - b.distance);
      
      setShops(shopsWithDistance);
      setFilteredShops(shopsWithDistance.filter(s => s.distance <= 3));
      setError(null);
      
      // Update map to city center
      updateMap(coords.lat, coords.lng, shopsWithDistance);
    } else {
      const availableCities = Object.keys(medicalShopsDatabase).join(', ');
      setError(`City "${city}" not found. Available: ${availableCities}`);
      setShops([]);
      setFilteredShops([]);
    }
  };

  const updateMap = (centerLat, centerLng, shopsToShow) => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
    markersRef.current = [];
    
    // Center map on the exact city location
    mapInstanceRef.current.setView([centerLat, centerLng], 13);
    
    // Add user location marker (city center)
    const userMarker = L.circleMarker([centerLat, centerLng], {
      radius: 10,
      fillColor: '#ec4899',
      color: '#fff',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(mapInstanceRef.current);
    userMarker.bindPopup('<strong>📍 City Center</strong><br/>Your Search Location');
    markersRef.current.push(userMarker);
    
    // Add 3 km safe radius circle
    const circle = L.circle([centerLat, centerLng], {
      radius: 3000,
      color: '#ec4899',
      fillColor: '#fce7f3',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(mapInstanceRef.current);
    markersRef.current.push(circle);
    
    // Add shop markers
    shopsToShow.forEach(shop => {
      const distColor = getDistanceColor(shop.distance);
      const colorMap = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };
      
      const marker = L.circleMarker([shop.lat, shop.lng], {
        radius: 8,
        fillColor: colorMap[distColor.color],
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(mapInstanceRef.current);
      
      marker.bindPopup(`<strong>${shop.name}</strong><br/>
        <strong>Distance:</strong> ${shop.distance.toFixed(1)} km<br/>
        <strong>Stock:</strong> ${shop.stock}<br/>
        <strong>Verified:</strong> ${shop.verified}+`);
      
      markersRef.current.push(marker);
    });
  };

  const handleSearch = (city) => {
    setLoading(true);
    setTimeout(() => {
      loadShopsForCity(city);
      setLoading(false);
    }, 300);
  };

  const handleUseMyLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        // Find nearest city (demo fallback to Chennai)
        loadShopsForCity('chennai');
        setLoading(false);
      },
      () => {
        setError('Unable to detect location. Using Chennai data.');
        loadShopsForCity('chennai');
        setLoading(false);
      }
    );
  };

  // Apply filters
  useEffect(() => {
    let filtered = shops.filter(s => s.distance <= 3);
    if (filters.type !== 'all') filtered = filtered.filter(s => s.type === filters.type);
    if (filters.verified) filtered = filtered.filter(s => s.verified >= 5);
    if (filters.inStock) filtered = filtered.filter(s => s.stock === 'available');
    setFilteredShops(filtered);
  }, [filters, shops]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        📍 Smart Medical Pad Locator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Find medical shops with sanitary pads within 3 km</p>
      
      {/* Search Bar */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter city or area (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Thachoor...)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchInput)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={() => handleSearch(searchInput)}
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
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
        {userLocation && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            ✓ Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)} • {shops.length} shops found
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-24">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="hospital">Hospital</option>
                  <option value="community">Community Center</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="verified" checked={filters.verified} onChange={(e) => setFilters({...filters, verified: e.target.checked})} className="rounded" />
                <label htmlFor="verified" className="text-sm">Verified (5+)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="inStock" checked={filters.inStock} onChange={(e) => setFilters({...filters, inStock: e.target.checked})} className="rounded" />
                <label htmlFor="inStock" className="text-sm">In stock</label>
              </div>
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs font-semibold mb-3">Distance Indicator</p>
                <div className="space-y-2 text-xs">
                  <div>🟢 0–1 km (Very Close)</div>
                  <div>🟡 1–2 km (Close)</div>
                  <div>🔴 2–3 km (Moderate)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map and Results */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div ref={mapRef} className="h-96 rounded-t-xl"></div>
            
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Medical Shops Within 3 km ({filteredShops.length})
              </h3>
              
              {filteredShops.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>📍 No locations found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredShops.map((shop) => {
                    const distColor = getDistanceColor(shop.distance);
                    return (
                      <div
                        key={shop.id}
                        onClick={() => setSelectedShop(shop)}
                        className={`p-4 border-2 border-${distColor.color}-300 rounded-lg bg-${distColor.color}-50 dark:bg-gray-700 cursor-pointer hover:shadow-lg hover:scale-105 transition`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex gap-2 mb-2">
                              <h4 className="font-semibold">{shop.name}</h4>
                              {shop.verified >= 5 && <span className="text-xs bg-green-200 px-2 rounded">✓ Verified ({shop.verified})</span>}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div>{distColor.icon} {distColor.label} • {shop.distance.toFixed(1)} km</div>
                              <div>⏱️ ETA: {getETA(shop.distance)} min</div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {shop.type.charAt(0).toUpperCase() + shop.type.slice(1)} • Click for details
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded font-medium ${shop.stock === 'available' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>
                            {shop.stock === 'available' ? '✓ Available' : '⚠️ Limited'}
                          </span>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedShop.name}</h2>
              <button onClick={() => setSelectedShop(null)} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              {/* Shop Type & Status */}
              <div className="flex gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                  {selectedShop.type.charAt(0).toUpperCase() + selectedShop.type.slice(1)}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded ${selectedShop.stock === 'available' ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100'}`}>
                  {selectedShop.stock === 'available' ? '✓ In Stock' : '⚠️ Limited Stock'}
                </span>
                {selectedShop.verified >= 5 && <span className="px-3 py-1 text-xs font-medium rounded bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100">✓ Verified ({selectedShop.verified})</span>}
              </div>

              {/* Location Details */}
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
                  <div className="border-t border-pink-200 dark:border-gray-600 pt-2 mt-2 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Your Location:</span>
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {userLocation?.latitude.toFixed(6)}°, {userLocation?.longitude.toFixed(6)}°
                    </span>
                  </div>
                </div>
              </div>

              {/* Distance & ETA */}
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

              {/* Safety Rating */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Safety Rating</span>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-300">{selectedShop.safety} ⭐</span>
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition font-medium">
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