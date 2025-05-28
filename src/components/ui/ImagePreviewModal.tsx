import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  imageUrl,
  onClose,
  onDelete,
  onDownload
}) => {
  // Prevent click inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative w-[1080px] h-[1920px] bg-gray-900 flex flex-col"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h1 
            className="text-6xl text-white absolute left-1/2 -translate-x-1/2"
            style={{ fontFamily: 'Dancing Script, cursive' }}
          >
            Find your best shot
          </h1>
        </div>

        {/* Main Image */}
        <div className="flex-1 relative">
          {/* Film strip markers - Left */}
          <div className="absolute left-4 top-0 bottom-0 w-8 flex flex-col justify-between py-32">
            <div className="text-yellow-500 -rotate-90 transform origin-left translate-y-4">65</div>
            <div className="text-yellow-500 -rotate-90 transform origin-left translate-y-4">▶</div>
            <div className="text-yellow-500 -rotate-90 transform origin-left translate-y-4">II ▶</div>
            <div className="text-yellow-500 -rotate-90 transform origin-left translate-y-4">▶ 005</div>
          </div>

          {/* Image */}
          <div className="mx-16 h-full p-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Film strip markers - Right */}
          <div className="absolute right-4 top-0 bottom-0 w-8 flex flex-col justify-between py-32">
            <div className="text-yellow-500 rotate-90 transform origin-right -translate-y-4">PHOTO</div>
            <div className="text-yellow-500 rotate-90 transform origin-right -translate-y-4">CAMERA</div>
            <div className="text-yellow-500 rotate-90 transform origin-right -translate-y-4">PF90/12.220</div>
            <div className="text-yellow-500 rotate-90 transform origin-right -translate-y-4">1996</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex justify-center gap-4">
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              Delete
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-8 py-3 bg-white hover:bg-gray-100 text-black rounded-full transition-colors"
            >
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal; 