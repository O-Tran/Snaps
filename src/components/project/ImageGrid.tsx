import React, { useState } from 'react';
import { Download, Trash2, CheckSquare, Square } from 'lucide-react';
import { Image } from '../../types';
import { formatTimeFromSeconds } from '../../utils/date';
import Button from '../ui/Button';
import ImagePreviewModal from '../ui/ImagePreviewModal';
import Toast from '../ui/Toast';
import { useProjects } from '../../context/ProjectContext';

interface ImageGridProps {
  images: Image[];
  onDelete: (imageId: string) => void;
  selectedImages: string[];
  onToggleSelect: (imageId: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ 
  images, 
  onDelete, 
  selectedImages, 
  onToggleSelect 
}) => {
  const [previewImage, setPreviewImage] = useState<Image | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { undoImageDeletion, lastDeletedImage } = useProjects();

  const downloadImage = (url: string, timestamp: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `frame-${timestamp}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (imageId: string) => {
    onDelete(imageId);
    setShowToast(true);
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-2">No images available for this project.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(image => {
          const isSelected = selectedImages.includes(image.id);
          
          return (
            <div 
              key={image.id} 
              className={`relative group rounded-lg overflow-hidden shadow-md transition-all 
                ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
            >
              <div className="relative h-48">
                <img 
                  src={image.url} 
                  alt={`Frame at ${formatTimeFromSeconds(image.timestamp)}`} 
                  className="w-full h-full object-cover cursor-pointer"
                  loading="lazy"
                  onClick={() => setPreviewImage(image)}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-sm font-medium">
                    {formatTimeFromSeconds(image.timestamp)}
                  </p>
                </div>
              </div>
              
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(image.id);
                  }}
                  className="p-1 bg-white/90 dark:bg-gray-800/90 rounded-md"
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(image.url, image.timestamp);
                  }}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image.id);
                  }}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="bg-white/90 text-red-500 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage.url}
          timestamp={previewImage.timestamp}
          onClose={() => setPreviewImage(null)}
        />
      )}

      {showToast && lastDeletedImage && (
        <Toast
          message="Image deleted"
          onUndo={undoImageDeletion}
          onClose={() => setShowToast(false)}
          duration={5000}
        />
      )}
    </>
  );
};

export default ImageGrid;