import React, { useEffect, useState } from 'react';
import { calculatePreparednessScore, getPreparednessStatus } from '../../utils/calculations';
import { useAuth } from '../../context/AuthContext';
import { getDocs } from 'firebase/firestore';
import { locationsRef, healthLogsRef } from '../../firebase/db';

const PreparednessScore = () => {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const locations = await getDocs(locationsRef);
      const logs = await getDocs(healthLogsRef);
      const userData = {
        hasStock: user.hasStock,
        stockCount: user.stockCount,
        nearestLocationDistance: user.nearestLocationDistance,
        tracksCycle: user.tracksCycle,
        hasEmergencyContacts: user.hasEmergencyContacts
      };
      const pts = calculatePreparednessScore(
        userData,
        locations.docs.map(d => d.data()),
        logs.docs.map(d => d.data())
      );
      setScore(pts);
      setStatus(getPreparednessStatus(pts));
    };
    fetch();
  }, [user]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Preparedness Score
      </h3>
      <div className="text-center">
        <span className="text-4xl font-bold" style={{color: status.color}}>{score}</span>
        <p className="mt-2" style={{color: status.color}}>{status.status}</p>
      </div>
    </div>
  );
};

export default PreparednessScore;