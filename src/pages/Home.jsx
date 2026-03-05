import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="space-y-12">
    {/* Hero */}
    <div className="text-center py-12">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
        🩸 PinkRoute
      </h1>
      <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
        Predictive menstrual emergency infrastructure
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Ensuring access, safety, and dignity through AI-powered solutions.
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Link to="/locator" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
        <div className="text-4xl mb-3">📍</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Smart Pad Locator</h2>
        <p className="text-gray-600 dark:text-gray-400">Find nearby pads with live maps and verified locations.</p>
      </Link>

      <Link to="/emergency?mode=pad" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
        <div className="text-4xl mb-3">🚨</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Emergency Mode</h2>
        <p className="text-gray-600 dark:text-gray-400">Auto-detect nearest stocked location instantly.</p>
      </Link>

      <Link to="/emergency?mode=delivery" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
        <div className="text-4xl mb-3">📦</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Emergency Delivery</h2>
        <p className="text-gray-600 dark:text-gray-400">Get pads delivered to your location fast.</p>
      </Link>

      <Link to="/emergency?mode=anonymous" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
        <div className="text-4xl mb-3">🕵️</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Anonymous Help</h2>
        <p className="text-gray-600 dark:text-gray-400">Request help discreetly with verified volunteers.</p>
      </Link>

      <Link to="/school" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
        <div className="text-4xl mb-3">🎓</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">School Mode</h2>
        <p className="text-gray-600 dark:text-gray-400">Campus supply tracking & nurse requests.</p>
      </Link>

      <Link to="/stealth" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Stealth Mode</h2>
        <p className="text-gray-600 dark:text-gray-400">Calculator-style login & shake-to-hide.</p>
      </Link>
    </div>

    {/* Key Metrics */}
    <div className="grid md:grid-cols-3 gap-6 py-8">
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl text-center">
        <div className="text-4xl font-bold mb-2">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">Risk Scoring</h3>
        <p className="text-sm opacity-90">AI-powered menstrual risk index calculation</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl text-center">
        <div className="text-4xl font-bold mb-2">📊</div>
        <h3 className="text-lg font-semibold mb-2">Health Monitoring</h3>
        <p className="text-sm opacity-90">Track symptoms & detect patterns</p>
      </div>
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl text-center">
        <div className="text-4xl font-bold mb-2">🌍</div>
        <h3 className="text-lg font-semibold mb-2">Offline Support</h3>
        <p className="text-sm opacity-90">PWA with offline data caching</p>
      </div>
    </div>
  </div>
);

export default Home;