import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Loader2, ArrowLeft, Settings } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useSettings } from '../context/SettingsContext';
import CameraCapture from '../components/capture/CameraCapture';
import VideoUpload from '../components/capture/VideoUpload';
import Button from '../components/ui/Button';
import CloseIcon from '../components/icons/CloseIcon';
import FilmRollIcon from '../components/icons/FilmRollIcon';

type CaptureMode = 'camera' | 'upload' | null;

const CapturePage: React.FC = () => {
  const [mode, setMode] = useState<CaptureMode>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  
  const { settings } = useSettings();
  const { addProject } = useProjects();
  const navigate = useNavigate();
  
  const handleVideoRecorded = async (videoBlob: Blob) => {
    if (!projectTitle.trim()) {
      setProjectTitle(`Project ${new Date().toLocaleDateString()}`);
    }
    
    setIsProcessing(true);
    try {
      const videoFile = new File([videoBlob], 'recorded-video.webm', { 
        type: 'video/webm' 
      });
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
    }
  };
  
  const handleVideoUploaded = async (file: File) => {
    if (!projectTitle.trim()) {
      setProjectTitle(file.name.split('.')[0]);
    }
    
    setIsProcessing(true);
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
              Create New Memory
            </h1>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <h2 className="text-2xl mb-2">Processing Your Video</h2>
                <p className="text-gray-400 text-center max-w-md">
                  We're extracting images from your video. This may take a moment.
                </p>
              </div>
            ) : !mode ? (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-lg">
                    Project Title (optional)
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter a title for your project"
                    className="w-full px-6 py-4 bg-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => setMode('camera')}
                    className="bg-white/10 rounded-xl p-8 hover:bg-white/20 transition-colors group"
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="w-16 h-16 mb-4 text-yellow-500" />
                      <h2 className="text-2xl mb-2">Record Video</h2>
                      <p className="text-gray-400 text-center">
                        Use your camera to record a new video
                      </p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setMode('upload')}
                    className="bg-white/10 rounded-xl p-8 hover:bg-white/20 transition-colors group"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="w-16 h-16 mb-4 text-yellow-500" />
                      <h2 className="text-2xl mb-2">Upload Video</h2>
                      <p className="text-gray-400 text-center">
                        Upload an existing video from your device
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl">
                    {mode === 'camera' ? 'Record Video' : 'Upload Video'}
                  </h2>
                  <button 
                    onClick={() => setMode(null)}
                    className="text-yellow-500 hover:text-yellow-400"
                  >
                    Back
                  </button>
                </div>
                
                {mode === 'camera' ? (
                  <CameraCapture onVideoRecorded={handleVideoRecorded} />
                ) : (
                  <VideoUpload onVideoUploaded={handleVideoUploaded} />
                )}
              </div>
            )}
          </div>

          {/* Right Text */}
          <div className="absolute right-4 top-0 w-24 text-yellow-500 text-base flex flex-col justify-between h-[calc(100%-120px)] pt-[200px] pb-32 pr-5">
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
              <Settings className="w-12 h-12 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapturePage;