import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleEmergency = (mode) => {
    setShowOptions(false);
    navigate('/emergency-mode');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showOptions && (
        <div className="absolute bottom-20 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 mb-2 w-64">
          <button
            onClick={() => handleEmergency('pad')}
            className="w-full text-left px-4 py-3 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-lg mb-2"
          >
            <span className="block font-semibold text-pink-600">🚨 Find Nearest Pad</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Auto-detect stocked location</span>
          </button>
          <button
            onClick={() => handleEmergency('delivery')}
            className="w-full text-left px-4 py-3 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-lg mb-2"
          >
            <span className="block font-semibold text-purple-600">📦 Emergency Delivery</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Get pads delivered</span>
          </button>
          <button
            onClick={() => handleEmergency('anonymous')}
            className="w-full text-left px-4 py-3 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-lg"
          >
            <span className="block font-semibold text-indigo-600">🕵️ Anonymous Help</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Request help discreetly</span>
          </button>
        </div>
      )}
      
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform"
      >
        {showOptions ? '✕' : '🚨'}
      </button>
    </div>
  );
};

export default EmergencyButton;