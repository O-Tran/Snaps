import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Calendar, Film, Image as ImageIcon, Loader2, Settings } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import ImageGrid from '../components/project/ImageGrid';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/date';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getProjectById, 
    deleteImage, 
    selectedImages, 
    toggleImageSelection, 
    clearSelectedImages,
    deleteProject
  } = useProjects();
  
  const [project, setProject] = useState(id ? getProjectById(id) : undefined);
  const [isExportingGif, setIsExportingGif] = useState(false);
  
  useEffect(() => {
    if (id) {
      const projectData = getProjectById(id);
      setProject(projectData);
      
      if (!projectData) {
        navigate('/');
      }
    }
    
    // Clear selected images when leaving the page
    return () => clearSelectedImages();
  }, [id, getProjectById, navigate, clearSelectedImages]);
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const handleDeleteImage = (imageId: string) => {
    deleteImage(project.id, imageId);
  };
  
  const handleExportGif = () => {
    setIsExportingGif(true);
    setTimeout(() => {
      alert('GIF exported successfully! In a real application, this would download a GIF created from your selected images.');
      setIsExportingGif(false);
      clearSelectedImages();
    }, 2000);
  };
  
  const downloadAllImages = () => {
    alert('In a real application, this would download all images as a zip file.');
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
            className="text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this project?')) {
                deleteProject(project.id);
                navigate('/');
              }
            }}
            className="text-red-500 hover:text-red-400 transition-colors"
            aria-label="Delete project"
          >
            <Trash2 className="w-6 h-6" />
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
            {/* Title */}
            <h1 
              className="text-6xl text-center mb-12" 
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              Find your best shot
            </h1>

            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-6 pb-32">
              {project.images.map((image, index) => (
                <div 
                  key={image.id} 
                  className="aspect-square bg-[#F8E4DD] rounded-2xl overflow-hidden cursor-pointer shadow-lg min-h-[88px] relative group"
                  onClick={() => toggleImageSelection(image.id)}
                >
                  <img
                    src={image.url}
                    alt={`Shot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this image?')) {
                          handleDeleteImage(image.id);
                        }
                      }}
                    >
                      <Trash2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              ))}
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

export default ProjectPage;