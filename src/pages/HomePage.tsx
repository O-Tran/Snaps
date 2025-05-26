import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import SwipeableFilmStrip from '../components/home/SwipeableFilmStrip';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, deleteProject } = useProjects();

  return (
    // Wrapper for centering the phone app
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
      {/* Phone app container with fixed dimensions */}
      <div className="w-[1080px] h-[1920px] bg-gradient-to-br from-pink-200 via-pink-100 to-[#f8e4dd] text-black relative overflow-hidden">
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
            <div className="w-6 h-3 bg-black rounded-sm" />
          </div>
        </div>

        {/* Logo and Film Strip Markers in Black Bar */}
        <div className="bg-black">
          {/* Top Film Strip Markers */}
          <div className="flex justify-between px-6 py-3 text-yellow-500 text-sm font-medium tracking-wide">
            <span>65</span>
            <span>PHOTO</span>
            <span>1996</span>
            <span>CAMERA</span>
            <span>PF90/12.220</span>
          </div>

          <h1 
            className="text-6xl text-center text-white py-8" 
            style={{ fontFamily: 'Dancing Script, cursive' }}
          >
            Looking Cute!
          </h1>
          
          {/* Bottom Film Strip Markers */}
          <div className="flex justify-between px-6 py-3 text-yellow-500 text-sm font-medium tracking-wide">
            <span>23 ▶</span>
            <span>▶</span>
            <span>II ▶</span>
            <span>▶ 005</span>
          </div>
        </div>

        {/* Film Strip */}
        <div className="px-6 pt-6 overflow-y-auto h-[calc(1920px-280px)]">
          <div className="space-y-8">
            {projects.map((project) => (
              <SwipeableFilmStrip
                key={project.id}
                project={project}
                onDelete={deleteProject}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full bg-black border-t border-white/10">
          <div className="max-w-2xl mx-auto grid grid-cols-3 py-8">
            <button 
              onClick={() => navigate('/gallery')} 
              className="flex justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-white">
                <path fill="currentColor" d="M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M7,18H9L14,10L19,18H7Z" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/capture')} 
              className="flex justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-white">
                <path fill="currentColor" d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M7,13H17V11H7" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/settings')} 
              className="flex justify-center"
            >
              <Settings className="w-12 h-12 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;