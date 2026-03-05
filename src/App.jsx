import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import EmergencyButton from './components/layout/EmergencyButton';
import HealthAssistant from './components/HealthAssistant';
import Home from './pages/Home';
import Locator from './pages/Locator';
import Emergency from './pages/Emergency';
import EmergencyMode from './pages/EmergencyMode';
import Profile from './pages/Profile';
import SchoolMode from './pages/SchoolMode';
import StealthMode from './pages/StealthMode';
import AdminDashboard from './components/admin/AdminDashboard';
import MenstrualRiskCalculator from './components/MenstrualRiskCalculator';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/locator" element={<Locator />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/emergency-mode" element={<EmergencyMode />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
            <Route path="/school" element={<SchoolMode />} />
            <Route path="/risk-calculator" element={<MenstrualRiskCalculator />} />
            <Route path="/stealth" element={<StealthMode />} />
            <Route path="/admin" element={user?.email === 'admin@pinkroute.com' ? <AdminDashboard /> : <Navigate to="/" />} />
          </Routes>
        </main>
        <EmergencyButton />
        <HealthAssistant />
      </div>
    </BrowserRouter>
  );
}

export default App;