import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <nav className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          🩸 PinkRoute
        </Link>
        <div className="flex space-x-6 items-center">
          <Link to="/locator" className="text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition">
            Locator
          </Link>
          <Link to="/emergency" className="text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition">
            Emergency
          </Link>
          <Link to="/emergency-mode" className="text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition font-semibold">
            🚨 Mode
          </Link>
          <Link to="/school" className="text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition">
            School
          </Link>
          <Link to="/risk-calculator" className="text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition">
            Risk Check
          </Link>
          <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition">
            Profile
          </Link>
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;