import React, { createContext, useState, useEffect, useContext } from 'react';
import { Project, Image, VideoProcessingOptions } from '../types';

type DeletedImage = {
  projectId: string;
  image: Image;
  timestamp: number;
};

type ProjectUpdate = {
  title?: string;
  createdAt?: Date;
};

type ProjectContextType = {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (title: string, videoUrl: string, options: VideoProcessingOptions) => Promise<Project>;
  updateProject: (id: string, update: ProjectUpdate) => void;
  deleteProject: (id: string) => void;
  deleteImage: (projectId: string, imageId: string) => void;
  undoImageDeletion: () => void;
  addImagesToProject: (projectId: string, images: Image[]) => void;
  getProjectById: (id: string) => Project | undefined;
  selectedImages: string[];
  toggleImageSelection: (imageId: string) => void;
  clearSelectedImages: () => void;
  lastDeletedImage: DeletedImage | null;
};

const extractImagesFromVideo = async (
  videoUrl: string, 
  options: VideoProcessingOptions,
  projectId: string,
  onProgress?: (progress: number) => void
): Promise<Image[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    const images: Image[] = [];
    
    video.onloadedmetadata = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Use the actual video dimensions
      const width = video.videoWidth;
      const height = video.videoHeight;
      
      // Apply resolution scaling with better performance
      let scale = 1;
      switch (options.resolution) {
        case 'low':
          scale = 0.25; // Reduced from 0.5 to 0.25 for better performance
          break;
        case 'medium':
          scale = 0.5; // Reduced from 0.75 to 0.5
          break;
        case 'high':
          scale = 0.75; // Reduced from 1 to 0.75
          break;
      }
      
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      
      // Calculate total frames to extract with increased interval
      const duration = video.duration * 1000; // Convert to milliseconds
      const interval = Math.max(options.interval, 500); // Increased minimum interval from 200ms to 500ms
      const totalFrames = Math.min(Math.floor(duration / interval), 100); // Cap at 100 frames maximum
      let framesProcessed = 0;
      
      const extractFrame = (currentTime: number) => {
        video.currentTime = currentTime / 1000; // Convert back to seconds for video API
      };
      
      video.onseeked = () => {
        if (ctx) {
          try {
            // Draw the current frame to canvas with resolution scaling
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to blob with lower quality for better performance
            canvas.toBlob((blob) => {
              if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                images.push({
                  id: `img-${Date.now()}-${framesProcessed}`,
                  url: imageUrl,
                  timestamp: video.currentTime,
                  createdAt: new Date(),
                  projectId: projectId,
                });
              }
              
              framesProcessed++;
              
              // Report progress
              if (onProgress) {
                onProgress((framesProcessed / totalFrames) * 100);
              }
              
              if (framesProcessed < totalFrames) {
                // Extract next frame with a small delay to prevent browser freezing
                setTimeout(() => {
                  extractFrame((framesProcessed * interval));
                }, 0);
              } else {
                // All frames extracted
                resolve(images);
                
                // Clean up
                video.remove();
                canvas.remove();
              }
            }, 'image/jpeg', 0.8); // Reduced quality from 0.95 to 0.8 for better performance
          } catch (error) {
            console.error('Error extracting frame:', error);
            reject(error);
          }
        }
      };
      
      // Start extraction
      extractFrame(0);
    };
    
    video.onerror = (error) => {
      console.error('Error loading video:', error);
      reject(error);
    };
    
    // Add timeout to prevent infinite loading
    setTimeout(() => {
      if (images.length === 0) {
        reject(new Error('Video processing timed out'));
      }
    }, 60000); // Increased timeout from 30s to 60s for longer videos
  });
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('videoToImagesProjects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [lastDeletedImage, setLastDeletedImage] = useState<DeletedImage | null>(null);

  useEffect(() => {
    localStorage.setItem('videoToImagesProjects', JSON.stringify(projects));
  }, [projects]);

  const addProject = async (title: string, videoUrl: string, options: VideoProcessingOptions) => {
    try {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        title,
        createdAt: new Date(),
        thumbnail: '',
        videoUrl,
        images: [],
      };

      const images = await extractImagesFromVideo(videoUrl, options, newProject.id);
      
      if (images.length === 0) {
        throw new Error('No frames could be extracted from the video');
      }
      
      newProject.images = images;
      
      // Use the first frame as thumbnail
      newProject.thumbnail = images[0].url;

      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      // Clean up any created object URLs
      URL.revokeObjectURL(videoUrl);
      throw error;
    }
  };

  const updateProject = (id: string, update: ProjectUpdate) => {
    setProjects(prev => prev.map(project => {
      if (project.id === id) {
        return {
          ...project,
          ...update
        };
      }
      return project;
    }));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const projectToDelete = prev.find(p => p.id === id);
      if (projectToDelete) {
        // Clean up object URLs
        projectToDelete.images.forEach(img => URL.revokeObjectURL(img.url));
        if (projectToDelete.videoUrl) {
          URL.revokeObjectURL(projectToDelete.videoUrl);
        }
      }
      return prev.filter(project => project.id !== id);
    });
    
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const deleteImage = (projectId: string, imageId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const imageToDelete = project.images.find(img => img.id === imageId);
        if (imageToDelete) {
          // Store the deleted image for potential undo
          setLastDeletedImage({
            projectId,
            image: imageToDelete,
            timestamp: Date.now()
          });
          
          return {
            ...project,
            images: project.images.filter(img => img.id !== imageId)
          };
        }
      }
      return project;
    }));

    setSelectedImages(prev => prev.filter(id => id !== imageId));
  };

  const undoImageDeletion = () => {
    if (lastDeletedImage) {
      const { projectId, image } = lastDeletedImage;
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            images: [...project.images, image]
          };
        }
        return project;
      }));
      
      setLastDeletedImage(null);
    }
  };

  const addImagesToProject = (projectId: string, images: Image[]) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          images: [...project.images, ...images]
        };
      }
      return project;
    }));
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const clearSelectedImages = () => {
    setSelectedImages([]);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        addProject,
        updateProject,
        deleteProject,
        deleteImage,
        undoImageDeletion,
        addImagesToProject,
        getProjectById,
        selectedImages,
        toggleImageSelection,
        clearSelectedImages,
        lastDeletedImage,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};