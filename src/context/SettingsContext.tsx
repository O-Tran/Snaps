import React, { createContext, useState, useEffect, useContext } from 'react';
import { Settings } from '../types';

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
  interval: 200, // Extract 1 frame every 200ms (minimum interval)
  resolution: 'medium',
  gifFrameRate: 10,
  theme: 'light',
  language: 'en',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('videoToImagesSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Debounced localStorage update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('videoToImagesSettings', JSON.stringify(settings));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [settings]);

  // Separate effect for theme to prevent blocking
  useEffect(() => {
    requestAnimationFrame(() => {
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};