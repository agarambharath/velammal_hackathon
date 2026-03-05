import React, { useState, useEffect } from 'react';
import { MapPin, Package, Users, AlertCircle, Phone, MapPinIcon, Clock } from 'lucide-react';

const EmergencyMode = () => {
  const [currentView, setCurrentView] = useState('main');
  const [userLocation, setUserLocation] = useState(null);
  const [nearestPads, setNearestPads] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [volunteerStatus, setVolunteerStatus] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [steps, setSteps] = useState({
    location: false,
    finding: false,
    route: false,
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    padType: 'Regular',
    address: '',
  });

  // Mock pad locations data
  const padLocations = [
    {
      id: 1,
      name: 'Sakhi Pharmacy',
      distance: '0.8 km',
      eta: '10 minutes',
      status: 'Available',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Women\'s Health Center',
      distance: '1.2 km',
      eta: '15 minutes',
      status: 'Limited',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Medical Store Plus',
      distance: '1.5 km',
      eta: '18 minutes',
      status: 'Available',
      rating: 4.7,
    },
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation && currentView === 'nearestPads') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Simulate finding nearest pads
          setNearestPads(padLocations);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Use mock location
          setNearestPads(padLocations);
        }
      );
    }
  }, [currentView]);

  // Handle Emergency Delivery
  const handleDeliveryRequest = (e) => {
    e.preventDefault();
    const request = {
      id: Date.now(),
      padType: deliveryDetails.padType,
      address: deliveryDetails.address || 'Current Location',
      timestamp: new Date().toLocaleTimeString(),
    };
    localStorage.setItem(`delivery_${request.id}`, JSON.stringify(request));
    setDeliveryStatus({
      id: request.id,
      eta: '20–30 minutes',
      status: 'confirmed',
    });
    setShowDeliveryForm(false);
  };

  // Handle Volunteer Help
  const handleVolunteerAlert = () => {
    const alert = {
      id: Date.now(),
      volunteerID: '#' + Math.floor(Math.random() * 1000),
      distance: '1.5 km',
      eta: '12 minutes',
      timestamp: new Date().toLocaleTimeString(),
    };
    localStorage.setItem(`volunteer_${alert.id}`, JSON.stringify(alert));
    setVolunteerStatus(alert);
  };

  // Navigate to location
  const handleNavigate = (location) => {
    alert(`Opening maps for: ${location.name}`);
    // In production: window.open(`google.com/maps/search/${location.name}`)
  };

  // Main Emergency Assist Flow
  useEffect(() => {
    if (currentView === 'assistActivated') {
      setSteps({ location: false, finding: false, route: false });
      setNearestPads([]);
      // Simulate step-by-step progress
      setTimeout(() => setSteps(s => ({ ...s, location: true })), 700);
      setTimeout(() => setSteps(s => ({ ...s, finding: true })), 1400);
      setTimeout(() => setSteps(s => ({ ...s, route: true })), 2100);
      setTimeout(() => setNearestPads([padLocations[0]]), 2600);
    }
  }, [currentView]);

  if (currentView === 'assistActivated') {
    // Removed assistActivated view entirely
    return null;
  }

  // Pad Location Card
  const PadLocationCard = ({ location }) => (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-pink-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="text-pink-600" size={24} />
          <h4 className="font-bold text-gray-800">{location.name}</h4>
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
          {location.status}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon size={16} />
          <span className="text-sm">{location.distance}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={16} />
          <span className="text-sm">ETA: {location.eta}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">⭐ {location.rating}</span>
        </div>
      </div>
      <button
        onClick={() => handleNavigate(location)}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
      >
        Navigate Now
      </button>
    </div>
  );

  // Main View
  if (currentView === 'main') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-20">
        {/* Header */}
        <div className="pt-8 px-6 text-center">
          <div className="inline-block mb-4">
            <AlertCircle className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Emergency Mode
          </h1>
          <p className="text-gray-600 text-lg">Quick assistance during menstrual emergencies</p>
        </div>

        {/* Main Info Box */}
        <div className="mx-6 mt-8 bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Help Available 24/7</h3>
              <p className="text-blue-800 text-sm">We're here to support you with discreet, quick assistance</p>
            </div>
          </div>
        </div>

        {/* Emergency Cards Grid */}
        <div className="px-6 space-y-6">
          <EmergencyCard
            icon={MapPin}
            title="Find Nearest Pads"
            description="Automatically detect the nearest location with sanitary pads in stock"
            onClick={() => setCurrentView('nearestPads')}
            bgColor="bg-gradient-to-br from-pink-500 to-rose-500"
          />

          <EmergencyCard
            icon={Package}
            title="Emergency Delivery"
            description="Get sanitary pads delivered to your location quickly and discreetly"
            onClick={() => setCurrentView('delivery')}
            bgColor="bg-gradient-to-br from-purple-500 to-indigo-500"
          />

          <EmergencyCard
            icon={Users}
            title="Volunteer Help"
            description="Request assistance from nearby verified volunteers in your community"
            onClick={() => setCurrentView('volunteer')}
            bgColor="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 px-6">
          <p className="text-gray-600 text-sm">📞 Emergency Helpline: 1800-XXX-XXXX</p>
          <p className="text-gray-500 text-xs mt-4">Empowering Women's Health and Safety</p>
        </div>
      </div>
    );
  }

  // Nearest Pads View
  if (currentView === 'nearestPads') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-pink-200 shadow-md z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('main')}
              className="text-gray-600 hover:text-gray-800 font-semibold"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-gray-800">Nearest Pads</h2>
            <div className="w-12"></div>
          </div>
        </div>

        {/* Searching Animation */}
        {nearestPads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-16 h-16 rounded-full border-4 border-pink-300 border-t-pink-600 animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Finding nearest pad locations...</p>
          </div>
        ) : (
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              🚨 {nearestPads.length} Locations Found
            </h3>

            <div className="space-y-4">
              {nearestPads.map((location) => (
                <PadLocationCard key={location.id} location={location} />
              ))}
            </div>

            {/* Safety Tips */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
              <h4 className="font-bold text-yellow-800 mb-2">💡 Safety Tip</h4>
              <p className="text-yellow-700 text-sm">Always inform someone trusted before going out. Your safety is our priority.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Emergency Delivery View
  if (currentView === 'delivery') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-purple-200 shadow-md z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentView('main');
                setDeliveryStatus(null);
              }}
              className="text-gray-600 hover:text-gray-800 font-semibold"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-gray-800">Emergency Delivery</h2>
            <div className="w-12"></div>
          </div>
        </div>

        <div className="px-6 py-8">
          {deliveryStatus ? (
            // Delivery Confirmed
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Delivery Confirmed!</h3>
              <p className="text-gray-600 mb-8">Your order has been placed successfully</p>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-green-300">
                    <span className="text-gray-700">Pad Type:</span>
                    <span className="font-bold text-gray-800">{deliveryDetails.padType}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-green-300">
                    <span className="text-gray-700">Delivery Address:</span>
                    <span className="font-bold text-gray-800">{deliveryDetails.address || 'Current Location'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Estimated Delivery:</span>
                    <span className="font-bold text-green-600">20–30 minutes</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Your delivery will be discreet and unmarked. Track your order in notifications.
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentView('main');
                  setDeliveryStatus(null);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            // Delivery Form
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Request Quick Delivery</h3>

              <form onSubmit={handleDeliveryRequest} className="space-y-6">
                {/* Pad Type Selection */}
                <div>
                  <label className="block text-gray-700 font-bold mb-3">Pad Type</label>
                  <div className="space-y-2">
                    {['Regular', 'Overnight', 'XL'].map((type) => (
                      <label key={type} className="flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-pink-400 cursor-pointer transition-all">
                        <input
                          type="radio"
                          name="padType"
                          value={type}
                          checked={deliveryDetails.padType === type}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, padType: e.target.value })}
                          className="w-4 h-4 text-pink-600"
                        />
                        <span className="ml-3 font-semibold text-gray-800">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-gray-700 font-bold mb-3">Delivery Address</label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full border-2 border-dashed border-pink-400 rounded-lg p-4 text-pink-600 font-semibold hover:bg-pink-50 transition-all"
                    >
                      📍 Use My Current Location
                    </button>
                    <input
                      type="text"
                      placeholder="Or enter alternate address"
                      value={deliveryDetails.address}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
                  <p className="text-purple-800 text-sm">
                    <strong>Privacy:</strong> Discreet packaging. No details will be shared. Track here only.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Request Delivery
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Volunteer Help View
  if (currentView === 'volunteer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-blue-200 shadow-md z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentView('main');
                setVolunteerStatus(null);
              }}
              className="text-gray-600 hover:text-gray-800 font-semibold"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-gray-800">Volunteer Help</h2>
            <div className="w-12"></div>
          </div>
        </div>

        <div className="px-6 py-8">
          {volunteerStatus ? (
            // Volunteer Assigned
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Volunteer Assigned!</h3>
              <p className="text-gray-600 mb-8">A verified volunteer is coming to help you</p>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-blue-300">
                    <span className="text-gray-700">Volunteer ID:</span>
                    <span className="font-bold text-gray-800 bg-blue-100 px-3 py-1 rounded-full">{volunteerStatus.volunteerID}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-blue-300">
                    <span className="text-gray-700">Distance:</span>
                    <span className="font-bold text-gray-800">{volunteerStatus.distance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Estimated Arrival:</span>
                    <span className="font-bold text-blue-600">{volunteerStatus.eta}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                  <Phone size={20} /> Call Volunteer
                </button>
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all">
                  Message
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm">
                  <strong>Safety:</strong> Your identity remains anonymous. Volunteer has been verified.
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentView('main');
                  setVolunteerStatus(null);
                }}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            // Volunteer Alert
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Need Immediate Help?</h3>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-300 mb-8 text-center">
                <Users size={48} className="text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-800 mb-3">Send Emergency Alert</h4>
                <p className="text-gray-600 mb-6">Connect with verified volunteers in your community</p>

                <button
                  onClick={handleVolunteerAlert}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  🚨 Send Emergency Alert
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2">✓ What Happens Next</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Nearby volunteers will be notified</li>
                    <li>• You'll get a volunteer match within 5-10 minutes</li>
                    <li>• Communication remains anonymous</li>
                    <li>• All volunteers are verified & trained</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2">🛡️ Your Privacy</h4>
                  <p className="text-sm text-gray-600">
                    Your real name and contact remain private. Both parties use anonymous IDs.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2">⭐ Volunteer Community</h4>
                  <p className="text-sm text-gray-600">
                    Join our network of women supporting women. Help others when you're able.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Emergency:</strong> If you're in danger, please call 112 (Emergency) or local authorities immediately.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default EmergencyMode;
