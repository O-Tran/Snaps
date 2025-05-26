import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Home, Settings, Sun, Moon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Header: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">FrameCapture</h1>
        </div>
        
        <nav className="flex items-center">
          <NavLink 
            to="/"
            className={({ isActive }) => 
              `px-4 py-2 rounded-md flex items-center space-x-1 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>
          
          <NavLink 
            to="/capture"
            className={({ isActive }) => 
              `px-4 py-2 rounded-md flex items-center space-x-1 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <Camera className="w-5 h-5" />
            <span className="hidden sm:inline">Capture</span>
          </NavLink>
          
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `px-4 py-2 rounded-md flex items-center space-x-1 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Settings</span>
          </NavLink>
          
          <button 
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {settings.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;