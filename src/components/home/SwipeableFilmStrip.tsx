import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { Project, Image } from '../../types';

interface SwipeableFilmStripProps {
  project: Project;
  onDelete: (id: string) => void;
}

const SwipeableFilmStrip: React.FC<SwipeableFilmStripProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const { updateProject } = useProjects();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const startXRef = useRef(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditing) return; // Prevent swipe while editing
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return; // Prevent swipe while editing
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isEditing) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    setSwipeOffset(Math.max(Math.min(diff, 0), -stripRef.current!.offsetWidth));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isEditing) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    setSwipeOffset(Math.max(Math.min(diff, 0), -stripRef.current!.offsetWidth));
  };

  const handleTouchEnd = () => {
    if (isEditing) return;
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

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateProject(project.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(project.title);
    setIsEditing(false);
  };

  const getProjectImages = (project: Project) => {
    let images: (string | null)[] = [];
    
    // If we have images in the project, take the first 3
    if (project.images && project.images.length > 0) {
      images = project.images.slice(0, 3).map((img: Image) => img.url);
    }
    
    // If we have less than 3 images, fill the remaining slots with null
    while (images.length < 3) {
      images.push(null);
    }
    
    return images;
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
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 bg-transparent border-b-2 border-yellow-500 text-xl font-medium focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTitle}
                  className="p-2 rounded-full hover:bg-green-500/10 text-green-500 transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 
                className="text-black text-xl font-medium cursor-pointer hover:text-yellow-600 transition-colors leading-relaxed"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                {project.title}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="w-11 h-11 rounded-full hover:bg-black/10 transition-colors flex items-center justify-center"
                aria-label="Edit project title"
              >
                <Edit2 className="w-6 h-6" />
              </button>
            </>
          )}
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
          {getProjectImages(project).map((imageUrl: string | null, index: number) => (
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