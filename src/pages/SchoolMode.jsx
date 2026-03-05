import React, { useState } from 'react';

const SchoolMode = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [padStations, setPadStations] = useState([
    { id: 1, name: 'Block A Restroom', pads: 6, status: 'Available' },
    { id: 2, name: 'Library Restroom', pads: 2, status: 'Low Stock' },
    { id: 3, name: 'Girls Hostel', pads: 0, status: 'Out of Stock' },
  ]);
  const [padLocations, setPadLocations] = useState([
    { id: 1, name: 'Nurse Office', distance: 0.2, status: 'Available' },
    { id: 2, name: 'Block B Washroom', distance: 0.5, status: 'Limited' },
    { id: 3, name: 'Hostel Office', distance: 0.8, status: 'Available' },
  ]);
  const [nurseRequest, setNurseRequest] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [nurseSubmitted, setNurseSubmitted] = useState(false);
  const [buddyRequest, setBuddyRequest] = useState(null);
  const [buddySubmitted, setBuddySubmitted] = useState(false);
  const [reportAlert, setReportAlert] = useState('');

  const cards = [
    {
      id: 'pads',
      icon: '📦',
      title: 'Pad Stations',
      description: 'Check sanitary pad availability across campus.',
      bgColor: 'from-pink-100 to-pink-50 dark:from-pink-900/20 dark:to-pink-900/10',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    {
      id: 'nurse',
      icon: '🧑‍⚕️',
      title: 'Nurse Help',
      description: 'Request assistance from the school nurse.',
      bgColor: 'from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'locator',
      icon: '📍',
      title: 'Campus Pad Locator',
      description: 'Find the nearest pad location inside campus.',
      bgColor: 'from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/10',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      id: 'buddy',
      icon: '👭',
      title: 'Campus Buddy',
      description: 'Request a volunteer to accompany you safely.',
      bgColor: 'from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-900/10',
      borderColor: 'border-rose-200 dark:border-rose-800'
    }
  ];

  // Handle pad station reporting
  const handleReportEmpty = (stationId) => {
    setReportAlert('Alert sent to campus nurse.');
    setTimeout(() => setReportAlert(''), 3000);
  };

  // Handle nurse request submission
  const handleNurseSubmit = () => {
    setNurseSubmitted(true);
    setTimeout(() => {
      setNurseRequest({
        message: 'Nurse has been notified.',
        location: 'Please visit the Health Room.'
      });
    }, 1500);
  };

  // Handle buddy request
  const handleBuddyRequest = () => {
    setBuddySubmitted(true);
    setTimeout(() => {
      setBuddyRequest({
        volunteerId: '#' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
        eta: Math.floor(Math.random() * 10) + 3
      });
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' };
      case 'Low Stock':
      case 'Limited':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' };
      case 'Out of Stock':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', dot: 'bg-gray-500' };
    }
  };

  // Main card view
  if (!selectedCard) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🎓 School Mode
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Campus menstrual support & health assistance
          </p>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className="w-full text-left transition transform hover:scale-105"
            >
              <div className={`bg-gradient-to-br ${card.bgColor} border-2 ${card.borderColor} rounded-xl p-6 shadow-lg hover:shadow-xl`}>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{card.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {card.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {card.description}
                    </p>
                  </div>
                  <div className="text-2xl text-gray-400">→</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
          <p className="text-lg font-semibold">💪 Empowering Women's Health and Safety</p>
        </div>
      </div>
    );
  }

  // PAD STATIONS VIEW
  if (selectedCard === 'pads') {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => { setSelectedCard(null); setReportAlert(''); }}
          className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 font-semibold"
        >
          ← Back
        </button>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">📦 Campus Pad Stations</h2>
        </div>

        {reportAlert && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 p-4 rounded-lg">
            {reportAlert}
          </div>
        )}

        {/* Stations List */}
        <div className="space-y-3">
          {padStations.map((station) => {
            const colors = getStatusColor(station.status);
            return (
              <div key={station.id} className={`${colors.bg} border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${colors.dot}`}></div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">📍 {station.name}</h3>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${colors.text}`}>
                    {station.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 dark:text-gray-300">
                    {station.pads > 0 ? `${station.pads} pads left` : 'Out of Stock'}
                  </p>
                  {station.pads === 0 && (
                    <button
                      onClick={() => handleReportEmpty(station.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg transition"
                    >
                      ⚠ Report Empty Machine
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
          <p className="text-lg font-semibold">💪 Empowering Women's Health and Safety</p>
        </div>
      </div>
    );
  }

  // NURSE HELP VIEW
  if (selectedCard === 'nurse') {
    const reasons = ['Severe cramps', 'Pad required', 'Feeling dizzy'];

    if (nurseSubmitted && !nurseRequest) {
      return (
        <div className="space-y-6">
          <button
            onClick={() => { setSelectedCard(null); setNurseRequest(null); setNurseSubmitted(false); setSelectedReason(''); }}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold"
          >
            ← Back
          </button>

          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 animate-pulse">
                <svg className="w-8 h-8 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">Connecting with nurse...</p>
            </div>
          </div>
        </div>
      );
    }

    if (nurseRequest) {
      return (
        <div className="space-y-6">
          <button
            onClick={() => { setSelectedCard(null); setNurseRequest(null); setNurseSubmitted(false); setSelectedReason(''); }}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold"
          >
            ← Back
          </button>

          <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-3">{nurseRequest.message}</h3>
            <p className="text-green-700 dark:text-green-300">{nurseRequest.location}</p>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
            <p className="text-lg font-semibold">💪 Empowering Women's Health and Safety</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <button
          onClick={() => { setSelectedCard(null); setSelectedReason(''); }}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🧑‍⚕️ Need Help?</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {reasons.map((reason, idx) => (
            <label
              key={idx}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition border-2 ${
                selectedReason === reason
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">○ {reason}</span>
            </label>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNurseSubmit}
          disabled={!selectedReason}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Request Nurse Help
        </button>

        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
          <p className="text-lg font-semibold">💪 Empowering Women's Health and Safety</p>
        </div>
      </div>
    );
  }

  // PAD LOCATOR VIEW
  if (selectedCard === 'locator') {
    const sortedLocations = [...padLocations].sort((a, b) => a.distance - b.distance);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedCard(null)}
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 font-semibold"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">📍 Campus Pad Locations</h2>
        </div>

        {/* Locations List */}
        <div className="space-y-3">
          {sortedLocations.map((location) => {
            const colors = getStatusColor(location.status);
            return (
              <div key={location.id} className={`${colors.bg} border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${colors.dot}`}></div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">📍 {location.name}</h3>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${colors.text}`}>
                    {location.status}
                  </span>
                </div>
                <p className="text-purple-600 dark:text-purple-400 font-semibold">
                  {location.distance} km away
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
          <p className="text-lg font-semibold">💪 Empowering Women's Health and Safety</p>
        </div>
      </div>
    );
  }

  // CAMPUS BUDDY VIEW
  if (selectedCard === 'buddy') {
    if (buddySubmitted && !buddyRequest) {
      return (
        <div className="space-y-6">
          <button
            onClick={() => { setSelectedCard(null); setBuddyRequest(null); setBuddySubmitted(false); }}
            className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold"
          >
            ← Back
          </button>

          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-4 animate-pulse">
                <svg className="w-8 h-8 text-rose-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">Finding a volunteer...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This usually takes 1-2 minutes</p>
            </div>
          </div>
        </div>
      );
    }

    if (buddyRequest) {
      return (
        <div className="space-y-6">
          <button
            onClick={() => { setSelectedCard(null); setBuddyRequest(null); setBuddySubmitted(false); }}
            className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold"
          >
            ← Back
          </button>

          <div className="bg-rose-100 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-700 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="text-xl font-bold text-rose-800 dark:text-rose-200 mb-4">Volunteer Assigned</h3>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 space-y-3 mb-4 text-left">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Student Volunteer ID:</span> {buddyRequest.volunteerId}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">ETA:</span> {buddyRequest.eta} minutes
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
            <p className="text-lg font-semibold">💪 Empowering Women's Health and Safety</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedCard(null)}
          className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">👭 Request Campus Buddy</h2>
          <p className="text-gray-600 dark:text-gray-400">A volunteer can accompany you if you feel uncomfortable going alone.</p>
        </div>

        <button
          onClick={handleBuddyRequest}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Request Buddy
        </button>

        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
          <p className="text-lg font-semibold">💪 Empowering Women's Health and Safety</p>
        </div>
      </div>
    );
  }
};

export default SchoolMode;