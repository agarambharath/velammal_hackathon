import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

const CycleTracker = () => {
  const { user } = useAuth();
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLengthDays, setCycleLengthDays] = useState(28);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch existing cycle data
  useEffect(() => {
    const fetchCycleData = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'cycle_data'),
          where('user_id', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setLastPeriodDate(data.last_period_date || '');
          setCycleLengthDays(data.cycle_length_days || 28);
        }
      } catch (err) {
        console.error('Error fetching cycle data:', err);
      }
    };

    fetchCycleData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!lastPeriodDate) {
      setError('Please enter the last period start date');
      return;
    }

    if (cycleLengthDays < 21 || cycleLengthDays > 35) {
      setError('Cycle length should typically be between 21-35 days');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const dateObj = new Date(lastPeriodDate);
      
      // Calculate next period date
      const nextPeriodDate = new Date(dateObj);
      nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLengthDays);

      // Calculate safe window (5 days before, 3-4 days after)
      const safeWindowStart = new Date(nextPeriodDate);
      safeWindowStart.setDate(safeWindowStart.getDate() - 5);
      
      const safeWindowEnd = new Date(nextPeriodDate);
      safeWindowEnd.setDate(safeWindowEnd.getDate() + 4);

      await setDoc(doc(db, 'cycle_data', user.uid), {
        user_id: user.uid,
        last_period_date: lastPeriodDate,
        cycle_length_days: parseInt(cycleLengthDays),
        next_period_date: nextPeriodDate.toISOString().split('T')[0],
        safe_window_start: safeWindowStart.toISOString().split('T')[0],
        safe_window_end: safeWindowEnd.toISOString().split('T')[0],
        updated_at: new Date()
      },{ merge: true });

      setSuccessMessage('Cycle data saved successfully! ✓');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving cycle data:', err);
      setError('Failed to save cycle data. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">📅</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Track Your Cycle
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get predictions for your next period
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Last Period Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Period Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              placeholder="dd-mm-yyyy"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-gray-800"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => {
                const input = document.querySelector('input[type="date"]');
                input?.click();
              }}
            >
              📅
            </button>
          </div>
        </div>

        {/* Average Cycle Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Average Cycle Length (days)
          </label>
          <input
            type="number"
            value={cycleLengthDays}
            onChange={(e) => setCycleLengthDays(e.target.value)}
            min="21"
            max="35"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-gray-800"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Typically between 21-35 days
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              📋 Calculate & Save
            </>
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-pink-200 dark:border-pink-800">
        <p className="font-semibold mb-2">How it works:</p>
        <ul className="space-y-1 text-xs">
          <li>✓ Predicts your next period date</li>
          <li>✓ Calculates safe window for planning</li>
          <li>✓ Updates risk assessments automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default CycleTracker;
