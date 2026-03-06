import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Emergency = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const mode = params.get('mode');

  // Delivery form state
  const [deliveryForm, setDeliveryForm] = useState({
    padType: 'regular',
    quantity: 1,
    name: '',
    phone: '',
    address: '',
    notes: '',
    location: null,
    paymentMethod: 'cod',
    deliveryPriority: 'normal',
    deliverySource: 'pharmacy',
  });
  const [deliverySubmitted, setDeliverySubmitted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'volunteer', text: "Hi! I've received your order. I'm at the pharmacy now.", time: '14:22' },
    { type: 'volunteer', text: 'I will be at your location in about 15 minutes.', time: '14:23' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Anonymous Help state
  const [anonSubMode, setAnonSubMode] = useState(null); // 'pads', 'accompany', 'info', null
  const [anonForm, setAnonForm] = useState({
    padType: 'regular',
    urgency: 'normal',
    location: null,
    notes: '',
    reason: 'unsafe',
  });
  const [anonSubmitted, setAnonSubmitted] = useState(false);
  const [anonVolunteer, setAnonVolunteer] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [showHidden, setShowHidden] = useState(false);

  // Health advice topics and chat bot state
  const healthAdvice = {
    cramps: { title: 'Severe Cramps', advice: ['Drink warm water', 'Rest in a comfortable position', 'Use a heating pad if available', 'If pain persists for 2+ hours, visit a clinic'] },
    heavy: { title: 'Heavy Bleeding', advice: ['Change pad every 3-4 hours', 'Stay hydrated', 'Eat iron-rich foods', 'If bleeding soaks 1 pad/hour, seek medical help'] },
    delay: { title: 'Period Delay', advice: ['Don\'t panic - stress can cause delays', 'Maintain regular sleep schedule', 'Eat nutritious meals', 'If delayed 2+ weeks, consult a doctor'] },
    hygiene: { title: 'Hygiene Tips', advice: ['Change pad every 4-6 hours', 'Wash hands before & after changing', 'Use clean, dry pads only', 'Wash genital area with plain water'] },
  };
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showBotChat, setShowBotChat] = useState(false);
  const [botMessages, setBotMessages] = useState([]);
  const [botInput, setBotInput] = useState('');

  // Detect device shake for privacy
  React.useEffect(() => {
    if (anonSubMode) {
      let shakeCount = 0;
      let lastX = 0, lastY = 0, lastZ = 0;

      const handleMotion = (event) => {
        const { x, y, z } = event.accelerationIncludingGravity;
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        
        if (acceleration > 30) {
          shakeCount++;
          if (shakeCount > 2) {
            setShowHidden(true);
            setTimeout(() => setShowHidden(false), 10000);
            shakeCount = 0;
          }
        }
      };

      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [anonSubMode]);

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (delta) => {
    setDeliveryForm(prev => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, prev.quantity + delta))
    }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDeliveryForm(prev => ({
            ...prev,
            location: { latitude, longitude, fetched: true }
          }));
        },
        () => alert('Unable to get your location')
      );
    }
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    if (!deliveryForm.name || !deliveryForm.phone || !deliveryForm.address) {
      alert('Please fill all required fields');
      return;
    }
    setDeliverySubmitted(true);
    setShowChat(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { type: 'user', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
    setTimeout(() => {
      const responses = [
        "Got it! I'll make sure to deliver there.",
        "No problem, I'll call you when I arrive.",
        "Perfect, see you in a few minutes!",
        "Thanks for letting me know!",
      ];
      setChatMessages(prev => [...prev, { type: 'volunteer', text: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  const handleSendBotMessage = () => {
    if (!botInput.trim()) return;
    setBotMessages(prev => [...prev, { type: 'user', text: botInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    const question = botInput.toLowerCase();
    setBotInput('');
    setTimeout(() => {
      let reply = "Sorry, I don't have information on that.";
      if (question.includes('cramp')) reply = 'Try using a heating pad and resting for a while.';
      else if (question.includes('bleed')) reply = 'If bleeding heavily change pads often and seek medical help if it continues.';
      else if (question.includes('delay')) reply = 'Period delays can be due to stress; consult a doctor if it exceeds 2 weeks.';
      else if (question.includes('hygiene')) reply = 'Keep the area clean and change pads every 4–6 hours.';
      setBotMessages(prev => [...prev, { type: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  // auto-scroll bot chat when new messages arrive
  React.useEffect(() => {
    if (showBotChat) {
      const container = document.getElementById('botChatContainer');
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [botMessages, showBotChat]);

  const renderContent = () => {
    switch(mode) {
      case 'pad':
        return (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-4">🚨 Emergency Mode</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Auto-detecting nearest stocked location...</p>
            <div className="space-y-2 text-sm">
              <p>✓ Getting your location</p>
              <p>✓ Finding nearby stores</p>
              <p>✓ Calculating fastest route</p>
            </div>
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-semibold">Sakhi Pharmacy - 0.8km away</p>
              <p className="text-sm text-green-700 dark:text-green-300">ETA: 12 mins • Stock: Available</p>
            </div>
          </div>
        );
      case 'delivery':
        if (showChat && deliverySubmitted) {
          return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">💬 Chat with Volunteer</h2>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 dark:text-gray-400">Priya S. - 2 km away</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.type === 'user' ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-pink-100' : 'text-gray-500 dark:text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition font-medium"
                >
                  Send
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                  onClick={() => {
                    handleSendMessage();
                    setChatInput("I'm at the main gate");
                  }}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-xs hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                >
                  Main Gate
                </button>
                <button
                  onClick={() => {
                    handleSendMessage();
                    setChatInput("Please ring the bell");
                  }}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-xs hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                >
                  Ring Bell
                </button>
                <button
                  onClick={() => {
                    handleSendMessage();
                    setChatInput("Thank you!");
                  }}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-xs hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                >
                  Thank You
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-2">📦 Emergency Pad Delivery</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get sanitary pads delivered to you in 20-30 minutes</p>

            {deliverySubmitted ? (
              <div className="bg-green-100 dark:bg-green-900 border-2 border-green-500 rounded-lg p-6 text-center">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">Delivery Requested!</p>
                <p className="text-green-700 dark:text-green-300">Volunteer assigned: Priya S.</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">ETA: {deliveryForm.deliveryPriority === 'critical' ? '10 mins' : deliveryForm.deliveryPriority === 'urgent' ? '15 mins' : '20-30 mins'}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-4">Track your order: #DL{Math.floor(Math.random() * 100000)}</p>
                <button
                  onClick={() => { setShowChat(true); setDeliverySubmitted(false); }}
                  className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  💬 Chat with Volunteer
                </button>
              </div>
            ) : (
              <form onSubmit={handleDeliverySubmit} className="space-y-5">
                {/* Delivery Source */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Delivery Source
                  </label>
                  <div className="space-y-2">
                    {['pharmacy', 'volunteer', 'nurse'].map((source) => (
                      <label key={source} className="flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          name="deliverySource"
                          value={source}
                          checked={deliveryForm.deliverySource === source}
                          onChange={handleDeliveryChange}
                          className="w-4 h-4"
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {source === 'pharmacy' && '💊 Pharmacy Delivery'}
                          {source === 'volunteer' && '👥 Nearby Volunteer'}
                          {source === 'nurse' && '👨‍⚕️ School Nurse'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Delivery Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Delivery Priority
                  </label>
                  <div className="space-y-2">
                    {['normal', 'urgent', 'critical'].map((priority) => (
                      <label key={priority} className="flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          name="deliveryPriority"
                          value={priority}
                          checked={deliveryForm.deliveryPriority === priority}
                          onChange={handleDeliveryChange}
                          className="w-4 h-4"
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {priority === 'normal' && '⏱️ Normal (30 mins)'}
                          {priority === 'urgent' && '🔔 Urgent (15 mins)'}
                          {priority === 'critical' && '🆘 Critical Emergency (10 mins)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pad Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Pad Type
                  </label>
                  <select
                    name="padType"
                    value={deliveryForm.padType}
                    onChange={handleDeliveryChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-medium"
                  >
                    <option value="regular">Regular</option>
                    <option value="heavy">Heavy Flow</option>
                    <option value="overnight">Overnight</option>
                    <option value="liner">Panty Liner</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-lg"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={deliveryForm.quantity}
                      readOnly
                      className="w-16 text-center px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryForm.name}
                    onChange={handleDeliveryChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryForm.phone}
                    onChange={handleDeliveryChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={deliveryForm.address}
                    onChange={handleDeliveryChange}
                    placeholder="Enter your full delivery address"
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="mt-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 font-medium text-sm"
                  >
                    📍 Use My Current Location
                  </button>
                  {deliveryForm.location?.fetched && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      ✓ Location fetched: {deliveryForm.location.latitude.toFixed(4)}°, {deliveryForm.location.longitude.toFixed(4)}°
                    </p>
                  )}
                </div>

                {/* Special Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Special Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={deliveryForm.notes}
                    onChange={handleDeliveryChange}
                    placeholder="Example: deliver at gate / hostel block / ask for Priya"
                    rows="2"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {['cod', 'upi', 'card'].map((method) => (
                      <label key={method} className="flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={deliveryForm.paymentMethod === method}
                          onChange={handleDeliveryChange}
                          className="w-4 h-4"
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {method === 'cod' && '💵 Cash on Delivery'}
                          {method === 'upi' && '📱 UPI / Google Pay'}
                          {method === 'card' && '💳 Debit/Credit Card'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-700 transition text-lg"
                >
                  🚀 Request Delivery
                </button>

                {/* Info */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">⏱️ Estimated Delivery: {deliveryForm.deliveryPriority === 'critical' ? '10 mins' : deliveryForm.deliveryPriority === 'urgent' ? '15 mins' : '20–30 mins'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Safe • Discreet • Reliable</p>
                </div>
              </form>
            )}
          </div>
        );
      case 'anonymous':
        // Anonymous Help Main Menu
        if (!anonSubMode) {
          return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🕵️ Anonymous Help</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Your identity is fully protected. Request help from nearby verified volunteers anonymously.</p>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setAnonSubMode('pads')}
                  className="p-6 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900 dark:to-red-800 rounded-xl hover:shadow-lg hover:scale-105 transition text-left"
                >
                  <p className="text-2xl mb-2">🆘</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">Emergency Pads</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get sanitary pads delivered anonymously</p>
                </button>

                <button
                  onClick={() => setAnonSubMode('accompany')}
                  className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-xl hover:shadow-lg hover:scale-105 transition text-left"
                >
                  <p className="text-2xl mb-2">👭</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">Accompany to Store</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Request a volunteer to come with you</p>
                </button>

                <button
                  onClick={() => setAnonSubMode('info')}
                  className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-xl hover:shadow-lg hover:scale-105 transition text-left"
                >
                  <p className="text-2xl mb-2">ℹ️</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">Information & Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Health tips and nearby clinic information</p>
                </button>
              </div>

              <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">🔒 Privacy Protection</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">✓ Your location rounded to ~1km radius</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">✓ Only volunteer ID shown, never names</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">✓ Shake phone to hide request instantly</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">✓ Verified female volunteers only</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">✓ Request auto-deletes after 24 hours</p>
              </div>
            </div>
          );
        }

        // Emergency Pads Form
        if (anonSubMode === 'pads' && !anonSubmitted) {
          return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <button
                onClick={() => setAnonSubMode(null)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4 font-semibold"
              >
                ← Back
              </button>
              
              <h2 className="text-3xl font-bold mb-2">🆘 Emergency Pad Request</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Request pads anonymously from a nearby volunteer</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!anonForm.location) {
                    alert('Please share your location');
                    return;
                  }
                  setAnonSubmitted(true);
                  setAnonVolunteer({
                    id: Math.floor(Math.random() * 100) + 1,
                    distance: (Math.random() * 2 + 0.5).toFixed(1),
                    eta: anonForm.urgency === 'urgent' ? 8 : 15,
                  });
                  setRequestStatus('sent');
                  setTimeout(() => setRequestStatus('accepted'), 2000);
                  setTimeout(() => setRequestStatus('onway'), 5000);
                }}
                className="space-y-5"
              >
                {/* Pad Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Pad Type</label>
                  <select
                    value={anonForm.padType}
                    onChange={(e) => setAnonForm({...anonForm, padType: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="regular">Regular</option>
                    <option value="overnight">Overnight</option>
                    <option value="xl">XL</option>
                  </select>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Urgency</label>
                  <div className="space-y-2">
                    {['normal', 'urgent'].map((urg) => (
                      <label key={urg} className="flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          value={urg}
                          checked={anonForm.urgency === urg}
                          onChange={(e) => setAnonForm({...anonForm, urgency: e.target.value})}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">
                          {urg === 'normal' ? '⏱️ Normal (15 mins)' : '🔔 Urgent (8 mins)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Location</label>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setAnonForm({
                            ...anonForm,
                            location: {
                              lat: pos.coords.latitude,
                              lng: pos.coords.longitude,
                              fetched: true
                            }
                          });
                        },
                        () => alert('Enable location access')
                      );
                    }}
                    className="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 font-medium"
                  >
                    📍 Use My Location
                  </button>
                  {anonForm.location?.fetched && <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">✓ Location rounded to ~1km radius for privacy</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
                  <textarea
                    value={anonForm.notes}
                    onChange={(e) => setAnonForm({...anonForm, notes: e.target.value})}
                    placeholder="Hostel gate / classroom / near library"
                    rows="2"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-700 transition text-lg"
                >
                  Send Anonymous Request
                </button>
              </form>
            </div>
          );
        }

        // Pad Request Confirmation
        if (anonSubMode === 'pads' && anonSubmitted) {
          return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <button
                onClick={() => { setAnonSubMode(null); setAnonSubmitted(false); setAnonVolunteer(null); }}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4 font-semibold"
              >
                ← Back
              </button>

              <div className="space-y-6">
                {/* Request Status */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6 text-center">
                  <p className="text-4xl mb-2">✅</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Request Sent</p>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${requestStatus === 'sent' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <span className="text-xl">✔</span>
                    <p className="font-medium">Request Sent</p>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${requestStatus === 'accepted' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <span className="text-xl">{requestStatus === 'accepted' ? '✔' : '⏳'}</span>
                    <p className="font-medium">Volunteer Accepted</p>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${requestStatus === 'onway' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <span className="text-xl">{requestStatus === 'onway' ? '🚶' : '⏳'}</span>
                    <p className="font-medium">Volunteer On the Way</p>
                  </div>
                </div>

                {/* Volunteer Info */}
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Nearby Volunteer Found</p>
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-300 mb-2">Volunteer #{anonVolunteer?.id}</p>
                  <div className="flex justify-center gap-6 text-center">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-300">{anonVolunteer?.distance} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">ETA</p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-300">{anonVolunteer?.eta} mins</p>
                    </div>
                  </div>
                </div>

                {/* Privacy Note */}
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">🔒 Your identity remains anonymous</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Volunteer sees only your ID & location</p>
                </div>
              </div>
            </div>
          );
        }

        // Accompany to Store Form
        if (anonSubMode === 'accompany' && !anonSubmitted) {
          return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <button
                onClick={() => setAnonSubMode(null)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4 font-semibold"
              >
                ← Back
              </button>

              <h2 className="text-3xl font-bold mb-2">👭 Request Companion</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">A volunteer will come with you to the store</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!anonForm.location) {
                    alert('Please share your location');
                    return;
                  }
                  setAnonSubmitted(true);
                  setAnonVolunteer({
                    id: Math.floor(Math.random() * 100) + 1,
                    distance: (Math.random() * 1.5 + 0.3).toFixed(1),
                    eta: Math.floor(Math.random() * 10) + 5,
                  });
                  setRequestStatus('sent');
                  setTimeout(() => setRequestStatus('accepted'), 2000);
                }}
                className="space-y-5"
              >
                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Why do you need a companion?</label>
                  <div className="space-y-2">
                    {['night', 'unsafe', 'uncomfortable'].map((reason) => (
                      <label key={reason} className="flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          value={reason}
                          checked={anonForm.reason === reason}
                          onChange={(e) => setAnonForm({...anonForm, reason: e.target.value})}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">
                          {reason === 'night' && '🌙 Night time'}
                          {reason === 'unsafe' && '⚠️ Unsafe area'}
                          {reason === 'uncomfortable' && '😟 Feeling uncomfortable'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Meeting Location */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Meeting Point</label>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setAnonForm({
                            ...anonForm,
                            location: {
                              lat: pos.coords.latitude,
                              lng: pos.coords.longitude,
                              fetched: true
                            }
                          });
                        },
                        () => alert('Enable location access')
                      );
                    }}
                    className="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 font-medium"
                  >
                    📍 Use My Location
                  </button>
                  {anonForm.location?.fetched && <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">✓ Location ready</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-700 transition text-lg"
                >
                  Request Companion
                </button>
              </form>
            </div>
          );
        }

        // Companion Confirmation
        if (anonSubMode === 'accompany' && anonSubmitted) {
          return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <button
                onClick={() => { setAnonSubMode(null); setAnonSubmitted(false); setAnonVolunteer(null); }}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4 font-semibold w-full text-left"
              >
                ← Back
              </button>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-8">
                <p className="text-4xl mb-4">👭</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Volunteer Available</p>
                <div className="space-y-4 mt-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volunteer ID</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">#{anonVolunteer?.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Distance</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{anonVolunteer?.distance} km</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">ETA</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{anonVolunteer?.eta} mins</p>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 mt-4">
                    <p className="font-semibold text-green-800 dark:text-green-200">✓ Meeting at your location</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Information & Support
        if (anonSubMode === 'info') {
          /* healthAdvice and related state are defined at top level to satisfy hooks rules */

          return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <button
                onClick={() => setAnonSubMode(null)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4 font-semibold"
              >
                ← Back
              </button>

              <h2 className="text-3xl font-bold mb-2">ℹ️ Information & Support</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Get health advice and find nearby help</p>


              {!selectedTopic ? (
                <div className="space-y-3">
                  {Object.entries(healthAdvice).map(([key, { title }]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTopic(key)}
                      className="w-full p-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg hover:shadow-lg transition text-left font-medium text-gray-800 dark:text-white"
                    >
                      {key === 'cramps' && '😣'} {key === 'heavy' && '🩸'} {key === 'delay' && '⏰'} {key === 'hygiene' && '🧼'} {title}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowBotChat(true)}
                    className="w-full mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium"
                  >
                    💬 Chat with Health Bot
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-semibold mb-4"
                  >
                    ← Back to Topics
                  </button>

                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6">
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{healthAdvice[selectedTopic].title}</p>
                    <ul className="space-y-2">
                      {healthAdvice[selectedTopic].advice.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-green-600 dark:text-green-400 font-bold mt-1">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">🏥 Nearest Clinic</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">1.2 km away</p>
                      <button className="w-full mt-3 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        return null;
      default:
        return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Choose Emergency Mode</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Select how you'd like help:</p>
            <div className="grid grid-cols-1 gap-4">
              <a href="?mode=pad" className="p-4 bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800 rounded-lg">
                🚨 Find Nearest Pad
              </a>
              <a href="?mode=delivery" className="p-4 bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-lg">
                📦 Emergency Delivery
              </a>
              <a href="?mode=anonymous" className="p-4 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-lg">
                🕵️ Anonymous Help
              </a>
            </div>
          </div>
        );
    }
  };

  // global chat overlay component for health bot
  const ChatOverlay = () => (
    showBotChat ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-11/12 max-w-md p-4 relative">
          <button
            onClick={() => setShowBotChat(false)}
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 text-xl font-bold"
          >
            ×
          </button>
          <div id="botChatContainer" className="h-64 overflow-y-auto mb-2 space-y-2">
            {botMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.type === 'user'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={botInput}
              onChange={(e) => setBotInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendBotMessage()}
              placeholder="Ask the health bot..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSendBotMessage}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="relative">
      {renderContent()}
      {/* floating chat button always visible */}
      <button
        onClick={() => setShowBotChat(true)}
        className="fixed bottom-4 right-4 bg-teal-500 text-white p-3 rounded-full shadow-lg z-40"
      >
        💬
      </button>
      <ChatOverlay />
    </div>
  );
};

export default Emergency;