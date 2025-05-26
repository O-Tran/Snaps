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