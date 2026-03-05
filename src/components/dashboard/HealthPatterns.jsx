import React, { useState, useEffect } from 'react';
import { detectHealthPatterns } from '../../utils/calculations';
import { addHealthLog, healthLogsRef } from '../../firebase/db';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';

const HealthPatterns = () => {
  const { user } = useAuth();
  const [warnings, setWarnings] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [symptom, setSymptom] = useState({
    type: '',
    severity: 'medium',
    notes: ''
  });

  useEffect(() => {
    const fetchHealthLogs = async () => {
      if (!user) return;
      
      const q = query(healthLogsRef, where('user_id', '==', user.uid));
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => doc.data());
      
      const detectedWarnings = detectHealthPatterns(logs);
      setWarnings(detectedWarnings);
    };
    
    fetchHealthLogs();
  }, [user]);

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    
    await addHealthLog({
      user_id: user.uid,
      symptom_type: symptom.type,
      severity_level: symptom.severity,
      notes: symptom.notes,
      date: new Date()
    });
    
    setShowLogForm(false);
    setSymptom({ type: '', severity: 'medium', notes: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Health Pattern Monitoring
        </h3>
        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          + Log Symptom
        </button>
      </div>
      
      {showLogForm && (
        <form onSubmit={handleLogSubmit} className="mb-6 p-4 bg-pink-50 dark:bg-gray-700 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Symptom Type
            </label>
            <select
              value={symptom.type}
              onChange={(e) => setSymptom({...symptom, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800"
              required
            >
              <option value="">Select symptom</option>
              <option value="heavy_bleeding">Heavy Bleeding</option>
              <option value="severe_cramps">Severe Cramps</option>
              <option value="irregular_cycle">Irregular Cycle</option>
              <option value="unusual_symptoms">Unusual Symptoms</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={symptom.severity}
              onChange={(e) => setSymptom({...symptom, severity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={symptom.notes}
              onChange={(e) => setSymptom({...symptom, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800"
              rows="3"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Save Log
            </button>
            <button
              type="button"
              onClick={() => setShowLogForm(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {warnings.length > 0 ? (
        <div className="space-y-3">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                warning.severity === 'high' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">
                  {warning.severity === 'high' ? '🔴' : '🟡'}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {warning.message}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {warning.suggestion}
                  </p>
                  <button className="text-sm text-pink-600 dark:text-pink-400 hover:underline">
                    Find nearby PHC →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <span className="text-4xl mb-2 block">📊</span>
          <p>No health pattern warnings detected</p>
          <p className="text-sm mt-2">Continue logging symptoms for personalized insights</p>
        </div>
      )}
    </div>
  );
};

export default HealthPatterns;