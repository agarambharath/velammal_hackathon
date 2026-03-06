import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'pinkroute_profile';

const defaultProfile = {
  city: '',
  area: '',
  campus: '',
  lastPeriodDate: '',
  cycleLength: '28',
  symptoms: [],
  contactName: '',
  contactPhone: '',
  anonymousHelp: false,
  hideIdentity: false,
  periodReminder: true,
  padAlerts: true,
  emergencyAlerts: true,
};

const SYMPTOM_OPTIONS = ['Cramps', 'Heavy Flow', 'Mood Swings', 'Headache', 'Back Pain'];

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [nextPeriodDays, setNextPeriodDays] = useState(null);
  const [riskLevel, setRiskLevel] = useState('Low');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile((p) => ({ ...defaultProfile, ...parsed }));
        setIsEditing(false);
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (profile.lastPeriodDate && profile.cycleLength) {
      const last = new Date(profile.lastPeriodDate);
      const cycle = parseInt(profile.cycleLength, 10) || 28;
      const next = new Date(last);
      next.setDate(next.getDate() + cycle);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      next.setHours(0, 0, 0, 0);
      const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
      setNextPeriodDays(diff);
      if (diff <= 3) setRiskLevel('High');
      else if (diff <= 7) setRiskLevel('Medium');
      else setRiskLevel('Low');
    }
  }, [profile.lastPeriodDate, profile.cycleLength]);

  const handleChange = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const toggleSymptom = (symptom) => {
    setProfile((p) => ({
      ...p,
      symptoms: p.symptoms.includes(symptom)
        ? p.symptoms.filter((s) => s !== symptom)
        : [...p.symptoms, symptom],
    }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setIsEditing(false);
    setSaveMessage('Profile updated successfully.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const locationDisplay = [profile.city, profile.campus].filter(Boolean).join(' / ') || '—';

  const Card = ({ icon, title, children, className = '' }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700 dark:text-gray-300 text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white text-4xl mb-4 shadow-lg">
          👤
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          User Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your personal information and preferences.
        </p>
        <div className="mt-3">
          <p className="font-semibold text-gray-800 dark:text-white">{displayName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{locationDisplay}</p>
        </div>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-center font-medium">
          {saveMessage}
        </div>
      )}

      {/* Status Card */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Your Preparedness Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm opacity-90">Next Period</p>
            <p className="text-2xl font-bold">{nextPeriodDays != null ? `${nextPeriodDays} days` : '—'}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Risk Level</p>
            <p className="text-2xl font-bold">{riskLevel}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Nearby Pad Locations</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1 – Location Details */}
        <Card icon="📍" title="Location Details">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => handleChange('city', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. Visakhapatnam"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Area / Locality</label>
              <input
                type="text"
                value={profile.area}
                onChange={(e) => handleChange('area', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. Pedagadi"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Campus / School</label>
              <input
                type="text"
                value={profile.campus}
                onChange={(e) => handleChange('campus', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. MVGR College"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              />
            </div>
          </div>
        </Card>

        {/* Card 2 – Cycle Information */}
        <Card icon="📅" title="Cycle Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Last Period Date</label>
              <input
                type="date"
                value={profile.lastPeriodDate}
                onChange={(e) => handleChange('lastPeriodDate', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cycle Length (days)</label>
              <input
                type="number"
                min="21"
                max="45"
                value={profile.cycleLength}
                onChange={(e) => handleChange('cycleLength', e.target.value)}
                disabled={!isEditing}
                placeholder="28"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Used to predict your next period and risk level.
          </p>
        </Card>

        {/* Card 3 – Health Symptoms */}
        <Card icon="🩺" title="Health Symptoms" className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => isEditing && toggleSymptom(symptom)}
                disabled={!isEditing}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  profile.symptoms.includes(symptom)
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </Card>

        {/* Card 4 – Emergency Contact */}
        <Card icon="🚨" title="Emergency Contact">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Trusted Contact Name</label>
              <input
                type="text"
                value={profile.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. Mom"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profile.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            This contact may receive alerts during emergencies.
          </p>
        </Card>

        {/* Card 5 – Privacy Settings */}
        <Card icon="🔒" title="Privacy Settings">
          <div className="space-y-2">
            <Toggle
              checked={profile.anonymousHelp}
              onChange={(v) => handleChange('anonymousHelp', v)}
              label="Enable Anonymous Help Requests"
            />
            <Toggle
              checked={profile.hideIdentity}
              onChange={(v) => handleChange('hideIdentity', v)}
              label="Hide identity when requesting help"
            />
          </div>
        </Card>

        {/* Card 6 – Notification Preferences */}
        <Card icon="🔔" title="Notification Preferences">
          <div className="space-y-2">
            <Toggle
              checked={profile.periodReminder}
              onChange={(v) => handleChange('periodReminder', v)}
              label="Period Reminder"
            />
            <Toggle
              checked={profile.padAlerts}
              onChange={(v) => handleChange('padAlerts', v)}
              label="Nearby Pad Availability Alerts"
            />
            <Toggle
              checked={profile.emergencyAlerts}
              onChange={(v) => handleChange('emergencyAlerts', v)}
              label="Emergency Alerts"
            />
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full sm:w-auto min-w-[200px] px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Save Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto min-w-[200px] px-8 py-4 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
