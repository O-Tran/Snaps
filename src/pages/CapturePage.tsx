import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useSettings } from '../context/SettingsContext';
import CameraCapture from '../components/capture/CameraCapture';
import VideoUpload from '../components/capture/VideoUpload';
import FilmRollIcon from '../components/icons/FilmRollIcon';

type CaptureMode = 'Portrait' | 'Photo' | 'Video';

const CapturePage: React.FC = () => {
  const [mode, setMode] = useState<CaptureMode>('Video');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [progress, setProgress] = useState(0);
  
  const { settings } = useSettings();
  const { addProject } = useProjects();
  const navigate = useNavigate();
  
  const handleVideoRecorded = async (videoBlob: Blob) => {
    if (!projectTitle.trim()) {
      setProjectTitle(`Project ${new Date().toLocaleDateString()}`);
    }
    
    setIsProcessing(true);
    setProgress(0);
    try {
      const videoUrl = URL.createObjectURL(videoBlob);
      const project = await addProject(
        projectTitle.trim() || `Project ${new Date().toLocaleDateString()}`,
        videoUrl,
        {
          interval: settings.interval,
          resolution: settings.resolution
        }
      );
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Error processing video:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };
  
  const handleVideoUploaded = async (file: File) => {
    if (!projectTitle.trim()) {
      setProjectTitle(file.name.split('.')[0]);
    }
    
    setIsProcessing(true);
    setProgress(0);
    try {
      const videoUrl = URL.createObjectURL(file);
      const project = await addProject(
        projectTitle.trim() || file.name.split('.')[0],
        videoUrl,
        {
          interval: settings.interval,
          resolution: settings.resolution
        }
      );
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Error processing video:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

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

        {/* Main Camera View */}
        <div className="relative h-[calc(100%-200px)]">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <h2 className="text-2xl mb-2">Processing Your Video</h2>
              <div className="w-64 bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-gray-400 text-center max-w-md">
                {Math.round(progress)}% complete. Extracting images from your video...
              </p>
            </div>
          ) : showUpload ? (
            <div className="h-full p-8">
              <div className="bg-white/10 rounded-xl p-8 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl">Upload Video</h2>
                  <button 
                    onClick={() => setShowUpload(false)}
                    className="text-yellow-500 hover:text-yellow-400"
                  >
                    Back to Camera
                  </button>
                </div>
                <VideoUpload onVideoUploaded={handleVideoUploaded} />
              </div>
            </div>
          ) : (
            <div className="h-full">
              <CameraCapture onVideoRecorded={handleVideoRecorded} />
              {/* Camera Frame Corners */}
              <div className="absolute top-4 left-4 w-24 h-24 border-l-4 border-t-4 border-white/50"></div>
              <div className="absolute top-4 right-4 w-24 h-24 border-r-4 border-t-4 border-white/50"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 border-l-4 border-b-4 border-white/50"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 border-r-4 border-b-4 border-white/50"></div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 w-full">
          {/* Mode Selector */}
          <div className="flex justify-center gap-8 mb-8">
            {(['Video', 'Photo', 'Portrait'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-lg font-medium ${mode === m ? 'text-yellow-500' : 'text-white/70'}`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="bg-black border-t border-white/10 py-8">
            <div className="max-w-2xl mx-auto flex items-center justify-between px-12">
              {/* Left: Gallery Access */}
              <button 
                onClick={() => navigate('/gallery')} 
                className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20"
              >
                <FilmRollIcon className="w-full h-full p-3 text-white" />
              </button>

              {/* Center: Capture Button */}
              <button 
                className="w-24 h-24 rounded-full border-8 border-white/70 flex items-center justify-center"
                onClick={() => {
                  // Handle capture based on mode
                }}
              >
                <div className="w-full h-full rounded-full bg-white/20"></div>
              </button>

              {/* Right: Camera Switch */}
              <button 
                onClick={() => setShowUpload(!showUpload)}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10"
              >
                {showUpload ? (
                  <Camera className="w-8 h-8 text-white" />
                ) : (
                  <Upload className="w-8 h-8 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapturePage;