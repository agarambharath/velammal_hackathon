import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StealthMode = () => {
  const navigate = useNavigate();
  const [showTracker, setShowTracker] = useState(false);
  const [days, setDays] = useState(7);
  const [result, setResult] = useState(null);
  const [hidden, setHidden] = useState(false);

  // Risk calculation
  const checkRisk = () => {
    let level, desc, progress;
    if (days <= 3) {
      level = 'High Risk';
      desc = 'You are at high risk. Prepare immediately and consider asking for help.';
      progress = 0.2;
    } else if (days <= 7) {
      level = 'Medium Risk';
      desc = 'You have a few days to prepare. Start checking your current supplies and plan ahead to avoid last-minute hassle.';
      progress = 0.5;
    } else {
      level = 'Low Risk';
      desc = 'You are in a safe zone. Keep tracking and stay prepared.';
      progress = 0.8;
    }
    setResult({ level, desc, progress });
  };

  // Shake detection for privacy
  useEffect(() => {
    let lastTime = 0;
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const { x, y, z } = acc;
      const magnitude = Math.sqrt(x*x + y*y + z*z);
      const now = Date.now();
      if (magnitude > 25 && now - lastTime > 1000) {
        setHidden(true);
        lastTime = now;
      }
    };
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  if (hidden) {
    return (
      <div className="h-screen bg-gray-200 flex flex-col items-center justify-center">
        <p className="text-3xl font-mono">1234&nbsp;&nbsp;5678&nbsp;&nbsp;9012</p>
        <button
          onClick={() => setHidden(false)}
          className="mt-6 px-4 py-2 bg-pink-500 text-white rounded-lg"
        >
          Unlock
        </button>
      </div>
    );
  }

  if (!showTracker) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-pink-50 dark:bg-gray-900">
        <button
          onClick={() => setShowTracker(true)}
          className="px-8 py-6 bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-2xl shadow-2xl transform hover:scale-105 transition"
        >
          <p className="text-xl font-semibold">📊 Period Risk Tracker</p>
          <p className="text-sm mt-1">Know your risk level to be prepared</p>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 p-6">
      <h1 className="text-center text-3xl font-bold mb-4 text-gray-800 dark:text-white">Period Risk Tracker</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Know your risk level to be prepared</p>

      {!result ? (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          {/* Risk Guide */}
          <div className="flex justify-between">
            <div className="px-4 py-2 bg-red-100 dark:bg-red-900 rounded-lg text-red-700">0–3 days<br/>High Risk</div>
            <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-yellow-700">4–7 days<br/>Medium Risk</div>
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900 rounded-lg text-green-700">8+ days<br/>Low Risk</div>
          </div>

          {/* Input card */}
          <div className="bg-pink-100 dark:bg-gray-700 rounded-xl p-6 text-center">
            <p className="text-lg mb-4">How many days until your next period?</p>
            <div className="flex items-center justify-center gap-6 mb-4">
              <button onClick={() => setDays(d => Math.max(0, d - 1))} className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full text-2xl">−</button>
              <span className="text-4xl font-bold">{days}</span>
              <button onClick={() => setDays(d => Math.min(30, d + 1))} className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full text-2xl">+</button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Days Remaining</p>
          </div>

          {/* Risk scale */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden mt-4">
            <div
              className={`h-full ${days<=3 ? 'bg-red-500' : days<=7 ? 'bg-yellow-400' : 'bg-green-400'}`}
              style={{ width: `${(days/30)*100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0 days</span>
            <span>High Risk</span>
            <span>Medium Risk</span>
            <span>Low Risk</span>
            <span>30 days</span>
          </div>

          <button
            onClick={checkRisk}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold mt-6 hover:from-pink-600 hover:to-purple-700 transition"
          >
            Check Risk Level
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">YOUR RISK LEVEL</p>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">{result.level}</h2>
          <p className="text-center text-gray-700 dark:text-gray-300">{result.desc}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-green-400" style={{ width: `${result.progress*100}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Safer</span>
            <span>Urgent</span>
          </div>

          {/* Actions */}
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• Check your sanitary pad stock at home.</li>
            <li>• Bookmark a nearby pharmacy location.</li>
            <li>• Schedule a routine health checkup if needed.</li>
            <li>• Stay hydrated and maintain a healthy diet.</li>
            <li>• Manage stress with light exercise or yoga.</li>
          </ul>

          <button
            onClick={() => { setResult(null); }}
            className="w-full py-3 border-2 border-pink-500 text-pink-500 rounded-lg font-bold hover:bg-pink-50 dark:hover:bg-gray-700 transition"
          >
            Check Again
          </button>
        </div>
      )}
    </div>
  );
};

export default StealthMode;