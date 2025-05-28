import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Moon, Sun, Clock, Image as ImageIcon, Film, ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/ui/Button';
import CloseIcon from '../components/icons/CloseIcon';
import FilmRollIcon from '../components/icons/FilmRollIcon'; 

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const [tempSettings, setTempSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (field: keyof typeof tempSettings, value: any) => {
    setTempSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    // Apply settings immediately
    updateSettings(tempSettings);
    // Short delay just for UI feedback
    setTimeout(() => {
      setIsSaving(false);
      navigate('/');
    }, 300);
  };
  
  const handleReset = () => {
    setTempSettings(settings);
  };

  // Prevent navigation while saving
  useEffect(() => {
    if (isSaving) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isSaving]);
  
  return (
    // Wrapper for centering the phone app
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
      {/* Phone app container with fixed dimensions */}
      <div className="w-[1080px] h-[1920px] bg-black text-white relative overflow-hidden">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-4 py-2 text-sm">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path fill="currentColor" d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21" />
                <path fill="currentColor" d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3" />
                <path fill="currentColor" d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9" />
              </svg>
            </div>
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path fill="currentColor" d="M17,2V5H14V7H17V10H19V7H22V5H19V2M3,7H13V9H3V7M3,11H13V13H3V11M3,15H13V17H3V15Z" />
              </svg>
            </div>
            <div className="w-6 h-3 bg-white rounded-sm" />
          </div>
        </div>

        {/* Back Button and Title */}
        <div className="flex items-center justify-between px-4 py-2">
          <button 
            onClick={() => navigate('/')}
            className="text-white p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content with Side Numbers */}
        <div className="relative flex h-[calc(1920px-120px)]">
          {/* Left Film Strip Markers */}
          <div className="absolute left-4 top-0 w-24 text-yellow-500 text-base flex flex-col justify-between h-[calc(100%-120px)] pt-[200px] pb-32 pl-5">
            <div className="-rotate-90 transform origin-left translate-y-4">23 ▶</div>
            <div className="-rotate-90 transform origin-left translate-y-4">▶</div>
            <div className="-rotate-90 transform origin-left translate-y-4">II ▶</div>
            <div className="-rotate-90 transform origin-left translate-y-4">▶ 005</div>
          </div>

          {/* Center Content */}
          <div className="flex-1 px-6 mx-24">
            <h1 
              className="text-6xl text-center mb-12" 
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              Settings
            </h1>

            <div className="space-y-8 overflow-y-auto h-[calc(1920px-400px)] pr-4">
              {/* Frame Extraction Settings */}
              <section className="bg-white/10 rounded-xl p-8">
                <h2 className="text-2xl mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-yellow-500" />
                  Frame Extraction
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-lg mb-4">
                      Frame Interval
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="200"
                        max="10000"
                        step="100"
                        value={tempSettings.interval}
                        onChange={(e) => handleChange('interval', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg min-w-[5rem] text-right">
                        {tempSettings.interval >= 1000 
                          ? `${(tempSettings.interval / 1000).toFixed(1)}s` 
                          : `${tempSettings.interval}ms`}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-lg mb-4">
                      Image Resolution
                    </label>
                    <div className="flex gap-4">
                      {(['low', 'medium', 'high'] as const).map((res) => (
                        <button
                          key={res}
                          onClick={() => handleChange('resolution', res)}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-colors ${
                            tempSettings.resolution === res
                              ? 'border-yellow-500 bg-yellow-500/20'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          {res.charAt(0).toUpperCase() + res.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-lg mb-4">
                      GIF Frame Rate
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="5"
                        value={tempSettings.gifFrameRate}
                        onChange={(e) => handleChange('gifFrameRate', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg min-w-[5rem] text-right">
                        {tempSettings.gifFrameRate} fps
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Storage Policy */}
              <section className="bg-white/10 rounded-xl p-8">
                <h2 className="text-2xl mb-6 flex items-center">
                  <ImageIcon className="w-6 h-6 mr-3 text-yellow-500" />
                  Storage Policy
                </h2>
                
                <div className="bg-white/5 rounded-xl p-6">
                  <p className="text-lg mb-2">
                    All projects are automatically deleted after 30 days to keep our service free.
                  </p>
                  <p className="text-gray-400">
                    Download your images before they expire to keep them permanently.
                  </p>
                </div>
              </section>
              
              {/* Theme Settings */}
              <section className="bg-white/10 rounded-xl p-8">
                <h2 className="text-2xl mb-6 flex items-center">
                  <Sun className="w-6 h-6 mr-3 text-yellow-500" />
                  Appearance
                </h2>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => handleChange('theme', 'light')}
                    className={`flex-1 py-4 rounded-xl border-2 transition-colors ${
                      tempSettings.theme === 'light'
                        ? 'border-yellow-500 bg-yellow-500/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Sun className="w-6 h-6" />
                      <span>Light</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleChange('theme', 'dark')}
                    className={`flex-1 py-4 rounded-xl border-2 transition-colors ${
                      tempSettings.theme === 'dark'
                        ? 'border-yellow-500 bg-yellow-500/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Moon className="w-6 h-6" />
                      <span>Dark</span>
                    </div>
                  </button>
                </div>
              </section>

              {/* Save and Reset Buttons */}
              <div className="flex justify-center gap-4 mt-8 mb-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-yellow-500 text-black py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 border-2 border-white/20 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:border-white/40 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="absolute right-4 top-0 w-24 text-yellow-500 text-base font-medium tracking-wide flex flex-col justify-between h-[calc(100%-120px)] pt-[200px] pb-32 pr-5">
            <div className="rotate-90 transform origin-right -translate-y-4">PHOTO</div>
            <div className="rotate-90 transform origin-right -translate-y-4">CAMERA</div>
            <div className="rotate-90 transform origin-right -translate-y-4">PF90/12.220</div>
            <div className="rotate-90 transform origin-right -translate-y-4">1996</div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full bg-black border-t border-white/10">
          <div className="max-w-2xl mx-auto grid grid-cols-3 py-8">
            <button 
              onClick={() => navigate('/gallery')} 
              className="flex justify-center"
            >
              <FilmRollIcon className="w-12 h-12 text-white" />
            </button>
            <button 
              onClick={() => navigate('/capture')} 
              className="flex justify-center"
            >
              <CloseIcon className="w-12 h-12 text-white" />
            </button>
            <button 
              onClick={() => navigate('/settings')} 
              className="flex justify-center"
            >
              <Settings className="w-12 h-12 text-yellow-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;