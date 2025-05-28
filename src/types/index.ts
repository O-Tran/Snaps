export interface Project {
  id: string;
  title: string;
  createdAt: Date;
  thumbnail: string;
  videoUrl?: string;
  images: Image[];
}

export interface Image {
  id: string;
  url: string;
  timestamp: number; // timestamp in seconds from video start
  createdAt: Date;
  projectId: string;
}

export interface Settings {
  interval: number; // in seconds
  resolution: 'low' | 'medium' | 'high';
  gifFrameRate: number;
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
}

export interface VideoProcessingOptions {
  interval: number; // interval in milliseconds
  resolution: 'low' | 'medium' | 'high';
}

export type CaptureMode = 'Portrait' | 'Photo' | 'Video';

export interface ProjectUpdate {
  title?: string;
  thumbnail?: string;
  images?: Image[];
}

export interface DeletedImage {
  projectId: string;
  image: Image;
  timestamp: number;
}

export interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (
    title: string, 
    videoUrl: string, 
    options: VideoProcessingOptions,
    onProgress?: (progress: number) => void
  ) => Promise<Project>;
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
}