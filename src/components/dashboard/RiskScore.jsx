import React, { useEffect, useState } from 'react';
import { calculateRiskScore, getRiskLevel } from '../../utils/aiLogic';
import { useAuth } from '../../context/AuthContext';
import { getDocs } from 'firebase/firestore';
import { locationsRef, emergencyLogsRef } from '../../firebase/db';

const RiskScore = () => {
  const { user } = useAuth();
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState({});
  const [factors, setFactors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const locations = await getDocs(locationsRef);
      const emergencies = await getDocs(emergencyLogsRef);
      
      const userData = {
        nextPeriodDate: user.nextPeriodDate,
        location: user.location,
        areaType: user.areaType || 'urban'
      };
      
      const score = calculateRiskScore(
        userData,
        locations.docs.map(doc => doc.data()),
        emergencies.docs.map(doc => doc.data())
      );
      
      setRiskScore(score);
      setRiskLevel(getRiskLevel(score));
      
      // Calculate contributing factors
      const newFactors = [];
      if (score > 70) newFactors.push({ factor: 'Very high risk - immediate action needed', icon: '🔴' });
      else if (score > 50) newFactors.push({ factor: 'Stock up soon', icon: '🟡' });
      else newFactors.push({ factor: 'Low risk - you\'re prepared', icon: '🟢' });
      
      setFactors(newFactors);
    };
    
    fetchData();
  }, [user]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Menstrual Risk Index
      </h3>
      
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={riskLevel.color === 'red' ? '#EF4444' : riskLevel.color === 'yellow' ? '#F59E0B' : '#10B981'}
              strokeWidth="3"
              strokeDasharray={`${riskScore}, 100`}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-3xl font-bold text-gray-800 dark:text-white">{riskScore}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl mb-2">{riskLevel.icon}</div>
          <div className={`text-lg font-semibold text-${riskLevel.color}-600`}>
            {riskLevel.level}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {factors.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <span>{item.icon}</span>
            <span>{item.factor}</span>
          </div>
        ))}
      </div>
      
      {riskScore >= 70 && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            ⚠ High Risk – Stock up soon. Visit the locator to find nearby stores.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskScore;