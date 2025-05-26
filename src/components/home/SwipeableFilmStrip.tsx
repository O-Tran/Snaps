import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';

interface SwipeableFilmStripProps {
  project: any;
  onDelete: (id: string) => void;
}

const SwipeableFilmStrip: React.FC<SwipeableFilmStripProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    setSwipeOffset(Math.max(Math.min(diff, 0), -stripRef.current!.offsetWidth));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    setSwipeOffset(Math.max(Math.min(diff, 0), -stripRef.current!.offsetWidth));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = stripRef.current!.offsetWidth * 0.5; // 50% threshold
    if (Math.abs(swipeOffset) > threshold) {
      // Trigger delete
      if (window.confirm('Are you sure you want to delete this project?')) {
        onDelete(project.id);
      } else {
        setSwipeOffset(0);
      }
    } else {
      setSwipeOffset(0);
    }
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const getProjectImages = (project: any) => {
    const images = [project.thumbnail];
    if (project.images && project.images.length > 0) {
      images.push(...project.images.slice(0, 2));
    }
    while (images.length < 3) {
      images.push(null); // Fill empty slots
    }
    return images.slice(0, 3);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        ref={stripRef}
        className="relative transition-transform duration-200"
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Project Title and Edit */}
        <div className="flex items-center gap-4 mb-4">
          <h2 
            className="text-black text-xl font-medium cursor-pointer hover:text-yellow-600 transition-colors leading-relaxed"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            {project.title}
          </h2>
          <button
            onClick={() => navigate(`/project/${project.id}/edit`)}
            className="w-11 h-11 rounded-full hover:bg-black/10 transition-colors flex items-center justify-center"
            aria-label="Edit project"
          >
            <Edit2 className="w-6 h-6" />
          </button>
        </div>

        {/* Top Film Strip */}
        <div className="h-8 bg-black flex justify-between px-2 py-[6px]">
          {[...Array(24)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-full rounded-sm bg-white"
            />
          ))}
        </div>

        {/* Images Row */}
        <div className="grid grid-cols-3 gap-4 bg-black p-4">
          {getProjectImages(project).map((imageUrl: string, index: number) => (
            <div 
              key={`${project.id}-${index}`}
              className="aspect-square bg-white/10 cursor-pointer relative overflow-hidden rounded-xl min-h-[88px]"
              onClick={() => imageUrl && navigate(`/project/${project.id}`)}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-base">
                  No image
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Film Strip */}
        <div className="h-8 bg-black flex justify-between px-2 py-[6px]">
          {[...Array(24)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-full rounded-sm bg-white"
            />
          ))}
        </div>
      </div>

      {/* Delete indicator */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-full bg-red-500 flex items-center justify-center"
        style={{
          transform: `translateX(${stripRef.current?.offsetWidth || 0}px) translateX(${swipeOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          opacity: Math.abs(swipeOffset) > 0 ? 1 : 0
        }}
      >
        <Trash2 className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export default SwipeableFilmStrip; 