import React, { useState } from 'react';

const MenstrualRiskCalculator = () => {
  const [daysUntilPeriod, setDaysUntilPeriod] = useState(6);
  const [showResult, setShowResult] = useState(false);

  const getRiskLevel = (days) => {
    if (days <= 3) {
      return {
        level: 'High Risk',
        color: 'bg-red-600',
        bgColor: 'bg-red-600',
        textColor: 'text-white',
        borderColor: 'border-red-700',
        progressColor: 'bg-red-600',
        message: 'Your period is coming very soon. Stock up on pads now!',
        progressPercent: 10
      };
    } else if (days <= 7) {
      return {
        level: 'Medium Risk',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-500',
        textColor: 'text-gray-900',
        borderColor: 'border-yellow-600',
        progressColor: 'bg-yellow-500',
        message: 'Your period may start soon. Be prepared!',
        progressPercent: 50
      };
    } else {
      return {
        level: 'Low Risk',
        color: 'bg-green-600',
        bgColor: 'bg-green-600',
        textColor: 'text-white',
        borderColor: 'border-green-700',
        progressColor: 'bg-green-600',
        message: 'You are in a safe zone. Keep tracking and stay prepared.',
        progressPercent: 90
      };
    }
  };

  const getRecommendations = (days) => {
    if (days <= 3) {
      return [
        '✓ Carry sanitary pads with you always',
        '✓ Check nearest pad station location',
        '✓ Stay hydrated and get rest',
        '✓ Track any symptoms',
        '✓ Know where health room is located'
      ];
    } else if (days <= 7) {
      return [
        '✓ Stock up on sanitary pads at home',
        '✓ Bookmark nearby pharmacy location',
        '✓ Plan for rest days if needed',
        '✓ Eat iron-rich foods',
        '✓ Stay hydrated and exercise lightly'
      ];
    } else {
      return [
        '✓ Check your sanitary pad stock at home',
        '✓ Bookmark a nearby pharmacy location',
        '✓ Schedule a routine health checkup if needed',
        '✓ Stay hydrated and maintain a healthy diet',
        '✓ Manage stress with light exercise or yoga'
      ];
    }
  };

  const risk = getRiskLevel(daysUntilPeriod);
  const recommendations = getRecommendations(daysUntilPeriod);

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 p-6">
        <button
          onClick={() => setShowResult(false)}
          className="mb-6 flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 font-semibold"
        >
          ← Back
        </button>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Risk Level Display */}
          <div className={`${risk.bgColor} border-2 ${risk.borderColor} rounded-2xl p-8 text-center shadow-2xl`}>
            <p className={`text-sm font-semibold ${risk.textColor} opacity-90 mb-2`}>YOUR RISK LEVEL</p>
            <h1 className={`text-5xl font-bold ${risk.textColor} mb-4`}>{risk.level}</h1>
            <p className={`text-lg ${risk.textColor}`}>{risk.message}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>0 days</span>
              <span className="font-semibold">Days Remaining: {daysUntilPeriod}</span>
              <span>30 days</span>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="text-sm font-semibold text-red-700 dark:text-red-300">Safer</div>
              <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                <div
                  className={`h-full ${risk.progressColor} transition-all duration-300`}
                  style={{ width: `${risk.progressPercent}%` }}
                ></div>
              </div>
              <div className="text-sm font-semibold text-red-700 dark:text-red-300">Urgent</div>
            </div>
          </div>

          {/* Risk Indicators */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-600 border-2 border-red-700 rounded-lg p-4 text-center shadow-lg">
              <p className="text-xs font-semibold text-white">0-3 days</p>
              <p className="text-lg font-bold text-white">High Risk</p>
            </div>
            <div className="bg-yellow-500 border-2 border-yellow-600 rounded-lg p-4 text-center shadow-lg">
              <p className="text-xs font-semibold text-gray-900">4-7 days</p>
              <p className="text-lg font-bold text-gray-900">Medium Risk</p>
            </div>
            <div className="bg-green-600 border-2 border-green-700 rounded-lg p-4 text-center shadow-lg">
              <p className="text-xs font-semibold text-white">8+ days</p>
              <p className="text-lg font-bold text-white">Low Risk</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recommendations for You</h2>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <span className="text-lg mt-1">{rec.split(' ')[0]}</span>
                  <span>{rec.substring(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Check Again Button */}
          <button
            onClick={() => setShowResult(false)}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 text-lg"
          >
            🔄 Check Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📊 Menstrual Risk Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Check your preparedness level</p>
        </div>

        {/* Risk Indicators */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-red-600 border-2 border-red-700 rounded-lg p-4 text-center shadow-lg">
            <p className="text-sm font-bold text-white">0-3 days</p>
            <p className="text-xs text-red-100">High Risk</p>
          </div>
          <div className="bg-yellow-500 border-2 border-yellow-600 rounded-lg p-4 text-center shadow-lg">
            <p className="text-sm font-bold text-gray-900">4-7 days</p>
            <p className="text-xs text-gray-800">Medium Risk</p>
          </div>
          <div className="bg-green-600 border-2 border-green-700 rounded-lg p-4 text-center shadow-lg">
            <p className="text-sm font-bold text-white">8+ days</p>
            <p className="text-xs text-green-100">Low Risk</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">
            How many days until your next period?
          </h2>

          {/* Number Input with +/- */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <button
              onClick={() => setDaysUntilPeriod(Math.max(0, daysUntilPeriod - 1))}
              className="w-12 h-12 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-2xl font-bold flex items-center justify-center transition"
            >
              −
            </button>
            
            <div className="text-center">
              <p className="text-6xl font-bold text-pink-600">{daysUntilPeriod}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Days Remaining</p>
            </div>
            
            <button
              onClick={() => setDaysUntilPeriod(Math.min(30, daysUntilPeriod + 1))}
              className="w-12 h-12 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-2xl font-bold flex items-center justify-center transition"
            >
              +
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-8">
            <div className="flex gap-2 items-center">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">0</div>
              <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getRiskLevel(daysUntilPeriod).progressColor} transition-all duration-300`}
                  style={{ width: `${getRiskLevel(daysUntilPeriod).progressPercent}%` }}
                ></div>
              </div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">30</div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>High Risk</span>
              <span>Medium Risk</span>
              <span>Low Risk</span>
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={() => setShowResult(true)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 text-lg"
          >
            🎯 Check Risk Level
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-semibold">💡 Tip:</span> This calculator helps you stay prepared based on when your next period is expected. Track your cycle for better accuracy!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenstrualRiskCalculator;
