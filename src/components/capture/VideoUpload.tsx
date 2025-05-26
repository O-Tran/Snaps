import React, { useState, useRef } from 'react';
import { Upload, FileVideo, X, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface VideoUploadProps {
  onVideoUploaded: (file: File) => void;
}

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload MP4, WebM, or MOV videos.');
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 200MB.');
      return false;
    }
    
    return true;
  };
  
  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const uploadFile = () => {
    if (file) {
      onVideoUploaded(file);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-700'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <FileVideo className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Drag and drop your video here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                or click to browse (MP4, WebM, MOV up to 200MB)
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-5 h-5" />}
            >
              Select Video
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <div className="relative aspect-video">
            <video
              src={videoPreview || undefined}
              controls
              className="w-full h-full object-contain bg-black"
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-black/90"
              aria-label="Remove video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              
              <Button
                variant="primary"
                onClick={uploadFile}
                leftIcon={<Upload className="w-5 h-5" />}
              >
                Process Video
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;