import React from 'react';
import { useAuth } from '../context/AuthContext';
import CycleTracker from '../components/dashboard/CycleTracker';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Profile</h2>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">User ID:</span> {user?.uid?.substring(0, 12)}...
          </p>
        </div>
      </div>

      {/* Cycle Tracker */}
      <CycleTracker />
    </div>
  );
};

export default Profile;